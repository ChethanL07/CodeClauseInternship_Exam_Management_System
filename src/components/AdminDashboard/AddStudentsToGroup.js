import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddStudentsToGroup.css';

const AddStudentsToGroup = () => {
  const [examinations, setExaminations] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExaminations();
    fetchStudents();
    fetchGroups();
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      setError('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/student-groups');
      // Filter to only include predefined groups
      const predefinedGroups = ['group-1', 'group-2', 'group-3'];
      const filteredGroups = response.data.filter(group => predefinedGroups.includes(group.group_name));
      setGroups(filteredGroups);
    } catch (error) {
      setError('Error fetching groups');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGroup = async () => {
    if (!selectedExamId || !selectedGroupName || selectedStudents.length === 0) {
      setError('Please fill out all fields and select students');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/student-group', {
        examId: selectedExamId,
        groupName: selectedGroupName,
        students: selectedStudents
      });
      if (response.data.success) {
        fetchGroups();
        setSelectedGroupName('');
        setSelectedExamId('');
        setSelectedStudents([]);
        setSuccess('Students added to group successfully');
        setError('');
      } else {
        setError('An error occurred while adding students to the group');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred while adding students to the group');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-students-to-group">
      <h2>Add Students to Group</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading && <p>Loading...</p>}
      <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
        <option value="">Select Exam</option>
        {examinations.map((exam) => (
          <option key={exam.id} value={exam.id}>
            {exam.exam_name}
          </option>
        ))}
      </select>
      <select value={selectedGroupName} onChange={(e) => setSelectedGroupName(e.target.value)}>
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.group_name}>
            {group.group_name}
          </option>
        ))}
      </select>
      <select multiple value={selectedStudents} onChange={(e) => setSelectedStudents(Array.from(e.target.selectedOptions, option => option.value))}>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} ({student.regno})
          </option>
        ))}
      </select>
      <button onClick={handleAddToGroup} disabled={loading}>Add to Group</button>
    </div>
  );
};

export default AddStudentsToGroup;
