import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "./components/ui/button";
import Nav from "./components/ui/nav";

export default function Result({
  testResults = null,
  onTryAgain = () => {},
  onNewTest = () => {},
  onSettings = () => {},
  onLeaderboard = () => {}
}) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (testResults) {
      setResults(testResults);
    }
  }, [testResults]);

  // Time formatting helper
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Performance band / level
  const getPerformanceLevel = () => {
    if (!results) return { level: "--", color: "", bg: "" };
    const { netWpm, accuracy } = results;
    if (netWpm >= 60 && accuracy >= 95) return { level: "Expert", color: "text-purple-600", bg: "bg-purple-50" };
    if (netWpm >= 40 && accuracy >= 90) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-50" };
    if (netWpm >= 25 && accuracy >= 80) return { level: "Intermediate", color: "text-green-600", bg: "bg-green-50" };
    return { level: "Beginner", color: "text-orange-600", bg: "bg-orange-50" };
  };

  // Chart show/hide toggle state
  const [showChart, setShowChart] = useState(true);

    // Show loader if results not yet in state
  if (!results) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-2 sm:px-0">

        {/* Performance badge */}
        <div className={`${performance.bg} ${performance.color} px-6 py-2 rounded-full font-semibold text-lg mb-8 shadow-sm`}>
          {performance.level} Typist
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl mb-8">
          <div className="bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center py-6 px-2 sm:px-0 border border-gray-100 hover:shadow-md transition-all duration-200">
            <span className="text-gray-500 text-sm font-medium mb-1 tracking-wide">NET WPM</span>
            <span className="text-3xl font-bold text-green-600">{results.netWpm}</span>
            <span className="text-xs text-gray-400">Raw: {results.rawWpm}</span>
          </div>
          <div className="bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center py-6 px-2 sm:px-0 border border-gray-100 hover:shadow-md transition-all duration-200">
            <span className="text-gray-500 text-sm font-medium mb-1 tracking-wide">TIME</span>
            <span className="text-3xl font-bold text-blue-600">{formatTime(results.totalTimeTaken)}</span>
            {results.timeTarget && (
              <span className="text-xs text-gray-400">Target: {results.timeTarget}s</span>
            )}
          </div>
          <div className="bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center py-6 px-2 sm:px-0 border border-gray-100 hover:shadow-md transition-all duration-200">
            <span className="text-gray-500 text-sm font-medium mb-1 tracking-wide">ACCURACY</span>
            <span className="text-3xl font-bold text-purple-600">{results.accuracy}%</span>
            <span className="text-xs text-gray-400">Characters</span>
          </div>
          <div className="bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center py-6 px-2 sm:px-0 border border-gray-100 hover:shadow-md transition-all duration-200">
            <span className="text-gray-500 text-sm font-medium mb-1 tracking-wide">CORRECT</span>
            <span className="text-3xl font-bold text-emerald-600">{results.correctWords}</span>
            <span className="text-xs text-gray-400">of {results.totalWords} words</span>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
          {/* Character Stats */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Characters</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Correct:</span>
                <span className="font-bold text-green-600">{results.correctChars}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-500 font-medium">Incorrect:</span>
                <span className="font-bold text-red-500">{results.incorrectChars}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total:</span>
                <span className="font-bold">{results.correctChars + results.incorrectChars}</span>
              </div>
            </div>
          </div>

          {/* Word Stats */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Words</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Correct:</span>
                <span className="font-bold text-green-600">{results.correctWords}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-500 font-medium">Incorrect:</span>
                <span className="font-bold text-red-500">{results.incorrectWords}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-gray-700 font-medium">Word Accuracy:</span>
                <span className="font-bold">
                  {results.totalWords > 0 ? Math.round((results.correctWords / results.totalWords) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm rounded-xl p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Insights</h3>
            <div className="space-y-3 text-sm">
              {results.accuracy >= 95 && (
                <div className="text-green-600 font-medium">✓ Excellent accuracy!</div>
              )}
              {results.netWpm >= 40 && (
                <div className="text-green-600 font-medium">✓ Great typing speed!</div>
              )}
              {results.incorrectChars <= 3 && (
                <div className="text-green-600 font-medium">✓ Very few errors!</div>
              )}
              {results.accuracy < 85 && (
                <div className="text-blue-600 font-medium">• Focus on accuracy</div>
              )}
              {results.netWpm < 30 && (
                <div className="text-blue-600 font-medium">• Practice for speed</div>
              )}
              {results.incorrectChars > 10 && (
                <div className="text-blue-600 font-medium">• Slow down to reduce errors</div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Performance Breakdown</h3>
            {/* Accuracy Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Accuracy</span>
                <span className="text-sm font-bold text-purple-600">{results.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${results.accuracy}%` }}
                ></div>
              </div>
            </div>
            {/* Speed Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Speed Progress</span>
                <span className="text-sm font-bold text-green-600">{results.netWpm} WPM</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((results.netWpm / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            {/* Consistency Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Consistency</span>
                <span className="text-sm font-bold text-blue-600">
                  {results.incorrectChars <= 5 ? 'Excellent' : results.incorrectChars <= 15 ? 'Good' : 'Needs Practice'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(20, 100 - (results.incorrectChars * 5))}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Toggle Button */}
        <button
          onClick={() => setShowChart(prev => !prev)}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all"
        >
          {showChart ? 'Hide Graph' : 'Show Graph'}
        </button>

        {/* Chart Section (Speed Over Time) */}
        {showChart && (
          <section className="w-full max-w-4xl flex flex-col items-center mb-8">
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-6 text-center">Speed Over Time</h3>
              {results?.wpmHistory?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={results.wpmHistory} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(128,128,128,0.15)" 
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="time"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => `${value}s`}
                      stroke="#888"
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax + 10']}
                      allowDecimals={false}
                      stroke="#888"
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(32,32,32,0.95)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: '#fff', fontSize: '13px' }}
                      formatter={(value, name) => [
                        `${Math.round(value)} wpm`, 
                        name === 'raw' ? 'Raw WPM' : 'Net WPM'
                      ]}
                      labelFormatter={(label) => `${label}s`}
                    />
                    <Line 
                      type="monotone"
                      dataKey="raw"
                      stroke="#999"
                      strokeWidth={1.8}
                      dot={false}
                      isAnimationActive={false}
                      strokeDasharray="4 4"
                    />
                    <Line 
                      type="monotone"
                      dataKey="wpm"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8">No WPM history available.</p>
              )}
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-[#4f46e5]"></div>
                    <span className="text-sm text-gray-600">Net WPM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-[#999]" style={{ borderTop: '2px dashed #999' }}></div>
                    <span className="text-sm text-gray-600">Raw WPM</span>
                  </div>
                </div>
              </div>
          </section>
        )}        {/* Action Buttons */}
        <div className="w-full max-w-4xl bg-white/80 border border-amber-100 shadow-lg rounded-xl flex flex-col items-center gap-6 py-8 px-4 sm:px-8 mb-8">
                    <div className="flex flex-wrap justify-center gap-4 w-full">
            <Button
              onClick={onTryAgain}
              className="min-w-[120px] max-w-[180px] h-12 text-base bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Try Again
            </Button>
            <Button
              onClick={onNewTest}
              className="min-w-[120px] max-w-[180px] h-12 text-base bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              New Test
            </Button>
            <Button
              onClick={onSettings}
              className="min-w-[120px] max-w-[180px] h-12 text-base bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Settings
            </Button>
            <Button
              onClick={onLeaderboard}
              className="min-w-[120px] max-w-[180px] h-12 text-base bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Leaderboard
            </Button>
                  </div>
        </div>
      </main>
    </div>
  );
}

