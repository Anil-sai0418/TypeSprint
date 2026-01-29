import React from 'react';
import { Zap } from 'lucide-react';

export default function PerformanceBadge({ results }) {
  const getPerformanceLevel = () => {
    if (!results) return { level: "--", color: "", bg: "" };
    const { netWpm, accuracy } = results;
    if (netWpm >= 60 && accuracy >= 95) 
      return { level: "Expert", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950", icon: "🏆" };
    if (netWpm >= 40 && accuracy >= 90) 
      return { level: "Advanced", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950", icon: "⭐" };
    if (netWpm >= 25 && accuracy >= 80) 
      return { level: "Intermediate", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950", icon: "✨" };
    return { level: "Beginner", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950", icon: "🚀" };
  };

  const performance = getPerformanceLevel();

  return (
    <div className={`${performance.bg} ${performance.color} px-8 py-3 rounded-full font-bold text-lg mb-12 shadow-lg border-2 border-current/20 flex items-center gap-3 backdrop-blur-sm`}>
      <span className="text-2xl">{performance.icon}</span>
      <span>{performance.level} Typist</span>
    </div>
  );
}
