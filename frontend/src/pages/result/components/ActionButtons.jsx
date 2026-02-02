import React from 'react';

import { RotateCcw, Plus, Settings, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActionButtons({ onTryAgain, onNewTest,  }) {
  const navigate = useNavigate();

  return (
    <div className="w- max-w-6xl mx-auto">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
        <h3 className="mb-3 text-center text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100">
          What’s next
        </h3>
        
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-6">
          <ActionButton
            icon={RotateCcw}
            label="Try Again"
            description="Same text"
            onClick={onTryAgain}
            primary
          />
          <ActionButton
            icon={Plus}
            label="New Test"
            description="Fresh text"
            onClick={onNewTest}
          />
          <ActionButton
            icon={Trophy}
            label="Leaderboard"
            description="View rankings"
            onClick={() => navigate('/leaderboard')}
          />
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ icon: IconComp, label, description, onClick, primary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-xl px-5 py-4 h-full w-full sm:w-[260px] transition-all duration-200 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 ${
        primary
          ? 'border border-gray-300/60 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-gray-100 shadow-md hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-gray-400/60 dark:focus-visible:ring-gray-600/60'
          : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-indigo-500/60 dark:focus-visible:ring-indigo-400/60'
      }`}
    >
      <div
        className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
          primary
            ? 'bg-gray-900/5 dark:bg-white/10 text-gray-900 dark:text-gray-100'
            : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-400'
        }`}
      >
        <IconComp className="h-5 w-5" />
      </div>

      <div className="relative z-10 flex-1 text-left">
        <p
          className={`text-sm font-semibold ${
            primary ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {label}
        </p>
        <p
          className={`text-xs ${
            primary ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {description}
        </p>
        {!primary && (
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 dark:text-indigo-400">
            Open
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
};
