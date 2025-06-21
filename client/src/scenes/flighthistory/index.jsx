import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, InputAdornment,
  MenuItem, Grid, Card, CardContent, Chip
} from "@mui/material";
import { Search as SearchIcon, Flight as FlightIcon } from "@mui/icons-material";
import { apiFetch } from '../../service/api';

const FlightHistory = () => {
  // Fetch flight data from backend
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [multiplierFilter, setMultiplierFilter] = useState("all");
  const [stats, setStats] = useState({
    totalFlights: 0,
    averageMultiplier: 0,
    highestMultiplier: 0,
    totalPlayers: 0
  });

  useEffect(() => {
    setLoading(true);
    apiFetch('/flights')
      .then(data => {
        // Only keep flights that are linked to a flight plan
        setFlights(data.filter(flight => flight.flightPlan));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Wrap the filter function in useCallback to prevent unnecessary recalculations
  const getFilteredFlights = useCallback(() => {
    return flights.filter(flight => {
      // Search filter
      const matchesSearch = (flight.flightNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
      // Date filter
      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = flight.startTime?.startsWith(today);
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        matchesDate = flight.startTime?.startsWith(yesterday);
      } else if (dateFilter === "thisWeek") {
        const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        matchesDate = flight.startTime >= oneWeekAgo;
      }
      // Multiplier filter (if you have a multiplier field)
      let matchesMultiplier = true;
      if (multiplierFilter === "low") {
        matchesMultiplier = parseFloat(flight.multiplier || 0) < 2.0;
      } else if (multiplierFilter === "medium") {
        matchesMultiplier = parseFloat(flight.multiplier || 0) >= 2.0 && parseFloat(flight.multiplier || 0) < 4.0;
      } else if (multiplierFilter === "high") {
        matchesMultiplier = parseFloat(flight.multiplier || 0) >= 4.0;
      }
      return matchesSearch && matchesDate && matchesMultiplier;
    });
  }, [flights, searchTerm, dateFilter, multiplierFilter]);

  // Calculate statistics
  useEffect(() => {
    const filteredFlights = getFilteredFlights();
    const totalFlights = filteredFlights.length;
    const totalMultiplier = filteredFlights.reduce((sum, flight) => sum + parseFloat(flight.multiplier || 0), 0);
    const averageMultiplier = totalFlights > 0 ? (totalMultiplier / totalFlights).toFixed(2) : 0;
    const highestMultiplier = filteredFlights.length > 0 
      ? Math.max(...filteredFlights.map(flight => parseFloat(flight.multiplier || 0)))
      : 0;
    const totalPlayers = filteredFlights.reduce((sum, flight) => sum + (flight.players || 0), 0);
    setStats({
      totalFlights,
      averageMultiplier,
      highestMultiplier,
      totalPlayers
    });
  }, [getFilteredFlights]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleMultiplierFilterChange = (event) => {
    setMultiplierFilter(event.target.value);
  };

  const filteredFlights = getFilteredFlights();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Flight History
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        View historical Betika Aviator flights
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Flights</Typography>
              <Typography variant="h3">{stats.totalFlights}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Avg. Multiplier</Typography>
              <Typography variant="h3">{stats.averageMultiplier}x</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Highest Multiplier</Typography>
              <Typography variant="h3">{stats.highestMultiplier}x</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Players</Typography>
              <Typography variant="h3">{stats.totalPlayers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Flight Number"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Date Filter"
            value={dateFilter}
            onChange={handleDateFilterChange}
          >
            <MenuItem value="all">All Dates</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Multiplier Range"
            value={multiplierFilter}
            onChange={handleMultiplierFilterChange}
          >
            <MenuItem value="all">All Multipliers</MenuItem>
            <MenuItem value="low">Low (&lt; 2.0x)</MenuItem>
            <MenuItem value="medium">Medium (2.0x - 4.0x)</MenuItem>
            <MenuItem value="high">High (&gt; 4.0x)</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      
      {/* Flight History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Flight Number</TableCell>
              <TableCell>Multiplier</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Players</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
                <TableRow key={flight.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FlightIcon sx={{ mr: 1, color: '#666' }} />
                      {flight.flightNumber}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${flight.multiplier}x`} 
                      color={
                        parseFloat(flight.multiplier) < 2.0 ? "default" : 
                        parseFloat(flight.multiplier) < 4.0 ? "primary" : "success"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{flight.timestamp}</TableCell>
                  <TableCell>{flight.duration}</TableCell>
                  <TableCell>{flight.players}</TableCell>
                  <TableCell>
                    <Chip label="Completed" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No flight history found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FlightHistory;