import React, { useState } from "react";

const TimeTracker = () => {
  const [tasks, setTasks] = useState({});
  const [completed, setCompleted] = useState({});
  const [hourInput, setHourInput] = useState("9");
  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    const hour = parseInt(hourInput);
    if (!taskInput.trim()) return;
    setTasks({ ...tasks, [hour]: taskInput });
    setCompleted({ ...completed, [hour]: false });
    setTaskInput("");
  };

  const toggleCompleted = (hour) => {
    setCompleted((prev) => ({ ...prev, [hour]: !prev[hour] }));
  };

  const isSleepHour = (hour) => hour < 6 || hour >= 22;

  const TimeBlock = ({ hour, task, isCompleted, toggleCompleted }) => {
    const label = `${hour.toString().padStart(2, "0")}:00`;
    const sleepHour = isSleepHour(hour);

    return (
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
          sleepHour ? "opacity-30 italic text-zinc-500" : "text-white"
        } hover:bg-zinc-800 border border-transparent hover:border-zinc-700`}
      >
        <div className="flex items-center gap-2 w-40">
          {!sleepHour && (
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggleCompleted(hour)}
              className="accent-zinc-400 w-4 h-4"
            />
          )}
          <span className="text-sm">{label}</span>
        </div>
        <span
          className={`flex-1 text-right text-sm truncate ${
            isCompleted ? "opacity-40 line-through" : ""
          }`}
        >
          {sleepHour ? (
            <span className="opacity-50">🔒 Unavailable</span>
          ) : task ? (
            task
          ) : (
            <span className="opacity-30">No task</span>
          )}
        </span>
      </div>
    );
  };

  const hoursLeft = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const hoursRight = Array.from({ length: 12 }, (_, i) => i + 12); // 12–23
  const activeHours = Array.from({ length: 16 }, (_, i) => i + 6); // 6–21

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Input Form */}
        <div className="rounded-2xl shadow-md border border-zinc-800 p-6 bg-black/40 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4">Assign a Task</h2>
        </div>

        {/* Two-Column Timeline */}
        <div className="rounded-2xl shadow-md border border-zinc-800 bg-black/40 backdrop-blur-sm p-6">
          <h3 className="text-md font-semibold px-2 pb-2 border-b border-zinc-800 mb-4">
            Daily Task Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              {hoursLeft.map((hour) => (
                <TimeBlock
                  key={hour}
                  hour={hour}
                  task={tasks[hour]}
                  isCompleted={completed[hour]}
                  toggleCompleted={toggleCompleted}
                />
              ))}
            </div>
            <div className="space-y-2">
              {hoursRight.map((hour) => (
                <TimeBlock
                  key={hour}
                  hour={hour}
                  task={tasks[hour]}
                  isCompleted={completed[hour]}
                  toggleCompleted={toggleCompleted}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
