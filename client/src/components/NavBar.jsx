import React, { useState, useEffect } from "react";
import { Menu as MenuIcon, ArrowDropDownOutlined } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import profileImage from "assets/profile.jpeg";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiFetch } from '../service/api';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Fetch user details from backend using token
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoadingUser(true);
        const data = await apiFetch('/auth/me');
        setUserDetails(data);
        localStorage.setItem('admin', JSON.stringify(data));
      } catch (error) {
        // fallback to localStorage if /auth/me is not available
        try {
          const admin = JSON.parse(localStorage.getItem('admin'));
          setUserDetails(admin);
        } catch {
          setUserDetails(null);
        }
        setUserError(error.message);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    handleClose();
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      setLogoutError(error.message || "Failed to logout. Please try again.");
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
      setOpenLogoutDialog(false);
    }
  };

  const handleCancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  const handleCloseError = () => {
    setLogoutError(null);
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "#1e2a38",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        padding: "0 1rem",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "80px" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon sx={{ color: "#A5F3EB" }} />
          </IconButton>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
              disabled={isLoggingOut}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                {loadingUser ? (
                  <CircularProgress size={20} sx={{ color: "#A5F3EB" }} />
                ) : userError ? (
                  <Typography
                    fontWeight="bold"
                    fontSize="0.85rem"
                    sx={{ color: "#ff6b6b" }}
                  >
                    Error loading user
                  </Typography>
                ) : (
                  <Typography
                    fontWeight="bold"
                    fontSize="0.85rem"
                    sx={{ color: "#A5F3EB" }}
                  >
                    {userDetails?.username || userDetails?.email || "User"}
                  </Typography>
                )}
              </Box>
              <ArrowDropDownOutlined sx={{ color: "#A5F3EB", fontSize: "25px" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCancelLogout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} disabled={isLoggingOut}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            autoFocus
            disabled={isLoggingOut}
            startIcon={isLoggingOut ? <CircularProgress size={20} /> : null}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!logoutError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {logoutError}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
