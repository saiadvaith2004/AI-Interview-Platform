import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Flipkart', 'Adobe', 'Uber', 'Netflix', 'Swiggy',
  'Zomato', 'Paytm', 'CRED', 'Razorpay', 'Atlassian',
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'
];

const COMPANY_TIERS = {
  FAANG: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix'],
  Unicorn: ['Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'CRED', 'Razorpay'],
  Global: ['Adobe', 'Uber', 'Atlassian'],
  Service: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant']
};

const getTier = (c) => {
  for (const [tier, list] of Object.entries(COMPANY_TIERS))
    if (list.includes(c)) return tier;
  return '';
};

const TIER_COLOR = {
  FAANG:   { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.3)',  text: '#fbbf24' },
  Unicorn: { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.3)',  text: '#818cf8' },
  Global:  { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.3)',  text: '#34d399' },
  Service: { bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.25)', text: '#9ca3af' },
};

export default function CompanyPrep() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [company, setCompany] = useState('');
  const [resumeStatus, setResumeStatus] = useState({ hasResume: false, fileName: '' });
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  const logout = () => {
  localStorage.clear();
  navigate('/login');
};

  useEffect(() => {
    fetchResumeStatus();
    setTimeout(() => setMounted(true), 50);
  }, []);

  const fetchResumeStatus = async () => {
    try {
      const res = await api.get(`/resume/status/${username}`);
      setResumeStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch resume status');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadMsg('Only PDF files are allowed.');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/resume/upload/${username}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadMsg('success');
      fetchResumeStatus();
    } catch (err) {
      setUploadMsg('Failed to upload resume. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const startCompanyInterview = async () => {
    if (!resumeStatus.hasResume) { setUploadMsg('Please upload your resume first.'); return; }
    if (!company) { alert('Please select a company!'); return; }
    setStarting(true);
    try {
      if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      const res = await api.post('/resume/start-company-interview', { username, company });
      navigate(`/interview/${res.data.id}`, { state: { interview: res.data } });
    } catch (err) {
      alert('Failed to start interview. Please try again.');
      if (document.exitFullscreen) document.exitFullscreen();
    } finally {
      setStarting(false);
    }
  };

  const canStart = resumeStatus.hasResume && company && !starting;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cp-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1rem;
          position: relative;
          overflow-x: hidden;
        }

        .cp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .cp-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.08;
        }
        .cp-orb-1 { width: 400px; height: 400px; background: #6366f1; top: -100px; right: -80px; }
        .cp-orb-2 { width: 300px; height: 300px; background: #a78bfa; bottom: -80px; left: -60px; }

        /* Card */
        .cp-card {
          width: 100%;
          max-width: 660px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.25rem 2rem;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }

        .cp-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Header */
        .cp-header {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .cp-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.55rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.3rem;
        }

        .cp-sub {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.3);
          line-height: 1.6;
        }

        /* Section */
        .cp-section {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .cp-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
        }

        /* Drop zone */
        .drop-zone {
          border: 1.5px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(255,255,255,0.02);
        }

        .drop-zone.drag-over {
          border-color: #6366f1;
          background: rgba(99,102,241,0.07);
        }

        .drop-zone:hover {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.03);
        }

        .drop-icon { font-size: 2.25rem; line-height: 1; }

        .drop-text {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }

        .drop-or {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.2);
        }

        .btn-browse {
          padding: 0.55rem 1.4rem;
          background: #6366f1;
          color: #fff;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .btn-browse:hover { background: #4f46e5; }

        /* Resume exists */
        .resume-exists {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.1rem;
          background: rgba(52,211,153,0.07);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 10px;
        }

        .resume-big-icon { font-size: 1.75rem; flex-shrink: 0; }

        .resume-file-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #e5e7eb;
          margin-bottom: 2px;
          word-break: break-all;
        }

        .resume-ok {
          font-size: 0.75rem;
          color: #34d399;
        }

        .btn-replace {
          margin-left: auto;
          flex-shrink: 0;
          padding: 0.4rem 0.9rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, color 0.2s;
        }
        .btn-replace:hover { background: rgba(255,255,255,0.12); color: #fff; }

        /* Upload message */
        .upload-msg {
          font-size: 0.82rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
        }
        .upload-msg.ok  { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }
        .upload-msg.err { background: rgba(239,68,68,0.1);  color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

        /* Company grid */
        .company-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .company-btn {
          padding: 0.55rem 0.4rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          text-align: center;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
        }

        .company-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8);
          transform: translateY(-1px);
        }

        .company-btn.selected {
          font-weight: 500;
          transform: translateY(-1px);
        }

        /* Selected company banner */
        .company-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.08);
          font-size: 0.85rem;
        }

        .company-banner-label { color: rgba(255,255,255,0.35); }
        .company-banner-name  { color: #a5b4fc; font-weight: 500; font-family: 'Syne', sans-serif; }

        /* Generating state */
        .generating-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(99,102,241,0.07);
          border-radius: 8px;
          border: 1px solid rgba(99,102,241,0.15);
        }

        .generating-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          text-align: center;
          line-height: 1.6;
        }

        .generating-bar {
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .generating-fill {
          height: 100%;
          background: #6366f1;
          border-radius: 2px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%   { width: 0%; margin-left: 0; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }

        /* Action buttons */
        .btn-row {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .btn-start {
          width: 100%;
          padding: 0.9rem;
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
        .btn-start:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-back {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        .btn-back:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.65);
          border-color: rgba(255,255,255,0.15);
        }

        <button className="btn-logout" onClick={logout}>
            🚪 &nbsp;Logout
        </button>

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

        @media (max-width: 520px) {
          .cp-card { padding: 1.5rem 1.25rem; }
          .company-grid { grid-template-columns: repeat(3, 1fr); }
        }

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

        @media (max-width: 380px) {
          .company-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="cp-root">
        <div className="cp-orb cp-orb-1" />
        <div className="cp-orb cp-orb-2" />

        <div className={`cp-card ${mounted ? 'mounted' : ''}`}>

          {/* Header */}
          <div className="cp-header">
            <div className="cp-title">Company specific prep</div>
            <div className="cp-sub">
              Upload your resume and select your target company to get AI-personalised interview questions
            </div>
          </div>

          {/* Resume section */}
          <div className="cp-section">
            <div className="cp-section-title">Your resume</div>

            {resumeStatus.hasResume ? (
              <div className="resume-exists">
                <span className="resume-big-icon">📋</span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="resume-file-name">{resumeStatus.fileName}</div>
                  <div className="resume-ok">Resume on file</div>
                </div>
                <label className="btn-replace" htmlFor="resumeInput" style={{ cursor: 'pointer' }}>
                  Replace
                </label>
              </div>
            ) : (
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <span className="drop-icon">📁</span>
                <p className="drop-text">Drag & drop your PDF resume here</p>
                <p className="drop-or">or</p>
                <label className="btn-browse" htmlFor="resumeInput" style={{ cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Browse PDF file'}
                </label>
              </div>
            )}

            <input
              id="resumeInput"
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={e => handleFileUpload(e.target.files[0])}
            />

            {uploadMsg && uploadMsg !== 'success' && (
              <div className={`upload-msg ${uploadMsg === 'success' ? 'ok' : 'err'}`}>
                {uploadMsg}
              </div>
            )}
            {uploadMsg === 'success' && (
              <div className="upload-msg ok">Resume uploaded successfully!</div>
            )}
          </div>

          {/* Company section */}
          <div className="cp-section">
            <div className="cp-section-title">Target company</div>

            {company && (
              <div className="company-banner">
                <span className="company-banner-label">Selected</span>
                <span className="company-banner-name">{company}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: TIER_COLOR[getTier(company)]?.bg,
                  color: TIER_COLOR[getTier(company)]?.text,
                  border: `1px solid ${TIER_COLOR[getTier(company)]?.border}`
                }}>
                  {getTier(company)}
                </span>
              </div>
            )}

            <div className="company-grid">
              {COMPANIES.map(c => {
                const tier = getTier(c);
                const isSelected = company === c;
                const tc = TIER_COLOR[tier];
                return (
                  <button
                    key={c}
                    className={`company-btn ${isSelected ? 'selected' : ''}`}
                    style={isSelected ? {
                      background: tc.bg,
                      borderColor: tc.border,
                      color: tc.text
                    } : {}}
                    onClick={() => setCompany(c)}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generating state */}
          {starting && (
            <div className="generating-box">
              <div className="generating-text">
                AI is analysing your resume and generating personalised questions for <strong style={{ color: '#a5b4fc' }}>{company}</strong>...
              </div>
              <div className="generating-bar">
                <div className="generating-fill" />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="btn-row">
            <button
              className="btn-start"
              onClick={startCompanyInterview}
              disabled={!canStart}
            >
              {starting ? 'Generating questions...' : 'Start company interview'}
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