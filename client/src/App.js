import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'scenes/layout';
import Dashboard from 'scenes/dashboard';
<<<<<<< HEAD
import Products from 'scenes/products';
import Customers from 'scenes/customers';
import Transactions from 'scenes/transactions';
import Admin from 'scenes/admin';
=======
import Admin from 'scenes/admin';
import FlightHistory from 'scenes/flighthistory';
import FlightPlans from 'scenes/flightplans';
import Settings from 'scenes/settings';
import Players from 'scenes/players';
import BetHistory from 'scenes/BetHistory';
import Payout from 'scenes/Payout';
>>>>>>> d51f49f9b6e10f30dd368a36df313b855f9eb463
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
<<<<<<< HEAD
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="admin" element={<Admin />} />
=======
          <Route path="admin" element={<Admin />} />
          <Route path="flighthistory" element={<FlightHistory />} />
          <Route path="flightplans" element={<FlightPlans />} />
          <Route path="settings" element={<Settings />} />
          <Route path="players" element={<Players />} />
          <Route path="bets-history" element={<BetHistory />} />
          <Route path="payouts" element={<Payout />} />
>>>>>>> d51f49f9b6e10f30dd368a36df313b855f9eb463
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
