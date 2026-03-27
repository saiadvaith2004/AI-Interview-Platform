import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slidingIn, setSlidingIn] = useState(true); // Starts shifted right
  const [slidingOut, setSlidingOut] = useState(false);
  const navigate = useNavigate();

  // Trigger the "Slide In" effect on mount
  useEffect(() => {
    const timer = setTimeout(() => setSlidingIn(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      // Sending to the /auth/register endpoint we tested in Postman
      await api.post('/auth/register', form);
      
      // On success, slide out and go to login
      setSlidingOut(true);
      setTimeout(() => navigate('/login'), 400);
    } catch (err) {
      // Displays the "Password must contain..." message from your backend
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setSlidingOut(true);
    setTimeout(() => navigate('/login'), 400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          min-height: 100vh;
          background: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .slide-wrapper {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          padding-right: 12vw;
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.18, 1),
                      opacity 0.35s ease;
          transform: translateX(0);
          opacity: 1;
        }

        /* Initial state: Hidden to the right */
        .slide-wrapper.slide-in {
          transform: translateX(60vw);
          opacity: 0;
        }

        /* Exit state: Moving to the left */
        .slide-wrapper.slide-out {
          transform: translateX(-60vw);
          opacity: 0;
        }

        .auth-card {
          background: #ffffff;
          padding: 2.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.09);
          width: 340px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-card h2 {
          font-size: 1.6rem;
          font-weight: 600;
          color: #111;
        }

        .auth-card p.subtitle {
          font-size: 0.875rem;
          color: #888;
          margin-top: -0.5rem;
        }

        .auth-card input {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1.5px solid #e0e0e0;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .auth-card input:focus {
          border-color: #4f46e5;
        }

        .auth-card button.primary {
          padding: 0.8rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .auth-card button.primary:disabled {
          background: #a5b4fc;
        }

        .auth-card .error-msg {
          color: #dc2626;
          font-size: 0.85rem;
          text-align: center;
          background: #fef2f2;
          padding: 0.5rem;
          border-radius: 6px;
          line-height: 1.4;
        }

        .auth-card .footer-text {
          font-size: 0.875rem;
          color: #666;
          text-align: center;
        }

        .auth-card .footer-text a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .slide-wrapper { justify-content: center; padding-right: 0; }
          .auth-card { width: 90vw; }
        }
      `}</style>

      <div className="auth-page">
        <div className={`slide-wrapper ${slidingIn ? 'slide-in' : ''} ${slidingOut ? 'slide-out' : ''}`}>
          <form className="auth-card" onSubmit={handleSubmit}>
            <div>
              <h2>Create Account</h2>
              <p className="subtitle">Join the AI Interview Platform</p>
            </div>

            <input
              required
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>

            {error && <p className="error-msg">{error}</p>}

            <p className="footer-text">
              Already have an account?{' '}
              <a href="/login" onClick={handleLoginClick}>
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}