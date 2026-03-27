import axios from 'axios';

const api = axios.create({
  // Use the exact URL that showed you the "UP" message
  baseURL: 'https://ai-interview-platform-8ptv.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to attach the JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;