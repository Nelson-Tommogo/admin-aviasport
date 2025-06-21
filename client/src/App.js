import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'scenes/layout';
import Dashboard from 'scenes/dashboard';
import Admin from 'scenes/admin';
import FlightHistory from 'scenes/flighthistory';
import FlightPlans from 'scenes/flightplans';
import Settings from 'scenes/settings';
import Login from 'components/Auth/login';
import Signup from 'components/Auth/signup';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin" element={<Admin />} />
          <Route path="flighthistory" element={<FlightHistory />} />
          <Route path="flightplans" element={<FlightPlans />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all Route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
