import React from 'react';
import { Zap, Clock, Target, CheckCircle2 } from 'lucide-react';

const getColorClasses = (color) => {
  const colors = {
    green: { bg: 'bg-green-100 dark:bg-green-950', icon: 'text-green-600 dark:text-green-400', text: 'text-green-600 dark:text-green-400', border: 'hover:border-green-400 dark:hover:border-green-500' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-950', icon: 'text-blue-600 dark:text-blue-400', text: 'text-blue-600 dark:text-blue-400', border: 'hover:border-blue-400 dark:hover:border-blue-500' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-950', icon: 'text-purple-600 dark:text-purple-400', text: 'text-purple-600 dark:text-purple-400', border: 'hover:border-purple-400 dark:hover:border-purple-500' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-950', icon: 'text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-400 dark:hover:border-emerald-500' }
  };
  return colors[color] || colors.green;
};

const StatCard = ({ icon: IconComponent, label, value, subValue, color }) => {
  const colorClasses = getColorClasses(color);
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-transparent ${colorClasses.border} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
          <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
      <p className={`text-4xl md:text-5xl font-bold ${colorClasses.text}`}>{value}</p>
      {subValue && <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subValue}</p>}
    </div>
  );
};

export default function MainStatsCards({ results }) {
  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="w-full max-w-6xl mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Test Results</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Zap}
          label="NET WPM"
          value={results.netWpm}
          subValue={`Raw: ${results.rawWpm}`}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="TIME"
          value={formatTime(results.totalTimeTaken)}
          subValue={results.timeTarget ? `Target: ${results.timeTarget}s` : ""}
          color="blue"
        />
        <StatCard
          icon={Target}
          label="ACCURACY"
          value={`${results.accuracy}%`}
          subValue="Precision"
          color="purple"
        />
        <StatCard
          icon={CheckCircle2}
          label="CORRECT"
          value={results.correctWords}
          subValue={`of ${results.totalWords} words`}
          color="emerald"
        />
      </div>
    </div>
  );
}
