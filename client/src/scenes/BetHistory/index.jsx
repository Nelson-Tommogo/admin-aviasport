import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, InputAdornment,
  MenuItem, Grid, Card, CardContent, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Select,
  FormControl, InputLabel, IconButton
} from "@mui/material";
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";

const BetHistory = () => {
  // Sample bet data
  const [bets] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [selectedBet, setSelectedBet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [stats] = useState({
    totalBets: 0,
    totalWagered: 0,
    totalPayout: 0,
    winRate: 0
  });

  // Define getFilteredBets with useCallback
  const getFilteredBets = useCallback(() => {
    return bets.filter(bet => {
      // Search filter
      const matchesSearch = 
        bet.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || bet.status === statusFilter;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = bet.date.startsWith(today);
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        matchesDate = bet.date.startsWith(yesterday);
      } else if (dateFilter === "thisWeek") {
        const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        matchesDate = bet.date >= oneWeekAgo;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [bets, searchTerm, statusFilter, dateFilter, sortConfig]);

  // Calculate statistics (if needed, you can use getFilteredBets here)
  useEffect(() => {
    getFilteredBets();
  }, [getFilteredBets]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
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

  const handleViewDetails = (bet) => {
    setSelectedBet(bet);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const filteredBets = getFilteredBets();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Bet History
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        Track and analyze all betting activity
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Bets</Typography>
              <Typography variant="h3">{stats.totalBets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Wagered</Typography>
              <Typography variant="h3">{formatCurrency(stats.totalWagered)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Payout</Typography>
              <Typography variant="h3">{formatCurrency(stats.totalPayout)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Win Rate</Typography>
              <Typography variant="h3">{stats.winRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Players or Flights"
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
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="won">Won</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
      </Grid>
      
      {/* Bet History Table */}
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
              <TableCell>Flight Number</TableCell>
              <TableCell align="right">
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  Amount
                  <IconButton size="small" onClick={() => handleSort('amount')}>
                    {sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">Multiplier</TableCell>
              <TableCell align="right">Payout</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  Date
                  <IconButton size="small" onClick={() => handleSort('date')}>
                    {sortConfig.key === 'date' && sortConfig.direction === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBets.length > 0 ? (
              filteredBets.map((bet) => (
                <TableRow key={bet.id} hover>
                  <TableCell>{bet.player}</TableCell>
                  <TableCell>{bet.flightNumber}</TableCell>
                  <TableCell align="right">{formatCurrency(bet.amount)}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${bet.multiplier}x`} 
                      color={bet.multiplier > 1 ? "success" : "default"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={bet.payout > 0 ? "bold" : "normal"}>
                      {bet.payout > 0 ? formatCurrency(bet.payout) : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>{bet.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bet.status === "won" ? "Won" : "Lost"} 
                      color={bet.status === "won" ? "success" : "error"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(bet)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No bets found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bet Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedBet && (
          <>
            <DialogTitle>
              Bet Details - {selectedBet.flightNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Player:</Typography>
                  <Typography variant="body1">{selectedBet.player}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Flight Number:</Typography>
                  <Typography variant="body1">{selectedBet.flightNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Bet Amount:</Typography>
                  <Typography variant="body1">{formatCurrency(selectedBet.amount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Multiplier:</Typography>
                  <Typography variant="body1">{selectedBet.multiplier}x</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Payout:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedBet.payout > 0 ? formatCurrency(selectedBet.payout) : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Status:</Typography>
                  <Chip 
                    label={selectedBet.status === "won" ? "Won" : "Lost"} 
                    color={selectedBet.status === "won" ? "success" : "error"} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Date:</Typography>
                  <Typography variant="body1">{selectedBet.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Profit/Loss:</Typography>
                  <Typography 
                    variant="body1" 
                    color={selectedBet.payout > selectedBet.amount ? "success.main" : "error.main"}
                    fontWeight="bold"
                  >
                    {formatCurrency(selectedBet.payout - selectedBet.amount)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  // Add action for contacting player
                  handleCloseDialog();
                }}
              >
                Contact Player
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BetHistory;