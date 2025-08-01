import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import countDownTimer from '../hooks/timerCountdown';
import '../css/popupTimer.css';

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
        <div className={`timerBanner ${bannerAnimation}`}>
          {bannerText}
        </div>
      )}

      <div className="popupTimer">
        <h3>{name} Reminder</h3>

        <button
          onClick={handleStop}
          className={isActive ? 'timerButton active' : 'timerButton'}
        >
          {isActive ? `Stop ${name}` : `Start ${name}`}
        </button>

        <span className="timerDisplay">{formattedTime(timeLeft)}</span>

        <button
          className="settingsButton"
          onClick={() => setShowSettings((v) => !v)}
        >
          ⋮
        </button>

        {showSettings && (
          <div className="settingsPanel">
            <label>Every {duration} minutes</label>
            <br></br>
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );
}
