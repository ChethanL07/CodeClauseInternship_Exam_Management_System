import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/student-groups');
      setGroups(response.data);
    } catch (error) {
      setError('Error fetching groups');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="groups">
      <h2>Groups</h2>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}
      <ul className="group-list">
        {groups.map((group) => (
          <li key={group.id} className="group-item">
            <strong>{group.group_name}</strong> (Exam: {group.exam_name})
            <ul className="student-list">
              {group.students.map((student) => (
                <li key={student.id} className="student-item">
                  {student.name} ({student.regno})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Groups;
