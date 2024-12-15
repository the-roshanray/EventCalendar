"use client";

import { useEffect, useState } from "react";

const loadEvents = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("events")) || {};
  }
  return {};
};

const saveEvents = (events) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("events", JSON.stringify(events));
  }
};

export default function Home() {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [events, setEvents] = useState({});
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    start: "",
    end: "",
    description: "",
    type: "",
  });
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    const storedEvents = loadEvents();
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    if (date) {
      const key = date.toISOString().split("T")[0];
      setSelectedDateEvents(events[key] || []);
    }
  }, [date, events]);

  const isOverlapping = (newEvent) => {
    return selectedDateEvents.some(
      (event) =>
        new Date(newEvent.start) < new Date(event.end) &&
        new Date(newEvent.end) > new Date(event.start)
    );
  };

  const handleAddEvent = () => {
    if (!date || !eventDetails.name) {
      alert("Please select a date and provide an event name.");
      return;
    }
    if (!eventDetails.start || !eventDetails.end) {
      alert("Please provide start and end times.");
      return;
    }
    if (new Date(eventDetails.start) >= new Date(eventDetails.end)) {
      alert("Start time must be earlier than end time.");
      return;
    }
    if (isOverlapping(eventDetails)) {
      alert("Event times overlap with an existing event.");
      return;
    }

    const key = date.toISOString().split("T")[0];
    const updatedEvents = {
      ...events,
      [key]: [...(events[key] || []), eventDetails],
    };
    setEvents(updatedEvents);
    saveEvents(updatedEvents);

    setEventDetails({
      name: "",
      start: "",
      end: "",
      description: "",
      type: "",
    });
    setShowEventModal(false);
  };

  const handleDeleteEvent = (index) => {
    const key = date.toISOString().split("T")[0];
    const updatedEvents = { ...events };
    updatedEvents[key].splice(index, 1);
    if (updatedEvents[key].length === 0) delete updatedEvents[key];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const handleExport = () => {
    if (!date || selectedDateEvents.length === 0) {
      alert("No events to export for the selected date.");
      return;
    }

    const key = date.toISOString().split("T")[0];
    const data = JSON.stringify({ [key]: selectedDateEvents }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${key}.json`;
    link.click();
  };

  const renderCalendarDays = () => {
    const currentMonth = date.getMonth();
    const firstDayOfMonth = new Date(date.getFullYear(), currentMonth, 1);
    const lastDayOfMonth = new Date(date.getFullYear(), currentMonth + 1, 0);

    const startDate = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startDate; i++) calendarDays.push(null);

    for (let i = 1; i <= totalDays; i++) {
      calendarDays.push(i);
    }

    while (calendarDays.length < 42) {
      calendarDays.push(null);
    }

    return calendarDays;
  };

  const handleChangeMonth = (direction) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + direction);
    setDate(newDate);
  };
  return (
    <div className="min-h-screen max-w-full bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Calendar</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-6 w-full max-w-6xl">
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleChangeMonth(-1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <span className="font-bold text-xl text-gray-800">
              {date?.toLocaleString("default", { month: "long" })} 2024
            </span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleChangeMonth(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <div>
            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div
                    key={day}
                    className={`text-sm font-semibold py-2 rounded-lg ${
                      index === 0
                        ? "bg-red-100 text-red-600"
                        : index === 6
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {renderCalendarDays().map((day, index) => {
                const isSunday = index % 7 === 0;
                const isSaturday = index % 7 === 6;
                const isToday =
                  day &&
                  new Date().toDateString() ===
                    new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      day
                    ).toDateString();
                const currentDateKey = day
                  ? new Date(date.getFullYear(), date.getMonth(), day)
                      .toISOString()
                      .split("T")[0]
                  : null;
                const hasEvents =
                  currentDateKey && events[currentDateKey]?.length > 0;

                return (
                  <div
                    key={index}
                    className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      day
                        ? isToday
                          ? "bg-green-100 text-green-700 font-bold shadow-md border border-green-500"
                          : isSunday
                          ? "bg-red-50 text-red-600"
                          : isSaturday
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-blue-50 text-blue-600"
                        : "bg-white"
                    } hover:scale-105 hover:shadow-lg`}
                    onClick={() =>
                      day &&
                      setDate(
                        new Date(date.getFullYear(), date.getMonth(), day)
                      )
                    }
                  >
                    {day}

                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 mt-6 lg:mt-0 bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search events"
              aria-label="Search events"
              className="w-full p-2 border rounded-lg pl-4"
              onChange={(e) => {
                const keyword = e.target.value.toLowerCase();
                if (date) {
                  const key = date.toISOString().split("T")[0];
                  setSelectedDateEvents(
                    (events[key] || []).filter((event) =>
                      [event.name, event.description]
                        .filter(Boolean) // Ensure non-null values
                        .some((text) => text.toLowerCase().includes(keyword))
                    )
                  );
                }
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              aria-hidden="true"
              focusable="false"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </div>

          {date ? (
            <>
              <h3 className="text-2xl font-semibold text-blue-700 text-center">
                Events on {date.toDateString()}
              </h3>
              {selectedDateEvents.length > 0 ? (
                <ul className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <li
                      key={index}
                      className={`p-4 border rounded-lg shadow-md ${
                        event.type === "work"
                          ? "bg-blue-100"
                          : event.type === "personal"
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center rounded-lg">
                        <div>
                          <h5 className="capitalize text-sm font-bold text-gray-600">
                            {event.type}
                          </h5>
                          <h4 className="text-lg font-bold text-blue-700">
                            {event.name}
                          </h4>
                        </div>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteEvent(index)}
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Time:</span>{" "}
                        {event.start} - {event.end}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Description:</span>{" "}
                          {event.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">
                  No events for this day.
                </p>
              )}
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                onClick={() => setShowEventModal(true)}
              >
                Add Event
              </button>
              {selectedDateEvents.length > 0 && (
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg mt-4"
                  onClick={handleExport}
                >
                  Export Events
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Select a date to view events.
            </p>
          )}
        </div>
      </div>

      {showEventModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Add New Event
            </h3>
            <input
              type="text"
              placeholder="Event Name"
              value={eventDetails.name}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex space-x-4 mb-4">
              <input
                type="time"
                value={eventDetails.start}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, start: e.target.value })
                }
                className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="time"
                value={eventDetails.end}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, end: e.target.value })
                }
                className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <textarea
              placeholder="Description (Optional)"
              value={eventDetails.description}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            ></textarea>
            <select
              className="w-full p-2 border rounded-lg mb-4"
              value={eventDetails.type}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, type: e.target.value })
              }
            >
              <option value="">Select Type</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                onClick={handleAddEvent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
