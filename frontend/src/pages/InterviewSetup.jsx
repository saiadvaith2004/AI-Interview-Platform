import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const TOPICS = [
  { id: 'Java',           emoji: '☕' },
  { id: 'Python',         emoji: '🐍' },
  { id: 'DSA',            emoji: '🧩' },
  { id: 'General',        emoji: '💬' },
  { id: 'SQL',            emoji: '🗄️' },
  { id: 'Spring',         emoji: '🌱' },
  { id: 'OS',             emoji: '🖥️' },
  { id: 'Networking',     emoji: '🌐' },
  { id: 'System_Design',  emoji: '🏗️' },
  { id: 'Machine_Learning', emoji: '🤖' },
];

export default function InterviewSetup() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const startInterview = async () => {
    if (!topic) return alert('Please select a topic!');
    setLoading(true);

    try {
      if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else if (document.documentElement.webkitRequestFullscreen)
        await document.documentElement.webkitRequestFullscreen();
      else if (document.documentElement.mozRequestFullScreen)
        await document.documentElement.mozRequestFullScreen();
    } catch (err) {
      console.log('Fullscreen failed:', err);
    }

    try {
      const res = await api.post('/interviews/start', { username, topic });
      navigate(`/interview/${res.data.id}`, { state: { interview: res.data } });
    } catch (err) {
      alert('Failed to start interview');
      if (document.exitFullscreen) document.exitFullscreen();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .setup-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }

        .setup-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .setup-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.09;
        }
        .setup-orb-1 { width: 380px; height: 380px; background: #6366f1; top: -80px; left: -80px; }
        .setup-orb-2 { width: 280px; height: 280px; background: #a78bfa; bottom: -60px; right: -60px; }

        .setup-card {
          width: 100%;
          max-width: 500px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.25rem 2rem 2rem;
          position: relative;
          z-index: 1;
          animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .setup-header {
          text-align: center;
          margin-bottom: 1.75rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          animation: fadeUp 0.4s ease 0.1s both;
        }

        .setup-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.3rem;
        }

        .setup-sub {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.3);
        }

        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          animation: fadeUp 0.4s ease 0.15s both;
        }

        .topic-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.4s ease 0.2s both;
        }

        .topic-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 0.9rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.15s;
          text-align: left;
        }

        .topic-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85);
          transform: translateY(-1px);
        }

        .topic-btn.selected {
          background: rgba(99,102,241,0.15);
          border-color: #6366f1;
          color: #a5b4fc;
          font-weight: 500;
        }

        .topic-btn.selected:hover { background: rgba(99,102,241,0.22); }

        .topic-emoji { font-size: 1rem; line-height: 1; flex-shrink: 0; }
        .topic-label { flex: 1; }

        .topic-btn.selected::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }

        .btn-row {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          animation: fadeUp 0.4s ease 0.25s both;
        }

        .btn-start {
          width: 100%;
          padding: 0.85rem;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
        }

        .btn-start:hover:not(:disabled) { background: #4f46e5; }
        .btn-start:active:not(:disabled) { transform: scale(0.98); }
        .btn-start:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-back {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .btn-back:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
        }

        /* ✅ Logout Button */
        .btn-logout {
          width: 100%;
          padding: 0.8rem;
          background: #ff0000;
          border: 3px solid #ff6666;
          border-radius: 8px;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-logout:hover { background: #cc0000; border-color: #ff4444; }
        .btn-logout:active { transform: scale(0.98); }

        .selected-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.9rem;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.82rem;
          color: #a5b4fc;
          animation: fadeUp 0.3s ease both;
        }

        .selected-banner span { font-weight: 500; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .loading-dots::after {
          content: '';
          animation: dots 1.2s steps(4, end) infinite;
        }
        @keyframes dots {
          0%,20%  { content: ''; }
          40%     { content: '.'; }
          60%     { content: '..'; }
          80%,100%{ content: '...'; }
        }

        @media (max-width: 480px) {
          .setup-card { padding: 1.5rem 1.25rem; }
          .topic-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="setup-root">
        <div className="setup-orb setup-orb-1" />
        <div className="setup-orb setup-orb-2" />

        <div className="setup-card">

          {/* Header */}
          <div className="setup-header">
            <div className="setup-title">Start interview</div>
            <div className="setup-sub">Select a topic to begin your practice session</div>
          </div>

          {/* Selected topic banner */}
          {topic && (
            <div className="selected-banner">
              <span>Selected:</span>
              {TOPICS.find(t => t.id === topic)?.emoji}&nbsp;
              <span>{topic.replace('_', ' ')}</span>
            </div>
          )}

          {/* Topic label */}
          <div className="section-label">Choose topic</div>

          {/* Topic grid */}
          <div className="topic-grid">
            {TOPICS.map(t => (
              <button
                key={t.id}
                className={`topic-btn ${topic === t.id ? 'selected' : ''}`}
                onClick={() => setTopic(t.id)}
              >
                <span className="topic-emoji">{t.emoji}</span>
                <span className="topic-label">{t.id.replace('_', ' ')}</span>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="btn-row">
            <button
              className="btn-start"
              onClick={startInterview}
              disabled={loading}
            >
              {loading
                ? <span className="loading-dots">Starting</span>
                : 'Start interview'}
            </button>
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
              ← Back to dashboard
            </button>
            <button className="btn-logout" onClick={logout}>
              🚪 &nbsp;Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
}