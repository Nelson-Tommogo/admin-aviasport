<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from "react";
import { 
  Box, Button, Typography, Alert, Link, Grid, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";

const Dashboard = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({
    totalBets: 0,
    totalPayout: 0,
    activePlayers: 0,
    highestWin: 0
  });
  const [recentBets, setRecentBets] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);

  // Mock data for Betika Aviator dashboard
  useEffect(() => {
    // Simulate fetching data from API
    const mockStats = {
      totalBets: 1243,
      totalPayout: 5824600,
      activePlayers: 87,
      highestWin: 245000
    };

    const mockRecentBets = [
      { id: 1, player: "User123", amount: 500, multiplier: 2.5, payout: 1250, time: "2 mins ago" },
      { id: 2, player: "User456", amount: 1000, multiplier: 1.8, payout: 1800, time: "5 mins ago" },
      { id: 3, player: "User789", amount: 250, multiplier: 4.2, payout: 1050, time: "8 mins ago" },
      { id: 4, player: "User101", amount: 750, multiplier: 1.2, payout: 900, time: "12 mins ago" },
      { id: 5, player: "User202", amount: 1500, multiplier: 0, payout: 0, time: "15 mins ago" }
    ];

    const mockTopPlayers = [
      { id: 1, player: "WinnerX", totalWins: 12, totalPayout: 125000 },
      { id: 2, player: "LuckyGuy", totalWins: 8, totalPayout: 87600 },
      { id: 3, player: "AviatorPro", totalWins: 15, totalPayout: 68200 },
      { id: 4, player: "BetMaster", totalWins: 6, totalPayout: 54300 },
      { id: 5, player: "CashKing", totalWins: 9, totalPayout: 49800 }
    ];

    setStats(mockStats);
    setRecentBets(mockRecentBets);
    setTopPlayers(mockTopPlayers);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
>>>>>>> d51f49f9b6e10f30dd368a36df313b855f9eb463
  };

  return (
    <Box p={3}>
<<<<<<< HEAD
      <Typography variant="h4" gutterBottom>Product Management Dashboard</Typography>
      
      {/* Status Alerts */}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {csvError && <Alert severity="error" sx={{ mb: 2 }}>{csvError}</Alert>}

      <Box mb={2} gap={2} display="flex">
        <Button variant="contained" onClick={handleOpen}>Add New Product</Button>
        <Button 
          variant="contained" 
          onClick={handleCsvOpen}
=======
      <Typography variant="h4" gutterBottom>Betika Aviator Admin Dashboard</Typography>
      
      {/* Navigation Links */}
      <Box mb={3} display="flex" gap={2}>
        <Link href="/bets-history" underline="none">
          <Button variant="contained" color="primary">
            Bets History
          </Button>
        </Link>
        <Link href="/players" underline="none">
          <Button variant="contained" color="primary">
            Players
          </Button>
        </Link>
        <Link href="/payouts" underline="none">
          <Button variant="contained" color="primary">
            Payouts
          </Button>
        </Link>
      </Box>

      {/* Status Alerts */}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Bets</Typography>
            <Typography variant="h4">{stats.totalBets}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Payout</Typography>
            <Typography variant="h4">{formatCurrency(stats.totalPayout)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Players</Typography>
            <Typography variant="h4">{stats.activePlayers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Highest Win</Typography>
            <Typography variant="h4">{formatCurrency(stats.highestWin)}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bets Table */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Bets</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Multiplier</TableCell>
                    <TableCell align="right">Payout</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>{bet.player}</TableCell>
                      <TableCell align="right">{formatCurrency(bet.amount)}</TableCell>
                      <TableCell align="right">{bet.multiplier}x</TableCell>
                      <TableCell align="right" sx={{ 
                        color: bet.payout > 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {bet.payout > 0 ? formatCurrency(bet.payout) : 'Lost'}
                      </TableCell>
                      <TableCell>{bet.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Players Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Players</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Total Wins</TableCell>
                    <TableCell align="right">Total Payout</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.player}</TableCell>
                      <TableCell align="right">{player.totalWins}</TableCell>
                      <TableCell align="right">{formatCurrency(player.totalPayout)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box mb={2} gap={2} display="flex">
        <Button 
          variant="contained" 
          onClick={() => setSuccessMessage("New round started successfully")}
        >
          Start New Round
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={() => setErrorMessage("Round cancelled successfully")}
        >
          Cancel Round
        </Button>
        <Button 
          variant="contained" 
>>>>>>> d51f49f9b6e10f30dd368a36df313b855f9eb463
          sx={{
            backgroundColor: '#121212',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#000000',
            }
          }}
<<<<<<< HEAD
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
=======
          onClick={() => setSuccessMessage("Manual payout processed")}
        >
          Manual Payout
        </Button>
      </Box>
>>>>>>> d51f49f9b6e10f30dd368a36df313b855f9eb463
    </Box>
  );
};

export default Dashboard;