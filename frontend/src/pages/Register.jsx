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
    // 1. Basic empty field check
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // 2. STRENGTH VALIDATION: 7+ chars, 1 Upper, 1 Number, 1 Special
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 7 characters, include one uppercase letter, one number, and one special character (@$!%*?&).");
      return;
    }

    // 3. Clear previous errors and proceed to API call
    setError(''); 
    try {
      await api.post('/auth/register', { username, password });
      setMessage('Registered successfully! Redirecting to login...');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Username already exists or invalid data. Try a different one.');
      } else {
        setError('Registration failed. Is the backend running?');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
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
        
        {/* Short hint for the user */}
        <p style={{ fontSize: '0.7rem', color: '#666', margin: '0' }}>
          Min. 7 chars (A-Z, 0-9, @$!%*?&)
        </p>

        <button style={styles.button} onClick={handleSubmit}>
          Register
        </button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <a href="/login" style={{ color: '#4f46e5' }}>Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  success: { color: 'green', textAlign: 'center', fontSize: '0.85rem' },
  error: { color: 'red', textAlign: 'center', fontSize: '0.85rem', lineHeight: '1.2' }
};