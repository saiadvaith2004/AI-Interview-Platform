import axios from 'axios';

const api = axios.create({
  // Use the exact URL that gave you the "UP" message
  baseURL: 'https://ai-interview-platform-8ptv.onrender.com', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// IMPORTANT: This interceptor ensures your JWT is sent with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;