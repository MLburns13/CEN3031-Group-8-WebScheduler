import React, { useState, useEffect } from 'react';
import focusTimerCountdown from '../hooks/focusTimerCountdown';
import '../css/focusTimer.css';
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

  // render based on state
  let content;
  if (state === 'idle') {
    content = (
      <form className="timerSettings" onSubmit={handleStart}>
        <div className="setTimerContainer">
          <div>Focus for</div>
          <input
            type="number"
            className="focusTimerInput"
            value={focusTime}
            onChange={e => setFocus(Number(e.target.value))}
          />
          <div>minutes</div>
        </div>
        <div className="setTimerContainer">
          <div>Break for</div>
          <input
            type="number"
            className="focusTimerInput"
            value={breakTime}
            onChange={e => setBreakTime(Number(e.target.value))}
          />
          <div>minutes</div>
        </div>
        <div className="setTimerContainer">
          <div>Long break for</div>
          <input
            type="number"
            className="focusTimerInput"
            value={longBreakTime}
            onChange={e => setLongBreakTime(Number(e.target.value))}
          />
          <div>minutes</div>
        </div>
        <div className="setTimerContainer">
          <div>Long break every</div>
          <input
            type="number"
            className="focusTimerInput"
            value={intervals}
            onChange={e => setIntervals(Number(e.target.value))}
          />
          <div>regular breaks</div>
        </div>
        <button type="submit" className="startButton">
          Start
        </button>
      </form>
    );
  } 
  else if (['focus', 'break', 'longBreak'].includes(state)) {
    const mainHeading = state === 'focus'
      ? 'Focus'
      : state === 'break'
      ? 'Take a Break'
      : 'Long Break';
    const subText = state === 'focus'
      ? `${formatTime(timeLeft)} until break`
      : `${formatTime(timeLeft)} until focus`;

    content = (
      <div className="timerCountdownContainer">
        <h1>{mainHeading}</h1>
        <p className="finishMessage">{subText}</p>
        <div className="buttonContainer">
          {isRunning
            ? <button onClick={pauseTimer}>Pause</button>
            : <button onClick={resumeTimer}>Resume</button>}
          <button onClick={handleStop}>Stop</button>
        </div>
      </div>
    );
  } 
  else {
    content = (
      <div className="timerCountdownContainer">
        <h1>{user.customMessages.focusCompletion || 'Good Job!'}</h1>
        <p className="finishMessage">
          You focused for {Math.floor(totalFocusTime / 60)} minutes
        </p>
        <button onClick={resetTimer}>New Session</button>
      </div>
    );
  }

  return (
    <div className="focusTimerContainer">
      <button onClick={handleBack} className="backButton">
        ← Back to Home
      </button>

      <header>
        <h1 className="focusHeading">Focus Timer</h1>
        <hr />
      </header>

      {content}
    </div>
  );
}

export default FocusTimerPage;
