import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./components/ui/button";
import Nav from "./components/ui/nav";
import { RotateCcw } from "lucide-react";
import Result from "./Result";

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
  const [finalTestResults, setFinalTestResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // ========== UTILS ==========
  const calculateInstantWPM = (chars, correct, incorrect, seconds) => {
    if (seconds === 0) return 0;
    const minutes = seconds / 60;
    const grossWPM = (chars / 5) / minutes;
    const netWPM = grossWPM - (incorrect / minutes);
    return Math.max(0, Math.round(netWPM));
  };

  const getRandomText = useCallback((wordLimit = null) => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.texts.length);
    let text = sampleTexts.texts[randomIndex];
    let words = text.split(' ');

    if (wordLimit) {
      while (words.length < wordLimit) {
        const nextRandomIndex = Math.floor(Math.random() * sampleTexts.texts.length);
        words = words.concat(sampleTexts.texts[nextRandomIndex].split(' '));
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

  const calculateWordStats = useCallback(() => {
    if (!userInput || !text) return;
    const originalWords = text.split(' ');
    const typedWords = userInput.split(' ');
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
    if (timerRef.current) clearInterval(timerRef.current);
    const wordLimit = letters ? parseInt(letters, 10) : null;
    setText(getRandomText(wordLimit));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [time, letters, getRandomText]);

  // ========== EFFECTS ==========

  useEffect(() => { resetTest(); }, [resetTest]);

  useEffect(() => {
    if (isTestStarted && !isTestComplete) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const currentElapsedTime = Math.round((Date.now() - startTime) / 1000);
          const rawWPM = calculateInstantWPM(userInput.length, userInput.length, 0, currentElapsedTime);
          const netWPM = calculateInstantWPM(userInput.length, correctChars, incorrectChars, currentElapsedTime);
          setWpmHistory(prevHist => [
            ...prevHist,
            { time: currentElapsedTime, wpm: netWPM, raw: rawWPM }
          ]);

          if (prev === null) return null;
          if (prev <= 0) {
            clearInterval(timerRef.current);
            const end = Date.now();
            setEndTime(end);
            setIsTestComplete(true);

            const timeTakenSecs = Math.round((end - startTime) / 1000);
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
              wpmHistory: [
                ...wpmHistory,
                { time: currentElapsedTime, wpm: netWPM, raw: rawWPM }
              ]
            });
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTestStarted, timeLeft, isTestComplete, startTime, correctChars, incorrectChars, userInput.length, correctWords, incorrectWords, totalWords, time, wpmHistory]);

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
    const value = e.target.value;
    if (isTestComplete) return;
    if (!isTestStarted && value.length === 1) {
      setIsTestStarted(true);
      setStartTime(Date.now());
      if (time) setTimeLeft(parseInt(time, 10));
    }
    if (value.length > text.length) return;

    setUserInput(value);
    setCurrentIndex(value.length);

    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) correct++;
      else incorrect++;
    }
    setCorrectChars(correct);
    setIncorrectChars(incorrect);

    if (value.length === text.length && !isTestComplete) {
      setIsTestComplete(true);
      setEndTime(Date.now());
      if (timerRef.current) clearInterval(timerRef.current);

      const timeTakenSecs = Math.round((Date.now() - startTime) / 1000);
      const totalChars = correct + incorrect;
      const finalAccuracy = totalChars > 0 ? Math.round((correct / totalChars) * 100) : 100;
      const elapsedMinutes = timeTakenSecs / 60;
      const rawWpm = elapsedMinutes > 0 ? Math.round((value.length / 5) / elapsedMinutes) : 0;
      const netWpm = elapsedMinutes > 0 ? Math.round(rawWpm - (incorrect / elapsedMinutes)) : 0;

      const finalResults = {
        netWpm: Math.max(0, netWpm),
        rawWpm: rawWpm,
        accuracy: finalAccuracy,
        correctChars: correct,
        incorrectChars: incorrect,
        correctWords: correctWords,
        incorrectWords: incorrectWords,
        totalWords: totalWords,
        totalTimeTaken: timeTakenSecs,
        timeTarget: time ? parseInt(time, 10) : null,
        wpmHistory: [...wpmHistory]
      };
      setFinalTestResults(finalResults);
      setShowResults(true);
    }
  };

  const handleReload = () => { resetTest(); };
  const handleSettings = () => {};
  const handleLeaderboard = () => {};

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = "";
      if (index < userInput.length) {
        className = userInput[index] === char ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/20";
      } else if (index === currentIndex) {
        className = "bg-yellow-400/30 animate-pulse";
      } else {
        className = "text-muted-foreground";
      }
      return <span key={index} className={`${className} transition-colors duration-100`}>{char}</span>;
    });
  };

  if (showResults && finalTestResults !== null) {
    return (
      <Result
        testResults={finalTestResults}
        onTryAgain={resetTest}
        onNewTest={resetTest}
        onSettings={handleSettings}
        onLeaderboard={handleLeaderboard}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative flex flex-col items-center">
      <Nav />
      {/* Controls */}
      <div className="mt-6 w-full max-w-4xl bg-card/60 backdrop-blur-sm rounded-2xl flex flex-wrap justify-evenly items-center gap-4 px-4 py-4 shadow-lg z-20 relative">
        <div className="flex gap-2">
          <Button variant={showPunctuation ? "default" : "secondary"} onClick={e => { e.stopPropagation(); if(isTestStarted) return; setShowPunctuation(prev => !prev); }} disabled={isTestStarted}>Punctuation</Button>
          <Button variant={showNumbers ? "default" : "secondary"} onClick={e => { e.stopPropagation(); if(isTestStarted) return; setShowNumbers(prev => !prev); }} disabled={isTestStarted}>Numbers</Button>
        </div>
        <select value={time} onChange={e => { e.stopPropagation(); handleTimeChange(e); }} disabled={isTestStarted} className="w-[100px] px-3 py-2 rounded-md bg-background text-foreground border border-input">
          <option value="">Time</option>
          <option value="15">15s</option>
          <option value="30">30s</option>
          <option value="60">1min</option>
        </select>
        <select value={letters} onChange={e => { e.stopPropagation(); handleLettersChange(e); }} disabled={isTestStarted} className="w-[100px] px-3 py-2 rounded-md bg-background text-foreground border border-input">
          <option value="">Words</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* {isTestStarted && !isTestComplete && (
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
      )} */}

      {/* Typing area */}
    <div className="flex-grow flex justify-center items-center w-full px-4 lg:mt-[-40px]">
  <div
    className="w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-2xl flex flex-col justify-center items-center gap-6 py-10 px-6 text-center shadow-lg cursor-text"
    onClick={(e) => {
      if (!isTestComplete && !e.target.closest("button")) inputRef.current?.focus();
    }}
  >
    {/* Typing Text */}
    <div className="text-foreground leading-relaxed tracking-wide text-left max-w-4xl font-medium text-lg sm:text-xl md:text-2xl">
      {renderText()}
    </div>

    {/* Hidden Input Field */}
    <input
      ref={inputRef}
      type="text"
      value={userInput}
      onChange={handleInputChange}
      className="absolute opacity-0"
      autoFocus
      disabled={isTestComplete}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />

    {/* Instruction Message */}
    {!isTestStarted && !isTestComplete && (
      <p className="text-muted-foreground text-base">
        Click here and start typing to begin the test
      </p>
    )}

    {/* Reload Button */}
    <button
      onClick={handleReload}
      className="w-40 h-12 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex justify-center items-center font-medium text-lg transition-colors"
    >
      <RotateCcw className="mr-2" />
      Restart
    </button>
  </div>
</div>


      {!isTestComplete && <div className="absolute inset-0 z-10 cursor-text" onClick={e => { const target = e.target; if (!target.closest('.bg-card') && !target.closest('button') && !target.closest('select')) inputRef.current?.focus(); }} />}
    </div>
  );
}
