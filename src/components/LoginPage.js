import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Correctly import the CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      if (response.data.success) {
        if (response.data.role === 'admin') {
          navigate('/admin-dashboard/create-examination');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="container">
      <div className="login-page">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
        />
        <button onClick={handleLogin} className="submit-button">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
