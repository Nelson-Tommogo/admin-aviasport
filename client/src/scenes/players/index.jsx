import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, InputAdornment,
  MenuItem, Grid, Card, CardContent, Avatar, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Search as SearchIcon, Person as PersonIcon } from "@mui/icons-material";

const Players = () => {
  // Sample player data
  const [players] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [stats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    totalWagered: 0,
    totalPayouts: 0
  });

  // Define getFilteredPlayers with useCallback
  const getFilteredPlayers = useCallback(() => {
    return players.filter(player => {
      // Search filter
      const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || player.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [players, searchTerm, statusFilter]);

  useEffect(() => {
    getFilteredPlayers();
  }, [getFilteredPlayers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewDetails = (player) => {
    setSelectedPlayer(player);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const filteredPlayers = getFilteredPlayers();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Players Management
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        Manage and monitor player activity
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Players</Typography>
              <Typography variant="h3">{stats.totalPlayers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Active Players</Typography>
              <Typography variant="h3">{stats.activePlayers}</Typography>
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
              <Typography variant="h6" color="text.secondary">Total Payouts</Typography>
              <Typography variant="h3">{formatCurrency(stats.totalPayouts)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
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
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Status Filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      
      {/* Players Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell align="right">Total Bets</TableCell>
              <TableCell align="right">Total Wins</TableCell>
              <TableCell align="right">Total Payout</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <TableRow key={player.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.username} style={{ width: '100%' }} />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                      {player.username}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{player.totalBets}</TableCell>
                  <TableCell align="right">{player.totalWins}</TableCell>
                  <TableCell align="right">{formatCurrency(player.totalPayout)}</TableCell>
                  <TableCell>{player.lastActive}</TableCell>
                  <TableCell>
                    <Chip 
                      label={player.status === "active" ? "Active" : "Inactive"} 
                      color={player.status === "active" ? "success" : "default"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(player)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No players found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Player Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedPlayer && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                  {selectedPlayer.avatar ? (
                    <img src={selectedPlayer.avatar} alt={selectedPlayer.username} style={{ width: '100%' }} />
                  ) : (
                    <PersonIcon />
                  )}
                </Avatar>
                {selectedPlayer.username}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Total Bets:</Typography>
                  <Typography variant="body1">{selectedPlayer.totalBets}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Total Wins:</Typography>
                  <Typography variant="body1">{selectedPlayer.totalWins}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Win Rate:</Typography>
                  <Typography variant="body1">
                    {Math.round((selectedPlayer.totalWins / selectedPlayer.totalBets) * 100)}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Total Payout:</Typography>
                  <Typography variant="body1">{formatCurrency(selectedPlayer.totalPayout)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Status:</Typography>
                  <Chip 
                    label={selectedPlayer.status === "active" ? "Active" : "Inactive"} 
                    color={selectedPlayer.status === "active" ? "success" : "default"} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Last Active:</Typography>
                  <Typography variant="body1">{selectedPlayer.lastActive}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  // Add action for messaging player
                  handleCloseDialog();
                }}
              >
                Message Player
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Players;