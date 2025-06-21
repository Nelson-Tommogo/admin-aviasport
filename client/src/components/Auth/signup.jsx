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

const Signup = () => {
  const [username, setUsername] = useState('');
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

    const payload = { username, email, password };

    try {
      const response = await fetch('https://mataa-backend.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        let backendMessage = data?.error || `Signup failed with status ${response.status}`;

        if (backendMessage.includes('Email already in use')) {
          backendMessage = 'This email is already registered. Try logging in instead.';
        } else if (backendMessage.includes('Username already taken')) {
          backendMessage = 'That username is already in use. Please choose another.';
        } else if (backendMessage.includes('Signup limit reached')) {
          backendMessage = 'Signup limit reached. Only 10 users are allowed.';
        }

        throw new Error(backendMessage);
      }

      // Show success dialog
      setOpenSuccessDialog(true);

    } catch (err) {
      const errorMessage = err.message.includes('Failed to fetch')
        ? 'Network error. Please check your internet connection.'
        : err.message;

      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenSuccessDialog(false);
    navigate('/login');
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
          Create Account
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
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            autoComplete="username"
          />

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
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
            endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {isLoading ? 'Registering...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link
            href="/login"
            underline="hover"
            sx={{
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark'
              }
            }}
          >
            Login here
          </Link>
        </Typography>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleDialogClose}>
        <DialogTitle>Registration Successful!</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;
