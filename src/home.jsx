import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./components/ui/button";
import Nav from "./components/ui/Nav";
import { RotateCcw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter } from "recharts";

// Result component
const Result = ({ testResults, onTryAgain, onNewTest, onSettings, onLeaderboard }) => {
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

  // Prepare chart data
  const prepareChartData = () => {
    if (!results || !results.wpmHistory || results.wpmHistory.length === 0) return [];
    return results.wpmHistory.map((entry, index) => ({
      time: entry.time ? Math.round(entry.time / 1000) : index, // Use absolute time in seconds
      wpm: entry.wpm,
      rawWpm: entry.rawWpm || entry.wpm,
      error: results.errorTimeline && results.errorTimeline.includes(index) ? 1 : 0
    }));
  };

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
  const chartData = prepareChartData();

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

        {/* WPM Chart */}
        {chartData.length > 0 && (
          <div className="w-full max-w-4xl mb-8">
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">WPM Over Time</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(tick) => `${tick}s`}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 'dataMax + 10']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        `${value} ${name === 'error' ? 'Error' : 'WPM'}`,
                        name === 'wpm' ? 'Net WPM' : name === 'rawWpm' ? 'Raw WPM' : 'Error'
                      ]}
                      labelFormatter={(label) => `Time: ${label}s`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="wpm" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rawWpm" 
                      stroke="#6b7280" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 4, stroke: '#6b7280', strokeWidth: 2, fill: 'white' }}
                    />
                    <Scatter
                      dataKey="error"
                      fill="#ef4444"
                      shape={(props) => (
                        props.payload.error ? (
                          <text
                            x={props.cx}
                            y={props.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={16}
                            fill="#ef4444"
                          >
                            ×
                          </text>
                        ) : null
                      )}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span className="text-gray-600">Net WPM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-gray-500 border-dashed border-t-2 border-gray-500"></div>
                  <span className="text-gray-600">Raw WPM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span className="text-gray-600">Errors</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
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

        {/* Action Buttons */}
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
};

const sampleTexts = {
  texts: [
    "Typing practice is not just about speed, it's also about developing consistency and accuracy. By building a daily habit of typing long passages, your body will adapt and improve muscle memory. This leads to more natural and fluid typing over time, reducing stress and making it easier to focus on content rather than keys.",
    "A good developer is not someone who knows all the syntax, but someone who can solve problems effectively. Every new project is an opportunity to learn and grow. Embrace bugs as lessons and keep challenging yourself with slightly harder tasks. The effort you put into practice compounds into results.",
    "In the digital world, attention to detail is crucial. Whether you're designing a user interface or writing an algorithm, clear logic and thoughtful structure set your work apart. Start with small improvements. Maybe align the button, write cleaner code, or improve responsiveness. The small steps bring big wins."
  ],
  punctuations: ['.', ',', '!', '?', ';', ':', '-', '(', ')', '[', ']', '{', '}', '/', '\\', '"', "'", '`', '~', '@', '#', '$', '%', '^', '&', '*', '_', '+', '=', '<', '>'],
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
};

