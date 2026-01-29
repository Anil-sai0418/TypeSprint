import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { RotateCcw, Type, Clock, Hash, AlignLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Navigation from "@/components/ui/Navagation";
import Footer from "./Footer";
import Result from "./Result";
import { fetchRandomText } from "../services/api";

// --- HOOK: Core Logic (Separated for cleanliness) ---
const useTypingEngine = (settings) => {
  const [status, setStatus] = useState("idle"); // idle, running, completed
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  // Fetch Text
  const loadTest = useCallback(async () => {
    setIsLoading(true);
    setStatus("idle");
    setWpmHistory([]);
    setInput("");
    setStartTime(null);
    setEndTime(null);

    try {
      const { wordLimit, showPunctuation, showNumbers } = settings;
      const data = await fetchRandomText(wordLimit, showPunctuation.toString(), showNumbers.toString());
      // Split by spaces to handle word-wrapping logic easier in UI if needed, 
      // but for now keeping it as a string is fine, or array of chars.
      setWords(data.text.split("")); 
    } catch (e) {
      console.error(e);
      setWords("Error loading text. Please check your connection.".split(""));
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Timer & WPM Tracker
  useEffect(() => {
    if (status === "running") {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        
        // Live WPM Calc
        const wordsTyped = input.length / 5;
        const currentWpm = Math.round(wordsTyped / (elapsed / 60));
        
        setWpmHistory(prev => [...prev, { time: Math.round(elapsed), wpm: currentWpm }]);

        // Time Limit Check
        if (settings.timeLimit && elapsed >= settings.timeLimit) {
          finishTest();
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [status, startTime, settings.timeLimit, input]);

  const startTest = () => {
    if (status === "idle") {
      setStatus("running");
      setStartTime(Date.now());
    }
  };

  const finishTest = () => {
    clearInterval(timerRef.current);
    setStatus("completed");
    setEndTime(Date.now());
  };

  const handleInput = (val) => {
    if (status === "completed" || isLoading) return;
    
    // Auto-start
    if (status === "idle") startTest();
    
    // Boundary check
    if (val.length > words.length) return;
    
    setInput(val);

    // Completion check
    if (val.length === words.length) {
      finishTest();
    }
  };

  // Derived Stats
  const stats = useMemo(() => {
    const timeElapsed = endTime ? (endTime - startTime) / 1000 : (Date.now() - startTime) / 1000;
    const correctChars = input.split('').filter((c, i) => c === words[i]).length;
    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
    const rawWpm = timeElapsed > 0 ? Math.round((input.length / 5) / (timeElapsed / 60)) : 0;
    const netWpm = Math.round(rawWpm * (accuracy / 100));

    return {
      netWpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars: input.length - correctChars,
      timeElapsed: Math.round(timeElapsed),
      timeLeft: settings.timeLimit ? Math.max(0, Math.round(settings.timeLimit - timeElapsed)) : null
    };
  }, [input, words, startTime, endTime, settings.timeLimit]);

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
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col transition-colors duration-500 pt-28">
      <Navigation />

      {/* --- Toolbar --- */}
     <div
  className={`
    sticky top-28 z-10 w-full flex justify-center py-8 transition-all duration-500 ease-in-out
    ${status === "running" ? "opacity-20 translate-y-[-10px] pointer-events-none" : "opacity-100 translate-y-0"}
  `}
>
  <div
    className="
      flex items-center gap-4 px-20 py-3
      bg-gradient-to-b from-background/80 to-background/40
      backdrop-blur-2xl
      border border-border/40
      ring-1 ring-black/5 dark:ring-white/10
      shadow-[0_10px_40px_rgba(0,0,0,0.15)]
      rounded-lg
      transition-all duration-300 ease-out
      hover:shadow-[0_14px_50px_rgba(0,0,0,0.25)]
    "
  >
    {/* Group 1: Toggles */}
  <div className="flex items-center bg-muted/60 backdrop-blur-md p-1 rounded-2xl shadow-inner border border-border/40">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSettings((s) => ({ ...s, showPunctuation: !s.showPunctuation }))}
      className={`
        h-9 w-14 rounded-xl transition-all duration-300
        ${
          settings.showPunctuation
            ? "bg-background text-foreground shadow-md scale-105"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
    >
      <Hash className="w-4 h-4" strokeWidth={settings.showPunctuation ? 2.5 : 2} />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSettings((s) => ({ ...s, showNumbers: !s.showNumbers }))}
      className={`
        h-9 w-14 rounded-xl transition-all duration-300
        ${
          settings.showNumbers
            ? "bg-background text-foreground shadow-md scale-105"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
    >
      <Type className="w-4 h-4" strokeWidth={settings.showNumbers ? 2.5 : 2} />
    </Button>
  </div>

    {/* Divider */}
    <div className="w-px h-5 bg-border/40 mx-1" />

    {/* Group 2: Mode Selectors */}
    <div className="flex items-center gap-3">
      
      {/* Time Selector */}
      <Select
        value={settings.timeLimit ? settings.timeLimit.toString() : "placeholder"}
        onValueChange={(v) =>
          setSettings((s) => ({ ...s, timeLimit: parseInt(v), wordLimit: null }))
        }
      >
        <SelectTrigger
          className={`
            h-8 gap-2 px-3 border-0 transition-all duration-300 rounded-full font-medium text-xs
            focus:ring-0 focus:ring-offset-0
            ${
              settings.timeLimit
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }
          `}
        >
           <Clock className="w-3.5 h-3.5 opacity-70" />
           {/* If a time is set, show the number, otherwise show label 'Time' */}
           <span>{settings.timeLimit ? `${settings.timeLimit}s` : "Time"}</span>
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
            h-8 gap-2 px-3 border-0 transition-all duration-300 rounded-full font-medium text-xs
            focus:ring-0 focus:ring-offset-0
            ${
              settings.wordLimit
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }
          `}
        >

          {/* If words are set, show the number, otherwise show label 'Words' */}
          <span>{settings.wordLimit ? `${settings.wordLimit}` : "Words"}</span>
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
      <main className="flex-1 flex flex-col items-center justify-center relative px-4 sm:px-8">
        
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