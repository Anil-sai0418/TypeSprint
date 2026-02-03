const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Capitalization utilities
const convertToCase = (text, mode) => {
  switch (mode) {
    case 'lowercase':
      return text.toLowerCase();
    case 'uppercase':
      return text.toUpperCase();
    case 'normal': // Preserve original capitalization
      return text;
    default:
      return text;
  }
};

// GET /random-text - Get random typing text (OPTIMIZED WITH NO REPEATED WORDS)
router.get("/random-text", (req, res) => {
  try {
    const { 
      wordLimit = 50, 
      includePunctuation = 'false', 
      includeNumbers = 'false',
      case: caseMode = 'normal'
    } = req.query;

    // Efficient boolean conversion
    const hasPunctuation = includePunctuation === 'true';
    const hasNumbers = includeNumbers === 'true';
    const limit = Math.min(parseInt(wordLimit), 500);

    // Large word bank to avoid repetition
    const COMMON_WORDS = [
      "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on",
      "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we",
      "say", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
      "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
      "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year",
      "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look",
      "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how",
      "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these",
      "give", "day", "most", "us", "is", "was", "are", "been", "being", "has", "had", "does",
      "did", "should", "could", "would", "may", "might", "must", "can", "am", "such", "should",
      "each", "both", "own", "very", "great", "much", "last", "long", "high", "low", "best",
      "true", "false", "more", "less", "many", "few", "all", "none", "some", "right", "wrong",
      "fast", "slow", "hard", "easy", "strong", "weak", "big", "small", "hot", "cold", "old",
      "young", "new", "good", "bad", "happy", "sad", "kind", "mean", "bright", "dark", "light",
      "dark", "short", "tall", "fat", "thin", "clean", "dirty", "wet", "dry", "full", "empty",
      "live", "die", "begin", "end", "start", "stop", "go", "come", "leave", "stay", "sit",
      "stand", "walk", "run", "jump", "fall", "fly", "swim", "drive", "ride", "dance", "sing",
      "speak", "talk", "listen", "hear", "see", "watch", "look", "read", "write", "think",
      "feel", "know", "learn", "teach", "understand", "remember", "forget", "sleep", "wake",
      "eat", "drink", "cook", "buy", "sell", "pay", "cost", "price", "money", "rich", "poor"
    ];

    // Generate unique words - no repetition
    const generatedWords = [];
    const used = new Set();

    while (generatedWords.length < limit) {
      const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
      
      // Ensure no repetition
      if (!used.has(randomWord)) {
        generatedWords.push(randomWord);
        used.add(randomWord);
      } else {
        // If we've used this word, pick another
        let attempts = 0;
        while (attempts < 5) {
          const altWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
          if (!used.has(altWord)) {
            generatedWords.push(altWord);
            used.add(altWord);
            break;
          }
          attempts++;
        }
      }
    }

    let wordArray = generatedWords.slice(0, limit);
    
    // OPTIMIZATION: Process case conversion only once
    if (caseMode !== 'normal') {
      wordArray = wordArray.map(word => convertToCase(word, caseMode));
    }

    // OPTIMIZATION: Build text once instead of string concatenation
    let text = wordArray.join(' ');

    // Remove trailing punctuation when not requested
    if (!hasPunctuation) {
      text = text.replace(/[.,!?;:—–-]+$/g, '');
    }

    // Add punctuation naturally (end of sentence)
    if (hasPunctuation) {
      const punctuationMarks = ['.', '!', '?'];
      const randomPunct = punctuationMarks[Math.floor(Math.random() * 3)];
      text += randomPunct;
    }

    // Add numbers naturally (at beginning or mixed)
    if (hasNumbers) {
      // OPTIMIZATION: Only add numbers if not already present
      if (!/\d/.test(text)) {
        const numbers = Math.floor(Math.random() * 1000);
        text = `${numbers} ${text}`;
      }
    }

    // Calculate word count efficiently
    const finalWordCount = text.split(/\s+/).length;

    res.send({
      success: true,
      text: text,
      wordCount: finalWordCount,
      metadata: {
        hasPunctuation,
        hasNumbers,
        caseMode,
        requestedLimit: limit,
        actualWords: finalWordCount
      }
    });
  } catch (err) {
    console.error('Random text generation error:', err);
    res.status(500).send({ 
      success: false, 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal error'
    });
  }
});

module.exports = router;
