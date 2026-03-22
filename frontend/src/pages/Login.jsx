import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [sliding, setSliding] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', form.username);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setSliding(true);
    setTimeout(() => {
      navigate('/register');
    }, 400); // match animation duration
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

        /* Wrapper slides the card in/out */
        .slide-wrapper {
          width: 100%;
          display: flex;
          justify-content: flex-end;  /* card starts on the RIGHT */
          padding-right: 12vw;
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.18, 1),
                      opacity  0.35s ease;
        }

        .slide-wrapper.slide-out {
          transform: translateX(-60vw);
          opacity: 0;
        }

        /* The card itself */
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
          margin-bottom: 0.25rem;
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
          color: #111;
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
          transition: background 0.2s, transform 0.1s;
        }

        .auth-card button.primary:hover {
          background: #4338ca;
        }

        .auth-card button.primary:active {
          transform: scale(0.98);
        }

        .auth-card .error-msg {
          color: #dc2626;
          font-size: 0.85rem;
          text-align: center;
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

        .auth-card .footer-text a:hover {
          text-decoration: underline;
        }

        /* Responsive: centre on small screens */
        @media (max-width: 600px) {
          .slide-wrapper {
            justify-content: center;
            padding-right: 0;
          }
          .auth-card {
            width: 90vw;
          }
        }
      `}</style>

      <div className="auth-page">
        <div className={`slide-wrapper${sliding ? ' slide-out' : ''}`}>
          <div className="auth-card">
            <div>
              <h2>Welcome back</h2>
              <p className="subtitle">Sign in to your account</p>
            </div>

            <input
              placeholder="Username"
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <button className="primary" onClick={handleSubmit}>
              Login
            </button>

            {error && <p className="error-msg">{error}</p>}

            <p className="footer-text">
              Don't have an account?{' '}
              <a href="/register" onClick={handleRegisterClick}>
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}