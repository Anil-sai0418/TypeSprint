import React from 'react';
import { motion } from 'framer-motion';

export default function PerformanceBadge({ results }) {
  const getPerformanceLevel = () => {
    if (!results) return { level: "Unknown", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "⌨️" };
    const { netWpm, accuracy } = results;
    
    if (netWpm >= 80 && accuracy >= 98) 
      return { level: "Legendary", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: "👑", glow: "shadow-amber-500/20" };
    if (netWpm >= 60 && accuracy >= 95) 
      return { level: "Elite", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: "🏆", glow: "shadow-purple-500/20" };
    if (netWpm >= 40 && accuracy >= 90) 
      return { level: "Professional", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/30", icon: "⭐", glow: "shadow-indigo-500/20" };
    if (netWpm >= 25 && accuracy >= 80) 
      return { level: "Skilled", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: "✨", glow: "shadow-emerald-500/20" };
    
    return { level: "Pioneer", color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/30", icon: "⌨️", glow: "shadow-slate-500/20" };
  };

  const performance = getPerformanceLevel();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group flex items-center gap-4 px-8 py-3.5 rounded-full font-black text-xl mb-16 border-2 backdrop-blur-xl ${performance.bg} ${performance.color} ${performance.border} ${performance.glow} shadow-2xl overflow-hidden relative`}
    >
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      <span className="text-3xl drop-shadow-md">{performance.icon}</span>
      <span className="tracking-tight uppercase">{performance.level} SPEEDSTER</span>
    </motion.div>
  );
}
