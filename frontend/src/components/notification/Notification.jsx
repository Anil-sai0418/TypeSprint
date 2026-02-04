import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "New Test Available", desc: "Try the new speed challenge test." },
    { id: 2, title: "Streak Updated", desc: "You’re on a 5-day streak. Keep going!" },
    { id: 3, title: "Leaderboard Update", desc: "You moved up to rank #12." },
  ];

  return (
    <div className="relative flex items-center justify-center p-4" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl transition-all duration-300 group
                   bg-gray-100 text-gray-600 hover:bg-gray-200 
                   dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 
                   border border-gray-200 dark:border-zinc-700"
      >
        <Bell className="h-5 w-5 transition-transform group-active:scale-90" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-14 w-80 rounded-xl shadow-xl z-50
                     bg-white dark:bg-zinc-900
                     border border-gray-200 dark:border-zinc-700
                     animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
              Notifications
            </h3>
          </div>

          {/* Notification List */}
          <ul className="max-h-72 overflow-y-auto">
            {notifications.map((item) => (
              <li
                key={item.id}
                className="px-4 py-3 cursor-pointer transition-colors
                           hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 text-center">
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;