// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import LoginPage from './components/LoginPage';
import HallTicket from './components/HallTicket';

// Importing AdminDashboard subcomponents
import CreateExamination from './components/AdminDashboard/CreateExamination';
import RegisterStudent from './components/AdminDashboard/RegisterStudent';
import AddStudentsToGroup from './components/AdminDashboard/AddStudentsToGroup';
import Examinations from './components/AdminDashboard/Examinations';
import SubmittedForms from './components/AdminDashboard/SubmittedForms';
import Groups from './components/AdminDashboard/Groups';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="create-examination" element={<CreateExamination />} />
          <Route path="register-student" element={<RegisterStudent />} />
          <Route path="add-students-to-group" element={<AddStudentsToGroup />} />
          <Route path="examinations" element={<Examinations />} />
          <Route path="submitted-forms" element={<SubmittedForms />} />
          <Route path="groups" element={<Groups />} />
        </Route>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/hall-ticket" element={<HallTicket />} />
      </Routes>
    </Router>
  );
};

export default App;
