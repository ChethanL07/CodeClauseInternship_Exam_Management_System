import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Examinations.css';

const Examinations = () => {
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/examinations');
      setExaminations(response.data);
    } catch (error) {
      setError('Error fetching examinations');
    } finally {
      setLoading(false);
    }
  };

  const formatExamDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="examinations">
      <h2>Examinations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <ul>
        {examinations.map((exam) => (
          <li key={exam.id}>
            {exam.exam_name} - {formatExamDate(exam.exam_date)}
           
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Examinations;
