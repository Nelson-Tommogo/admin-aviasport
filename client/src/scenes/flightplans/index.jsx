import React, { useState } from "react";
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Backdrop, CircularProgress
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const FlightPlans = () => {
  const [flights, setFlights] = useState([
    { id: 1, flightNumber: "AV-1234", multiplier: 2.5, timestamp: "2023-06-15 14:30", status: "Completed" },
    { id: 2, flightNumber: "AV-5678", multiplier: 1.8, timestamp: "2023-06-15 15:45", status: "Completed" },
    { id: 3, flightNumber: "AV-9012", multiplier: 3.2, timestamp: "2023-06-16 09:15", status: "Scheduled" },
  ]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: "",
    multiplier: "",
    timestamp: "",
    status: "Scheduled"
  });

  const handleOpen = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setFormData(flights[index]);
    } else {
      setEditIndex(null);
      setFormData({
        flightNumber: "",
        multiplier: "",
        timestamp: "",
        status: "Scheduled"
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editIndex !== null) {
        const updatedFlights = [...flights];
        updatedFlights[editIndex] = formData;
        setFlights(updatedFlights);
      } else {
        const newFlight = {
          ...formData,
          id: flights.length + 1
        };
        setFlights([...flights, newFlight]);
      }
      setLoading(false);
      setOpen(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFlights(flights.filter(flight => flight.id !== id));
        setLoading(false);
      }, 1000);
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
              <TableCell>Flight Number</TableCell>
              <TableCell>Multiplier</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight, index) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.multiplier}x</TableCell>
                <TableCell>{flight.timestamp}</TableCell>
                <TableCell>{flight.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(index)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(flight.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Flight" : "Add New Flight"}</DialogTitle>
        <DialogContent>
          <TextField 
            label="Flight Number" 
            name="flightNumber" 
            value={formData.flightNumber} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
          />
          <TextField 
            label="Multiplier" 
            name="multiplier" 
            type="number"
            value={formData.multiplier} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
          />
          <TextField 
            label="Timestamp" 
            name="timestamp" 
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.timestamp} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
          />
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="dense"
            SelectProps={{
              native: true,
            }}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </TextField>
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
