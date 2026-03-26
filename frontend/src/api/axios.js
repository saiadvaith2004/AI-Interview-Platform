import axios from 'axios';

const api = axios.create({
  // Automatically switches between Local and Render based on the URL in your browser
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:8081' 
    : 'https://ai-interview-platform-8ptv.onrender.com'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Check if url exists before calling .includes to prevent crashes
  const isAuthEndpoint = config.url && config.url.includes('/auth/');
  
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;