export default function HomePage() {
  // ========== STATE ==========
  const [text, setText] = useState("");
  const [time, setTime] = useState("");
  const [letters, setLetters] = useState("");
  const [showPunctuation, setShowPunctuation] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [netWpm, setNetWpm] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(null);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [errorTimeline, setErrorTimeline] = useState([]);
  const [finalTestResults, setFinalTestResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // ========== REFS ==========
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const wpmTrackingRef = useRef(null);

  // ========== UTILS & LOGIC ==========

  const getRandomText = useCallback((wordLimit = null) => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.texts.length);
    let text = sampleTexts.texts[randomIndex];
    let words = text.split(' ');

    if (wordLimit) {
      while (words.length < wordLimit) {
        const nextRandomIndex = Math.floor(Math.random() * sampleTexts.texts.length);
        const additionalWords = sampleTexts.texts[nextRandomIndex].split(' ');
        words = words.concat(additionalWords);
      }
      words = words.slice(0, wordLimit);
    }

    if (showNumbers) {
      words = words.map(word => {
        if (Math.random() < 0.15) {
          const randomNum = sampleTexts.numbers[Math.floor(Math.random() * sampleTexts.numbers.length)];
          return Math.random() < 0.5 ? randomNum + word : word + randomNum;
        }
        return word;
      });
    }

    text = words.join(' ');

    if (showPunctuation) {
      text = text.replace(/\./g, () => {
        const randIndex = Math.floor(Math.random() * sampleTexts.punctuations.length);
        return sampleTexts.punctuations[randIndex] || '.';
      });
      words = text.split(' ');
      text = words.map((word, index) => {
        if (Math.random() < 0.1 && index < words.length - 1) {
          const randPunc = sampleTexts.punctuations[Math.floor(Math.random() * sampleTexts.punctuations.length)];
          return word + randPunc;
        }
        return word;
      }).join(' ');
    }

    return text;
  }, [showPunctuation, showNumbers]);

  // Calculate Word Stats
  const calculateWordStats = useCallback(() => {
    if (!userInput || !text) return;
    const originalWords = text.split(' ');
    const typedWords = userInput.trim().split(' ').filter(word => word.length > 0);
    let correctWordsCount = 0, incorrectWordsCount = 0;
    for (let i = 0; i < typedWords.length; i++) {
      if (i < originalWords.length) {
        if (typedWords[i] === originalWords[i]) correctWordsCount++;
        else incorrectWordsCount++;
      }
    }
    setCorrectWords(correctWordsCount);
    setIncorrectWords(incorrectWordsCount);
    setTotalWords(originalWords.length);
  }, [userInput, text]);

  // Calculate Stats
  const calculateStats = useCallback(() => {
    if (!startTime) return;
    const currentTime = isTestComplete ? endTime : Date.now();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; // minutes
    const wordsTyped = correctChars / 5;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    const totalChars = correctChars + incorrectChars;
    const currentAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const allCharsTyped = userInput.length;
    const currentRawWpm = timeElapsed > 0 ? Math.round((allCharsTyped / 5) / timeElapsed) : 0;
    const currentNetWpm = timeElapsed > 0 ? Math.round(currentRawWpm - (incorrectChars / timeElapsed)) : 0;
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    setRawWpm(currentRawWpm);
    setNetWpm(Math.max(0, currentNetWpm));
  }, [startTime, endTime, isTestComplete, correctChars, incorrectChars, userInput.length]);

  // Complete the test
  const completeTest = useCallback(() => {
    const endTimeNow = Date.now();
    setEndTime(endTimeNow);
    setIsTestComplete(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTrackingRef.current) clearInterval(wpmTrackingRef.current);

    const timeTakenSecs = Math.round((endTimeNow - startTime) / 1000);
    const totalChars = correctChars + incorrectChars;
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const elapsedMinutes = timeTakenSecs / 60;
    const rawWpmCalc = elapsedMinutes > 0 ? Math.round((userInput.length / 5) / elapsedMinutes) : 0;
    const netWpmCalc = elapsedMinutes > 0 ? Math.round(rawWpmCalc - (incorrectChars / elapsedMinutes)) : 0;

    setFinalTestResults({
      netWpm: Math.max(0, netWpmCalc),
      rawWpm: rawWpmCalc,
      accuracy: finalAccuracy,
      correctChars: correctChars,
      incorrectChars: incorrectChars,
      correctWords: correctWords,
      incorrectWords: incorrectWords,
      totalWords: totalWords,
      totalTimeTaken: timeTakenSecs,
      timeTarget: time ? parseInt(time, 10) : null,
      wpmHistory: wpmHistory,
      errorTimeline: errorTimeline
    });
    setShowResults(true);
  }, [startTime, correctChars, incorrectChars, userInput.length, correctWords, incorrectWords, totalWords, time, wpmHistory, errorTimeline]);

  // Reset Test
  const resetTest = useCallback(() => {
    setUserInput("");
    setCurrentIndex(0);
    setIsTestStarted(false);
    setIsTestComplete(false);
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(time ? parseInt(time, 10) : null);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTotalTimeTaken(null);
    setCorrectWords(0);
    setIncorrectWords(0);
    setTotalWords(0);
    setRawWpm(0);
    setNetWpm(0);
    setFinalTestResults(null);
    setWpmHistory([]);
    setErrorTimeline([]);
    setShowResults(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTrackingRef.current) clearInterval(wpmTrackingRef.current);
    const wordLimit = letters ? parseInt(letters, 10) : null;
    setText(getRandomText(wordLimit));
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }, [time, letters, getRandomText]);

  // ========== EFFECTS ==========

  useEffect(() => { resetTest(); }, [resetTest]);

  // WPM and Error tracking
  useEffect(() => {
    if (isTestStarted && !isTestComplete) {
      wpmTrackingRef.current = setInterval(() => {
        if (startTime) {
          const currentTime = Date.now();
          const timeElapsed = (currentTime - startTime) / 1000 / 60; // minutes
          const allCharsTyped = userInput.length;
          const currentRawWpm = timeElapsed > 0 ? Math.round((allCharsTyped / 5) / timeElapsed) : 0;
          const currentNetWpm = timeElapsed > 0 ? Math.round(currentRawWpm - (incorrectChars / timeElapsed)) : 0;
          
          setWpmHistory(prev => [
            ...prev,
            {
              time: currentTime - startTime, // Store relative time in milliseconds
              wpm: Math.max(0, currentNetWpm),
              rawWpm: currentRawWpm
            }
          ]);
        }
      }, 1000);
    } else {
      if (wpmTrackingRef.current) clearInterval(wpmTrackingRef.current);
    }
    
    return () => {
      if (wpmTrackingRef.current) clearInterval(wpmTrackingRef.current);
    };
  }, [isTestStarted, isTestComplete, startTime, userInput.length, incorrectChars]);

  // Timer Logic
  useEffect(() => {
    if (isTestStarted && time && timeLeft !== null && timeLeft > 0 && !isTestComplete) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestStarted, time, timeLeft, isTestComplete, completeTest]);

  // Stats update
  useEffect(() => {
    calculateStats();
    calculateWordStats();
  }, [calculateStats, calculateWordStats]);

  // ========== HANDLERS ==========

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTime(val);
    setLetters("");
    setTimeLeft(val && !isNaN(val) ? parseInt(val, 10) : null);
  };

  const handleLettersChange = (e) => {
    const val = e.target.value;
    setLetters(val);
    setTime("");
    setTimeLeft(null);
    const wordLimit = val && !isNaN(val) ? parseInt(val, 10) : null;
    setText(getRandomText(wordLimit));
  };

  const handleInputChange = (e) => {
    if (isTestComplete || timeLeft === 0) return;
    
    const value = e.target.value;
    
    if (!isTestStarted && value.length === 1) {
      setIsTestStarted(true);
      setStartTime(Date.now());
    }
    
    if (value.length > text.length) return;

    setUserInput(value);
    setCurrentIndex(value.length);

    let correct = 0;
    let incorrect = 0;
    const errors = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correct++;
      } else {
        incorrect++;
        errors.push(Math.floor((Date.now() - startTime) / 1000));
      }
    }
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    if (errors.length > 0) {
      setErrorTimeline(prev => [...new Set([...prev, ...errors])]);
    }

    if (value.length === text.length && !time && !isTestComplete) {
      completeTest();
    }
  };

  const handleReload = () => {
    resetTest();
  };

  const handleTryAgain = () => { resetTest(); };
  const handleNewTest = () => { resetTest(); };
  const handleSettings = () => { /* Link to settings */ };
  const handleLeaderboard = () => { /* Link to leaderboard */ };

  // Render Highlighted Text
  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = "";
      if (index < userInput.length) {
        className = userInput[index] && userInput[index] === char
          ? "text-green-500 bg-green-500/10"
          : "text-red-500 bg-red-500/20";
      } else if (index === currentIndex) {
        className = "bg-yellow-400/30 animate-pulse";
      } else {
        className = "text-muted-foreground";
      }
      return (
        <span key={index} className={`${className} transition-colors duration-100`}>
          {char}
        </span>
      );
    });
  };

  // Main UI
  if (showResults && finalTestResults !== null) {
    return (
      <Result
        testResults={finalTestResults}
        onTryAgain={handleTryAgain}
        onNewTest={handleNewTest}
        onSettings={handleSettings}
        onLeaderboard={handleLeaderboard}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative flex flex-col items-center">
      <Nav />
      <div className="mt-6 w-full max-w-4xl bg-card/60 backdrop-blur-sm rounded-2xl flex flex-wrap justify-evenly items-center gap-4 px-4 py-4 shadow-lg z-20 relative">
        
          <Button
            variant={showPunctuation ? "default" : "secondary"}
            onClick={e => {
              e.stopPropagation();
              if (isTestStarted) return;
              setShowPunctuation(prev => !prev);
            }}
            disabled={isTestStarted}
          >Punctuation</Button>
          <Button
            variant={showNumbers ? "default" : "secondary"}
            onClick={e => {
              e.stopPropagation();
              if (isTestStarted) return;
              setShowNumbers(prev => !prev);
            }}
            disabled={isTestStarted}
          >Numbers</Button>
       
        <select
          value={time}
          onChange={e => { e.stopPropagation(); handleTimeChange(e); }}
          onClick={e => e.stopPropagation()}
          disabled={isTestStarted}
          className="w-[100px] px-3 py-2 rounded-md bg-background text-foreground border border-input"
        >
          <option value="">Time</option>
          <option value="15">15s</option>
          <option value="30">30s</option>
          <option value="60">1min</option>
        </select>
        <select
          value={letters}
          onChange={e => { e.stopPropagation(); handleLettersChange(e); }}
          onClick={e => e.stopPropagation()}
          disabled={isTestStarted}
          className="w-[100px] px-3 py-2 rounded-md bg-background text-foreground border border-input"
        >
          <option value="">Words</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      {isTestStarted && !isTestComplete && (
        <div className="mt-4 w-full max-w-4xl bg-card/30 backdrop-blur-sm rounded-xl flex justify-center items-center gap-8 px-4 py-3 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{netWpm}</div>
            <div className="text-xs text-muted-foreground">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          {timeLeft !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{timeLeft}s</div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
          )}
        </div>
      )}
      <div className="flex-grow flex justify-center items-center w-full px-4 lg:mt-[-40px]">
        <div
          className="w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-2xl flex flex-col justify-center items-center font-medium text-lg sm:text-xl md:text-2xl gap-6 py-8 px-4 text-center shadow-lg cursor-text"
          onClick={e => {
            if (!isTestComplete && !e.target.closest('button') && timeLeft !== 0) {
              inputRef.current?.focus();
            }
          }}
        >
          <div className="text-foreground leading-relaxed tracking-wide text-left max-w-4xl">
            {renderText()}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="opacity-0 absolute"
            autoFocus
            disabled={isTestComplete || timeLeft === 0}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!isTestStarted && !isTestComplete && timeLeft !== 0 && (
            <div className="text-muted-foreground text-base">Click here and start typing to begin the test</div>
          )}
          {timeLeft === 0 && isTestComplete && (
            <div className="text-red-500 text-lg font-semibold">Time's up!</div>
          )}
          <button
            className="w-40 h-12 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex justify-center items-center font-medium text-lg transition-colors"
            onClick={handleReload}
          >
            <RotateCcw />
          </button>
        </div>
      </div>
      {!isTestComplete && timeLeft !== 0 && (
        <div
          className="absolute top-[100px] bottom-0 left-0 right-0 z-10 cursor-text"
          onClick={e => {
            const target = e.target;
            if (!target.closest('.bg-card') && !target.closest('button') && !target.closest('select')) {
              inputRef.current?.focus();
            }
          }}
        />
      )}
    </div>
  );
}