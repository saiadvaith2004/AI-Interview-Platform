import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const TOPICS = ['Java', 'Python', 'DSA', 'General', 'SQL', 'Spring', 'OS', 'Networking', 'System_Design', 'Machine_Learning'];

export default function InterviewSetup() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const startInterview = async () => {
    if (!topic) return alert('Please select a topic!');
    setLoading(true);

    // Enter fullscreen directly on button click (browser allows this)
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        await document.documentElement.mozRequestFullScreen();
      }
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🎯 Start Interview</h2>
        <p>Select a topic to begin your practice session</p>
        <div style={styles.topicGrid}>
          {TOPICS.map(t => (
            <button
              key={t}
              style={topic === t ? styles.topicSelected : styles.topic}
              onClick={() => setTopic(t)}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button style={styles.btnPrimary} onClick={startInterview} disabled={loading}>
          {loading ? 'Starting...' : 'Start Interview'}
        </button>
        <button style={styles.btnSecondary} onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '420px', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' },
  topicGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  topic: { padding: '0.75rem', background: '#f3f4f6', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  topicSelected: { padding: '0.75rem', background: '#ede9fe', border: '2px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', color: '#4f46e5' },
  btnPrimary: { padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  btnSecondary: { padding: '0.75rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }
};