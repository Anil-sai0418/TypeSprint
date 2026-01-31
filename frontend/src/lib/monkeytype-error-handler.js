/**
 * Monkeytype-Accurate Error Handler & WPM Calculator
 * 
 * CORE PRINCIPLES:
 * 1. Errors are tracked but do NOT directly reduce WPM
 * 2. Errors consume time naturally (correction time)
 * 3. Accuracy = correct_chars / total_chars (separate from WPM graph)
 * 4. WPM graph shows RAW keystroke throughput only
 * 5. Error visualization is an overlay, not a calculation factor
 */

/**
 * Track a complete keystroke event
 * 
 * @param {number} timestamp - Date.now() when key was pressed
 * @param {string} expectedCharacter - What should have been typed
 * @param {string} typedCharacter - What was actually typed
 * @param {boolean} isBackspace - Whether this was a backspace
 * @returns {Object} Complete keystroke record
 */
export function trackKeystroke(timestamp, expectedCharacter, typedCharacter, isBackspace = false) {
  return {
    timestamp,
    expectedCharacter,
    typedCharacter,
    isCorrect: expectedCharacter === typedCharacter,
    isBackspace,
    isError: !isBackspace && expectedCharacter !== typedCharacter
  };
}

/**
 * Calculate RAW WPM for a bucket of characters
 * Formula: RAW_WPM = (charactersTyped / 5) * 60
 * 
 * Includes ALL characters (correct, wrong, backspaces)
 * This is keystroke throughput, not accuracy-adjusted
 * 
 * @param {number} characterCount
 * @returns {number} Raw WPM
 */
function calculateRawWPM(characterCount) {
  return (characterCount / 5) * 60;
}

/**
 * Apply moving average smoothing
 * Creates smooth graph without artificial penalty
 * 
 * @param {number[]} wpmArray
 * @param {number} windowSize
 * @returns {number[]}
 */
function applySmoothingFilter(wpmArray, windowSize = 3) {
  if (wpmArray.length === 0) return [];
  
  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < wpmArray.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = i - halfWindow; j <= i + halfWindow; j++) {
      if (j >= 0 && j < wpmArray.length) {
        sum += wpmArray[j];
        count++;
      }
    }

    smoothed.push(count > 0 ? sum / count : wpmArray[i]);
  }

  return smoothed;
}

/**
 * Generate WPM graph data with error markers
 * 
 * IMPORTANT: WPM line is unaffected by accuracy
 * Errors are tracked separately as visual indicators
 * 
 * @param {Array} keystrokes - All keystroke objects
 * @param {number} startTime - Test start time (ms)
 * @returns {Array} Chart data: [{ time, wpm, raw, hasError }, ...]
 */
export function generateWPMGraphData(keystrokes, startTime) {
  if (!keystrokes || keystrokes.length === 0) {
    return [];
  }

  // Bucket keystrokes by 1-second intervals
  const relativeKeystrokes = keystrokes.map(k => ({
    secondBucket: Math.floor((k.timestamp - startTime) / 1000),
    isCorrect: k.isCorrect,
    isError: k.isError,
    isBackspace: k.isBackspace
  }));

  const minBucket = 0;
  const maxBucket = Math.max(...relativeKeystrokes.map(k => k.secondBucket));

  // Count total characters per bucket (keystroke throughput)
  const buckets = {};
  for (let i = minBucket; i <= maxBucket; i++) {
    buckets[i] = 0;
  }

  relativeKeystrokes.forEach(keystroke => {
    buckets[keystroke.secondBucket]++;
  });

  // Track errors per bucket (for visualization only)
  const errorBuckets = {};
  for (let i = minBucket; i <= maxBucket; i++) {
    errorBuckets[i] = [];
  }

  relativeKeystrokes.forEach(keystroke => {
    if (keystroke.isError) {
      errorBuckets[keystroke.secondBucket].push(keystroke);
    }
  });

  // Calculate raw WPM per bucket
  const rawWPMs = [];
  for (let i = minBucket; i <= maxBucket; i++) {
    const characterCount = buckets[i];
    const rawWPM = calculateRawWPM(characterCount);
    rawWPMs.push(rawWPM);
  }

  // Apply smoothing
  const smoothedWPMs = applySmoothingFilter(rawWPMs, 3);

  // Generate chart data
  const chartData = smoothedWPMs.map((wpm, index) => ({
    time: index,
    wpm: Math.round(wpm),
    raw: Math.round(rawWPMs[index]),
    hasError: errorBuckets[minBucket + index].length > 0 ? 1 : 0,
    errorCount: errorBuckets[minBucket + index].length,
    secondBucket: minBucket + index
  }));

  return chartData;
}

