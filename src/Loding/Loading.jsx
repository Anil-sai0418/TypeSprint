import React from 'react';

const TypingLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex space-x-2">
        {/* Dot 1 */}
        <div className="h-4 w-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        {/* Dot 2 */}
        <div className="h-4 w-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        {/* Dot 3 */}
        <div className="h-4 w-4 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default TypingLoader;