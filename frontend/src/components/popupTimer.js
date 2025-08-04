import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import countDownTimer from '../hooks/timerCountdown';

export default function PopupTimer({
  name = 'Timer',
  initialMinutes = 15,
  popUpMessage,
}) {
  const {
    duration,
    setDuration,
    timeLeft,
    isActive,
    toggle,
    formattedTime,
  } = countDownTimer(initialMinutes);

  const [popupCount, setPopupCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [bannerAnimation, setBannerAnimation] = useState('');
  const prevTimeRef = useRef(timeLeft);
  const bannerText = popUpMessage || `${name} timer has finished.`;
  const SOUND_URL = '/sounds/popup.mp3';
  const audioRef = useRef(null);

  // Dark theme styles
  const styles = {
    timerBanner: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      padding: '16px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '600',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
      transform: bannerAnimation === 'slideDown' ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s ease'
    },
    popupTimer: {
      backgroundColor: 'rgba(42, 42, 62, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    },
    timerTitle: {
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
      marginTop: '0'
    },
    timerButton: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '12px',
      backgroundColor: 'transparent',
      color: '#a5a5b8'
    },
    timerButtonActive: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 0.5)',
      color: '#ef4444'
    },
    timerDisplay: {
      display: 'block',
      color: '#6366f1',
      fontSize: '18px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '12px',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace"
    },
    settingsButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'transparent',
      border: 'none',
      color: '#a5a5b8',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '6px',
      transition: 'all 0.2s ease'
    },
    settingsPanel: {
      backgroundColor: 'rgba(30, 30, 46, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '12px',
      backdropFilter: 'blur(10px)'
    },
    settingsLabel: {
      color: '#ffffff',
      fontSize: '14px',
      marginBottom: '8px',
      display: 'block'
    },
    settingsSlider: {
      width: '100%',
      height: '6px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '3px',
      outline: 'none',
      appearance: 'none',
      cursor: 'pointer'
    }
  }

  useEffect(() => {
    audioRef.current = new Audio(SOUND_URL);
    audioRef.current.preload = 'auto';
  }, []);

  useEffect(() => {
    if (isActive && timeLeft === duration * 60 && prevTimeRef.current <= 1) {
      setPopupCount(c => c + 1);
      setIsBannerActive(true);
      setBannerAnimation('slideDown');
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, duration, isActive]);
  useEffect(() => {
    if (!isBannerActive) return;

    const timerId = setTimeout(() => {
      setBannerAnimation('slideUp');

      const removeId = setTimeout(() => {
        setIsBannerActive(false);
        setBannerAnimation('');
      }, 300);

      return () => clearTimeout(removeId);
    }, 10000);

    return () => clearTimeout(timerId);
  }, [isBannerActive]);

  // send session info to backend
  async function savePopupSession() {
    if (popupCount === 0) return;

    try {
      await axios.post(
        'http://localhost:5000/api/timers/popup',
        {
          popupName: name.toLowerCase(),
          popupCount
        },
        { withCredentials: true }
      );
      console.log(`[${name}] session saved: ${popupCount} popups`);
    } catch (err) {
      console.error(`Error saving ${name} session:`, err);
    }
  }

  // save data when stop button is pressed
  function handleStop() {
    savePopupSession();
    toggle();
    setPopupCount(0);
  }

  // if user exits while in a session, it saves
  useEffect(() => {
    function handleUnload() {
      if (isActive && popupCount > 0) {
        const payload = {
          popupName: name.toLowerCase(),
          popupCount
        };

        navigator.sendBeacon(
          'http://localhost:5000/api/timers/popup',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
      }
    }

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [isActive, popupCount, name]);

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      {isBannerActive && (
        <div style={styles.timerBanner}>
          {bannerText}
        </div>
      )}

      <div style={styles.popupTimer}>
        <h3 style={styles.timerTitle}>{name} Reminder</h3>

        <button
          onClick={handleStop}
          style={isActive ? { ...styles.timerButton, ...styles.timerButtonActive } : styles.timerButton}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'
              e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'
              e.target.style.color = '#6366f1'
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.target.style.color = '#a5a5b8'
            }
          }}
        >
          {isActive ? `Stop ${name}` : `Start ${name}`}
        </button>

        <span style={styles.timerDisplay}>{formattedTime(timeLeft)}</span>

        <button
          style={styles.settingsButton}
          onClick={() => setShowSettings((v) => !v)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            e.target.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.color = '#a5a5b8'
          }}
        >
          ⋮
        </button>

        {showSettings && (
          <div style={styles.settingsPanel}>
            <label style={styles.settingsLabel}>Every {duration} minutes</label>
            <br />
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
              style={styles.settingsSlider}
            />
          </div>
        )}
      </div>
    </>
  );
}
