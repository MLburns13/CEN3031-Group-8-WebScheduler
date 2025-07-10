import React, { useState, useEffect, useRef } from 'react';
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

  const [showSettings, setShowSettings] = useState(false);
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [bannerAnimation, setBannerAnimation] = useState('');

  const prevTimeRef = useRef(timeLeft);
  const bannerText = popUpMessage || `${name} timer has finished.`;

  // show popup banner
  useEffect(() => {
    if (
      isActive &&
      timeLeft === duration * 60 &&
      prevTimeRef.current <= 1
    ) {
      // add sound here
      setIsBannerActive(true);
      setBannerAnimation('slideDown');
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, duration, isActive]);

  // hide popup banner after 10 seconds
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

  return (
    <>
      {isBannerActive && (
        <div className={`timerBanner ${bannerAnimation}`}>
          {bannerText}
        </div>
      )}

      <div className="popupTimer">
        <h3>{name} Reminder</h3>

        <button
          onClick={toggle}
          className={isActive ? 'timerBtn active' : 'timerBtn'}
        >
          {isActive ? `Stop ${name}` : `Start ${name}`}
        </button>

        <span className="timerDisplay">{formattedTime(timeLeft)}</span>

        <button
          className="settingsBtn"
          onClick={() => setShowSettings((v) => !v)}
        >
          ⋮
        </button>

        {showSettings && (
          <div className="settingsPanel">
            <label>Every {duration} minutes</label>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );
}