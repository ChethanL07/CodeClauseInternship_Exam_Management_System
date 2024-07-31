import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SubmittedForms.css';

const SubmittedForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/examination-forms');
      setForms(response.data);
    } catch (error) {
      setError('Error fetching forms');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptForm = async (formId) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/accept-form', { formId });
      fetchForms();
      setSuccess('Form accepted successfully');
      setError('');
    } catch (error) {
      setError('An error occurred while accepting the form');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submitted-forms">
      <h2>Submitted Forms</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <p>Loading...</p>}
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <span>Name: {form.name}</span>
            <span>Reg No: {form.regno}</span>
            <span>Class: {form.class}</span>
            <span>Status: {form.status}</span>
            <button 
              onClick={() => handleAcceptForm(form.id)} 
              disabled={loading || form.status === 'Accepted'}
              className={form.status === 'Accepted' ? 'accepted' : ''}
            >
              {form.status === 'Accepted' ? 'Accepted' : 'Accept'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmittedForms;
