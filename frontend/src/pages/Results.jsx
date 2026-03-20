import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  let isMounted = true;
  const fetchEvaluations = async () => {
    try {
      const existing = await api.get(`/interviews/${id}/evaluations`);
      if (existing.data.length > 0) {
        if (isMounted) setEvaluations(existing.data);
        return;
      }
      await api.post(`/interviews/${id}/evaluate`);
      const res = await api.get(`/interviews/${id}/evaluations`);
      if (isMounted) setEvaluations(res.data);
    } catch (err) {
      if (isMounted) setError('Failed to load evaluations');
    } finally {
      if (isMounted) setLoading(false);
    }
  };
  fetchEvaluations();
  return () => { isMounted = false; };
}, [id]);

  const avgScore = evaluations.length
    ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 7) return '#10b981';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Average';
    return 'Needs Improvement';
  };

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🤖 AI is evaluating your answers...</h2>
        <p>This may take a few seconds</p>
        <div style={styles.spinner} />
      </div>
    </div>
  );

  if (error) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>❌ {error}</h2>
        <button style={styles.btnPrimary} onClick={() => navigate('/history')}>
          Back to History
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Overall Score */}
        <div style={styles.overallScore}>
          <h2>Interview Results 🎯</h2>
          <div style={{
            ...styles.scoreBadge,
            background: getScoreColor(avgScore)
          }}>
            {avgScore}/10
          </div>
          <p style={styles.scoreLabel}>{getScoreLabel(avgScore)}</p>
        </div>

        {/* Individual Questions */}
        {evaluations.map((evaluation, index) => (
          <div key={index} style={styles.evaluationCard}>
            <div style={styles.evalHeader}>
              <span style={styles.questionNum}>Q{index + 1}</span>
              <span style={{
                ...styles.scoreChip,
                background: getScoreColor(evaluation.score)
              }}>
                {evaluation.score}/10
              </span>
            </div>

            <p style={styles.question}>{evaluation.question}</p>

            <div style={styles.answerBox}>
              <strong>Your Answer:</strong>
              <p style={styles.answer}>
                {evaluation.answer || 'No answer provided'}
              </p>
            </div>

            <div style={styles.feedbackBox}>
              <strong>📝 Feedback:</strong>
              <p>{evaluation.feedback}</p>
            </div>

            {evaluation.strengths && (
              <div style={styles.strengthsBox}>
                <strong>✅ Strengths:</strong>
                <p>{evaluation.strengths}</p>
              </div>
            )}

            {evaluation.improvements && (
              <div style={styles.improvementsBox}>
                <strong>⚠️ Improvements:</strong>
                <p>{evaluation.improvements}</p>
              </div>
            )}
          </div>
        ))}

        <div style={styles.buttons}>
          <button style={styles.btnPrimary} onClick={() => navigate('/interview/setup')}>
            Start New Interview
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate('/history')}>
            View History
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '2rem 1rem' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  overallScore: { textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '12px' },
  scoreBadge: { display: 'inline-block', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', padding: '0.5rem 1.5rem', borderRadius: '999px', margin: '0.5rem 0' },
  scoreLabel: { fontSize: '1.1rem', color: '#6b7280', margin: 0 },
  evaluationCard: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  evalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  questionNum: { background: '#ede9fe', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.875rem' },
  scoreChip: { color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.875rem' },
  question: { fontWeight: '600', color: '#1f2937', margin: 0 },
  answerBox: { background: '#f9fafb', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' },
  answer: { margin: '0.25rem 0 0', color: '#4b5563' },
  feedbackBox: { background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#1e40af' },
  strengthsBox: { background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#166534' },
  improvementsBox: { background: '#fffbeb', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#92400e' },
  buttons: { display: 'flex', gap: '1rem' },
  btnPrimary: { flex: 1, padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  btnSecondary: { flex: 1, padding: '0.75rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  spinner: { width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '1rem auto' }
};