import axios from 'axios';

const api = axios.create({
    // IMPORTANT: No trailing slash at the end of the URL
    baseURL: 'https://ai-interview-platform-ten-gray.onrender.com', 
    headers: {
        'Content-Type': 'application/json'
    },
    // Required if you handle sessions/cookies, otherwise optional but safe
    withCredentials: true 
});

export default api;