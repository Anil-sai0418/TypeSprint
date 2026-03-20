import React from 'react';
import { Bell } from 'lucide-react';

const Notification = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <button 
        type="button"
        className="relative p-2 rounded-xl transition-all duration-300 group
                   /* Light Mode: Subtle gray scale */
                   bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600
                   /* Dark Mode: Deep grays */
                   dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400
                   /* Border for definition */
                   border border-gray-200 dark:border-zinc-700"
      >
        {/* Icon with requested h-8 w-8 */}
        <Bell className="h-8 w-8 transition-transform group-active:scale-90" />

        {/* Notification Badge */}
        <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-zinc-900"></span>
        </span>
      </button>
    </div>
  );
}

export default Notification;