import React, { useState, useEffect } from 'react';
import Navigation from "../../components/ui/Navagation";
import PerformanceBadge from './components/PerformanceBadge';
import MainStatsCards from './components/MainStatsCards';
import DetailedStats from './components/DetailedStats';
import PerformanceBreakdown from './components/PerformanceBreakdown';
import WpmChart from './components/WpmChart';
import ActionButtons from './components/ActionButtons';

export default function Result({
  testResults = null,
  onTryAgain = () => {},
  onNewTest = () => {},
  onSettings = () => {},
  onLeaderboard = () => {}
}) {
  const [results, setResults] = useState(null);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    if (testResults) {
      setResults(testResults);
    }
  }, [testResults]);

  if (!results) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-12 px-3 sm:px-4 md:px-6 pb-12">
        
        {/* Performance Badge */}
        <PerformanceBadge results={results} />

        {/* Main Stats - High Priority */}
        <div className="w-full max-w-6xl mb-8">
          <WpmChart results={results} showChart={showChart} setShowChart={setShowChart} />
        </div>

        {/* Stats Cards */}
        <MainStatsCards results={results} />

        {/* Detailed Stats */}
        <DetailedStats results={results} />

        {/* Performance Breakdown */}
        <PerformanceBreakdown results={results} />

        {/* Action Buttons */}
        <ActionButtons 
          onTryAgain={onTryAgain}
          onNewTest={onNewTest}
          onSettings={onSettings}
          onLeaderboard={onLeaderboard}
        />
      </main>
    </div>
  );
}
