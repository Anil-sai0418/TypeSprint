export const calculateWPM = (charCount, timeInSeconds, errors = 0) => {
  const minutes = timeInSeconds / 60;
  const words = charCount / 5;
  const rawWPM = words / minutes;
  const netWPM = rawWPM - (errors / minutes);
  const accuracy = Math.max(0, Math.min(100, ((charCount - errors) / charCount) * 100));
  
  return {
    raw: Math.max(0, Math.round(rawWPM)),
    wpm: Math.max(0, Math.round(netWPM)),
    accuracy: Math.round(accuracy * 100) / 100,
    characters: {
      total: charCount,
      correct: charCount - errors,
      incorrect: errors,
    }
  };
};

export const updateWPMHistory = (charCount, errors, timeElapsed) => {
  const testResults = calculateWPM(charCount, timeElapsed, errors);
  return {
    timestamp: new Date().toISOString(),
    time: timeElapsed,
    raw: testResults.raw,
    wpm: testResults.wpm,
    accuracy: testResults.accuracy,
    characters: testResults.characters,
    consistency: calculateConsistency(timeElapsed, charCount, errors),
  };
};

const calculateConsistency = (timeElapsed, charCount, errors) => {
  // Simple consistency calculation based on error rate over time
  const errorRate = errors / timeElapsed;
  const maxConsistency = 100;
  const consistency = Math.max(0, maxConsistency - (errorRate * 100));
  return Math.round(consistency * 100) / 100;
};