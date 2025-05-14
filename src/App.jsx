"use client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useContext, useState, useEffect, useMemo } from "react";
import Todo from "./Components/Todo.jsx";
import CalendarStrip from "./Components/CalendarStrip.jsx";
import Pomodoro from "./Components/Pomodoro.jsx";
import TimeTracker from "./Components/TimeTracker.jsx";
import { dataContext } from "./Wrapper.jsx";

// Presentational component for showing combined tasks list
const CombinedTasksList = ({ combinedTasks }) => (
  <ul>
    {combinedTasks.map((t, i) => (
      <li key={i} className="block pl-2 font-bold">
        {t.source === "ToDo"
          ? `TODO - ${t.title}`
          : `${t.time}:00 - ${t.title}`}
      </li>
    ))}
  </ul>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const { tasks, tasksTr } = useContext(dataContext);

  // Memoize combined tasks so it only recalculates when tasks/tasksTr change
  const combinedTasks = useMemo(() => {
    const timeTrackerTasks = Object.entries(tasksTr || {}).map(
      ([key, value]) => ({
        title: value,
        time: key,
        source: "TimeTracker",
      })
    );

    const todoTasks = Array.isArray(tasks)
      ? tasks.map((t) => ({
          ...t,
          source: "ToDo",
        }))
      : [];

    return [...todoTasks, ...timeTrackerTasks];
  }, [tasks, tasksTr]);

  // Manage loading state based on combinedTasks length
  useEffect(() => {
    if (combinedTasks.length === 0) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [combinedTasks]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="w-full text-black flex items-center justify-center min-h-screen">
              <div className="w-full h-full overflow-hidden flex flex-col md:flex-row">
                {/* Top Section - Left on desktop */}
                <div className="topLeft bg-white px-4 pt-6 pb-4 md:w-1/2 h-1/2 md:min-h-screen">
                  <h1 className="text-6xl font-bold">Hi There</h1>
                  <h2 className="font-bold">Productivity at the Peak</h2>
                  <div className="mt-10">
                    <CalendarStrip />
                  </div>
                  {/* The main buttons to enter different sections */}
                  <div className="bg-black bg-opacity-60 backdrop-blur-md rounded shadow-lg max-w-sm mx-auto overflow-hidden mt-10 md:mt-30">
                    <div className="flex justify-center items-center py-auto">
                      <Link
                        to="/Todo"
                        className="text-center h-full group relative w-full py-2 text-white font-semibold transition cursor-pointer overflow-hidden hover:text-black hover:shadow-[0_0px_20px_rgba(0,0,0,0.4)] active:scale-100"
                      >
                        <span className="absolute inset-0 m-auto w-[50px] h-[50px] rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[3] -z-10"></span>
                        To Do
                      </Link>

                      <Link
                        to="/TimeTracker"
                        className="text-center h-full group relative w-full py-2 text-white font-semibold transition cursor-pointer overflow-hidden hover:text-black hover:shadow-[0_0px_20px_rgba(0,0,0,0.4)] active:scale-100"
                      >
                        <span className="absolute inset-0 m-auto w-[50px] h-[50px] rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[3] -z-10"></span>
                        Time Manager
                      </Link>

                      <Link
                        to="/Pomodoro"
                        className="text-center h-full group relative w-full py-2 text-white font-semibold transition cursor-pointer overflow-hidden hover:text-black hover:shadow-[0_0px_20px_rgba(0,0,0,0.4)] active:scale-100"
                      >
                        <span className="absolute inset-0 m-auto w-[50px] h-[50px] rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[3] -z-10"></span>
                        Pomodoro Clock
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Right on desktop */}
                <div className="bg-black text-white h-72 px-4 pt-6 pb-8 md:w-1/2 md:rounded-l-3xl md:rounded-r-none rounded-t-3xl rounded-b-none md:min-h-screen min-h-1/2 overflow-hidden">
                  <h3 className="text-lg font-semibold mb-4">Today</h3>
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-14 bg-[#111] rounded w-3/4"></div>
                      <div className="h-6 bg-[#111] rounded w-1/2"></div>
                      <div className="h-14 bg-[#111] rounded w-full"></div>
                      <div className="h-8 bg-[#111] rounded w-3/4"></div>
                      <div className="h-14 bg-[#111] rounded w-full"></div>
                    </div>
                  ) : (
                    <CombinedTasksList combinedTasks={combinedTasks} />
                  )}
                </div>
              </div>
            </div>
          }
        />
        <Route path="/todo" element={<Todo />} />
        <Route path="/TimeTracker" element={<TimeTracker />} />
        <Route path="/Pomodoro" element={<Pomodoro />} />
      </Routes>
    </Router>
  );
};

export default App;
