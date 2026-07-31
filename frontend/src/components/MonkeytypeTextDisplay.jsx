import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Authentic Monkeytype-Style Typing Text Display
 * Features:
 * 1. Word-container based rendering (words never break mid-word across lines).
 * 2. Smoothly gliding animated Caret bar with pixel-perfect positioning.
 * 3. Uniform font weight & styling (zero bold distortion or background pill boxes).
 * 4. Clean error highlights without word-level bottom underlines.
 * 5. Smooth 3-line auto-scrolling container.
 */
export default function MonkeytypeTextDisplay({
  words = [],
  displayInput = '',
  isFocused = true,
  isReplaying = false,
  onFocusInput = () => {}
}) {
  const containerRef = useRef(null);
  const wordsWrapperRef = useRef(null);
  const activeCharRef = useRef(null);
  const activeWordRef = useRef(null);

  const [caretPos, setCaretPos] = useState({ left: 0, top: 4, height: 32 });
  const [isIdle, setIsIdle] = useState(false);
  const [scrollTopOffset, setScrollTopOffset] = useState(0);

  const idleTimerRef = useRef(null);

  // Parse raw text into structured words
  const fullText = useMemo(() => words.join(''), [words]);

  const targetWords = useMemo(() => {
    if (!fullText) return [];
    return fullText.split(' ');
  }, [fullText]);

  // Parse typed input into words
  const typedWords = useMemo(() => {
    return displayInput.split(' ');
  }, [displayInput]);

  const activeWordIndex = Math.max(0, typedWords.length - 1);
  const activeTypedWord = typedWords[activeWordIndex] || '';

  // Track user typing activity for caret idle animation (pulsing)
  useEffect(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 800);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [displayInput]);

  // Update Caret position and smooth scroll offset dynamically
  useEffect(() => {
    if (!activeCharRef.current && !activeWordRef.current) return;

    const animationFrame = requestAnimationFrame(() => {
      const wrapperEl = wordsWrapperRef.current;
      const activeCharEl = activeCharRef.current;
      const activeWordEl = activeWordRef.current;

      if (!wrapperEl) return;

      const wrapperRect = wrapperEl.getBoundingClientRect();

      if (activeCharEl) {
        const charRect = activeCharEl.getBoundingClientRect();
        const isEndPosition = activeCharEl.dataset.pos === 'end';
        const left = (isEndPosition ? charRect.right : charRect.left) - wrapperRect.left;
        const top = charRect.top - wrapperRect.top;
        const height = charRect.height || 32;

        setCaretPos({ left, top, height });

        // Auto-scroll when active word moves down lines
        if (activeWordEl) {
          const wordTop = activeWordEl.offsetTop;
          if (wordTop > 40) {
            setScrollTopOffset(wordTop - 40);
          } else {
            setScrollTopOffset(0);
          }
        }
      } else if (activeWordEl) {
        const wordRect = activeWordEl.getBoundingClientRect();
        const left = wordRect.right - wrapperRect.left;
        const top = activeWordEl.offsetTop;
        const height = wordRect.height || 32;

        setCaretPos({ left, top, height });

        if (activeWordEl.offsetTop > 40) {
          setScrollTopOffset(activeWordEl.offsetTop - 40);
        } else {
          setScrollTopOffset(0);
        }
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [displayInput, targetWords, activeWordIndex]);

  return (
    <div
      ref={containerRef}
      onClick={onFocusInput}
      className={`
        relative w-full max-w-4xl h-36 sm:h-40 overflow-hidden select-none font-mono text-2xl sm:text-3xl leading-relaxed cursor-text
        transition-opacity duration-200
        ${!isFocused && !isReplaying ? 'blur-[2px] opacity-50' : 'opacity-100'}
      `}
    >
      {/* Inner Scroll Wrapper */}
      <div
        ref={wordsWrapperRef}
        className="relative flex flex-wrap transition-transform duration-200 ease-out py-2"
        style={{
          transform: `translateY(-${scrollTopOffset}px)`
        }}
      >
        {/* Authentic Smooth Moving Caret */}
        {(isFocused || isReplaying) && (
          <div
            className={`
              absolute z-30 w-[2.5px] rounded-full bg-amber-400 dark:bg-amber-400
              shadow-[0_0_10px_rgba(251,191,36,0.8)]
              transition-all duration-75 ease-out pointer-events-none
              ${isIdle ? 'animate-pulse' : ''}
            `}
            style={{
              left: `${caretPos.left}px`,
              top: `${caretPos.top}px`,
              height: `${caretPos.height || 32}px`
            }}
          />
        )}

        {/* Word Containers */}
        {targetWords.map((targetWord, wIdx) => {
          const typedWord = typedWords[wIdx];
          const isCompletedWord = wIdx < activeWordIndex;
          const isActiveWord = wIdx === activeWordIndex;

          const targetChars = targetWord.split('');
          const typedChars = typedWord ? typedWord.split('') : [];

          // Extra letters typed past word length
          const extraChars = typedChars.slice(targetChars.length);

          return (
            <div
              key={wIdx}
              ref={isActiveWord ? activeWordRef : null}
              className="relative flex items-center mr-3.5 my-1"
            >
              {/* Target Characters */}
              {targetChars.map((targetChar, cIdx) => {
                const typedChar = typedChars[cIdx];
                const isCharTyped = typedChar !== undefined;
                const isCorrect = isCharTyped && typedChar === targetChar;
                const isIncorrect = isCharTyped && typedChar !== targetChar;

                // Caret position logic
                const isCaretOnLeft = isActiveWord && cIdx === activeTypedWord.length;
                const isCaretOnRight = isActiveWord &&
                  extraChars.length === 0 &&
                  activeTypedWord.length === targetChars.length &&
                  cIdx === targetChars.length - 1;

                const isTargetCharActive = isCaretOnLeft || isCaretOnRight;

                return (
                  <span
                    key={cIdx}
                    ref={isTargetCharActive ? activeCharRef : null}
                    data-pos={isCaretOnRight ? 'end' : 'start'}
                    className={`
                      relative transition-colors duration-100 font-normal
                      ${isCorrect ? 'text-zinc-900 dark:text-zinc-100' : ''}
                      ${isIncorrect ? 'text-red-500 dark:text-red-400' : ''}
                      ${!isCharTyped && isCompletedWord ? 'text-red-500/70 dark:text-red-400/70' : ''}
                      ${!isCharTyped && !isCompletedWord ? 'text-zinc-400/50 dark:text-zinc-600' : ''}
                    `}
                  >
                    {targetChar}
                  </span>
                );
              })}

              {/* Extra Incorrect Characters */}
              {extraChars.map((extraChar, eIdx) => {
                const isLastExtra = isActiveWord && (eIdx === extraChars.length - 1);
                return (
                  <span
                    key={`extra-${eIdx}`}
                    ref={isLastExtra ? activeCharRef : null}
                    data-pos="end"
                    className="text-red-700 dark:text-red-500 font-normal opacity-90 transition-colors duration-100"
                  >
                    {extraChar}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
