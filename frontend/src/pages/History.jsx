import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [evaluations, setEvaluations] = useState({});
  const [loadingEval, setLoadingEval] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // Fetch all interviews for the user
  useEffect(() => {
    api.get(`/interviews/user/${username}`)
      .then(res => {
        const userInterviews = res.data.filter(i => i.username !== 'SYSTEM');
        userInterviews.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
        setInterviews(userInterviews);
      })
      .catch(err => console.error(err));
  }, []);

  // Check if interview was disqualified
  const isDisqualified = (interview) => {
    if (!interview.answersJson) return false;
    try {
      const answers = JSON.parse(interview.answersJson);
      return answers.length > 0 && answers.every(a => a === 'DISQUALIFIED');
    } catch {
      return false;
    }
  };

  // Fetch evaluations for a specific interview
  const handleViewDetails = async (interviewId) => {
    if (selectedId === interviewId) {
      setSelectedId(null);
      return;
    }
    setSelectedId(interviewId);
    if (evaluations[interviewId]) return;
    setLoadingEval(interviewId);
    try {
      const res = await api.get(`/interviews/${interviewId}/evaluations`);
      setEvaluations(prev => ({ ...prev, [interviewId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch evaluations', err);
    } finally {
      setLoadingEval(null);
    }
  };

  const getAvgScore = (evals) => {
    if (!evals || evals.length === 0) return null;
    return Math.round(evals.reduce((sum, e) => sum + e.score, 0) / evals.length);
  };

  const getScoreColor = (score) => {
    if (score >= 7) return '#10b981';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return '🌟 Excellent';
    if (score >= 6) return '✅ Good';
    if (score >= 4) return '⚡ Average';
    return '📈 Needs Improvement';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📋 Interview History</h2>
        <p style={styles.subtitle}>
          {interviews.length} interview{interviews.length !== 1 ? 's' : ''} completed
        </p>

        {interviews.length === 0 ? (
          <div style={styles.empty}>
            <p>No interviews yet.</p>
            <button style={styles.btnPrimary} onClick={() => navigate('/interview/setup')}>
              Start Your First Interview
            </button>
          </div>
        ) : (
          interviews.map(i => {
            const evals = evaluations[i.id];
            const avgScore = getAvgScore(evals);
            const isOpen = selectedId === i.id;
            const disqualified = isDisqualified(i);

            return (
              <div key={i.id} style={{
                ...styles.item,
                borderColor: disqualified ? '#fca5a5' : '#e5e7eb',
                background: disqualified ? '#fff5f5' : 'white'
              }}>

                {/* Interview Header */}
                <div style={styles.itemHeader}>
                  <div style={styles.itemLeft}>
                    <span style={styles.topicBadge}>{i.topic}</span>
                    {disqualified ? (
                      <span style={styles.disqualified}>❌ DISQUALIFIED</span>
                    ) : (
                      <span style={i.status === 'COMPLETED' ? styles.done : styles.started}>
                        {i.status}
                      </span>
                    )}
                  </div>
                  {/* Only show score if not disqualified */}
                  {!disqualified && avgScore !== null && (
                    <div style={{ ...styles.scoreBadge, background: getScoreColor(avgScore) }}>
                      {avgScore}/10
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div style={styles.date}>
                  🕐 Started: {formatDate(i.startedAt)}
                  {i.completedAt && (
                    <span style={{ marginLeft: '1rem' }}>
                      ✅ Completed: {formatDate(i.completedAt)}
                    </span>
                  )}
                </div>

                {/* Disqualified Message */}
                {disqualified && (
                  <div style={styles.disqualifiedBox}>
                    <strong>⚠️ Interview Disqualified</strong>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                      This interview was disqualified — answers were not submitted properly or the session was exited early. Please start a new interview to get evaluated.
                    </p>
                  </div>
                )}

                {/* Overall Performance Summary — only for valid completed interviews */}
                {!disqualified && avgScore !== null && (
                  <div style={{ ...styles.summaryBox, borderColor: getScoreColor(avgScore) }}>
                    <strong>Overall Performance: </strong>
                    <span style={{ color: getScoreColor(avgScore), fontWeight: 'bold' }}>
                      {getScoreLabel(avgScore)} ({avgScore}/10)
                    </span>
                  </div>
                )}

                {/* View Details Button — only for valid completed interviews */}
                {i.status === 'COMPLETED' && !disqualified && (
                  <button
                    style={isOpen ? styles.btnSecondary : styles.btnPrimary}
                    onClick={() => handleViewDetails(i.id)}
                  >
                    {loadingEval === i.id
                      ? 'Loading...'
                      : isOpen
                      ? '▲ Hide Details'
                      : '▼ View Answers & Feedback'}
                  </button>
                )}

                {/* Resume Button for STARTED interviews */}
                {i.status === 'STARTED' && !disqualified && (
                  <button
                    style={styles.btnResume}
                    onClick={() => navigate(`/interview/${i.id}`)}
                  >
                    ▶ Resume Interview
                  </button>
                )}

                {/* Retry Button for disqualified interviews */}
                {disqualified && (
                  <button
                    style={styles.btnResume}
                    onClick={() => navigate('/interview/setup')}
                  >
                    🔄 Start New Interview
                  </button>
                )}

                {/* Expanded Evaluation Details */}
                {isOpen && evals && evals.length > 0 && (
                  <div style={styles.evalSection}>
                    {evals.map((evaluation, index) => (
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
                  </div>
                )}

              </div>
            );
          })
        )}

        <button style={styles.btnBack} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '2rem 1rem' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  title: { margin: 0, fontSize: '1.5rem', color: '#1f2937' },
  subtitle: { margin: 0, color: '#6b7280', fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '2rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' },
  item: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  topicBadge: { background: '#ede9fe', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.875rem' },
  done: { background: '#d1fae5', color: '#065f46', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' },
  started: { background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' },
  disqualified: { background: '#fee2e2', color: '#991b1b', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' },
  disqualifiedBox: { background: '#fff1f2', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#991b1b' },
  scoreBadge: { color: 'white', fontWeight: 'bold', fontSize: '1rem', padding: '0.25rem 0.75rem', borderRadius: '999px' },
  date: { color: '#6b7280', fontSize: '0.8rem' },
  summaryBox: { background: '#f9fafb', border: '1px solid', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem' },
  evalSection: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' },
  evaluationCard: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fafafa' },
  evalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  questionNum: { background: '#ede9fe', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.875rem' },
  scoreChip: { color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.875rem' },
  question: { fontWeight: '600', color: '#1f2937', margin: 0 },
  answerBox: { background: '#f9fafb', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' },
  answer: { margin: '0.25rem 0 0', color: '#4b5563' },
  feedbackBox: { background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#1e40af' },
  strengthsBox: { background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#166534' },
  improvementsBox: { background: '#fffbeb', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#92400e' },
  btnPrimary: { padding: '0.6rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  btnSecondary: { padding: '0.6rem 1rem', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  btnResume: { padding: '0.6rem 1rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  btnBack: { padding: '0.75rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
};