import axios from 'axios';

const api = axios.create({
  // REPLACE with your actual Render URL
  baseURL: 'https://ai-powered-interview-platform.onrender.com', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// This automatically attaches your JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;