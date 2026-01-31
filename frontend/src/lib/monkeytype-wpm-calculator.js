/**
 * Monkeytype-style WPM Chart Calculator
 * 
 * This module handles:
 * 1. Real-time keystroke tracking with timestamps
 * 2. Time bucketing (1-second intervals)
 * 3. Raw WPM calculation per bucket
 * 4. Moving average smoothing for premium feel
 * 5. Accurate graph data generation
 */

/**
 * Calculate raw WPM for a bucket of characters
 * Formula: RAW_WPM = (charactersTyped / 5) * 60
 * 
 * @param {number} characterCount - Number of characters typed in the bucket
 * @returns {number} Raw WPM for that second
 */
function calculateRawWPM(characterCount) {
  return (characterCount / 5) * 60;
}

/**
 * Apply Moving Average smoothing to WPM data
 * Creates a premium, smooth graph by reducing zig-zag spikes
 * 
 * @param {number[]} wpmArray - Array of raw WPM values
 * @param {number} windowSize - Size of moving average window (3 or 5 recommended)
 * @returns {number[]} Smoothed WPM array
 */
function applySmoothingFilter(wpmArray, windowSize = 3) {
  if (wpmArray.length === 0) return [];
  
  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < wpmArray.length; i++) {
    let sum = 0;
    let count = 0;

    // Create window around current point
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
 * Process keystrokes into time buckets and calculate WPM
 * 
 * @param {Array} keystrokes - Array of keystroke objects
 *   Each object: { timestamp, isCorrect }
 * @param {number} startTime - When the test started (milliseconds)
 * @returns {Array} Chart data: [{ time, wpm }, ...]
 */
function generateWPMGraphData(keystrokes, startTime) {
  if (!keystrokes || keystrokes.length === 0) {
    return [];
  }

  // Convert to relative time (seconds from start)
  const relativeKeystrokes = keystrokes.map(k => ({
    secondBucket: Math.floor((k.timestamp - startTime) / 1000),
    isCorrect: k.isCorrect
  }));

  // Find the actual start and end time
  const minBucket = 0;
  const maxBucket = Math.max(...relativeKeystrokes.map(k => k.secondBucket));

  // Initialize buckets
  const buckets = {};
  for (let i = minBucket; i <= maxBucket; i++) {
    buckets[i] = 0;
  }

  // Assign keystrokes to buckets (count all characters, errors included)
  relativeKeystrokes.forEach(keystroke => {
    buckets[keystroke.secondBucket]++;
  });

  // Count errors per bucket
  const errorBuckets = {};
  for (let i = minBucket; i <= maxBucket; i++) {
    errorBuckets[i] = 0;
  }
  relativeKeystrokes.forEach(keystroke => {
    if (!keystroke.isCorrect) {
      errorBuckets[keystroke.secondBucket]++;
    }
  });

  // Calculate raw WPM for each bucket
  const rawWPMs = [];
  for (let i = minBucket; i <= maxBucket; i++) {
    const characterCount = buckets[i];
    const rawWPM = calculateRawWPM(characterCount);
    rawWPMs.push(rawWPM);
  }

  // Apply smoothing filter for premium feel
  const smoothedWPMs = applySmoothingFilter(rawWPMs, 3);

  // Generate chart data with both raw and smoothed WPM + error tracking
  const chartData = smoothedWPMs.map((wpm, index) => ({
    time: index,
    wpm: Math.round(wpm),
    raw: Math.round(rawWPMs[index]),
    errors: errorBuckets[minBucket + index],
    secondBucket: minBucket + index
  }));

  return chartData;
}

/**
 * Track a single keystroke during typing
 * Call this for EVERY keystroke during the test
 * 
 * @param {number} timestamp - Date.now() when key was pressed
 * @param {boolean} isCorrect - Whether the character matches the expected text
 * @returns {Object} Keystroke record
 */
function trackKeystroke(timestamp, isCorrect = true) {
  return {
    timestamp,
    isCorrect
  };
}

/**
 * Calculate final WPM (for test result, not for graph)
 * Formula: FINAL_WPM = RAW_WPM * ACCURACY
 * 
 * @param {number} rawWPM - Raw typing speed
 * @param {number} accuracy - Accuracy percentage (0-1)
 * @returns {number} Final WPM
 */
function calculateFinalWPM(rawWPM, accuracy) {
  return rawWPM * accuracy;
}

/**
 * Calculate accuracy from keystrokes
 * Formula: ACCURACY = CORRECT_CHARACTERS / TOTAL_CHARACTERS
 * 
 * @param {Array} keystrokes - Array of keystroke objects
 * @returns {number} Accuracy as percentage (0-100)
 */
function calculateAccuracy(keystrokes) {
  if (!keystrokes || keystrokes.length === 0) return 100;
  
  const correctCount = keystrokes.filter(k => k.isCorrect).length;
  const accuracy = (correctCount / keystrokes.length) * 100;
  
  return Math.round(accuracy);
}

/**
 * Get real-time WPM for display (updates once per second)
 * 
 * @param {Array} keystrokes - All keystrokes so far
 * @param {number} startTime - Test start time
 * @param {number} currentTime - Current time
 * @returns {number} Current WPM (unsmoothed)
 */
function getCurrentRawWPM(keystrokes, startTime, currentTime) {
  if (!keystrokes || keystrokes.length === 0) return 0;
  
  const elapsedSeconds = (currentTime - startTime) / 1000;
  if (elapsedSeconds < 0.1) return 0;

  const wordsTyped = keystrokes.length / 5;
  const rawWPM = (wordsTyped / elapsedSeconds) * 60;
  
  return Math.round(rawWPM);
}

export {
  generateWPMGraphData,
  trackKeystroke,
  calculateFinalWPM,
  calculateAccuracy,
  getCurrentRawWPM,
  calculateRawWPM,
  applySmoothingFilter
};