/**
 * Calculate accuracy (for final results only)
 * 
 * MONKEYTYPE LOGIC:
 * - accuracy = (correct_characters / total_characters) * 100
 * - backspaces do NOT affect accuracy
 * - errors are permanent (backspace doesn't delete error count)
 * - only the final accuracy matters
 * 
 * @param {Array} keystrokes - All keystroke objects
 * @returns {number} Accuracy percentage (0-100)
 */
export function calculateAccuracy(keystrokes) {
  if (!keystrokes || keystrokes.length === 0) return 100;

  // Count correct characters
  const correctCount = keystrokes.filter(k => k.isCorrect && !k.isBackspace).length;
  
  // Count total characters (excluding backspaces)
  const totalCount = keystrokes.filter(k => !k.isBackspace).length;

  if (totalCount === 0) return 100;

  const accuracy = (correctCount / totalCount) * 100;
  return Math.round(accuracy);
}

/**
 * Calculate total errors (for stats display)
 * 
 * Each incorrect character typed = 1 error
 * Backspaces do NOT remove error count
 * 
 * @param {Array} keystrokes
 * @returns {number} Total errors
 */
export function calculateTotalErrors(keystrokes) {
  if (!keystrokes || keystrokes.length === 0) return 0;

  return keystrokes.filter(k => k.isError).length;
}

/**
 * Get current raw WPM (for live display during test)
 * 
 * @param {Array} keystrokes
 * @param {number} startTime
 * @param {number} currentTime
 * @returns {number} Current raw WPM
 */
export function getCurrentRawWPM(keystrokes, startTime, currentTime) {
  if (!keystrokes || keystrokes.length === 0) return 0;

  const elapsedSeconds = (currentTime - startTime) / 1000;
  if (elapsedSeconds < 0.1) return 0;

  const wordsTyped = keystrokes.length / 5;
  const rawWPM = (wordsTyped / elapsedSeconds) * 60;

  return Math.round(rawWPM);
}

/**
 * Calculate final WPM (for results)
 * 
 * MONKEYTYPE LOGIC:
 * FINAL_WPM = RAW_WPM * ACCURACY_MULTIPLIER
 * where ACCURACY_MULTIPLIER = accuracy / 100
 * 
 * This naturally accounts for correction time
 * 
 * @param {number} rawWPM
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @returns {number} Final WPM
 */
export function calculateFinalWPM(rawWPM, accuracy) {
  return Math.round(rawWPM * (accuracy / 100));
}

/**
 * Calculate statistics from a complete test
 * 
 * @param {Array} keystrokes - All keystroke objects
 * @param {number} startTime - Test start time (ms)
 * @param {number} endTime - Test end time (ms)
 * @returns {Object} Complete statistics
 */
export function calculateTestStats(keystrokes, startTime, endTime) {
  const elapsedSeconds = (endTime - startTime) / 1000;

  // Count characters by type
  const correctCount = keystrokes.filter(k => k.isCorrect && !k.isBackspace).length;
  const totalCount = keystrokes.filter(k => !k.isBackspace).length;
  const errorCount = keystrokes.filter(k => k.isError).length;
  const backspaceCount = keystrokes.filter(k => k.isBackspace).length;

  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 100;
  const rawWPM = elapsedSeconds > 0 ? ((totalCount / 5) / (elapsedSeconds / 60)) : 0;
  const finalWPM = rawWPM * (accuracy / 100);

  return {
    rawWPM: Math.round(rawWPM),
    finalWPM: Math.round(finalWPM),
    accuracy: Math.round(accuracy),
    correctChars: correctCount,
    totalChars: totalCount,
    errors: errorCount,
    backspaces: backspaceCount,
    timeElapsed: Math.round(elapsedSeconds)
  };
}
