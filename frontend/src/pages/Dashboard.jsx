import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [resumeStatus, setResumeStatus] = useState({ hasResume: false, fileName: '' });

  useEffect(() => {
    api.get(`/resume/status/${username}`)
      .then(res => setResumeStatus(res.data))
      .catch(err => console.error(err));
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
      alert('✅ Resume updated successfully!');
      const res = await api.get(`/resume/status/${username}`);
      setResumeStatus(res.data);
    } catch (err) {
      alert('❌ Failed to upload resume');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f0f2f5' }}>
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: '480px', borderRadius: '16px' }}>
        <div className="card-body p-4">

          {/* Header */}
          <h4 className="fw-bold text-center mb-1">AI Interview Platform 🎯</h4>
          <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            Hello, <strong>{username}</strong>! Choose your interview mode
          </p>

          {/* Resume Status */}
          <div className="p-3 mb-3 rounded-3" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2 overflow-hidden">
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>📄</span>
                <div className="overflow-hidden">
                  {resumeStatus.hasResume ? (
                    <>
                      <div className="fw-semibold text-truncate" style={{ fontSize: '0.85rem', maxWidth: '220px' }}>
                        {resumeStatus.fileName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#059669' }}>✅ Resume on file</div>
                    </>
                  ) : (
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>No resume uploaded yet</div>
                  )}
                </div>
              </div>
              <label
                htmlFor="dashResumeInput"
                className="btn btn-sm flex-shrink-0"
                style={{
                  background: resumeStatus.hasResume ? '#6b7280' : '#4f46e5',
                  color: 'white',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {resumeStatus.hasResume ? '🔄 Update' : '⬆ Upload'}
              </label>
              <input
                id="dashResumeInput"
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleResumeUpload}
              />
            </div>
          </div>

          {/* Practice Mode */}
          <div
            className="p-3 mb-3 rounded-3 d-flex align-items-center gap-3"
            style={{ border: '2px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}
            onClick={() => navigate('/interview/setup')}
          >
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>📚</span>
            <div className="flex-grow-1">
              <div className="fw-bold" style={{ fontSize: '0.95rem' }}>Practice Mode</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>Topic-based questions from our PBC question bank</div>
            </div>
            <span className="text-muted">→</span>
          </div>

          {/* Company Specific */}
          <div
            className="p-3 mb-3 rounded-3 d-flex align-items-center gap-3"
            style={{ border: '2px solid #c4b5fd', background: '#faf5ff', cursor: 'pointer' }}
            onClick={() => navigate('/company-prep')}
          >
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>🏢</span>
            <div className="flex-grow-1">
              <div className="fw-bold" style={{ fontSize: '0.95rem' }}>Company Specific Prep</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>Upload resume + select company for AI-personalized questions</div>
            </div>
            <span className="text-muted">→</span>
          </div>

          {/* View History */}
          <button
            className="btn w-100 mb-2"
            style={{ background: '#f3f4f6', color: '#374151', fontSize: '0.95rem' }}
            onClick={() => navigate('/history')}
          >
            📋 View Past Interviews
          </button>

          {/* Logout */}
          <button
            className="btn btn-danger w-100"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}