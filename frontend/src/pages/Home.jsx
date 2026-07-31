import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { RotateCcw, Type, Clock, Hash, AlignLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Navigation from "@/components/ui/Navigation";
import Footer from "./Footer";
import Result from "./Result";
import { useTranslation } from "react-i18next";
import { fetchRandomText } from "../services/api";
import MonkeytypeTextDisplay from "../components/MonkeytypeTextDisplay";
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
  const loadedSettingsKeyRef = useRef("");
  const isFetchingRef = useRef(false);

  // Fetch text based on active settings (Time Mode vs Words Mode)
  const loadTest = useCallback(async (force = false) => {
    const { timeLimit, wordLimit, showPunctuation, showNumbers } = settings;
    const settingsKey = `${timeLimit}_${wordLimit}_${showPunctuation}_${showNumbers}`;

    // Prevent duplicate fetch for identical settings or while already fetching
    if (!force && (isFetchingRef.current || (loadedSettingsKeyRef.current === settingsKey && words.length > 0))) {
      return;
    }

    isFetchingRef.current = true;
    loadedSettingsKeyRef.current = settingsKey;

    setIsLoading(true);
    setStatus("idle");
    setWpmHistory([]);
    setInput("");
    setStartTime(null);
    setEndTime(null);
    keystrokesRef.current = [];
    statsRef.current = { totalCorrect: 0, totalError: 0 };

    try {
      // In time mode, fetch a large word pool (250 words) so text never runs out early
      const fetchCount = timeLimit ? 250 : (wordLimit || 50);
      const data = await fetchRandomText(fetchCount, showPunctuation.toString(), showNumbers.toString());
      if (data && data.text) {
        setWords(data.text.split("")); 
      }
    } catch (e) {
      console.error('Failed to fetch random text:', e);
      setWords("Error loading text. Please check your connection.".split(""));
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [settings, words.length]);

  const restart = useCallback(() => {
    loadTest(true);
  }, [loadTest]);

  const retype = useCallback(() => {
    setStatus("idle");
    setWpmHistory([]);
    setInput("");
    setStartTime(null);
    setEndTime(null);
    keystrokesRef.current = [];
    statsRef.current = { totalCorrect: 0, totalError: 0 };
  }, []);

  // Timer for Time Mode
  useEffect(() => {
    if (status !== "running" || !settings.timeLimit) return;

    const checkTimeLimit = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= settings.timeLimit) {
        if (timerRef.current) clearInterval(timerRef.current);
        const graphData = generateWPMGraphData(keystrokesRef.current, startTime);
        setWpmHistory(graphData);
        setStatus("completed");
        setEndTime(Date.now());
      }
    };

    timerRef.current = setInterval(checkTimeLimit, 250);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, startTime, settings.timeLimit]);

  const startTest = useCallback(() => {
    if (status === "idle") {
      setStatus("running");
      setStartTime(Date.now());
      keystrokesRef.current = [];
      statsRef.current = { totalCorrect: 0, totalError: 0 };
    }
  }, [status]);

  // Handle Keystroke Input
  const handleInput = useCallback((val) => {
    if (status === "completed" || isLoading) return;
    if (status === "idle") startTest();

    const prevLength = input.length;
    const currentLength = val.length;

    if (currentLength > prevLength) {
      const newKeystrokes = [];
      for (let i = prevLength; i < currentLength; i++) {
        const typedChar = val[i];
        const expectedChar = words[i] || '';
        const keystroke = trackKeystroke(Date.now(), expectedChar, typedChar, false);
        newKeystrokes.push(keystroke);
        
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

    // Automatic submission ONLY in Words Mode (Time mode relies strictly on timer expiry)
    if (!settings.timeLimit && settings.wordLimit) {
      const fullText = words.join("");
      if (fullText.length > 0) {
        const targetWordsList = fullText.split(" ");
        const typedWordsList = val.split(" ");
        const isLastWord = typedWordsList.length >= targetWordsList.length;
        const lastTypedWord = typedWordsList[typedWordsList.length - 1] || "";
        const lastTargetWord = targetWordsList[targetWordsList.length - 1] || "";

        const isFinished = isLastWord && (
          lastTypedWord.length >= lastTargetWord.length || 
          val.endsWith(" ") ||
          val.length >= words.length
        );

        if (isFinished) {
          const graphData = generateWPMGraphData(keystrokesRef.current, startTime);
          setWpmHistory(graphData);
          setStatus("completed");
          setEndTime(Date.now());
        }
      }
    }
  }, [status, isLoading, input.length, words, startTest, startTime, settings]);

  // OPTIMIZATION: Memoized stats calculation - only recompute on ref or status change
  const stats = useMemo(() => {
    if (keystrokesRef.current.length === 0 || !startTime) {
      return {
        netWpm: 0,
        rawWpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        correctWords: 0,
        incorrectWords: 0,
        totalWords: 0,
        errors: 0,
        timeElapsed: 0,
        timeLeft: settings.timeLimit || null
      };
    }

    const currentTime = status === "completed" ? endTime : Date.now();
    const timeElapsed = Math.max(1, (currentTime - startTime) / 1000); 

    // Character stats
    const totalTyped = keystrokesRef.current.filter(k => !k.isBackspace).length;
    const correctCount = statsRef.current.totalCorrect;
    const errorCount = statsRef.current.totalError;

    const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
    const rawWpm = Math.round(((totalTyped / 5) / (timeElapsed / 60)));
    const netWpm = Math.round(rawWpm * (accuracy / 100));

    // Word stats (Monkeytype logic: word is correct if ALL chars in it match)
    const originalText = words.join("");
    const typedText = input;
    
    const originalWords = originalText.split(" ");
    const typedWords = typedText.trim().split(/\s+/);
    
    let correctWords = 0;
    let incorrectWords = 0;
    
    // We only evaluate words the user has actually finished (space pressed or end of text)
    // If the test ended via time limit, the last word might be partial
    typedWords.forEach((typedWord, idx) => {
      if (idx < originalWords.length) {
        if (typedWord === originalWords[idx]) {
          correctWords++;
        } else {
          incorrectWords++;
        }
      }
    });

    return {
      netWpm,
      rawWpm,
      accuracy,
      correctChars: correctCount,
      incorrectChars: totalTyped - correctCount,
      correctWords,
      incorrectWords,
      totalWords: originalWords.length,
      errors: errorCount,
      totalTimeTaken: Math.round(timeElapsed),
      timeLeft: settings.timeLimit ? Math.max(0, Math.round(settings.timeLimit - timeElapsed)) : null
    };
  }, [startTime, endTime, status, settings.timeLimit, words, input]); 

  return {
    status,
    words,
    input,
    isLoading,
    stats,
    wpmHistory,
    loadTest,
    handleInput,
    restart: loadTest,
    retype,
    keystrokes: keystrokesRef.current
  };
};

// --- COMPONENT: Main Page ---

export default function TypingTest() {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);
  const DEFAULT_SETTINGS = useMemo(() => ({
    mode: 'time',
    timeLimit: 30,
    wordLimit: null,
    showPunctuation: false,
    showNumbers: false,
  }), []);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("monkeytype_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          mode: parsed.wordLimit ? 'words' : 'time',
          timeLimit: parsed.timeLimit || (parsed.wordLimit ? null : 30),
          wordLimit: parsed.wordLimit || null,
          showPunctuation: Boolean(parsed.showPunctuation),
          showNumbers: Boolean(parsed.showNumbers),
        };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((newPartial) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem("monkeytype_settings", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save settings:", e);
      }
      return updated;
    });
  }, []);

  const { 
    status, 
    words, 
    input, 
    isLoading, 
    stats, 
    wpmHistory, 
    loadTest, 
    handleInput, 
    restart,
    retype,
    keystrokes
  } = useTypingEngine(settings);

  const isToolbarLocked = status === "running" && input.length > 0;

  // --- OPTIMIZATION: Toolbar Visibility & Animation State ---
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayInput, setReplayInput] = useState("");
  const toolbarRef = useRef(null);
  
  const displayInput = isReplaying ? replayInput : input;

  useEffect(() => {
    // Only animate when the toolbar is actually in the viewport
    const observer = new IntersectionObserver(
      ([entry]) => setIsToolbarVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (toolbarRef.current) observer.observe(toolbarRef.current);

    const handleVisibilityChange = () => setIsToolbarVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const shouldAnimateBorder = isToolbarVisible && !isToolbarLocked;

  // Replay Logic
  useEffect(() => {
    let timeoutId;
    if (isReplaying && keystrokes && keystrokes.length > 0) {
      const runReplay = async () => {
        let currentString = "";
        
        for (let i = 0; i < keystrokes.length; i++) {
          if (!isReplaying) break; // Check if stopped
          
          const stroke = keystrokes[i];
          let delay = (i === 0) ? 0 : (stroke.timestamp - keystrokes[i-1].timestamp);
          
          // Cap the delay to a maximum of 1.5 seconds to keep the replay engaging
          delay = Math.min(delay, 1500);
          
          if (delay > 0) {
            await new Promise(resolve => {
              timeoutId = setTimeout(resolve, delay);
            });
          }
          
          if (!isReplaying) break;

          if (stroke.isBackspace) {
            currentString = currentString.slice(0, -1);
          } else {
            currentString += stroke.typedCharacter || ""; // Use the correct property typedCharacter
          }
          setReplayInput(currentString);
        }
        
        // Wait a small moment then return to result
        if (isReplaying) {
          timeoutId = setTimeout(() => setIsReplaying(false), 1500);
        }
      };
      
      runReplay();
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else if (isReplaying) {
      // Nothing to replay, go back
      setIsReplaying(false);
    }
  }, [isReplaying, keystrokes]);

  // Initialize
  useEffect(() => { loadTest(); }, [loadTest]);

  // Focus Management
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    if (!isLoading && status !== 'completed') focusInput();
    
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [isLoading, status]);

  if (status === "completed" && !isReplaying) {
    return (
      <Result 
        testResults={{
          ...stats,
          timeTarget: settings.timeLimit,
          wpmHistory
        }}
        onTryAgain={retype}
        onNewTest={restart}
        onSettings={() => {}}
        onLeaderboard={() => {}}
        onReplay={() => setIsReplaying(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground  flex flex-col transition-colors duration-500 pt-28">
      <Navigation />

      {/* --- Toolbar --- */}
    <div
    className={`
     top-24 z-20 w-full flex justify-center py-6 px-4
    transition-all duration-500 ease-in-out
    ${isToolbarLocked
      ? "opacity-30 -translate-y-2 pointer-events-none"
      : "opacity-100 translate-y-0"}
    `}
  >
    {/* Authentic Polished Monkeytype Toolbar */}
    <div
      className="
        relative
        h-full w-full
        flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 sm:px-8 py-2.5
        rounded-[15px]
        bg-background/90
        backdrop-blur-2xl
        text-xs sm:text-sm font-mono font-medium
        text-muted-foreground
      "
    >
      {/* Group 1: Punctuation & Numbers Toggles */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => updateSettings({ showPunctuation: !settings.showPunctuation })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            settings.showPunctuation 
              ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 font-semibold shadow-xs' 
              : 'hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>punctuation</span>
        </button>

        <button
          type="button"
          onClick={() => updateSettings({ showNumbers: !settings.showNumbers })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            settings.showNumbers 
              ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 font-semibold shadow-xs' 
              : 'hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>numbers</span>
        </button>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-4 bg-border/60" />

      {/* Group 2: Mode Selectors (Time vs Words) */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => updateSettings({ mode: 'time', timeLimit: settings.timeLimit || 30, wordLimit: null })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            settings.mode === 'time'
              ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 font-semibold shadow-xs'
              : 'hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>time</span>
        </button>

        <button
          type="button"
          onClick={() => updateSettings({ mode: 'words', wordLimit: settings.wordLimit || 25, timeLimit: null })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            settings.mode === 'words'
              ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 font-semibold shadow-xs'
              : 'hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span>words</span>
        </button>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-4 bg-border/60" />

      {/* Group 3: Sub-Options (Pill Values) */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {settings.mode === 'time' ? (
          [15, 30, 60, 120].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => updateSettings({ timeLimit: val, wordLimit: null })}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                settings.timeLimit === val
                  ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10 shadow-xs'
                  : 'hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {val}
            </button>
          ))
        ) : (
          [10, 25, 50, 100].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => updateSettings({ wordLimit: val, timeLimit: null })}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                settings.wordLimit === val
                  ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10 shadow-xs'
                  : 'hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {val}
            </button>
          ))
        )}
      </div>
      </div>
    </div>

      {/* --- Main Area --- */}
      <main className="flex-1 flex flex-col font-mono items-center justify-center relative px-4 sm:px-8">
        
        {/* Live Timer / WPM Indicator */}
        <div className="h-12 mb-8 text-primary font-bold text-2xl tracking-widest tabular-nums">
          {settings.timeLimit ? (
            status !== "completed" ? stats.timeLeft : null
          ) : (
            status === "running" ? `${stats.netWpm} WPM` : null
          )}
        </div>

        {/* Text Display Container */}
        <div 
          className="relative w-full max-w-4xl min-h-40 text-2xl sm:text-3xl leading-relaxed outline-none"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-[92%] rounded-md" />
              <Skeleton className="h-8 w-[84%] rounded-md" />
            </div>
          )}

          {/* Actual Text */}
          {isReplaying && (
            <div className="absolute -top-12 left-0 right-0 flex justify-center z-50">
              <Button onClick={() => setIsReplaying(false)} variant="destructive" size="sm">
                Stop Replay
              </Button>
            </div>
          )}
          {!isLoading && (
            <MonkeytypeTextDisplay
              words={words}
              displayInput={displayInput}
              isFocused={isFocused}
              isReplaying={isReplaying}
              onFocusInput={() => inputRef.current?.focus()}
            />
          )}

          {/* Hidden Input */}
          {!isReplaying && (
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
          )}

          {/* Focus Overlay */}
          {!isFocused && !isLoading && !isReplaying && (
            <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer">
              <span className="bg-background/80 backdrop-blur text-muted-foreground px-4 py-2 rounded-lg text-sm font-medium border border-border shadow-lg animate-in fade-in zoom-in-95">
                {t('home.click_to_focus')}
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
            <span className="group-hover:tracking-wider transition-all">{t('home.restart_test')}</span>
          </Button>
        </div>

        <div className="absolute bottom-4 text-xs text-muted-foreground/30 font-medium">
          {t('home.tab_enter_restart')}
        </div>

      </main>

      <Footer isLoggedIn={true} />
    </div>
  );
}