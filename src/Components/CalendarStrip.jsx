import { useState, useEffect } from "react";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarStrip() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to get the dates of the week centered around the selected date
  const getWeekDates = (centerDate) => {
    const start = new Date(centerDate);
    start.setDate(centerDate.getDate() - 3);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(selectedDate);

  // Function to format the month
  const formatMonth = (date) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

  // Function to change the selected date
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Effect to auto-update the selected date every day
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      // If the current day is different from the selected date, update it
      if (today.toDateString() !== selectedDate.toDateString()) {
        setSelectedDate(today);
      }
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [selectedDate]);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Month Display */}
      <div className="flex justify-between w-full px-6 text-gray-600 text-base font-medium">
        <span>{formatMonth(weekDates[0])}</span>
        <span className="text-black text-2xl font-bold">
          {formatMonth(selectedDate)}
        </span>
        <span>{formatMonth(weekDates[6])}</span>
      </div>

      {/* Date Strip */}
      <div className="flex justify-center gap-3 md:gap-6">
        {weekDates.map((date, i) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          return (
            <div
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center cursor-pointer text-sm md:text-base font-medium transition-colors duration-200 ${
                isSelected ? "text-white" : "text-gray-800"
              }`}
            >
              <span className="text-gray-400 mb-1">
                {weekdays[date.getDay()]}
              </span>
              <span
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  isSelected ? "bg-black" : "hover:bg-gray-200"
                }`}
              >
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-4">
        {["Previous", "Next"].map((label, idx) => {
          const direction = idx === 0 ? -7 : 7;
          return (
            <button
              key={label}
              onClick={() => changeDate(direction)}
              className="cursor-pointer group relative px-6 py-2 text-base font-semibold text-black border-2 border-black rounded-full bg-transparent overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-white hover:scale-105 active:scale-100 shadow-sm hover:shadow-lg"
            >
              <span className="absolute inset-0 m-auto w-12 h-12 rounded-full scale-0 bg-black transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-150 -z-10"></span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarStrip;
