import { useState, useEffect } from 'react';

export default function useTimer(initialMinutes = 15) {
  const [duration, setDuration] = useState(initialMinutes);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  // if you change the timer duration, it resets to that amount
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  // countdown loop
  useEffect(() => {
    if (!isActive) return;
    const intervalID = setInterval(() => {
      setTimeLeft(sec => {
        if (sec <= 1) {
          // put sound effect here
          return duration * 60;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(intervalID);
  }, [isActive, duration]);

  // for starting/stopping
  const toggle = () => {
    if (isActive) {
      setIsActive(false);
      setTimeLeft(duration * 60);
    } else {
      setIsActive(true);
    }
  };

  // format the time
  const formattedTime = secs => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, '0');
    const seconds = String(secs % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return { duration, setDuration, timeLeft, isActive, toggle, formattedTime };
}
