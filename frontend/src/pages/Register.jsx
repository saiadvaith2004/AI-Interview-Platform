import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New State
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setMessage('');

    // 1. Basic Null Check
    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // 2. Password Match Check (Local check)
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // 3. Complexity Check (Regex)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password too weak (Need A-Z, 0-9, @$!%*?&)");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', { username, password });
      setMessage('Registered successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response && err.response.status === 409) {
          setError(err.response.data); // "Username already taken" from Java
      } else {
          setError('Connection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
        
        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

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
        {/* NEW INPUT FIELD */}
        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        
        <p style={{ fontSize: '0.7rem', color: '#666', margin: '0' }}>
          Min. 7 chars (A-Z, 0-9, @$!%*?&)
        </p>

        <button 
          style={{...styles.button, opacity: loading ? 0.7 : 1}} 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Now"}
        </button>

        {message && <p style={styles.success}>{message}</p>}
        
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
  errorBox: { color: '#721c24', backgroundColor: '#f8d7da', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid #f5c6cb', textAlign: 'center' }
};