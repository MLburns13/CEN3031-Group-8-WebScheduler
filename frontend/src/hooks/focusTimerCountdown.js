import { useState, useEffect, useRef } from 'react';

export default function useFocusTimer() {
  const [state, setState]                     = useState('idle');
  const [timeLeft, setTimeLeft]               = useState(0);
  const [isRunning, setIsRunning]             = useState(false);
  const [intervalCount, setIntervalCount]     = useState(0);
  const [totalFocusTime, setTotalFocusTime]   = useState(0);
  const [totalBreakTime, setTotalBreakTime]   = useState(0);
  const [totalLongBreakTime, setTotalLongBreakTime] = useState(0);

  const timerRef  = useRef(null);
  const configRef = useRef({
    focusMinutes: 0,
    breakMinutes: 0,
    longBreakMinutes: 0,
    intervalFrequency: 0
  });

  function startTimer(config) {
    configRef.current = config;
    setState('focus');
    setTimeLeft(config.focusMinutes * 60);
    setIntervalCount(0);
    setTotalFocusTime(0);
    setTotalBreakTime(0);
    setTotalLongBreakTime(0);
    setIsRunning(true);
  }

  function resumeTimer() {
    if (['focus', 'break', 'longBreak'].includes(state)) {
      setIsRunning(true);
    }
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function stopTimer() {
    setIsRunning(false);
    setState('completed');
  }

  function resetTimer() {
    clearInterval(timerRef.current);
    setState('idle');
    setTimeLeft(0);
    setIsRunning(false);
    setIntervalCount(0);
    setTotalFocusTime(0);
    setTotalBreakTime(0);
    setTotalLongBreakTime(0);
    configRef.current = {
      focusMinutes: 0,
      breakMinutes: 0,
      longBreakMinutes: 0,
      intervalFrequency: 0
    };
  }

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      if (state === 'focus') {
        setTotalFocusTime(t => t + 1);
      } 
      else if (state === 'break') {
        setTotalBreakTime(t => t + 1);
      } 
      else if (state === 'longBreak') {
        setTotalLongBreakTime(t => t + 1);
      }

      setTimeLeft(prev => {
        if (prev <= 1) {
          const {
            focusMinutes,
            breakMinutes,
            longBreakMinutes,
            intervalFrequency
          } = configRef.current;

          if (state === 'focus') {
            const nextCount = intervalCount + 1;
            setIntervalCount(nextCount);

            if (nextCount % intervalFrequency === 0) {
              setState('longBreak');
              return longBreakMinutes * 60;
            } 
            else {
              setState('break');
              return breakMinutes * 60;
            }
          } 
          else {
            setState('focus');
            return focusMinutes * 60;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, state, intervalCount]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return {
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
  };
}
