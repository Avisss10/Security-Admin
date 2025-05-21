import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Content from './components/content';
import Security from './components/security';
import Cabang from './components/cabang';
import Archive from './components/archive';
import Login from './components/login';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (nip) => {
    localStorage.setItem('user', JSON.stringify({ nip }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Layout component that wraps protected routes
  const DashboardLayout = ({ children }) => (
    <div className='dashboard'>
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard--content">
        {children}
      </div>
    </div>
  );

  // Protected route component
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  // Logout component to perform logout and redirect to login
  const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
      handleLogout();
      navigate('/login');
    }, []);

    return null;
  };

  return (
    <Router>
      <Routes>
        {/* Public route - Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

        {/* Protected routes with reusable layout */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardLayout><Content /></DashboardLayout>} />}
        />
        
        <Route
          path="/security"
          element={<ProtectedRoute element={<DashboardLayout><Security /></DashboardLayout>} />}
        />
        
        <Route
          path="/cabang"
          element={<ProtectedRoute element={<DashboardLayout><Cabang /></DashboardLayout>} />}
        />
        
        <Route
          path="/archive"
          element={<ProtectedRoute element={<DashboardLayout><Archive /></DashboardLayout>} />}
        />

        <Route
          path="/logout"
          element={<Logout />}
        />

        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
