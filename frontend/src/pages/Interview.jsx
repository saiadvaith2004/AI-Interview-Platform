import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TIME_PER_QUESTION = 120;

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const interview = state?.interview;

  const questions = JSON.parse(interview?.questionsJson || '[]');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [totalTimeLeft, setTotalTimeLeft] = useState(TIME_PER_QUESTION * questions.length);
  const timerRef = useRef(null);

  // Anti-cheat state
  const [warnings, setWarnings] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const warningsRef = useRef(0);

  // Fullscreen modal state
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);

  if (!interview) {
    navigate('/dashboard');
    return null;
  }

  // Auto-submit with zero score
  const forceSubmit = useCallback(async () => {
    clearTimeout(timerRef.current);
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
    try {
      const zeroAnswers = JSON.stringify(Array(questions.length).fill('DISQUALIFIED'));
      await api.post(`/interviews/${interview.id}/submit`, {
        answers: zeroAnswers
      });
      alert('⛔ You have been disqualified! Your score has been marked as 0.');
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    }
  }, [interview.id, questions.length, navigate]);

  const showWarningAlert = useCallback((message) => {
    warningsRef.current += 1;
    setWarnings(warningsRef.current);
    setWarningMessage(message);
    setShowWarning(true);

    setTimeout(() => setShowWarning(false), 4000);

    if (warningsRef.current >= 3) {
      setTimeout(() => forceSubmit(), 2000);
    }
  }, [forceSubmit]);

  // Re-enter fullscreen handler (requires user gesture)
  const reenterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
      setShowFullscreenModal(false);
    } catch (err) {
      console.log('Fullscreen failed:', err);
    }
  };

  // Detect fullscreen exit — show modal blocking screen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        showWarningAlert('⚠️ Exiting fullscreen is not allowed during the interview!');
        setShowFullscreenModal(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [showWarningAlert]);

  // Disable copy-paste and detect violations
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      showWarningAlert('⚠️ Copying is not allowed during the interview!');
    };
    const handlePaste = (e) => {
      e.preventDefault();
      showWarningAlert('⚠️ Pasting is not allowed during the interview!');
    };
    const handleCut = (e) => {
      e.preventDefault();
      showWarningAlert('⚠️ Cutting text is not allowed during the interview!');
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      showWarningAlert('⚠️ Right-clicking is not allowed during the interview!');
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showWarningAlert('⚠️ Tab switching detected! Stay on this page during the interview.');
      }
    };
    const handleWindowBlur = () => {
      showWarningAlert('⚠️ Window focus lost! Do not switch windows during the interview.');
    };
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'a', 'u', 's'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'v', 'x', 'a', 'u', 's'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        if (['c', 'v', 'x'].includes(e.key.toLowerCase())) {
          showWarningAlert('⚠️ Keyboard shortcuts are disabled during the interview!');
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [showWarningAlert]);

  // Reset per-question timer
  useEffect(() => {
    setTimeLeft(TIME_PER_QUESTION);
  }, [current]);

  // Per-question countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      if (current < questions.length - 1) setCurrent(c => c + 1);
      else handleSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  // Total countdown
  useEffect(() => {
    if (totalTimeLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setTotalTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [totalTimeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getTimerColor = (secs) => {
    if (secs > 60) return '#10b981';
    if (secs > 30) return '#f59e0b';
    return '#ef4444';
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    clearTimeout(timerRef.current);
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
    setSubmitting(true);
    try {
      await api.post(`/interviews/${interview.id}/submit`, {
        answers: JSON.stringify(answers)
      });
      navigate(`/results/${interview.id}`);
    } catch (err) {
      alert('Failed to submit interview');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Fullscreen Re-entry Modal - blocks entire screen */}
      {showFullscreenModal && (
        <div style={styles.fullscreenOverlay}>
          <div style={styles.fullscreenModal}>
            <h2 style={{ color: '#ef4444', margin: 0 }}>⚠️ Fullscreen Required!</h2>
            <p style={{ color: '#374151' }}>
              You exited fullscreen mode. You must return to fullscreen to continue the interview.
            </p>
            <p style={{ color: '#ef4444', fontWeight: 'bold', margin: 0 }}>
              Warning {warnings}/3 — {warnings >= 3 ? 'Submitting test...' : `${3 - warnings} warning(s) remaining`}
            </p>
            <button style={styles.btnFullscreen} onClick={reenterFullscreen}>
              ⛶ Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>

        {/* Warning Banner */}
        {showWarning && (
          <div style={{
            ...styles.warningBanner,
            background: warnings >= 3 ? '#7f1d1d' : '#fef3c7',
            color: warnings >= 3 ? 'white' : '#92400e',
            border: warnings >= 3 ? '2px solid #ef4444' : '2px solid #f59e0b'
          }}>
            <div style={styles.warningText}>{warningMessage}</div>
            <div style={styles.warningCount}>
              {warnings >= 3
                ? '🚫 DISQUALIFIED! Submitting your test...'
                : `Warning ${warnings}/3 — ${3 - warnings} warning(s) remaining before disqualification`}
            </div>
          </div>
        )}

        {/* Warning dots */}
        <div style={styles.warningDots}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              ...styles.warningDot,
              background: warnings >= i ? '#ef4444' : '#e5e7eb'
            }} title={`Warning ${i}`} />
          ))}
          <span style={styles.warningLabel}>
            {warnings === 0 ? 'No warnings' : `${warnings}/3 warnings`}
          </span>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.topic}>{interview.topic} Interview</span>
          <span style={styles.progress}>{current + 1} / {questions.length}</span>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${((current + 1) / questions.length) * 100}%`
          }} />
        </div>

        {/* Timers */}
        <div style={styles.timersRow}>
          <div style={styles.timerBox}>
            <div style={styles.timerLabel}>This Question</div>
            <div style={{ ...styles.timerValue, color: getTimerColor(timeLeft) }}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
          <div style={styles.timerBox}>
            <div style={styles.timerLabel}>Total Time</div>
            <div style={{ ...styles.timerValue, color: getTimerColor(totalTimeLeft) }}>
              ⏳ {formatTime(totalTimeLeft)}
            </div>
          </div>
        </div>

        {timeLeft <= 30 && (
          <div style={styles.timeWarning}>
            ⚠️ Less than 30 seconds left for this question!
          </div>
        )}

        {/* Question */}
        <h3 style={styles.question}>Q{current + 1}. {questions[current]}</h3>

        {/* Answer */}
        <textarea
          style={styles.textarea}
          placeholder="Type your answer here..."
          value={answers[current]}
          onChange={e => {
            const updated = [...answers];
            updated[current] = e.target.value;
            setAnswers(updated);
          }}
          onPaste={e => e.preventDefault()}
          onCopy={e => e.preventDefault()}
          onCut={e => e.preventDefault()}
          rows={6}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Answer dots */}
        <div style={styles.dots}>
          {questions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                ...styles.dot,
                background: answers[i] ? '#4f46e5' : i === current ? '#a5b4fc' : '#e5e7eb',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button style={styles.btnSecondary} onClick={handlePrev} disabled={current === 0}>
            ← Previous
          </button>
          {current < questions.length - 1 ? (
            <button style={styles.btnPrimary} onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button style={styles.btnSuccess} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : '✓ Submit'}
            </button>
          )}
        </div>

        {/* Rules reminder */}
        <div style={styles.rules}>
          🚫 Copy/paste disabled &nbsp;|&nbsp; 🚫 Tab switching monitored &nbsp;|&nbsp; ⛶ Fullscreen enforced &nbsp;|&nbsp; ⚠️ 3 violations = disqualification
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '1rem' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  fullscreenOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  fullscreenModal: { background: 'white', padding: '2.5rem', borderRadius: '12px', textAlign: 'center', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  btnFullscreen: { padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' },
  warningBanner: { padding: '1rem', borderRadius: '8px', textAlign: 'center' },
  warningText: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' },
  warningCount: { fontSize: '0.875rem' },
  warningDots: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  warningDot: { width: '14px', height: '14px', borderRadius: '50%', transition: 'background 0.3s' },
  warningLabel: { fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.25rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  topic: { background: '#ede9fe', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.875rem' },
  progress: { color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' },
  progressBar: { background: '#e5e7eb', borderRadius: '999px', height: '6px' },
  progressFill: { background: '#4f46e5', height: '6px', borderRadius: '999px', transition: 'width 0.3s' },
  timersRow: { display: 'flex', gap: '1rem' },
  timerBox: { flex: 1, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' },
  timerLabel: { fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' },
  timerValue: { fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' },
  timeWarning: { background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.875rem' },
  question: { fontSize: '1.1rem', color: '#1f2937', lineHeight: '1.6' },
  textarea: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit' },
  dots: { display: 'flex', gap: '0.5rem', justifyContent: 'center' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', transition: 'background 0.2s' },
  buttons: { display: 'flex', gap: '1rem' },
  btnPrimary: { flex: 1, padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  btnSecondary: { flex: 1, padding: '0.75rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  btnSuccess: { flex: 1, padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  rules: { textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', padding: '0.5rem', background: '#f9fafb', borderRadius: '8px' }
};