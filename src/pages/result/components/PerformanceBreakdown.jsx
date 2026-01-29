import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressBar = ({ label, value, maxValue = 100, color = 'indigo' }) => {
  const colorMap = {
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600'
  };
  const bgColor = colorMap[color] || colorMap.purple;
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        <span className={`text-sm font-bold bg-gradient-to-r ${bgColor} bg-clip-text text-transparent`}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${bgColor} h-3 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function PerformanceBreakdown({ results }) {
  return (
    <div className="w-full max-w-6xl mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950">
          <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Performance Breakdown</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Accuracy Progress */}
          <ProgressBar 
            label="Accuracy"
            value={`${results.accuracy}%`}
            maxValue={100}
            color="purple"
          />

          {/* Speed Progress */}
          <ProgressBar 
            label="Speed Progress"
            value={`${results.netWpm} WPM`}
            maxValue={100}
            color="green"
          />

          {/* Consistency Progress */}
          <ProgressBar 
            label="Consistency"
            value={results.incorrectChars <= 5 ? 'Excellent' : results.incorrectChars <= 15 ? 'Good' : 'Needs Practice'}
            maxValue={100}
            color="blue"
          />
        </div>

        {/* Summary Statistics Grid */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Avg WPM</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{Math.round(results.netWpm)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.accuracy}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Words/Min</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.correctWords}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Errors</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.incorrectChars}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
