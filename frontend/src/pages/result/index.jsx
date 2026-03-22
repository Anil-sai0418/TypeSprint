import React, { useState, useEffect } from 'react';
import Navigation from "../../components/ui/Navigation";
import PerformanceBadge from './components/PerformanceBadge';
import MainStatsCards from './components/MainStatsCards';
import DetailedStats from './components/DetailedStats';
import PerformanceBreakdown from './components/PerformanceBreakdown';
import WpmChart from './components/WpmChart';
import ActionButtons from './components/ActionButtons';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20" />
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500/20 border-t-indigo-500 mx-auto mb-6 relative z-10"></div>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs relative z-10 text-center">Calculating performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] relative overflow-hidden flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-1 flex flex-col items-center pt-12 px-6 pb-24 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full"
          >
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em] mb-3">Test Results</h1>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">How did you do?</h2>
            </div>

            {/* Performance Badge */}
            <PerformanceBadge results={results} />

            {/* Speed Graph Section */}
            <div className="w-full mb-12">
              <WpmChart results={results} showChart={showChart} setShowChart={setShowChart} />
            </div>

            {/* Core Metrics Grid */}
            <MainStatsCards results={results} />

            {/* Detailed Analytics */}
            <DetailedStats results={results} />

            {/* Visual Breakdown */}
            <div className="w-full max-w-6xl mb-16 px-1">
              <PerformanceBreakdown results={results} />
            </div>

            {/* Next Steps / Actions */}
            <div className="w-full max-w-6xl mb-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-800 to-transparent" />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">What's Next</h3>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-800 to-transparent" />
              </div>
              <ActionButtons 
                onTryAgain={onTryAgain}
                onNewTest={onNewTest}
                onSettings={onSettings}
                onLeaderboard={onLeaderboard}
              />
            </div>
          </motion.div>
        </main>
      </div>

      {/* Subtle Dot Grid Overlay */}
      <div className="fixed inset-0 z-[-1] opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}
