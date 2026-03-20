import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async () => {
  if (!username || !password) {
    setError('Please fill in all fields');
    return;
  }
  try {
    await api.post('/auth/register', { username, password });
    setMessage('Registered successfully! Redirecting to login...');
    setError('');
    setTimeout(() => navigate('/login'), 1500);
  } catch (err) {
    if (err.response?.status === 400) {
      setError('Username already exists. Try a different one.');
    } else {
      setError('Registration failed. Is the backend running?');
    }
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleSubmit}>
          Register
        </button>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  success: { color: 'green', textAlign: 'center' },
  error: { color: 'red', textAlign: 'center' }
};