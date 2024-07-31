// src/components/AdminDashboard/RegisterStudent.js
import React, { useState } from 'react';
import axios from 'axios';
import './RegisterStudent.css';

const RegisterStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regno, setRegno] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterStudent = async () => {
    if (!name || !email || !password || !regno || !studentClass) {
      setError('Please fill out all fields');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        role: 'student',
        regno,
        class: studentClass
      });
      if (response.data.success) {
        setSuccess('Student registered successfully');
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setRegno('');
        setStudentClass('');
      } else {
        setError('An error occurred during registration');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred during registration');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-student">
      <h2>Register Student</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading && <p>Loading...</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        type="text"
        value={regno}
        onChange={(e) => setRegno(e.target.value)}
        placeholder="Registration Number"
      />
      <input
        type="text"
        value={studentClass}
        onChange={(e) => setStudentClass(e.target.value)}
        placeholder="Class"
      />
      <button onClick={handleRegisterStudent} disabled={loading}>Register Student</button>
    </div>
  );
};

export default RegisterStudent;
