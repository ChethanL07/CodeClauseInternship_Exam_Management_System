// src/components/AdminDashboard/CreateExamination.js
import React, { useState } from 'react';
import axios from 'axios';
import './CreateExamination.css';

const CreateExamination = () => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateExam = async () => {
    if (!examName || !examDate) {
      setError('Please fill out all fields');
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/examinations', { examName, examDate });
      setExamName('');
      setExamDate('');
      setSuccess('Examination created successfully');
      setError('');
    } catch (error) {
      setError('An error occurred while creating the examination');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-examination">
      <h2>Create Examination</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading && <p>Loading...</p>}
      <input
        type="text"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
        placeholder="Exam Name"
      />
      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        placeholder="Exam Date"
      />
      <button onClick={handleCreateExam} disabled={loading}>Create Exam</button>
    </div>
  );
};

export default CreateExamination;
