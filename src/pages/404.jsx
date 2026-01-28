import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const searchedPath = window.location.pathname;

export default function NotFound() {
  const [displayPath, setDisplayPath] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [blinkCursor, setBlinkCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const path = `"${searchedPath}"`;
    
    const typeInterval = setInterval(() => {
      if (index < path.length) {
        setDisplayPath(path.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 100);

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setBlinkCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Typed searched path */}
        <p className="text-sm text-zinc-400 font-medium">
          You searched for:{' '}
          <span className="text-purple-500 font-mono">
            {displayPath}
            {isTyping && (
              <span
                className={`inline-block w-[2px] h-4 ml-1 bg-purple-500 align-middle ${
                  blinkCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </span>
        </p>

        {/* 404 */}
        <h1 className="text-[8rem] font-extrabold tracking-tight text-zinc-800 select-none">
          404
        </h1>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Page not found
          </h2>
          <p className="text-zinc-400 text-sm">
            The route you typed doesn’t exist.  
            Check your keystrokes or return to practice.
          </p>
        </div>

        {/* CTA */}
        <Link
          to="/"
          className="inline-block px-6 py-2 border border-zinc-700 text-sm font-medium text-white hover:bg-zinc-900 transition-colors rounded"
        >
          Back to typing
        </Link>

        {/* Footer hint */}
        <p className="text-[0.65rem] tracking-widest text-zinc-600">
          TYPING PLATFORM · 404
        </p>

      </div>
    </div>
  );
}