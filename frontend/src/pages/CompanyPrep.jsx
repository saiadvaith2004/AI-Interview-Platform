import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Flipkart', 'Adobe', 'Uber', 'Netflix', 'Swiggy',
  'Zomato', 'Paytm', 'CRED', 'Razorpay', 'Atlassian',
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'
];

export default function CompanyPrep() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [company, setCompany] = useState('');
  const [resumeStatus, setResumeStatus] = useState({ hasResume: false, fileName: '' });
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchResumeStatus();
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
      setUploadMsg('❌ Only PDF files are allowed!');
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
      setUploadMsg('✅ Resume uploaded successfully!');
      fetchResumeStatus();
    } catch (err) {
      setUploadMsg('❌ Failed to upload resume. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const startCompanyInterview = async () => {
    if (!resumeStatus.hasResume) {
      setUploadMsg('❌ Please upload your resume first!');
      return;
    }
    if (!company) {
      alert('Please select a company!');
      return;
    }

    setStarting(true);
    try {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      const res = await api.post('/resume/start-company-interview', { username, company });
      navigate(`/interview/${res.data.id}`, { state: { interview: res.data } });
    } catch (err) {
      alert('Failed to start interview. Please try again.');
      if (document.exitFullscreen) document.exitFullscreen();
    } finally {
      setStarting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: '#1f2937' }}>🏢 Company Specific Prep</h2>
        <p style={styles.subtitle}>Upload your resume and select your target company to get personalized interview questions</p>

        {/* Resume Upload Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📄 Your Resume</h3>

          {resumeStatus.hasResume ? (
            <div style={styles.resumeExists}>
              <div style={styles.resumeIcon}>📋</div>
              <div>
                <div style={styles.resumeName}>{resumeStatus.fileName}</div>
                <div style={styles.resumeUploaded}>Resume uploaded ✅</div>
              </div>
              <label style={styles.btnReplace} htmlFor="resumeInput">
                Replace
              </label>
            </div>
          ) : (
            <div
              style={{
                ...styles.dropZone,
                background: dragOver ? '#ede9fe' : '#f9fafb',
                borderColor: dragOver ? '#4f46e5' : '#d1d5db'
              }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div style={styles.dropIcon}>📁</div>
              <p style={styles.dropText}>Drag & drop your PDF resume here</p>
              <p style={styles.dropOr}>or</p>
              <label style={styles.btnUpload} htmlFor="resumeInput">
                {uploading ? 'Uploading...' : 'Browse PDF File'}
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

          {uploadMsg && (
            <p style={{
              ...styles.uploadMsg,
              color: uploadMsg.includes('✅') ? '#059669' : '#dc2626'
            }}>
              {uploadMsg}
            </p>
          )}
        </div>

        {/* Company Selection */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🎯 Select Target Company</h3>
          <div style={styles.companyGrid}>
            {COMPANIES.map(c => (
              <button
                key={c}
                style={company === c ? styles.companySelected : styles.company}
                onClick={() => setCompany(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          style={{
            ...styles.btnStart,
            opacity: (!resumeStatus.hasResume || !company || starting) ? 0.6 : 1
          }}
          onClick={startCompanyInterview}
          disabled={!resumeStatus.hasResume || !company || starting}
        >
          {starting ? '🤖 Generating Questions...' : '🚀 Start Company Interview'}
        </button>

        {starting && (
          <p style={styles.generatingMsg}>
            AI is analyzing your resume and generating personalized questions for {company}...
          </p>
        )}

        <button style={styles.btnBack} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#f0f2f5', padding: '2rem 1rem' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  subtitle: { color: '#374151', margin: 0, fontSize: '0.95rem' },
  section: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  sectionTitle: { margin: 0, fontSize: '1rem', color: '#1f2937', fontWeight: '600' },
  dropZone: { border: '2px dashed', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  dropIcon: { fontSize: '2.5rem' },
  dropText: { margin: 0, color: '#374151', fontWeight: '500' },
  dropOr: { margin: 0, color: '#9ca3af', fontSize: '0.875rem' },
  btnUpload: { padding: '0.6rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' },
  btnReplace: { padding: '0.4rem 1rem', background: '#6b7280', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', marginLeft: 'auto' },
  resumeExists: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px' },
  resumeIcon: { fontSize: '2rem' },
  resumeName: { fontWeight: '600', color: '#374151', fontSize: '0.9rem' },
  resumeUploaded: { color: '#059669', fontSize: '0.8rem' },
  uploadMsg: { margin: 0, fontSize: '0.9rem', fontWeight: '500' },
  companyGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' },
  company: { padding: '0.6rem', background: '#f3f4f6', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'center', color: '#1f2937' },
companySelected: { padding: '0.6rem', background: '#ede9fe', border: '2px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold', color: '#4f46e5' },
  btnStart: { padding: '1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', transition: 'opacity 0.2s' },
  generatingMsg: { textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', margin: 0 },
  btnBack: { padding: '0.75rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }
};