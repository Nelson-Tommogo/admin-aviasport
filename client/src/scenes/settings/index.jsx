import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Card, CardContent, Grid, Switch, 
  FormControlLabel, TextField, Button, Divider, 
  Select, MenuItem, InputLabel, FormControl,
  Tabs, Tab, Alert, Snackbar, CircularProgress
} from "@mui/material";
import {
  AccountCircle as AccountIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setMode } from "state/index";
import { apiFetch, getToken } from '../../service/api';

const Settings = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.global.mode);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    role: "Administrator"
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    flightUpdates: true,
    systemAlerts: true,
    marketingEmails: false
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Try to fetch user info from backend, fallback to localStorage
    apiFetch('/auth/me')
      .then(data => {
        setUserProfile({
          name: data.username || data.name || "",
          email: data.email || "",
          role: "Administrator"
        });
        setLoading(false);
      })
      .catch(() => {
        // fallback to localStorage if /auth/me is not available
        try {
          const admin = JSON.parse(localStorage.getItem('admin'));
          setUserProfile({
            name: admin?.username || "",
            email: admin?.email || "",
            role: "Administrator"
          });
        } catch {
          setUserProfile({ name: "", email: "", role: "Administrator" });
        }
        setLoading(false);
      });

    // Fetch real settings from backend
    apiFetch('/settings')
      .then(settings => {
        setSystemSettings(settings);
      })
      .catch(err => {
        setError('Failed to fetch settings: ' + err.message);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleProfileChange = (e) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    });
  };

  const handleSystemSettingChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSystemSettings({
      ...systemSettings,
      [e.target.name]: value
    });
  };

  const handleSaveSettings = (section) => {
    // Simulate API call to save settings
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: `${section} settings saved successfully!`,
        severity: "success"
      });
    }, 500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Settings
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        Manage your account and application settings
      </Typography>

      <Tabs 
        value={currentTab} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<AccountIcon />} label="Account" />
        <Tab icon={<PaletteIcon />} label="Appearance" />
        <Tab icon={<NotificationsIcon />} label="Notifications" />
        <Tab icon={<SettingsIcon />} label="System" />
      </Tabs>

      {/* Account Settings */}
      {currentTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={userProfile.name}
                  onChange={handleProfileChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={userProfile.email}
                  onChange={handleProfileChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={userProfile.phone}
                  onChange={handleProfileChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={userProfile.role}
                    onChange={handleProfileChange}
                    label="Role"
                  >
                    <MenuItem value="Administrator">Administrator</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings("Account")}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Appearance Settings */}
      {currentTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Theme Settings
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={() => dispatch(setMode())}
                />
              }
              label={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Layout Options
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Default Dashboard View</InputLabel>
                  <Select
                    value="flights"
                    label="Default Dashboard View"
                  >
                    <MenuItem value="flights">Flights Overview</MenuItem>
                    <MenuItem value="analytics">Analytics</MenuItem>
                    <MenuItem value="history">Flight History</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Table Density</InputLabel>
                  <Select
                    value="standard"
                    label="Table Density"
                  >
                    <MenuItem value="compact">Compact</MenuItem>
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="comfortable">Comfortable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings("Appearance")}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      {currentTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailAlerts}
                      onChange={handleNotificationChange}
                      name="emailAlerts"
                    />
                  }
                  label="Email Alerts"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsAlerts}
                      onChange={handleNotificationChange}
                      name="smsAlerts"
                    />
                  }
                  label="SMS Alerts"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.flightUpdates}
                      onChange={handleNotificationChange}
                      name="flightUpdates"
                    />
                  }
                  label="Flight Updates"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.systemAlerts}
                      onChange={handleNotificationChange}
                      name="systemAlerts"
                    />
                  }
                  label="System Alerts"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.marketingEmails}
                      onChange={handleNotificationChange}
                      name="marketingEmails"
                    />
                  }
                  label="Marketing Emails"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings("Notification")}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* System Settings */}
      {currentTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Settings (from database)
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Box>
                {systemSettings.length === 0 ? (
                  <Typography>No settings found in database.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {systemSettings.map(setting => (
                      <Grid item xs={12} md={6} key={setting._id}>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle1"><b>{setting.key}</b></Typography>
                            <Typography variant="body2">{String(setting.value)}</Typography>
                            {setting.description && (
                              <Typography variant="caption" color="text.secondary">{setting.description}</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;