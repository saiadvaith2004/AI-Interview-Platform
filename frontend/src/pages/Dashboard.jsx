import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [resumeStatus, setResumeStatus] = useState({ hasResume: false, fileName: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    api.get(`/resume/status/${username}`)
      .then(res => setResumeStatus(res.data))
      .catch(err => console.error(err));
    setTimeout(() => setMounted(true), 50);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/resume/upload/${username}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Resume updated successfully!');
      const res = await api.get(`/resume/status/${username}`);
      setResumeStatus(res.data);
    } catch (err) {
      alert('Failed to upload resume');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 2rem 1rem 3rem 1rem;
          position: relative;
          overflow-y: auto;
        }

        .dash-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.1;
        }
        .orb-1 { width: 400px; height: 400px; background: #6366f1; top: -100px; right: -100px; }
        .orb-2 { width: 300px; height: 300px; background: #a78bfa; bottom: -80px; left: -80px; }

        .dash-card {
          width: 100%;
          max-width: 480px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2rem 2rem 1.75rem;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .dash-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .dash-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .dash-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .dash-subtitle {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.35);
        }

        .dash-subtitle strong {
          color: #818cf8;
          font-weight: 500;
        }

        .resume-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
          transition: border-color 0.2s;
        }

        .resume-box:hover { border-color: rgba(255,255,255,0.15); }

        .resume-icon { font-size: 1.4rem; flex-shrink: 0; }

        .resume-info { flex: 1; overflow: hidden; }

        .resume-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #e5e7eb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }

        .resume-status-ok { font-size: 0.75rem; color: #34d399; margin-top: 1px; }
        .resume-status-none { font-size: 0.85rem; color: rgba(255,255,255,0.3); }

        .upload-btn {
          flex-shrink: 0;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .upload-btn:hover { opacity: 0.85; }
        .upload-btn:active { transform: scale(0.97); }
        .upload-btn.has-resume { background: rgba(255,255,255,0.1); color: #d1d5db; }
        .upload-btn.no-resume  { background: #6366f1; color: #fff; }

        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .mode-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.1rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          margin-bottom: 0.65rem;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          text-decoration: none;
        }

        .mode-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateX(3px);
        }

        .mode-card:active { transform: translateX(1px); }

        .mode-card.company {
          border-color: rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.06);
        }

        .mode-card.company:hover {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.1);
        }

        .mode-emoji { font-size: 1.75rem; flex-shrink: 0; line-height: 1; }
        .mode-text { flex: 1; }

        .mode-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #f3f4f6;
          margin-bottom: 2px;
        }

        .mode-desc { font-size: 0.78rem; color: rgba(255,255,255,0.3); line-height: 1.4; }

        .mode-arrow {
          color: rgba(255,255,255,0.2);
          font-size: 1rem;
          flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }

        .mode-card:hover .mode-arrow {
          color: rgba(255,255,255,0.6);
          transform: translateX(3px);
        }

        .dash-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 1.1rem 0;
        }

        /* ✅ History Button — bright white, clearly visible */
        .history-btn {
          width: 100%;
          padding: 0.85rem;
          background: #ffffff;
          border: none;
          border-radius: 8px;
          color: #111111;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 0.75rem;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.01em;
        }

        .history-btn:hover {
          background: #e5e7eb;
        }

        /* ✅ Logout Button — solid bright red, always visible */
        .logout-btn {
          width: 100%;
          padding: 0.85rem;
          background: #ff0000;
          border: 3px solid #ff6666;
          border-radius: 8px;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .logout-btn:hover {
          background: #cc0000;
          border-color: #ff4444;
        }

        .logout-btn:active {
          transform: scale(0.98);
        }

        .fade-item {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .dash-card.mounted .fade-item:nth-child(1) { opacity:1; transform:none; transition-delay:0.05s; }
        .dash-card.mounted .fade-item:nth-child(2) { opacity:1; transform:none; transition-delay:0.12s; }
        .dash-card.mounted .fade-item:nth-child(3) { opacity:1; transform:none; transition-delay:0.19s; }
        .dash-card.mounted .fade-item:nth-child(4) { opacity:1; transform:none; transition-delay:0.26s; }
        .dash-card.mounted .fade-item:nth-child(5) { opacity:1; transform:none; transition-delay:0.33s; }
        .dash-card.mounted .fade-item:nth-child(6) { opacity:1; transform:none; transition-delay:0.40s; }

        @media (max-width: 520px) {
          .dash-card { padding: 1.5rem 1.25rem; }
        }
      `}</style>

      <div className="dash-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className={`dash-card ${mounted ? 'mounted' : ''}`}>

          {/* Header */}
          <div className="dash-header fade-item">
            <div className="dash-title">AI Interview Platform</div>
            <div className="dash-subtitle">
              Hello, <strong>{username}</strong> — choose your mode
            </div>
          </div>

          {/* Resume */}
          <div className="resume-box fade-item">
            <span className="resume-icon">📄</span>
            <div className="resume-info">
              {resumeStatus.hasResume ? (
                <>
                  <div className="resume-name">{resumeStatus.fileName}</div>
                  <div className="resume-status-ok">Resume on file</div>
                </>
              ) : (
                <div className="resume-status-none">No resume uploaded yet</div>
              )}
            </div>
            <label
              htmlFor="dashResumeInput"
              className={`upload-btn ${resumeStatus.hasResume ? 'has-resume' : 'no-resume'}`}
              style={{ cursor: 'pointer' }}
            >
              {resumeStatus.hasResume ? 'Update' : 'Upload'}
            </label>
            <input
              id="dashResumeInput"
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleResumeUpload}
            />
          </div>

          {/* Modes label */}
          <div className="section-label fade-item">Interview modes</div>

          {/* Practice mode */}
          <div
            className="mode-card fade-item"
            onClick={() => navigate('/interview/setup')}
          >
            <span className="mode-emoji">📚</span>
            <div className="mode-text">
              <div className="mode-title">Practice mode</div>
              <div className="mode-desc">Topic-based questions from our AI question bank</div>
            </div>
            <span className="mode-arrow">→</span>
          </div>

          {/* Company specific */}
          <div
            className="mode-card company fade-item"
            onClick={() => navigate('/company-prep')}
          >
            <span className="mode-emoji">🏢</span>
            <div className="mode-text">
              <div className="mode-title">Company specific prep</div>
              <div className="mode-desc">Upload resume + select company for AI-personalised questions</div>
            </div>
            <span className="mode-arrow">→</span>
          </div>

          <div className="dash-divider fade-item" />

          {/* History & Logout */}
<div style={{ marginTop: '1rem' }}>
            <button className="history-btn" onClick={() => navigate('/history')}>
              📋 &nbsp;View past interviews
            </button>
            <button className="logout-btn" onClick={logout}>
              🚪 &nbsp;Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
}