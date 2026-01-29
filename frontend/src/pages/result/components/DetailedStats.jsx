import React from 'react';
import { BarChart3, Target, Lightbulb } from 'lucide-react';

const DetailCard = ({ title, icon: IconComp, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950">
        <IconComp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
    </div>
    {children}
  </div>
);

const StatRow = ({ label, value, color = 'gray' }) => {
  const colorMap = {
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-500 dark:text-red-400',
    gray: 'text-gray-700 dark:text-gray-300'
  };

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
      <span className={`font-bold ${colorMap[color]}`}>{value}</span>
    </div>
  );
};

export default function DetailedStats({ results }) {
  return (
    <div className="w-full max-w-6xl mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Detailed Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Character Stats */}
        <DetailCard title="Characters" icon={BarChart3}>
          <StatRow label="Correct" value={results.correctChars} color="green" />
          <StatRow label="Incorrect" value={results.incorrectChars} color="red" />
          <StatRow label="Total" value={results.correctChars + results.incorrectChars} color="gray" />
        </DetailCard>

        {/* Word Stats */}
        <DetailCard title="Words" icon={Target}>
          <StatRow label="Correct" value={results.correctWords} color="green" />
          <StatRow label="Incorrect" value={results.incorrectWords} color="red" />
          <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Accuracy</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {results.totalWords > 0 ? Math.round((results.correctWords / results.totalWords) * 100) : 0}%
            </span>
          </div>
        </DetailCard>

        {/* Performance Insights */}
        <DetailCard title="Insights" icon={Lightbulb}>
          <div className="space-y-3">
            {results.accuracy >= 95 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                <span className="text-lg">✓</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Excellent accuracy!</span>
              </div>
            )}
            {results.netWpm >= 40 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                <span className="text-lg">✓</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Great typing speed!</span>
              </div>
            )}
            {results.incorrectChars <= 3 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                <span className="text-lg">✓</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Very few errors!</span>
              </div>
            )}
            {results.accuracy < 85 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <span className="text-lg">•</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Focus on accuracy</span>
              </div>
            )}
            {results.netWpm < 30 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <span className="text-lg">•</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Practice for speed</span>
              </div>
            )}
            {results.incorrectChars > 10 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <span className="text-lg">•</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Slow down to reduce errors</span>
              </div>
            )}
          </div>
        </DetailCard>
      </div>
    </div>
  );
}
