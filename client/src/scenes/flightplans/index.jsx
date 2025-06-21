import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Backdrop, CircularProgress, Checkbox, FormControlLabel
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { apiFetch } from '../../service/api';

const FlightPlans = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });

  const fetchFlightPlans = () => {
    setLoading(true);
    apiFetch('/flight-plans')
      .then(data => {
        setFlights(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFlightPlans();
  }, []);

  const handleOpen = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setFormData(flights[index]);
    } else {
      setEditIndex(null);
      setFormData({
        name: "",
        description: "",
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editIndex !== null) {
        // Update existing flight plan
        const id = flights[editIndex]._id;
        await apiFetch(`/flight-plans/${id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        // Create new flight plan
        await apiFetch('/flight-plans', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      fetchFlightPlans();
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this flight plan?")) {
      setLoading(true);
      try {
        await apiFetch(`/flight-plans/${id}`, { method: 'DELETE' });
        fetchFlightPlans();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Flight Plans
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        Manage Betika Aviator flight plans
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={() => handleOpen()}
        sx={{ mb: "20px" }}
      >
        Add New Flight
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight, index) => (
              <TableRow key={flight._id || flight.id}>
                <TableCell>{flight.name}</TableCell>
                <TableCell>{flight.description}</TableCell>
                <TableCell>{flight.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(index)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(flight._id || flight.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Flight Plan" : "Add New Flight Plan"}</DialogTitle>
        <DialogContent>
          <TextField 
            label="Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
          />
          <TextField 
            label="Description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
          />
          <FormControlLabel
            control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" />}
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default FlightPlans;
