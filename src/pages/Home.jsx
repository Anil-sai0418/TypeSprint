import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RotateCcw } from "lucide-react";
import Result from "./Result";
import { fetchRandomText } from "../services/api";
import Navigation from "@/components/ui/Navagation";

// ========== HELPER FUNCTIONS ==========
const calculateAccuracy = (correct, total) => (total > 0 ? Math.round((correct / total) * 100) : 100);

const calculateWPM = (charsTyped, timeElapsedSeconds, errors = 0) => {
  if (timeElapsedSeconds <= 0) return { raw: 0, net: 0 };
  const minutes = timeElapsedSeconds / 60;
  const rawWpm = Math.round((charsTyped / 5) / minutes);
  const netWpm = Math.max(0, Math.round(rawWpm - (errors / minutes)));
  return { raw: rawWpm, net: netWpm };
};

export default function HomePage() {
  // ========== STATE: SETTINGS ==========
  const [settings, setSettings] = useState({
    timeLimit: null, // null = infinite/words mode, number = timed mode
    wordLimit: null, // null = timed mode, number = words mode
    showPunctuation: false,
    showNumbers: false,
  });

  // ========== STATE: TEST DATA ==========
  const [testState, setTestState] = useState({
    status: "idle", // 'idle' | 'running' | 'completed'
    text: "",
    userInput: "",
    startTime: null,
    endTime: null,
    wpmHistory: [],
    isLoading: false,
  });

  // Refs for items that don't need to trigger re-renders directly
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const statsRef = useRef({ correctChars: 0, incorrectChars: 0 }); // To track stats inside interval without deps

  // ========== DATA FETCHING ==========
  const getRandomText = useCallback(async () => {
    setTestState(prev => ({ ...prev, isLoading: true }));
    try {
      const { wordLimit, showPunctuation, showNumbers } = settings;
      // Ensure we pass string values as expected by your API
      const response = await fetchRandomText(
        wordLimit,
        showPunctuation.toString(),
        showNumbers.toString()
      );
      
      setTestState(prev => ({
        ...prev,
        text: response.text,
        userInput: "",
        status: "idle",
        isLoading: false,
        wpmHistory: [],
        startTime: null,
        endTime: null
      }));
      
      // Reset Stats Ref
      statsRef.current = { correctChars: 0, incorrectChars: 0 };
      
      // Focus input after load
      setTimeout(() => inputRef.current?.focus(), 50);
      
    } catch (error) {
      console.error("Error fetching text:", error);
      setTestState(prev => ({
        ...prev,
        text: "Typing practice is not just about speed, it's also about developing consistency and accuracy.",
        isLoading: false,
        status: "idle", 
        userInput: ""
      }));
    }
  }, [settings]);

  // Initial Load
  useEffect(() => {
    getRandomText();
  }, [getRandomText]);

  // ========== DERIVED STATS (Memoized) ==========
  // We calculate stats on the fly based on userInput vs text to avoid state de-sync
  const currentStats = useMemo(() => {
    const { userInput, text, startTime, endTime } = testState;
    const isComplete = testState.status === "completed";
    
    let correct = 0;
    let incorrect = 0;
    let correctWords = 0;
    
    // Character level analysis
    const inputLen = userInput.length;
    for (let i = 0; i < inputLen; i++) {
      if (userInput[i] === text[i]) correct++;
      else incorrect++;
    }

    // Word level analysis
    const textWords = text.split(' ');
    const inputWords = userInput.split(' ');
    inputWords.forEach((word, idx) => {
        if(idx < textWords.length && word === textWords[idx]) {
            correctWords++;
        }
    });

    // Update the Ref for the interval to access
    statsRef.current = { correctChars: correct, incorrectChars: incorrect };

    // Time Calculation
    const now = isComplete && endTime ? endTime : Date.now();
    const start = startTime || now;
    const timeElapsed = Math.max(0, (now - start) / 1000); 
    
    const { raw, net } = calculateWPM(inputLen, timeElapsed, incorrect);

    // Calculate progress/timer
    let timeLeft = null;
    if (settings.timeLimit) {
        timeLeft = Math.max(0, settings.timeLimit - timeElapsed);
    }

    return {
      correctChars: correct,
      incorrectChars: incorrect,
      accuracy: calculateAccuracy(correct, inputLen),
      rawWpm: raw,
      netWpm: net,
      correctWords,
      totalWords: textWords.length,
      timeElapsed,
      timeLeft: timeLeft !== null ? Math.round(timeLeft) : null
    };
  }, [testState, settings.timeLimit]);

  // ========== TIMER LOGIC ==========
  useEffect(() => {
    if (testState.status === "running") {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - testState.startTime) / 1000;
        
        // 1. Update History Graph
        const { correctChars, incorrectChars } = statsRef.current;
        const { raw, net } = calculateWPM(correctChars + incorrectChars, elapsed, incorrectChars);
        
        setTestState(prev => ({
            ...prev,
            wpmHistory: [...prev.wpmHistory, { time: Math.round(elapsed), wpm: net, raw: raw }]
        }));

        // 2. Check Time Limit
        if (settings.timeLimit && elapsed >= settings.timeLimit) {
          finishTest();
        }
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [testState.status, testState.startTime, settings.timeLimit]);

  // ========== HANDLERS ==========
  
  const finishTest = () => {
    clearInterval(timerRef.current);
    setTestState(prev => ({ ...prev, status: "completed", endTime: Date.now() }));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const { text, status } = testState;

    if (status === "completed" || testState.isLoading) return;

    // Start Test Logic
    if (status === "idle" && value.length === 1) {
      setTestState(prev => ({
        ...prev,
        status: "running",
        startTime: Date.now(),
        userInput: value
      }));
      return;
    }

    // Prevent typing beyond text length
    if (value.length > text.length) return;

    // Update Input
    setTestState(prev => ({ ...prev, userInput: value }));

    // Check Completion (End of Text)
    if (value.length === text.length) {
      // Use setTimeout to allow the last render of the character to happen before switching screens
      finishTest(); 
    }
  };

  // ========== RENDERERS ==========

  const renderCharacters = useMemo(() => {
    return testState.text.split("").map((char, index) => {
      let className = "transition-colors duration-75 ";
      const userChar = testState.userInput[index];
      
      if (index < testState.userInput.length) {
        className += userChar === char 
          ? "text-green-500 bg-green-500/10" 
          : "text-red-500 bg-red-500/20";
      } else if (index === testState.userInput.length) {
        className += "bg-yellow-400/50 animate-pulse text-foreground";
      } else {
        className += "text-muted-foreground/60";
      }

      return <span key={index} className={className}>{char}</span>;
    });
  }, [testState.text, testState.userInput]);

  // ========== VIEW: RESULTS ==========
  if (testState.status === "completed") {
    // Construct the final object expected by your Result component
    const finalResults = {
        netWpm: currentStats.netWpm,
        rawWpm: currentStats.rawWpm,
        accuracy: currentStats.accuracy,
        correctChars: currentStats.correctChars,
        incorrectChars: currentStats.incorrectChars,
        correctWords: currentStats.correctWords,
        incorrectWords: currentStats.totalWords - currentStats.correctWords, // Approximate
        totalWords: currentStats.totalWords,
        totalTimeTaken: Math.round(currentStats.timeElapsed),
        wpmHistory: testState.wpmHistory
    };

    return (
      <Result
        testResults={finalResults}
        onTryAgain={getRandomText} // Quick restart same settings
        onNewTest={getRandomText}
        onSettings={() => {}} // Placeholder
        onLeaderboard={() => {}} // Placeholder
      />
    );
  }

  // ========== VIEW: TYPING TEST ==========
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col font-mono" 
         onClick={() => inputRef.current?.focus()}>
      <Navigation />

      {/* Controls Header */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border/50 py-4"
           onClick={(e) => e.stopPropagation()} // Stop propagation so clicking toolbar doesn't focus input immediately
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
          {/* Mode Toggles */}
          <div className="flex gap-2 p-1 bg-secondary/30 rounded-lg">
             <Button
                variant={settings.showPunctuation ? "default" : "ghost"}
                size="sm"
                onClick={() => setSettings(s => ({ ...s, showPunctuation: !s.showPunctuation }))}
                disabled={testState.status === 'running'}
              >
                @ #
              </Button>
              <Button
                variant={settings.showNumbers ? "default" : "ghost"}
                size="sm"
                onClick={() => setSettings(s => ({ ...s, showNumbers: !s.showNumbers }))}
                disabled={testState.status === 'running'}
              >
                1 2
              </Button>
          </div>

          <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>

          {/* Time Selector */}
          <Select
            value={settings.timeLimit?.toString() || ""}
            onValueChange={(val) => {
              const timeVal = val ? parseInt(val) : null;
              setSettings(s => ({ ...s, timeLimit: timeVal, wordLimit: null }));
            }}
            disabled={testState.status === 'running'}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Time Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
              <SelectItem value="60">60s</SelectItem>
            </SelectContent>
          </Select>

          {/* Word Selector */}
          <Select
            value={settings.wordLimit?.toString() || ""}
            onValueChange={(val) => {
              const wordVal = val ? parseInt(val) : null;
              setSettings(s => ({ ...s, wordLimit: wordVal, timeLimit: null }));
            }}
            disabled={testState.status === 'running'}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Word Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 words</SelectItem>
              <SelectItem value="50">50 words</SelectItem>
              <SelectItem value="100">100 words</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 relative">
        
        {/* Live Stats Display (Optional - only show if running) */}
        {testState.status === 'running' && (
             <div className="mb-8 text-xl font-bold text-primary animate-in fade-in slide-in-from-bottom-2">
                {settings.timeLimit ? (
                    <span className="text-4xl tabular-nums">{currentStats.timeLeft}s</span>
                ) : (
                    <span className="text-4xl tabular-nums">{Math.round(currentStats.netWpm)} WPM</span>
                )}
             </div>
        )}

        {/* Mode Display - Show current test mode */}
        {testState.status === 'idle' && !testState.isLoading && (
            <div className="mb-6 text-sm font-medium text-muted-foreground">
              {settings.timeLimit ? (
                <span>⏱️ Time Mode: {settings.timeLimit} seconds</span>
              ) : settings.wordLimit ? (
                <span>📝 Word Mode: {settings.wordLimit} words</span>
              ) : (
                <span>⚙️ Select a mode to begin</span>
              )}
            </div>
        )}

        <div className="w-full max-w-5xl relative">
            {/* The Input - Hidden but active */}
            <input
                ref={inputRef}
                type="text"
                value={testState.userInput}
                onChange={handleInputChange}
                className="absolute opacity-0 w-full h-full cursor-default z-0"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={testState.isLoading}
            />

            {/* The Visual Text Layer */}
            <div 
                className={`
                    bg-card/50 backdrop-blur-sm rounded-3xl shadow-lg border border-border/50 p-8 sm:p-12
                    transition-all duration-300 min-h-[200px] flex items-center justify-center
                    ${testState.status === 'idle' ? 'cursor-pointer hover:border-primary/50' : 'cursor-text'}
                `}
            >
                {testState.isLoading ? (
                     <div className="flex gap-2 items-center text-muted-foreground animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75" />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150" />
                     </div>
                ) : (
                    <div className="text-2xl sm:text-3xl leading-relaxed tracking-wide font-medium text-left break-words select-none pointer-events-none">
                        {renderCharacters}
                    </div>
                )}

                {testState.status === 'idle' && !testState.isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px] rounded-3xl">
                        <p className="text-muted-foreground/80 font-medium">Tap to start the test</p>
                    </div>
                )}
            </div>
        </div>

        {/* Restart Button */}
        <div className="mt-12">
            <Button 
                variant="ghost" 
                size="lg"
                onClick={(e) => { e.stopPropagation(); getRandomText(); }}
                className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <RotateCcw className="w-5 h-5" />
                <span>Restart Test</span>
            </Button>
        </div>
      </main>
    </div>
  );
}