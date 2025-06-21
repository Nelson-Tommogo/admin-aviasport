import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, InputAdornment,
  MenuItem, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Select,
  FormControl, InputLabel, IconButton, Switch, FormControlLabel
} from "@mui/material";
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon
} from "@mui/icons-material";
import { apiFetch } from '../../service/api';

const Payout = () => {
  // Fetch payout data from backend
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [stats, setStats] = useState({
    totalPayouts: 0,
    totalAmount: 0,
    completedPayouts: 0,
    pendingPayouts: 0
  });

  useEffect(() => {
    setLoading(true);
    apiFetch('/payouts')
      .then(data => {
        setPayouts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Wrap getFilteredPayouts in useCallback
  const getFilteredPayouts = useCallback(() => {
    let filtered = payouts.filter(payout => {
      // Search filter
      const matchesSearch = (payout.player?.username || payout.player || "").toLowerCase().includes(searchTerm.toLowerCase());
      // Status filter
      const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
      // Method filter
      const matchesMethod = methodFilter === "all" || payout.method === methodFilter;
      // Date filter
      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = payout.createdAt?.startsWith(today);
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        matchesDate = payout.createdAt?.startsWith(yesterday);
      } else if (dateFilter === "thisWeek") {
        const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        matchesDate = payout.createdAt >= oneWeekAgo;
      }
      // Pending toggle filter
      const matchesPendingToggle = !showOnlyPending || payout.status === "pending";
      return matchesSearch && matchesStatus && matchesMethod && matchesDate && matchesPendingToggle;
    });
    // Sorting
    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [payouts, searchTerm, statusFilter, methodFilter, dateFilter, showOnlyPending, sortConfig]);

  useEffect(() => {
    getFilteredPayouts();
  }, [getFilteredPayouts]);

  // Calculate statistics
  useEffect(() => {
    const filteredPayouts = getFilteredPayouts();
    const totalPayouts = filteredPayouts.length;
    const totalAmount = filteredPayouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);
    const completedPayouts = filteredPayouts.filter(p => p.status === "completed").length;
    const pendingPayouts = filteredPayouts.filter(p => p.status === "pending").length;
    setStats({
      totalPayouts,
      totalAmount,
      completedPayouts,
      pendingPayouts
    });
  }, [payouts, searchTerm, statusFilter, methodFilter, dateFilter, showOnlyPending, getFilteredPayouts]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleMethodFilterChange = (event) => {
    setMethodFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    setOpenDialog(true);
  };

  const handleProcessPayout = (id) => {
    setPayouts(payouts.map(payout => 
      payout.id === id ? { ...payout, status: "completed" } : payout
    ));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "pending":
        return <PendingIcon color="warning" />;
      case "failed":
        return <CheckCircleIcon color="error" />;
      default:
        return null;
    }
  };

  const filteredPayouts = getFilteredPayouts();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Payout Management
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        Process and monitor player payout requests
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Payouts</Typography>
              <Typography variant="h3">{stats.totalPayouts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Amount</Typography>
              <Typography variant="h3">{formatCurrency(stats.totalAmount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Completed</Typography>
              <Typography variant="h3">{stats.completedPayouts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Pending</Typography>
              <Typography variant="h3">{stats.pendingPayouts}</Typography>
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
            label="Search Players"
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
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Method</InputLabel>
            <Select
              value={methodFilter}
              label="Method"
              onChange={handleMethodFilterChange}
            >
              <MenuItem value="all">All Methods</MenuItem>
              <MenuItem value="M-Pesa">M-Pesa</MenuItem>
              <MenuItem value="Airtel Money">Airtel Money</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateFilter}
              label="Date Range"
              onChange={handleDateFilterChange}
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyPending}
                onChange={() => setShowOnlyPending(!showOnlyPending)}
                color="primary"
              />
            }
            label="Only Pending"
            sx={{ mt: 1, ml: 1 }}
          />
        </Grid>
      </Grid>
      
      {/* Payouts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  Player
                  <IconButton size="small" onClick={() => handleSort('player')}>
                    {sortConfig.key === 'player' && sortConfig.direction === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  Amount
                  <IconButton size="small" onClick={() => handleSort('amount')}>
                    {sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  Date
                  <IconButton size="small" onClick={() => handleSort('date')}>
                    {sortConfig.key === 'date' && sortConfig.direction === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayouts.length > 0 ? (
              filteredPayouts.map((payout) => (
                <TableRow key={payout.id} hover>
                  <TableCell>{payout.player}</TableCell>
                  <TableCell align="right">{formatCurrency(payout.amount)}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getStatusIcon(payout.status)}
                      <Typography sx={{ ml: 1 }}>{payout.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(payout)}
                      sx={{ mr: 1 }}
                    >
                      Details
                    </Button>
                    {payout.status === "pending" && (
                      <Button 
                        variant="contained" 
                        size="small"
                        color="success"
                        startIcon={<PaymentIcon />}
                        onClick={() => handleProcessPayout(payout.id)}
                      >
                        Process
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No payouts found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payout Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedPayout && (
          <>
            <DialogTitle>
              Payout Details - {selectedPayout.transactionId}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Player:</Typography>
                  <Typography variant="body1">{selectedPayout.player}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Amount:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedPayout.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Payment Method:</Typography>
                  <Typography variant="body1">{selectedPayout.method}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Status:</Typography>
                  <Box display="flex" alignItems="center">
                    {getStatusIcon(selectedPayout.status)}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {selectedPayout.status}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Transaction ID:</Typography>
                  <Typography variant="body1">{selectedPayout.transactionId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Processed By:</Typography>
                  <Typography variant="body1">{selectedPayout.processedBy}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Date:</Typography>
                  <Typography variant="body1">{selectedPayout.date}</Typography>
                </Grid>
                {selectedPayout.status === "failed" && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Failure Reason:</Typography>
                    <Typography variant="body1" color="error.main">
                      Insufficient funds in operator account
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {selectedPayout.status === "pending" && (
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<PaymentIcon />}
                  onClick={() => {
                    handleProcessPayout(selectedPayout.id);
                    handleCloseDialog();
                  }}
                >
                  Process Payout
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Payout;