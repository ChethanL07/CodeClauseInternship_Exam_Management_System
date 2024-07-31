// src/components/AdminDashboard.js
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="header-left">
          <h1>Exam Portal</h1>
        </div>
        <div className="header-right">
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <span className="admin-label">Admin</span>
          <div className="profile-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png" alt="Profile" />
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <ul>
              <li><Link to="create-examination">Create Examination</Link></li>
              <li><Link to="register-student">Register Student</Link></li>
              <li><Link to="add-students-to-group">Add Students to Group</Link></li>
              <li><Link to="examinations">Examinations</Link></li>
              <li><Link to="submitted-forms">Submitted Forms</Link></li>
              <li><Link to="groups">Groups</Link></li>
              <li><Link to="/">Logout</Link></li>
            </ul>
          </nav>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
