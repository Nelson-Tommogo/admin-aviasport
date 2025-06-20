import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://mataa-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        let message = data?.message || 'Login failed. Please try again.';

        if (message.includes('Invalid credentials')) {
          message = 'Incorrect email or password.';
        } else if (message.includes('User not found')) {
          message = 'No account found with that email.';
        } else if (message.includes('Missing')) {
          message = 'Please fill in all fields.';
        }

        throw new Error(message);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success dialog
      setOpenSuccessDialog(true);

    } catch (err) {
      const errorMessage = err.message.includes('Failed to fetch')
        ? 'Network error. Please check your internet connection.'
        : err.message;

      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog close and navigate
  const handleDialogClose = () => {
    setOpenSuccessDialog(false);
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2, py: 1.5 }}
            endIcon={isLoading ? <CircularProgress size={24} /> : null}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/forgot-password" underline="hover" color="inherit">
            Forgot Password?
          </Link>
          <Link href="/signup" underline="hover" color="inherit">
            Create Account
          </Link>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleDialogClose}>
        <DialogTitle>Login Successful!</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
