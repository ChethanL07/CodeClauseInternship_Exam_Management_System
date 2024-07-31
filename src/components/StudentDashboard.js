import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';  
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [regno, setRegno] = useState('');
  const [gender, setGender] = useState('');
  const [phno, setPhno] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [registeredCourse, setRegisteredCourse] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [formAccepted, setFormAccepted] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/form-status');
        setFormAccepted(response.data.status === 'accepted');
      } catch (error) {
        console.error('Error fetching form status', error);
      }
    };

    fetchFormStatus();
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
  };

  const handleSubmitForm = async () => {
    if (!name || !studentClass || !regno || !gender || !phno || !email || !address || !registeredCourse || !comment) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/examination-form', {
        name,
        class: studentClass,
        regno,
        gender,
        phno,
        email,
        address,
        registeredCourse,
        comment,
      });

      if (response.data.success) {
        alert('Form submitted successfully');
        setName('');
        setStudentClass('');
        setRegno('');
        setGender('');
        setPhno('');
        setEmail('');
        setAddress('');
        setRegisteredCourse('');
        setComment('');
        setError('');
      } else {
        setError('An error occurred during form submission');
      }
    } catch (error) {
      console.error('Error submitting form', error);
      setError('An error occurred during form submission');
    }
  };

  const handleDownloadHallTicket = () => {
    const doc = new jsPDF();
    doc.text('Hall Ticket', 10, 10);
    doc.text(`Name: ${name}`, 10, 20);
    doc.text(`Class: ${studentClass}`, 10, 30);
    doc.text(`Reg No: ${regno}`, 10, 40);
    doc.save('hall_ticket.pdf');
  };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <div className="header-left">
          <h1>Exam Portal</h1>
        </div>
        <div className="header-right">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            &#9776;
          </button>
          <div className="admin-label">Student</div>
          <div className="profile-icon">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhBCXi1zez1JjpFZUpMzlP_w-zMf2W8Zh-RA&s" alt="Student Icon" />
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav>
            <ul>
              <li><a href="#" onClick={() => setCurrentTab('dashboard')}>Dashboard</a></li>
              <li><a href="#" onClick={() => setCurrentTab('download')}>Download Hall Ticket</a></li>
              <li><a href='/'>Logout</a></li>
            </ul>
          </nav>
        </div>
        <div className="main-content">
          {currentTab === 'dashboard' && (
            <div className="form-container">
              <h2>Fill Examination Form</h2>
              <p style={{ color: 'red' }}>{error}</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Class"
              />
              <input
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                placeholder="Reg No"
              />
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                value={phno}
                onChange={(e) => setPhno(e.target.value)}
                placeholder="Phone Number"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
              <select
                value={registeredCourse}
                onChange={(e) => setRegisteredCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                <option value="Course 1">Course 1</option>
                <option value="Course 2">Course 2</option>
                <option value="Course 3">Course 3</option>
              </select>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment"
              ></textarea>
              <button onClick={handleSubmitForm}>Submit Form</button>
            </div>
          )}
          {currentTab === 'download' && (
            <div className="download-container">
              {formAccepted ? (
                <button onClick={handleDownloadHallTicket}>Download Hall Ticket</button>
              ) : (
                <p>Your form has not been accepted yet. Please check back later.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
