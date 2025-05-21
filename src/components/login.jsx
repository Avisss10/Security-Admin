import React, { useState } from 'react';
import '../styles/login.css';

import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!nip || !password) {
      setError('NIP dan Password harus diisi');
      return;
    }
    
    // Here you would typically make an API call to authenticate
    // For now, we'll just simulate a successful login
    // Replace this with actual authentication logic
    
    onLogin(nip);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="logo-text">
            <span>SECURITY</span>
            <span>REPORT</span>
        </div>
    </div>

      
      <div className="login-form-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Nip"
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;