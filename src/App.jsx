import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Content from './components/content';
import Security from './components/security';
import Cabang from './components/cabang';
import Login from './components/login';
import Archive from './components/archive/Archive'; // ✅ Tambahkan import Archive baru
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cek user login dari localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Layout wrapper untuk halaman yang butuh sidebar
  const DashboardLayout = ({ children }) => (
    <div className="dashboard">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard--content">
        {children}
      </div>
    </div>
  );

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

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
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

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

        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
