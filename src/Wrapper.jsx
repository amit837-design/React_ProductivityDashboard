import React, { createContext, useContext, useState, useEffect } from "react";

export const dataContext = createContext(null);

const Wrapper = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [tasksTr, setTasksTr] = useState({});
  const [completed, setCompleted] = useState({});

  // Utility: Load from localStorage with fallback
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.warn(`Error loading ${key} from localStorage`, e);
      return defaultValue;
    }
  };

  // Load data once
  useEffect(() => {
    setTasks(loadFromStorage("tasks", []));
    setTasksTr(loadFromStorage("tasksTr", {}));
    setCompleted(loadFromStorage("completed", {}));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("tasksTr", JSON.stringify(tasksTr));
  }, [tasksTr]);

  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [completed]);

  return (
    <dataContext.Provider
      value={{ tasks, setTasks, tasksTr, setTasksTr, completed, setCompleted }}
    >
      {children}
    </dataContext.Provider>
  );
};

export default Wrapper;
