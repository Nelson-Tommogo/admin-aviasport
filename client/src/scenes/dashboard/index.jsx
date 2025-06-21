import React, { useState, useRef } from "react";
import { 
  Box, Button, Typography, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, MenuItem, Select, LinearProgress,
  Alert
} from "@mui/material";
import Papa from "papaparse";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", make: "", model: "", year: "", price: "", image: null, description: "" 
  });
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const lastUpdateRef = useRef(Date.now());

  const makes = [
    "Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Mitsubishi", "Suzuki", "Isuzu",
    "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Porsche", "Opel",
    "Ford", "Chevrolet", "Dodge", "Jeep", "Tesla", "Cadillac",
    "Hyundai", "Kia", "Genesis",
    "Land Rover", "Jaguar", "Rolls-Royce", "Bentley", "Mini",
    "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Fiat",
    "Peugeot", "Renault", "Citroën", "BYD", "Geely", "Chery", "Haval"
  ];

  const descriptions = [
    "Lighting", "Accessories", "Mirrors", "Body Parts", "Ex-Japan"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 }, (_, i) => 2001 + i);

  // Manual Product Upload Handlers (UNCHANGED)
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", make: "", model: "", year: "", price: "", image: null, description: "" });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      alert("Please select an image file");
      return;
    }
  
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("make", formData.make);
    formPayload.append("model", formData.model);
    formPayload.append("year", formData.year);
    formPayload.append("price", formData.price);
    formPayload.append("description", formData.description || "");
    formPayload.append("image", formData.image);
  
    try {
      const response = await fetch("https://mataa-backend.onrender.com/upload", {
        method: "POST",
        body: formPayload,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
  
      await response.json();
      setSuccessMessage("Product added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
      setCsvError("Product upload failed: " + error.message);
    }
  };

  // UPDATED CSV Upload Handlers for better CORS handling
  const handleCsvOpen = () => setCsvOpen(true);
  const handleCsvClose = () => {
    setCsvOpen(false);
    setCsvFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setCsvError("");
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
    setCsvError("");
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvError("Please select a CSV file");
      return;
    }
  
    setIsUploading(true);
    setCsvError("");
    setSuccessMessage("");

    // Create FormData object for proper file upload
    const formData = new FormData();
    formData.append('file', csvFile);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: header => header.trim().toLowerCase(),
      step: (result, parser) => {
        if (Date.now() - lastUpdateRef.current > 100) {
          setUploadProgress(Math.round((result.meta.cursor / csvFile.size) * 100));
          lastUpdateRef.current = Date.now();
        }
      },
      complete: async (result) => {
        try {
          const requiredFields = ['name', 'make', 'model', 'year', 'price'];
          const isValid = result.data.every(product => 
            requiredFields.every(field => product[field] !== undefined)
          );
  
          if (!isValid) throw new Error("CSV missing required fields: name, make, model, year, price");
          if (result.errors.length > 0) throw new Error("CSV parsing errors detected");
  
          // UPDATED: Using FormData for the actual upload
          const response = await fetch("https://mataa-backend.onrender.com/upload-products-csv", {
            method: "POST",
            body: formData, // Using FormData instead of JSON
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          });
  
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
          }
  
          setSuccessMessage(`Success: ${data.createdCount} products added (${data.totalReceived} processed)`);
          setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message;
          setCsvError(`Upload failed: ${errorMessage}`);
          console.error("CSV upload error:", error);
        } finally {
          setIsUploading(false);
          handleCsvClose();
        }
      },
      error: (error) => {
        setCsvError(`CSV parsing failed: ${error.message}`);
        setIsUploading(false);
        console.error("CSV parse error:", error);
      }
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Product Management Dashboard</Typography>
      
      {/* Status Alerts */}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {csvError && <Alert severity="error" sx={{ mb: 2 }}>{csvError}</Alert>}

      <Box mb={2} gap={2} display="flex">
        <Button variant="contained" onClick={handleOpen}>Add New Product</Button>
        <Button 
          variant="contained" 
          onClick={handleCsvOpen}
          sx={{
            backgroundColor: '#121212',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#000000',
            }
          }}
        >
          Bulk CSV Upload
        </Button>
      </Box>

      {/* Manual Product Upload Dialog (UNCHANGED) */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          />
          <Select
            name="make"
            value={formData.make}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          >
            <MenuItem value="" disabled>Select Make</MenuItem>
            {makes.map((make) => (
              <MenuItem key={make} value={make}>{make}</MenuItem>
            ))}
          </Select>
          <TextField
            name="model"
            label="Vehicle Model"
            value={formData.model}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          />
          <Select
            name="year"
            value={formData.year}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          >
            <MenuItem value="" disabled>Select Year</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
          <TextField
            name="price"
            label="Price (KES)"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          />
          <Select
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            displayEmpty
          >
            <MenuItem value="" disabled>Select Description Type</MenuItem>
            {descriptions.map((desc) => (
              <MenuItem key={desc} value={desc}>{desc}</MenuItem>
            ))}
          </Select>
          <TextField
            name="description"
            label="Custom Description (Optional)"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Box mt={2}>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required
              style={{ display: 'block', marginTop: '10px' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Upload Dialog (UNCHANGED UI) */}
      <Dialog open={csvOpen} onClose={handleCsvClose} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Upload via CSV</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvChange}
              disabled={isUploading}
              style={{ display: 'block', marginBottom: '20px' }}
            />
          </Box>

          {isUploading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" align="center" mt={1}>
                Progress: {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            CSV format requirements:
            <ul>
              <li>Required columns: name, make, model, year, price</li>
              <li>Please Follow the naming rule or you CSV, XLS files won't upload</li>
              <li>Optional columns: description, image</li>
              <li>First row should contain headers</li>
              <li>File encoding: UTF-8</li>
            </ul>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCsvClose} disabled={isUploading}>Cancel</Button>
          <Button 
            onClick={handleCsvUpload} 
            variant="contained" 
            color="primary"
            disabled={!csvFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;