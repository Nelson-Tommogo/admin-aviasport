import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';
import Dashboard from './scenes/dashboard';
import BetHistory from './scenes/BetHistory';
import Players from './scenes/players';
import Payout from './scenes/Payout';
import FlightHistory from './scenes/flighthistory';
import FlightPlans from './scenes/flightplans';
import Layout from './scenes/layout';
import Settings from './scenes/settings';
import { getToken } from './service/api';

const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bets-history" element={<BetHistory />} />
          <Route path="/players" element={<Players />} />
          <Route path="/payouts" element={<Payout />} />
          <Route path="/flighthistory" element={<FlightHistory />} />
          <Route path="/flightplans" element={<FlightPlans />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
