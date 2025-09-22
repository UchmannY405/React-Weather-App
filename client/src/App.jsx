import { useState } from 'react'
import * as React from 'react';
import Home from './pages/Home';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserUpdate from './pages/UserUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from './features/AuthContext';

function App() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const isAuthed = !!user;
  const path = location.pathname;

  // Decide which action to show 
  let action = null; 
  if (path === "/dashboard" && isAuthed) {
    action = { type: "dashboard" };
  } else if (path === "/" && !isAuthed) {
    action = { type: "link", label: "Login", to: "/login" };
  } else if (path === "/" && isAuthed) {
    action = { type: "link", label: "Dashboard", to: "/dashboard" };
  } else if (
    path === "/login" ||
    path === "/register" ||
    path === "/user-update"
  ) {
    action = { type: "home" };
  }

  const ACTION_WIDTH = 104; 

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            mb: { xs: 2, sm: 3, md: 5 },
            mt: { xs: 1, sm: 2 },
          }}
        >
          <AppBar position="static">
            <Toolbar
              sx={{
                minHeight: { xs: 56, sm: 64 },
                justifyContent: "center",
              }}
            >
              {action?.type === "dashboard" && (
                <>
                  <IconButton
                    component={Link}
                    to={"/"}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <HomeIcon />
                  </IconButton>
                </>
              )}
              {action?.type === "home" && (
                <>
                  <IconButton
                    component={Link}
                    to={"/"}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <HomeIcon />
                  </IconButton>
                </>
              )}
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  fontSize: { xs: "1.1rem", sm: "inherit" },
                  fontWeight: 600,
                }}
              >
                My Weather App
                <WbCloudyIcon
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                  }}
                />
              </Typography>
              <Box
                sx={{
                  minWidth: ACTION_WIDTH,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {action?.type === "link" && (
                  <Button
                    component={Link}
                    to={action.to}
                    color="inherit"
                    sx={{ fontWeight: 600 }}
                  >
                    {action.label}
                  </Button>
                )}
                {action?.type === "dashboard" && (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => {
                        logout?.();
                        navigate("/login", { replace: true });
                      }}
                      sx={{ fontWeight: 600 }}
                    >
                      Logout
                    </Button>
                    <IconButton
                      component={Link}
                      to={"/user-update"}
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </>
                )}
                {!action && <Box sx={{ width: ACTION_WIDTH }} />}
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-update"
            element={
              <ProtectedRoute>
                <UserUpdate />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App
