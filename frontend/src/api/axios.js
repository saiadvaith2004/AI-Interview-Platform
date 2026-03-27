import axios from 'axios';

const api = axios.create({
    // IMPORTANT: No trailing slash at the end of the URL
    baseURL: 'https://ai-interview-platform-8ptv.onrender.com', 
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true 
});

// Automatically inject JWT Token stored during login into every API Request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;