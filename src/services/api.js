import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust based on your backend URL
});

export const login = async (email, password) => {
  return await api.post('/login', { email, password });
};

export const submitExaminationForm = async (formData) => {
  return await api.post('/examination-form', formData);
};

// Other API calls

export default api;
