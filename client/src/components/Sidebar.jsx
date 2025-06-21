import { React, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  HistoryOutlined,
  MapOutlined,
  SettingsOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import ProfileImage from "../assets/profile.jpeg";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Vetting Aviator",
    icon: null,
  },
  {
    text: "Flight History",
    icon: <HistoryOutlined />,
  },
  {
    text: "Flight Plans",
    icon: <MapOutlined />,
  },
  {
    text: "Settings",
    icon: <SettingsOutlined />,
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    
    try {
      const response = await fetch("https://mataa-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed with status: " + response.status);
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError(error.message || "Failed to logout. Please try again.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
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
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: "#FFFFFF",
              backgroundColor: "#0D1B2A",
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color="#90E0EF">
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold" color="#90E0EF">
                    AviaSports
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft sx={{ color: "#90E0EF" }} />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem", color: "#90E0EF" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase().replace(/ /g, "");

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor: active === lcText ? "#90E0EF33" : "transparent",
                        color: "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "#90E0EF22",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: "#90E0EF",
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto", color: "#90E0EF" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          {isNonMediumScreens && (
            <Box position="absolute" bottom="2rem" width="100%">
              <Divider sx={{ backgroundColor: "#90E0EF55" }} />
              <FlexBetween
                textTransform="none"
                gap="1rem"
                m="1.5rem 2rem 0 3rem"
              >
                <Box
                  component="img"
                  alt="profile"
                  src={ProfileImage}
                  height="40px"
                  width="40px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover" }}
                />
                <Box textAlign="left">
                  <Typography fontWeight="bold" fontSize="0.9rem" sx={{ color: "#FFFFFF" }}>
                    {user.name}
                  </Typography>
                  <Typography fontSize="0.8rem" sx={{ color: "#90E0EF" }}>
                    {user.occupation}
                  </Typography>
                </Box>
                <IconButton onClick={handleLogoutClick} disabled={isLoggingOut}>
                  <LogoutOutlined sx={{ color: "#90E0EF", fontSize: "25px" }} />
                </IconButton>
              </FlexBetween>
            </Box>
          )}
        </Drawer>
      )}

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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {logoutError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sidebar;
