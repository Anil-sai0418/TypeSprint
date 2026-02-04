import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { RotateCcw, Type, Clock, Hash, AlignLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Navigation from "@/components/ui/Navagation";
import Footer from "./Footer";
import Result from "./Result";
import { fetchRandomText } from "../services/api";
import {
  generateWPMGraphData,
  trackKeystroke,
  calculateTestStats as _calculateTestStats
} from "@/lib/monkeytype-error-handler";

// --- HOOK: Core Logic (Monkeytype-style WPM tracking) - OPTIMIZED ---
const useTypingEngine = (settings) => {
  const [status, setStatus] = useState("idle");
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const timerRef = useRef(null);
  const keystrokesRef = useRef([]);
  const statsRef = useRef({ totalCorrect: 0, totalError: 0 }); // OPTIMIZATION: Track in ref for O(1) access

  // OPTIMIZATION: Fetch Text with memoized settings
  const loadTest = useCallback(async () => {
    setIsLoading(true);
    setStatus("idle");
    setWpmHistory([]);
    setInput("");
    setStartTime(null);
    setEndTime(null);
    keystrokesRef.current = [];
    statsRef.current = { totalCorrect: 0, totalError: 0 };

    try {
      const { wordLimit, showPunctuation, showNumbers } = settings;
      const data = await fetchRandomText(wordLimit, showPunctuation.toString(), showNumbers.toString());
      setWords(data.text.split("")); 
    } catch (e) {
      console.error('Failed to fetch random text:', e);
      setWords("Error loading text. Please check your connection.".split(""));
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // OPTIMIZATION: Efficient timer with early exit
  useEffect(() => {
    if (status !== "running" || !settings.timeLimit) return;

    const checkTimeLimit = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= settings.timeLimit) {
        clearInterval(timerRef.current);
        const graphData = generateWPMGraphData(keystrokesRef.current, startTime);
        setWpmHistory(graphData);
        setStatus("completed");
        setEndTime(Date.now());
      }
    };

    timerRef.current = setInterval(checkTimeLimit, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, startTime, settings.timeLimit]);

  const startTest = useCallback(() => {
    if (status === "idle") {
      setStatus("running");
      setStartTime(Date.now());
      keystrokesRef.current = [];
      statsRef.current = { totalCorrect: 0, totalError: 0 };
    }
  }, [status]);

  // OPTIMIZATION: Single-pass keystroke tracking with ref caching
  const handleInput = useCallback((val) => {
    if (status === "completed" || isLoading) return;
    if (status === "idle") startTest();
    if (val.length > words.length) return;

    const prevLength = input.length;
    const currentLength = val.length;

    // OPTIMIZATION: Minimize array operations - use splice instead of multiple pushes
    if (currentLength > prevLength) {
      const newKeystrokes = [];
      for (let i = prevLength; i < currentLength; i++) {
        const typedChar = val[i];
        const expectedChar = words[i];
        const keystroke = trackKeystroke(Date.now(), expectedChar, typedChar, false);
        newKeystrokes.push(keystroke);
        
        // OPTIMIZATION: Track stats inline
        if (keystroke.isCorrect) statsRef.current.totalCorrect++;
        else if (keystroke.isError) statsRef.current.totalError++;
      }
      keystrokesRef.current.push(...newKeystrokes);
    } else if (currentLength < prevLength) {
      const backspaceCount = prevLength - currentLength;
      for (let i = 0; i < backspaceCount; i++) {
        keystrokesRef.current.push(trackKeystroke(Date.now(), '', '', true));
      }
    }
    
    setInput(val);

    // OPTIMIZATION: Check completion without re-calculating
    if (val.length === words.length && words.length > 0) {
      const graphData = generateWPMGraphData(keystrokesRef.current, startTime);
      setWpmHistory(graphData);
      setStatus("completed");
      setEndTime(Date.now());
    }
  }, [status, isLoading, input.length, words, startTest, startTime]);

  // OPTIMIZATION: Memoized stats calculation - only recompute on ref or status change
  const stats = useMemo(() => {
    if (keystrokesRef.current.length === 0 || !startTime) {
      return {
        netWpm: 0,
        rawWpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        errors: 0,
        timeElapsed: 0,
        timeLeft: settings.timeLimit || null
      };
    }

    const currentTime = status === "completed" ? endTime : Date.now();
    const timeElapsed = Math.max(1, (currentTime - startTime) / 1000); // OPTIMIZATION: Prevent division by zero

    // OPTIMIZATION: Use cached stats + filter only once
    const totalTyped = keystrokesRef.current.filter(k => !k.isBackspace).length;
    const correctCount = statsRef.current.totalCorrect;
    const errorCount = statsRef.current.totalError;

    const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
    const rawWpm = Math.round(((totalTyped / 5) / (timeElapsed / 60)));
    const netWpm = Math.round(rawWpm * (accuracy / 100));

    return {
      netWpm,
      rawWpm,
      accuracy,
      correctChars: correctCount,
      incorrectChars: totalTyped - correctCount,
      errors: errorCount,
      timeElapsed: Math.round(timeElapsed),
      timeLeft: settings.timeLimit ? Math.max(0, Math.round(settings.timeLimit - timeElapsed)) : null
    };
  }, [startTime, endTime, status, settings.timeLimit]); // OPTIMIZATION: Minimal dependencies

  return {
    status,
    words,
    input,
    isLoading,
    stats,
    wpmHistory,
    loadTest,
    handleInput,
    restart: loadTest
  };
};

// --- COMPONENT: Main Page ---

export default function TypingTest() {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);
  
  const [settings, setSettings] = useState({
    timeLimit: 30, 
    wordLimit: null,
    showPunctuation: false,
    showNumbers: false,
  });

  const { 
    status, 
    words, 
    input, 
    isLoading, 
    stats, 
    wpmHistory, 
    loadTest, 
    handleInput, 
    restart 
  } = useTypingEngine(settings);

  // Initialize
  useEffect(() => { loadTest(); }, [loadTest]);

  // Focus Management
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    if (!isLoading && status !== 'completed') focusInput();
    
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [isLoading, status]);

  if (status === "completed") {
    return (
      <Result 
        testResults={{
          ...stats,
          totalWords: words.length,
          wpmHistory
        }}
        onTryAgain={restart}
        onNewTest={restart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground  flex flex-col transition-colors duration-500 pt-28">
      <Navigation />

      {/* --- Toolbar --- */}
     <div
  className={`
   top-24 z-20 w-full flex justify-center py-6
  transition-all duration-500 ease-in-out
  ${status === "running"
    ? "opacity-30 -translate-y-2 pointer-events-none"
    : "opacity-100 translate-y-0"}
  `}
>
  <div
    className="
      relative
      flex items-center  gap-6 px-10 py-3
      rounded-2xl
      bg-background/60
      backdrop-blur-2xl
      border border-border/40
      shadow-[0_20px_60px_rgba(0,0,0,0.18)]
      transition-all duration-300 ease-out
      hover:shadow-[0_28px_80px_rgba(0,0,0,0.25)]
    "
  >
    <span className="
      pointer-events-none absolute inset-x-6 -top-px h-px
      bg-gradient-to-r from-transparent via-border to-transparent
    " />

    {/* Group 1: Toggles */}
  <div className="relative flex items-center  gap-2 p-1.5 rounded-xl bg-muted/30 border border-border/40">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSettings((s) => ({ ...s, showPunctuation: !s.showPunctuation }))}
      className={`
        h-9 w-12 rounded-md 
        transition-all duration-200
        ${settings.showPunctuation
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"}
        data-[state=on]:scale-[1.03]
        active:scale-[0.97]
      `}
    >
      <Hash className="w-4 h-4" strokeWidth={settings.showPunctuation ? 2.5 : 2} />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSettings((s) => ({ ...s, showNumbers: !s.showNumbers }))}
      className={`
        h-9 w-12 rounded-md
        transition-all duration-200
        ${settings.showNumbers
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"}
        data-[state=on]:scale-[1.03]
        active:scale-[0.97]
      `}
    >
      <Type className="w-4 h-4" strokeWidth={settings.showNumbers ? 2.5 : 2} />
    </Button>
  </div>

    {/* Divider */}
    <div className="w-px h-6 bg-border/60 mx-2" />

    {/* Group 2: Mode Selectors */}
    <div className="flex items-center gap-5">
      
      {/* Time Selector */}
      <Select
        value={settings.timeLimit ? settings.timeLimit.toString() : "placeholder"}
        onValueChange={(v) =>
          setSettings((s) => ({ ...s, timeLimit: parseInt(v), wordLimit: null }))
        }
      >
        <SelectTrigger
          className={`
            h-9 min-w-[72px] px-3 gap-2
            rounded-md
            border border-border/60
            bg-transparent
            text-sm font-medium
            text-foreground
            shadow-none
            transition-all duration-200
            hover:border-border
            hover:bg-muted/30
            focus:outline-none focus:ring-0 focus:ring-offset-0
            data-[state=open]:border-border
            data-[state=open]:bg-muted/40
          `}
        >
          <Clock className="w-4 h-4 text-muted-foreground" />
          {/* If a time is set, show the number, otherwise show label 'Time' */}
          <span className="tracking-wide">{settings.timeLimit ? `${settings.timeLimit}s` : "Time"}</span>
        </SelectTrigger>
        <SelectContent align="center" className="min-w-[5rem]">
          <SelectItem value="15">15s</SelectItem>
          <SelectItem value="30">30s</SelectItem>
          <SelectItem value="60">60s</SelectItem>
        </SelectContent>
      </Select>

      {/* Words Selector */}
      <Select
        value={settings.wordLimit ? settings.wordLimit.toString() : "placeholder"}
        onValueChange={(v) =>
          setSettings((s) => ({ ...s, wordLimit: parseInt(v), timeLimit: null }))
        }
      >
        <SelectTrigger
          className={`
            h-9 min-w-[84px] px-3 gap-2
            rounded-md
            border border-border/60
            bg-transparent
            text-sm font-medium
            text-foreground
            shadow-none
            transition-all duration-200
            hover:border-border
            hover:bg-muted/30
            focus:outline-none focus:ring-0 focus:ring-offset-0
            data-[state=open]:border-border
            data-[state=open]:bg-muted/40
          `}
        >
          <span className="tracking-wide">
            {settings.wordLimit ? `${settings.wordLimit}` : "Words"}
          </span>
        </SelectTrigger>
        <SelectContent align="center" className="min-w-[5rem]">
          <SelectItem value="25">25 words</SelectItem>
          <SelectItem value="50">50 words</SelectItem>
          <SelectItem value="100">100 words</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</div>

      {/* --- Main Area --- */}
      <main className="flex-1 flex flex-col font-mono items-center justify-center relative px-4 sm:px-8">
        
        {/* Live Timer / WPM Indicator */}
        <div className="h-12 mb-8 text-primary font-bold text-2xl tracking-widest tabular-nums">
          {status === 'running' && (
             settings.timeLimit ? stats.timeLeft : `${stats.netWpm} WPM`
          )}
        </div>

        {/* Text Display Container */}
        <div 
          className="relative w-full max-w-4xl min-h-[160px] text-2xl sm:text-3xl leading-relaxed outline-none"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-wrap gap-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded-md w-full opacity-20" />
              ))}
            </div>
          )}

          {/* Actual Text */}
          {!isLoading && (
            <div className={`break-words select-none transition-opacity duration-200 ${!isFocused ? "blur-sm opacity-50" : "opacity-100"}`}>
              {words.map((char, i) => {
                const isCurrent = i === input.length;
                const isTyped = i < input.length;
                const isCorrect = isTyped && input[i] === char;
                const isWrong = isTyped && input[i] !== char;

                return (
                  <span key={i} className="relative">
                    {/* The Cursor */}
                    {isCurrent && isFocused && (
                      <span className="absolute -left-[2px] top-1 bottom-1 w-[2px] bg-primary animate-pulse rounded-full" />
                    )}
                    
                    {/* The Character */}
                    <span className={`
                      ${isCurrent ? 'text-foreground underline decoration-primary/30' : ''}
                      ${isCorrect ? 'text-foreground' : ''}
                      ${isWrong ? 'text-destructive' : ''}
                      ${!isTyped && !isCurrent ? 'text-muted-foreground/40' : ''}
                      transition-colors duration-100
                    `}>
                      {char}
                    </span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Focus Overlay */}
          {!isFocused && !isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer">
              <span className="bg-background/80 backdrop-blur text-muted-foreground px-4 py-2 rounded-lg text-sm font-medium border border-border shadow-lg animate-in fade-in zoom-in-95">
                Click or Press any key to focus
              </span>
            </div>
          )}
        </div>

        {/* Restart Action */}
        <div className="mt-16">
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={restart}
            className="group text-muted-foreground hover:text-foreground transition-all hover:bg-transparent"
          >
            <RotateCcw className="w-5 h-5 mr-2 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="group-hover:tracking-wider transition-all">Restart Test</span>
          </Button>
        </div>

        <div className="absolute bottom-4 text-xs text-muted-foreground/30 font-medium">
          TAB + ENTER to restart
        </div>

      </main>

      <Footer isLoggedIn={true} />
    </div>
  );
}