import React, { useState } from "react";
import { 
  Box, Typography, Card, CardContent, Grid, Switch, 
  FormControlLabel, TextField, Button, Divider, 
  Select, MenuItem, InputLabel, FormControl,
  Tabs, Tab, Alert, Snackbar
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

const Settings = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.global.mode);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: "Admin User",
    email: "admin@betikaaviator.com",
    phone: "+254 712 345 678",
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
  const [systemSettings, setSystemSettings] = useState({
    dataRetentionDays: 90,
    autoBackup: true,
    apiKey: "sk_live_51KjT7GHJk89Jk89Jk89Jk89Jk89Jk89Jk89Jk89",
    environment: "production"
  });

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
              System Configuration
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Retention (days)"
                  name="dataRetentionDays"
                  type="number"
                  value={systemSettings.dataRetentionDays}
                  onChange={handleSystemSettingChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.autoBackup}
                      onChange={handleSystemSettingChange}
                      name="autoBackup"
                    />
                  }
                  label="Automatic Backups"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API Key"
                  name="apiKey"
                  value={systemSettings.apiKey}
                  onChange={handleSystemSettingChange}
                  margin="normal"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Environment</InputLabel>
                  <Select
                    name="environment"
                    value={systemSettings.environment}
                    onChange={handleSystemSettingChange}
                    label="Environment"
                  >
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="staging">Staging</MenuItem>
                    <MenuItem value="production">Production</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Danger Zone
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              These actions are irreversible. Please proceed with caution.
            </Alert>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error">
                Clear All Data
              </Button>
              <Button variant="outlined" color="error">
                Reset to Default Settings
              </Button>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings("System")}
              >
                Save Changes
              </Button>
            </Box>
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