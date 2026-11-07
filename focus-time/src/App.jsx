
import { useState, useEffect, useRef } from "react";
import "./App.css";

function FocusTimer() {
  // Initial time: 25 minutes
  const INITIAL_TIME = 25 * 60;

  // Timer state
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  // Running status
  const [isRunning, setIsRunning] = useState(false);

  // Completed sessions saved in localStorage
  const [sessions, setSessions] = useState(() => {
    return Number(localStorage.getItem("sessions")) || 0;
  });

  // Store interval ID
  const intervalRef = useRef(null);

  // Format time into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Stop timer
  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start timer
  const startTimer = () => {
    if (isRunning || timeLeft === 0) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((previousTime) =>
        Math.max(0, previousTime - 1)
      );
    }, 1000);
  };

  // Detect when timer reaches zero
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      stopTimer();
      setIsRunning(false);
      setSessions((previous) => previous + 1);
    }
  }, [timeLeft, isRunning]);

  // Pause timer
  const pauseTimer = () => {
    stopTimer();
    setIsRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    stopTimer();
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
  };

  // Save sessions in localStorage
  useEffect(() => {
    localStorage.setItem("sessions", String(sessions));
  }, [sessions]);

  // Update browser tab title
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - Focus Timer`;

    return () => {
      document.title = "Focus Timer";
    };
  }, [timeLeft]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Check whether timer has finished
  const isFinished = timeLeft === 0;

  return (
    <div className="app">
      <div className="timer-card">

        <h1>Focus Timer</h1>

        <p className="subtitle">
          Stay focused. Achieve more.
        </p>

        {/* Timer display */}
        <div className="timer-circle">
          <div className="timer-content">
            <h2>{formatTime(timeLeft)}</h2>

            <p>
              {isFinished
                ? "Session completed"
                : isRunning
                ? "Focus time..."
                : "Ready to focus?"}
            </p>
          </div>
        </div>

        {/* Timer buttons */}
        <div className="buttons">

          <button
            className="start-btn"
            onClick={startTimer}
            disabled={isRunning || isFinished}
          >
            Start
          </button>

          <button
            className="pause-btn"
            onClick={pauseTimer}
            disabled={!isRunning}
          >
            Pause
          </button>

          <button
            className="reset-btn"
            onClick={resetTimer}
          >
            Reset
          </button>

        </div>

        {/* Break message */}
        {isFinished && (
          <div className="break-message">
            🎉 Time for a break!
          </div>
        )}

        {/* Completed sessions */}
        <div className="sessions">
          <span>🏆</span>

          <div>
            <h3>{sessions}</h3>
            <p>Sessions completed</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FocusTimer;
