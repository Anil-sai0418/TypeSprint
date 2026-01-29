import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"

const WORD_SETS = {
  common: [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "she",
    "or",
    "an",
    "will",
    "my",
    "one",
    "all",
    "would",
    "there",
    "their",
    "what",
    "so",
    "up",
    "out",
    "if",
    "about",
    "who",
    "get",
    "which",
    "go",
    "me",
    "when",
    "make",
    "can",
    "like",
    "time",
    "no",
    "just",
    "him",
    "know",
    "take",
    "people",
    "into",
    "year",
    "your",
    "good",
    "some",
    "could",
    "them",
    "see",
    "other",
    "than",
    "then",
    "now",
    "look",
    "only",
    "come",
    "its",
    "over",
    "think",
    "also",
    "back",
    "after",
    "use",
    "two",
    "how",
    "our",
    "work",
    "first",
  ],
  punctuation: [
    "hello,",
    "world!",
    "it's",
    "don't",
    "can't",
    "won't",
    "I'm",
    "you're",
    "we're",
    "they're",
    "isn't",
    "aren't",
    "wasn't",
    "weren't",
    "haven't",
    "hasn't",
    "hadn't",
    "wouldn't",
    "couldn't",
    "shouldn't",
    "let's",
    "that's",
    "what's",
    "where's",
    "when's",
    "why's",
    "how's",
    "here's",
    "there's",
    "he's",
    "she's",
    "it's",
    "we've",
    "you've",
    "they've",
    "I've",
  ],
}

// interface TestStats {
//   wpm: number
//   accuracy: number
//   errors: number
//   timeElapsed: number
// }

