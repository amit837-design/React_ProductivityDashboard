"use client";
import React, { useState, useEffect } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    setTasks([...tasks, { title, desc, opacity: 1 }]);
    setTitle("");
    setDesc("");
  };

  const toggleDone = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, opacity: task.opacity === 1 ? 0.2 : 1 } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 min-h-screen text-white py-6">
      <h1 className="text-center font-bold my-3 text-3xl">To-Do List</h1>

      {/* Input Form */}
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          placeholder="Enter task title"
          className="bg-white font-bold text-black rounded py-2 px-4 w-[50%]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter task description"
          className="bg-white font-bold text-black rounded py-2 px-4 w-[50%]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="cursor-pointer group relative px-6 py-2 text-base font-semibold text-white border-2 hover:border-white rounded-full bg-black overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-black hover:scale-105 active:scale-100 shadow-sm hover:shadow-lg">
          <span className="absolute inset-0 m-auto w-12 h-12 rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-150 -z-10"></span>
          Submit
        </button>
      </form>

      <hr className="my-5 w-[70%] mx-auto border-gray-700" />

      {/* Task Output */}
      <div className="w-[80%] flex flex-col gap-4 mx-auto">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="border border-white w-full rounded-lg relative p-3 transition-opacity duration-300"
            style={{ opacity: task.opacity }}
          >
            <h1 className="text-2xl font-bold text-white">{task.title}</h1>
            <p className="text-lg text-white-700 pl-2 font-semibold">
              {task.desc}
            </p>
            <div className="absolute right-2 top-2 flex flex-col gap-2">
              <button
                className="cursor-pointer group relative px-4 py-1 text-sm font-semibold text-white border-2 hover:border-white rounded-full bg-black overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-black hover:scale-105 active:scale-100 shadow-sm hover:shadow-lg"
                onClick={() => toggleDone(index)}
              >
                <span className="absolute inset-0 m-auto w-12 h-12 rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-150 -z-10"></span>
                {task.opacity === 1 ? "Done" : "Undo"}
              </button>

              <button
                className="cursor-pointer group relative px-4 py-1 text-sm font-semibold text-white border-2 hover:border-white rounded-full bg-black overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-black hover:scale-105 active:scale-100 shadow-sm hover:shadow-lg"
                onClick={() => deleteTask(index)}
              >
                <span className="absolute inset-0 m-auto w-12 h-12 rounded-full scale-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-150 -z-10"></span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
