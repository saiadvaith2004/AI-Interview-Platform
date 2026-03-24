import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://ai-interview-platform-8ptv.onrender.com'
  baseURL: 'http://localhost:8081'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isAuthEndpoint = config.url.includes('/auth/');
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;