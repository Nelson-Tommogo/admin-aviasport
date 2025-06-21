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
  };

  return (
    <Box p={3}>
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
          sx={{
            backgroundColor: '#121212',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#000000',
            }
          }}
          onClick={() => setSuccessMessage("Manual payout processed")}
        >
          Manual Payout
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;