import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [animating, setAnimating] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', password: '', confirm: '' });
  const [loginError, setLoginError] = useState('');
  const [regError, setRegError] = useState('');
  const navigate = useNavigate();

  const switchMode = (target) => {
    if (animating || mode === target) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(target);
      setAnimating(false);
    }, 480);
  };

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', loginForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', loginForm.username);
      navigate('/dashboard');
    } catch {
      setLoginError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    if (regForm.password !== regForm.confirm) {
      setRegError('Passwords do not match');
      return;
    }
    try {
      await api.post('/auth/register', regForm);
      switchMode('login');
    } catch {
      setRegError('Registration failed. Try again.');
    }
  };

  const isLogin = mode === 'login';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT DECORATION PANEL ── */
        .deco-panel {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0d0d0d;
        }

        /* Subtle grid */
        .deco-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* The big X — two lines as pseudo elements of a child div */
        .cross-wrap {
          position: relative;
          width: 340px;
          height: 340px;
        }

        .cross-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 110%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.55) 70%, transparent);
          transform-origin: center center;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.18, 1),
                      background 0.55s ease;
          border-radius: 2px;
        }

        .cross-line.line-a {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .cross-line.line-b {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        /* When register mode: rotate X by 90° → lines become + */
        .cross-wrap.register .line-a {
          transform: translate(-50%, -50%) rotate(135deg);
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8) 30%, rgba(99,102,241,0.8) 70%, transparent);
        }
        .cross-wrap.register .line-b {
          transform: translate(-50%, -50%) rotate(45deg);
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8) 30%, rgba(99,102,241,0.8) 70%, transparent);
        }

        /* Small label on deco panel */
        .deco-label {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          white-space: nowrap;
          transition: color 0.4s;
        }

        .deco-label.register { color: rgba(99,102,241,0.5); }

        /* Floating circles for depth */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.12;
          transition: all 0.6s ease;
          pointer-events: none;
        }
        .orb-1 { width: 260px; height: 260px; background: #6366f1; top: 10%; left: 5%; }
        .orb-2 { width: 180px; height: 180px; background: #a78bfa; bottom: 15%; right: 10%; }
        .orb-1.register { opacity: 0.22; background: #818cf8; }
        .orb-2.register { opacity: 0.18; }

        /* ── FORM PANEL ── */
        .form-panel {
          width: 420px;
          flex-shrink: 0;
          background: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-left: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.48s cubic-bezier(0.77, 0, 0.18, 1),
                      opacity  0.38s ease;
        }

        .form-panel.slide-out-right {
          transform: translateX(100%);
          opacity: 0;
        }
        .form-panel.slide-out-left {
          transform: translateX(-100%);
          opacity: 0;
        }

        .form-inner {
          width: 100%;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          transition: opacity 0.25s;
        }

        .form-inner.hidden { opacity: 0; pointer-events: none; }

        /* Headings */
        .form-heading {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }

        .form-sub {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.35);
          margin-top: -0.5rem;
        }

        /* Inputs */
        .auth-input {
          padding: 0.8rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .auth-input::placeholder { color: rgba(255,255,255,0.25); }

        .auth-input:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.07);
        }

        /* Primary button */
        .auth-btn {
          padding: 0.85rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.25rem;
        }

        .auth-btn:hover { background: #4f46e5; }
        .auth-btn:active { transform: scale(0.98); }

        /* Error */
        .auth-error {
          font-size: 0.82rem;
          color: #f87171;
          text-align: center;
        }

        /* Footer link */
        .auth-footer {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        .auth-footer button {
          background: none;
          border: none;
          color: #818cf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .auth-footer button:hover { color: #a5b4fc; }

        /* Divider */
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0.25rem 0;
        }

        /* Responsive */
        @media (max-width: 680px) {
          .deco-panel { display: none; }
          .form-panel { width: 100%; border-left: none; }
        }
      `}</style>

      <div className="auth-root">

        {/* ── DECORATION PANEL (left) ── */}
        <div className="deco-panel">
          <div className={`orb orb-1 ${!isLogin ? 'register' : ''}`} />
          <div className={`orb orb-2 ${!isLogin ? 'register' : ''}`} />

          <div className={`cross-wrap ${!isLogin ? 'register' : ''}`}>
            <div className="cross-line line-a" />
            <div className="cross-line line-b" />
          </div>

          <div className={`deco-label ${!isLogin ? 'register' : ''}`}>
            {isLogin ? 'sign in' : 'create account'}
          </div>
        </div>

        {/* ── FORM PANEL (right) ── */}
        <div className={`form-panel ${
          animating
            ? (isLogin ? 'slide-out-right' : 'slide-out-left')
            : ''
        }`}>

          {/* LOGIN FORM */}
          <div className={`form-inner ${!isLogin ? 'hidden' : ''}`}
               style={{ position: isLogin ? 'relative' : 'absolute' }}>
            <div>
              <div className="form-heading">Welcome back.</div>
              <div className="form-sub">Sign in to continue</div>
            </div>
            <div className="divider" />
            <input
              className="auth-input"
              placeholder="Username"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button className="auth-btn" onClick={handleLogin}>Login</button>
            {loginError && <p className="auth-error">{loginError}</p>}
            <p className="auth-footer">
              No account?{' '}
              <button onClick={() => switchMode('register')}>Register here</button>
            </p>
          </div>

          {/* REGISTER FORM */}
          <div className={`form-inner ${isLogin ? 'hidden' : ''}`}
               style={{ position: !isLogin ? 'relative' : 'absolute' }}>
            <div>
              <div className="form-heading">Create account.</div>
              <div className="form-sub">Join us today</div>
            </div>
            <div className="divider" />
            <input
              className="auth-input"
              placeholder="Username"
              value={regForm.username}
              onChange={e => setRegForm({ ...regForm, username: e.target.value })}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={regForm.password}
              onChange={e => setRegForm({ ...regForm, password: e.target.value })}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Confirm password"
              value={regForm.confirm}
              onChange={e => setRegForm({ ...regForm, confirm: e.target.value })}
            />
            <button className="auth-btn" onClick={handleRegister}>Register</button>
            {regError && <p className="auth-error">{regError}</p>}
            <p className="auth-footer">
              Already have an account?{' '}
              <button onClick={() => switchMode('login')}>Sign in</button>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}