import React from 'react';
import { Button } from '../../../components/ui/button';
import { RotateCcw, Plus, Settings, Trophy } from 'lucide-react';

export default function ActionButtons({ onTryAgain, onNewTest, onSettings, onLeaderboard }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-8 md:p-12">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">What's Next?</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ActionButton
            icon={RotateCcw}
            label="Try Again"
            description="Same text"
            onClick={onTryAgain}
            color="green"
          />
          <ActionButton
            icon={Plus}
            label="New Test"
            description="Fresh text"
            onClick={onNewTest}
            color="blue"
          />
          <ActionButton
            icon={Settings}
            label="Settings"
            description="Configure test"
            onClick={onSettings}
            color="purple"
          />
          <ActionButton
            icon={Trophy}
            label="Leaderboard"
            description="View rankings"
            onClick={onLeaderboard}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ icon: IconComp, label, description, onClick, color }) => {
  const colorMap = {
    green: {
      bg: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
      icon: 'text-white'
    },
    blue: {
      bg: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
      icon: 'text-white'
    },
    purple: {
      bg: 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700',
      icon: 'text-white'
    },
    orange: {
      bg: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
      icon: 'text-white'
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-xl ${colors.bg} text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95`}
    >
      <div className="p-3 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
        <IconComp className="w-6 h-6" />
      </div>
      <div className="text-center">
        <p className="font-bold text-sm md:text-base">{label}</p>
        <p className="text-xs opacity-90">{description}</p>
      </div>
    </button>
  );
};
