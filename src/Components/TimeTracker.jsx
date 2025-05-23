import React, { useContext, useState } from "react";
import { dataContext } from "../Wrapper";

const TimeTracker = () => {
  const { tasksTr, setTasksTr, completed, setCompleted } =
    useContext(dataContext);
  const [taskInput, setTaskInput] = useState("");
  const [hourInput, setHourInput] = useState("9");

  const addTask = () => {
    const hour = parseInt(hourInput);
    if (!taskInput.trim()) return;
    setTasksTr({ ...tasksTr, [hour]: taskInput });
    setCompleted({ ...completed, [hour]: false });
    setTaskInput("");
  };

  const toggleCompleted = (hour) => {
    const isNowCompleted = !completed[hour];

    if (isNowCompleted) {
      // Mark completed immediately to update UI
      setCompleted((prev) => ({ ...prev, [hour]: true }));

      // Then remove after 1 second delay
      setTimeout(() => {
        setTasksTr((prevTasksTr) => {
          const newTasksTr = { ...prevTasksTr };
          delete newTasksTr[hour];
          return newTasksTr;
        });

        setCompleted((prev) => {
          const newCompleted = { ...prev };
          delete newCompleted[hour];
          return newCompleted;
        });
      }, 1000);
    } else {
      // Uncheck — just mark incomplete immediately
      setCompleted((prev) => ({ ...prev, [hour]: false }));
    }
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full"
          >
            <select
              className="w-full sm:w-24 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm focus:ring-2 focus:ring-zinc-600"
              value={hourInput}
              onChange={(e) => setHourInput(e.target.value)}
            >
              {activeHours.map((i) => (
                <option key={i} value={i}>
                  {`${i.toString().padStart(2, "0")}:00`}
                </option>
              ))}
            </select>

            <input
              className="w-full flex-1 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm focus:ring-2 focus:ring-zinc-600"
              placeholder="Enter task description..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />

            <button
              type="submit"
              className="w-full sm:w-auto cursor-pointer group relative px-6 py-2 text-base font-semibold text-white border-2 border-white rounded-full bg-transparent overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-black hover:scale-105 active:scale-100 shadow-sm hover:shadow-lg"
            >
              <span className="absolute inset-0 m-auto w-12 h-12 rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-150 -z-10"></span>
              Add
            </button>
          </form>
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
                  task={tasksTr[hour]}
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
                  task={tasksTr[hour]}
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
