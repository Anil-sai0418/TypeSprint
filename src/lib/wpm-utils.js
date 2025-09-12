

export const calculateWPM = (charCount, timeInSeconds, errors = 0) => {
  const minutes = timeInSeconds / 60;
  const words = charCount / 5; // Standard: 5 chars = 1 word
  const rawWPM = words / minutes;
  const netWPM = rawWPM - (errors / minutes);
  
  return {
    raw: Math.max(0, Math.round(rawWPM)),
    wpm: Math.max(0, Math.round(netWPM))
  };
};

export const updateWPMHistory = (charCount, errors, timeElapsed) => {
  const speeds = calculateWPM(charCount, timeElapsed, errors);
  return {
    time: timeElapsed,
    raw: speeds.raw,
    wpm: speeds.wpm
  };
};