export default function TypingTest() {
  const [testMode, setTestMode] = useState("time")
  const [testDuration, setTestDuration] = useState(30)
  const [wordCount, setWordCount] = useState(50)
  const [includePunctuation, setIncludePunctuation] = useState(false)

  const [testText, setTestText] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState("")
  const [completedWords, setCompletedWords] = useState([])

  const [isTestActive, setIsTestActive] = useState(false)
  const [isTestComplete, setIsTestComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(testDuration)
  const [startTime, setStartTime] = useState(null)

  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    errors: 0,
    timeElapsed: 0,
  })

  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const generateTestText = useCallback(() => {
    const words = includePunctuation ? [...WORD_SETS.common, ...WORD_SETS.punctuation] : WORD_SETS.common

    const targetLength = testMode === "words" ? wordCount : 200
    const text = []

    for (let i = 0; i < targetLength; i++) {
      text.push(words[Math.floor(Math.random() * words.length)])
    }

    return text
  }, [testMode, wordCount, includePunctuation])

  const resetTest = useCallback(() => {
    setTestText(generateTestText())
    setCurrentWordIndex(0)
    setCurrentInput("")
    setCompletedWords([])
    setIsTestActive(false)
    setIsTestComplete(false)
    setTimeLeft(testDuration)
    setStartTime(null)
    setStats({ wpm: 0, accuracy: 0, errors: 0, timeElapsed: 0 })

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [generateTestText, testDuration])

  const calculateStats = useCallback(() => {
    if (!startTime) return

    const timeElapsed = (Date.now() - startTime) / 1000 / 60 // in minutes
    const totalChars = completedWords.join(" ").length
    const correctChars = completedWords.reduce((acc, word, index) => {
      const originalWord = testText[index] || ""
      let correct = 0
      for (let i = 0; i < Math.min(word.length, originalWord.length); i++) {
        if (word[i] === originalWord[i]) correct++
      }
      return acc + correct
    }, 0)

    const wpm = Math.round(correctChars / 5 / timeElapsed) || 0
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
    const errors = totalChars - correctChars

    setStats({ wpm, accuracy, errors, timeElapsed: timeElapsed * 60 })
  }, [startTime, completedWords, testText])

  const finishTest = useCallback(() => {
    setIsTestActive(false)
    setIsTestComplete(true)
    calculateStats()

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [calculateStats])

  const handleInputChange = (e) => {
    const value = e.target.value

    if (!isTestActive && value.length > 0) {
      setIsTestActive(true)
      setStartTime(Date.now())

      if (testMode === "time") {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              finishTest()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }

    if (value.endsWith(" ")) {
      const word = value.trim()
      setCompletedWords((prev) => [...prev, word])
      setCurrentWordIndex((prev) => prev + 1)
      setCurrentInput("")

      if (testMode === "words" && currentWordIndex + 1 >= wordCount) {
        finishTest()
      }
    } else {
      setCurrentInput(value)
    }
  }

  // eslint-disable-next-line no-unused-vars
  const getCharacterClass = (char, index, word) => {
    if (index >= currentInput.length) return "text-gray-400"
    if (currentInput[index] === char) return "text-green-500 bg-green-100"
    return "text-red-500 bg-red-100"
  }

  const getWordClass = (wordIndex) => {
    if (wordIndex < currentWordIndex) {
      const typedWord = completedWords[wordIndex] || ""
      const originalWord = testText[wordIndex] || ""
      return typedWord === originalWord ? "text-green-600" : "text-red-600"
    }
    if (wordIndex === currentWordIndex) return "bg-yellow-100 border-l-2 border-yellow-500 pl-1"
    return "text-gray-600"
  }

  useEffect(() => {
    resetTest()
  }, [resetTest])

  useEffect(() => {
    if (isTestActive) {
      calculateStats()
    }
  }, [completedWords, isTestActive, calculateStats])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">TypeSpeed</h1>
          <p className="text-gray-600">Test your typing speed and accuracy</p>
        </div>

        {/* Settings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex gap-2">
                <Button
                  variant={testMode === "time" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("time")}
                  disabled={isTestActive}
                >
                  Time
                </Button>
                <Button
                  variant={testMode === "words" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("words")}
                  disabled={isTestActive}
                >
                  Words
                </Button>
              </div>

              {testMode === "time" && (
                <div className="flex gap-2">
                  {[15, 30, 60, 120].map((duration) => (
                    <Button
                      key={duration}
                      variant={testDuration === duration ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTestDuration(duration)}
                      disabled={isTestActive}
                    >
                      {duration}s
                    </Button>
                  ))}
                </div>
              )}

              {testMode === "words" && (
                <div className="flex gap-2">
                  {[25, 50, 100].map((count) => (
                    <Button
                      key={count}
                      variant={wordCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWordCount(count)}
                      disabled={isTestActive}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              )}

              <Button
                variant={includePunctuation ? "default" : "outline"}
                size="sm"
                onClick={() => setIncludePunctuation(!includePunctuation)}
                disabled={isTestActive}
              >
                Punctuation
              </Button>

              <Button variant="outline" size="sm" onClick={resetTest} className="ml-auto bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(stats.wpm)}</div>
            <div className="text-sm text-gray-600">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(stats.accuracy)}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          {testMode === "time" && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{timeLeft}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          )}
          {testMode === "words" && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentWordIndex}/{wordCount}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
          )}
        </div>

        {/* Test Area */}
        {!isTestComplete ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-lg leading-relaxed font-mono min-h-[120px] max-w-full p-4 bg-gray-50 rounded-lg break-words whitespace-pre-wrap">
                  {testText.slice(0, 50).map((word, wordIndex) => (
                    <span key={wordIndex} className={`mr-2 ${getWordClass(wordIndex)}`}>
                      {wordIndex === currentWordIndex ? (
                        <>
                          {word.split("").map((char, charIndex) => (
                            <span key={charIndex} className={getCharacterClass(char, charIndex, word)}>
                              {char}
                            </span>
                          ))}
                        </>
                      ) : (
                        word
                      )}
                    </span>
                  ))}
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                  placeholder={isTestActive ? "Keep typing..." : "Start typing to begin the test..."}
                  disabled={isTestComplete}
                  autoFocus
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Results */
          <Card>
            <CardContent className="p-6 text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Test Complete!</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{Math.round(stats.wpm)}</div>
                  <div className="text-sm text-gray-600">Words per minute</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{Math.round(stats.accuracy)}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{stats.errors}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{Math.round(stats.timeElapsed)}</div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
              </div>

              <Button onClick={resetTest} size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
