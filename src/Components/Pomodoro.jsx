"use client";
import React, { useState, useEffect, useRef } from "react";
import { Pause, Play, RotateCw } from "lucide-react";

const Pomodoro = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showMessage, setShowMessage] = useState("");
  const intervalRef = useRef(null);

  const totalDuration = isBreak ? 5 * 60 : 25 * 60;
  const progress = timeLeft / totalDuration;

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("pomodoroState"));
    if (savedState) {
      setIsRunning(savedState.isRunning);
      setIsBreak(savedState.isBreak);
      setTimeLeft(savedState.timeLeft);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({ isRunning, isBreak, timeLeft })
    );
  }, [isRunning, isBreak, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            const nextMsg = isBreak
              ? "Break over! Time to focus for 25 minutes."
              : "Work session complete! Take a 5-minute break.";
            setShowMessage(nextMsg);
            setIsBreak(!isBreak);
            setTimeLeft(!isBreak ? 5 * 60 : 25 * 60);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  const toggleRunning = () => {
    setShowMessage("");
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setShowMessage("");
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 text-white min-h-screen flex items-center justify-center px-4">
      <div className="relative h-80 w-80 sm:h-96 sm:w-96 flex items-center justify-center">
        {/* Progress Circle */}
        <svg
          className="absolute z-0"
          width="100%"
          height="100%"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="#444"
            fill="transparent"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="#fff"
            fill="transparent"
            strokeWidth="6"
            strokeDasharray="345"
            strokeDashoffset={345 - 345 * progress}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s linear",
            }}
          />
        </svg>

        {/* Timer Box */}
        <div className="relative z-10 rounded-full h-full w-full backdrop-blur-lg border-4 border-white/20 shadow-xl bg-white/5 flex items-center justify-center flex-col">
          <div className="text-4xl sm:text-5xl font-semibold">
            {formatTime(timeLeft)}
          </div>

          {/* Notification Message */}
          {showMessage && (
            <div
              className={`absolute top-[-90px] w-[90%] max-w-xs px-4 py-2 rounded-xl 
                          text-sm font-medium text-center shadow-lg backdrop-blur-md transition-all duration-500 
                          bg-white/10 text-gray-300`}
            >
              <span className="mr-2">{isBreak ? "☕" : "⏰"}</span>
              {showMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="absolute bottom-6 flex gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={toggleRunning}
              className="bg-white text-black p-3 rounded-full hover:scale-110 hover:bg-gray-200 shadow-lg transition-transform"
              title={isRunning ? "Pause" : "Start"}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetTimer}
              className="bg-white text-black p-3 rounded-full hover:scale-110 hover:bg-gray-200 shadow-lg transition-transform"
              title="Reset Timer"
            >
              <RotateCw size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
