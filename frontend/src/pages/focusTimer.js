import React, { useState, useEffect } from 'react';
import focusTimerCountdown from '../hooks/focusTimerCountdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FocusTimerPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const [focusTime, setFocus]             = useState(25);
  const [breakTime, setBreakTime]         = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [intervals, setIntervals]         = useState(4);

  const {
    state,
    timeLeft,
    isRunning,
    totalFocusTime,
    totalBreakTime,
    totalLongBreakTime,
    startTimer,
    resumeTimer,
    pauseTimer,
    stopTimer,
    resetTimer
  } = focusTimerCountdown();

  // start a new session
  function handleStart(e) {
    e.preventDefault();
    startTimer({
      focusMinutes:     focusTime,
      breakMinutes:     breakTime,
      longBreakMinutes: longBreakTime,
      intervalFrequency: intervals
    });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // send session info to backend
  async function saveSessionTotals() {
    try {
      await axios.post(
        'http://localhost:5000/api/focus-session',
        {
          focusTime:     totalFocusTime,
          breakTime:     totalBreakTime,
          longBreakTime: totalLongBreakTime
        },
        { withCredentials: true }
      );
      console.log('Session totals saved');
    } catch (err) {
      console.error('Error saving session:', err);
    }
  }

  // save data when stop button is pressed
  async function handleStop() {
    stopTimer();
    await saveSessionTotals();
  }

  // save data when home button is pressed
  async function handleBack() {
    if (state !== 'idle' && state !== 'completed') {
      await saveSessionTotals();
    }
    navigate('/');
  }

  // if user exits while in a session, it saves
  useEffect(() => {
    function handleBeforeUnload(event) {
      if (state !== 'idle' && state !== 'completed') {
        navigator.sendBeacon(
          'http://localhost:5000/api/focus-session',
          new Blob([JSON.stringify({
            focusTime: totalFocusTime,
            breakTime: totalBreakTime,
            longBreakTime: totalLongBreakTime
          })], { type: 'application/json' })
        );
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state, totalFocusTime, totalBreakTime, totalLongBreakTime]);

  const styles = {
    container: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#f8fafc',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: '0',
      zIndex: '100'
    },
    headerContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0',
      color: '#f8fafc'
    },
    headerSubtitle: {
      fontSize: '16px',
      color: '#a5a5b8',
      margin: '0',
      fontWeight: '400'
    },
    backButton: {
      background: 'rgba(165, 165, 184, 0.2)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      color: '#f8fafc',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    content: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '32px',
      minHeight: 'calc(100vh - 100px)'
    },
    timerCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '48px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      maxWidth: '600px',
      width: '100%'
    },
    settingsForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      alignItems: 'flex-start',
      width: '100%'
    },
    settingRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      width: '100%'
    },
    settingLabel: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#f8fafc',
      minWidth: '150px',
      textAlign: 'left'
    },
    input: {
      background: '#2a2a3e',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '18px',
      color: '#f8fafc',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      outline: 'none',
      width: '80px',
      textAlign: 'center',
      fontWeight: '600'
    },
    startButton: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      border: 'none',
      borderRadius: '16px',
      padding: '20px 48px',
      color: '#ffffff',
      fontSize: '20px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      marginTop: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      alignSelf: 'center'
    },
    timerDisplay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    },
    timerHeading: {
      fontSize: '48px',
      fontWeight: '800',
      margin: '0',
      color: '#f8fafc',
      textAlign: 'center'
    },
    timerSubtext: {
      fontSize: '24px',
      color: '#a5a5b8',
      margin: '0',
      fontWeight: '500'
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    actionButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px 32px',
      color: '#f8fafc',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    stopButton: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '12px',
      padding: '16px 32px',
      color: '#fca5a5',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    completionMessage: {
      fontSize: '42px',
      fontWeight: '800',
      margin: '0',
      color: '#10b981',
      textAlign: 'center'
    },
    completionSubtext: {
      fontSize: '20px',
      color: '#a5a5b8',
      margin: '16px 0 32px 0',
      fontWeight: '500'
    },
    newSessionButton: {
      background: 'linear-gradient(135deg, #10b981, #6ee7b7)',
      border: 'none',
      borderRadius: '16px',
      padding: '20px 48px',
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }
  }

  // render based on state
  let content;
  if (state === 'idle') {
    content = (
      <form style={styles.settingsForm} onSubmit={handleStart}>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Focus for</span>
          <input
            type="number"
            style={styles.input}
            value={focusTime}
            onChange={e => setFocus(Number(e.target.value))}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1'
              e.target.style.backgroundColor = '#323244'
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.target.style.backgroundColor = '#2a2a3e'
              e.target.style.boxShadow = 'none'
            }}
          />
          <span style={styles.settingLabel}>minutes</span>
        </div>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Break for</span>
          <input
            type="number"
            style={styles.input}
            value={breakTime}
            onChange={e => setBreakTime(Number(e.target.value))}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1'
              e.target.style.backgroundColor = '#323244'
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.target.style.backgroundColor = '#2a2a3e'
              e.target.style.boxShadow = 'none'
            }}
          />
          <span style={styles.settingLabel}>minutes</span>
        </div>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Long break for</span>
          <input
            type="number"
            style={styles.input}
            value={longBreakTime}
            onChange={e => setLongBreakTime(Number(e.target.value))}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1'
              e.target.style.backgroundColor = '#323244'
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.target.style.backgroundColor = '#2a2a3e'
              e.target.style.boxShadow = 'none'
            }}
          />
          <span style={styles.settingLabel}>minutes</span>
        </div>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Long break every</span>
          <input
            type="number"
            style={styles.input}
            value={intervals}
            onChange={e => setIntervals(Number(e.target.value))}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1'
              e.target.style.backgroundColor = '#323244'
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.target.style.backgroundColor = '#2a2a3e'
              e.target.style.boxShadow = 'none'
            }}
          />
          <span style={styles.settingLabel}>regular breaks</span>
        </div>
        <button 
          type="submit" 
          style={styles.startButton}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)'
            e.target.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'none'
            e.target.style.boxShadow = 'none'
          }}
        >
          Start Focus Session
        </button>
      </form>
    );
  } 
  else if (['focus', 'break', 'longBreak'].includes(state)) {
    const mainHeading = state === 'focus'
      ? 'Focus Time 🎯'
      : state === 'break'
      ? 'Take a Break ☕'
      : 'Long Break 🌟';
    const subText = state === 'focus'
      ? `${formatTime(timeLeft)} until break`
      : `${formatTime(timeLeft)} until focus`;

    content = (
      <div style={styles.timerDisplay}>
        <h1 style={styles.timerHeading}>{mainHeading}</h1>
        <p style={styles.timerSubtext}>{subText}</p>
        <div style={styles.buttonContainer}>
          {isRunning
            ? <button 
                style={styles.actionButton}
                onClick={pauseTimer}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                Pause
              </button>
            : <button 
                style={styles.actionButton}
                onClick={resumeTimer}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                Resume
              </button>}
          <button 
            style={styles.stopButton}
            onClick={handleStop}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)'
            }}
          >
            Stop
          </button>
        </div>
      </div>
    );
  } 
  else {
    content = (
      <div style={styles.timerDisplay}>
        <h1 style={styles.completionMessage}>{user?.customMessages?.focusCompletion || 'Excellent Work! 🎉'}</h1>
        <p style={styles.completionSubtext}>
          You focused for {Math.floor(totalFocusTime / 60)} minutes
        </p>
        <button 
          style={styles.newSessionButton}
          onClick={resetTimer}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)'
            e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'none'
            e.target.style.boxShadow = 'none'
          }}
        >
          Start New Session
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Focus Timer ⏰</h1>
          <p style={styles.headerSubtitle}>Boost your productivity with focused work sessions</p>
        </div>
        <button 
          style={styles.backButton}
          onClick={handleBack}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(165, 165, 184, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(165, 165, 184, 0.2)'
          }}
        >
          ← Back to Home
        </button>
      </header>

      <div style={styles.content}>
        <div style={styles.timerCard}>
          {content}
        </div>
      </div>
    </div>
  );
}

export default FocusTimerPage;
