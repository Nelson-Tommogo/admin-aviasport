import React, { useState } from "react";
import { Box, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "", country: "", occupation: "", role: "" });

  const handleOpen = (index = null) => {
    setEditIndex(index);
    setFormData(index !== null ? customers[index] : { name: "", email: "", phoneNumber: "", country: "", occupation: "", role: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedCustomers = [...customers];
      updatedCustomers[editIndex] = formData;
      setCustomers(updatedCustomers);
    } else {
      setCustomers([...customers, formData]);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((_, i) => i !== index));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.occupation}</TableCell>
                <TableCell>{customer.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(index)}><Edit /></Button>
                  <Button onClick={() => handleDelete(index)}><Delete /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Role" name="role" value={formData.role} onChange={handleChange} fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
