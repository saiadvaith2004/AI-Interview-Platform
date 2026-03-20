import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
  try {
    const res = await api.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', form.username); // ← add this
    navigate('/dashboard');
  } catch (err) {
    setError('Invalid username or password');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        <input style={styles.input} placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={styles.button} onClick={handleSubmit}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center' }
};