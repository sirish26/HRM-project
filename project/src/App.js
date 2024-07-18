import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userRole, setUserRole] = useState(''); 

  // Function to handle successful login
  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="logo">
            <img src="https://cdn.worldvectorlogo.com/logos/react-1.svg" alt="React Logo" style={{ width: '100px', height: 'auto' }} />
          </div>
        </header>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<Dashboard userRole={userRole} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
