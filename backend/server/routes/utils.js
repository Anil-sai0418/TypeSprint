const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// GET /random-text - Get random typing text
router.get("/random-text", (req, res) => {
  try {
    const { wordLimit = 50, includePunctuation = false, includeNumbers = false } = req.query;

    // Convert string params to booleans
    const hasPunctuation = includePunctuation === 'true' || includePunctuation === true;
    const hasNumbers = includeNumbers === 'true' || includeNumbers === true;

    // Sample texts for random selection - LONGER texts to support 100 word selections
    const sampleTexts = [
      "The quick brown fox jumps over the lazy dog. Typing is an essential skill in todays digital world. Whether you are writing emails, coding, or creating documents, the ability to type quickly and accurately can significantly improve your productivity and efficiency. Many professionals spend hours each day typing, so investing time in improving your typing skills is worthwhile.",
      "Coding is like writing a story, each line adds to the narrative and builds upon the previous. In the world of technology, innovation is the key to success and continuous learning. Practice makes perfect, especially when it comes to typing and programming. Every expert was once a beginner who never gave up on their dreams and aspirations.",
      "The future belongs to those who believe in the beauty of their dreams and work tirelessly to achieve them. Success is not final, failure is not fatal. Life is ten percent what happens to you and ninety percent how you react to it. The only way to do great work is to love what you do.",
      "Your time is limited, so do not waste it living someone elses life. In order to write great code, you must first master the fundamentals of programming and practice consistently. The best way to predict the future is to invent it. Technology is best when it brings people together and helps them accomplish great things.",
      "Typing speed and accuracy are crucial skills for any professional in todays fast paced world. Whether you work in finance, marketing, or software development, your ability to type efficiently can make a significant difference in your career. The more you practice typing, the faster you will become. Consistency and dedication are key to improving your skills over time.",
      "Machine learning and artificial intelligence are transforming industries and changing the way we work. Cloud computing has revolutionized how companies store and process data. Cybersecurity is becoming increasingly important as more data is stored online. The internet of things is connecting devices and creating new opportunities for innovation and growth.",
      "Education is the most powerful weapon which you can use to change the world. Learning new skills opens doors to opportunities you never imagined. The journey of a thousand miles begins with a single step. Success comes to those who work hard and never give up on their goals.",
      "Design thinking is a problem solving methodology that focuses on understanding user needs. User experience design is critical to the success of any digital product. Mobile applications have changed how people interact with technology and access information. Data visualization helps us understand complex information and make better decisions.",
      "Photography is the art of capturing light and moments in time. The best camera is the one you have with you. Composition, lighting, and timing are essential elements of great photography. Post processing can enhance your images, but good photography starts with good fundamentals.",
      "Travel broadens the mind and exposes us to new cultures and perspectives. Exploring different countries teaches us about history, traditions, and ways of life. Every destination has unique attractions and experiences waiting to be discovered. The memories we create while traveling last a lifetime and shape who we become."
    ];

    // Select random text
    let selectedText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

    // Limit words
    const words = selectedText.split(" ").slice(0, parseInt(wordLimit));
    selectedText = words.join(" ");

    // Add punctuation if requested
    if (hasPunctuation && Math.random() > 0.5) {
      selectedText += "!";
    }

    // Add numbers if requested
    if (hasNumbers && Math.random() > 0.5) {
      selectedText = "123 " + selectedText;
    }

    res.send({
      success: true,
      text: selectedText,
      wordCount: selectedText.split(" ").length
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
