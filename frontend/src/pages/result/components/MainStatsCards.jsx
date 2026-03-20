import React from 'react';
import { Zap, Clock, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const getColorClasses = (color) => {
  const colors = {
    indigo: { 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10', 
      icon: 'text-indigo-600 dark:text-indigo-400', 
      accent: 'bg-indigo-600',
      glow: 'shadow-indigo-500/20',
      border: 'border-indigo-100 dark:border-indigo-500/20'
    },
    amber: { 
      bg: 'bg-amber-50 dark:bg-amber-500/10', 
      icon: 'text-amber-600 dark:text-amber-400', 
      accent: 'bg-amber-600',
      glow: 'shadow-amber-500/20',
      border: 'border-amber-100 dark:border-amber-500/20'
    },
    rose: { 
      bg: 'bg-rose-50 dark:bg-rose-500/10', 
      icon: 'text-rose-600 dark:text-rose-400', 
      accent: 'bg-rose-600',
      glow: 'shadow-rose-500/20',
      border: 'border-rose-100 dark:border-rose-500/20'
    },
    emerald: { 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
      icon: 'text-emerald-600 dark:text-emerald-400', 
      accent: 'bg-emerald-600',
      glow: 'shadow-emerald-500/20',
      border: 'border-emerald-100 dark:border-emerald-500/20'
    }
  };
  return colors[color] || colors.indigo;
};

const StatCard = ({ icon: IconComponent, label, value, subValue, color, index }) => {
  const colorClasses = getColorClasses(color);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border ${colorClasses.border} shadow-xl ${colorClasses.glow} transition-shadow duration-300`}
    >
      {/* Decorative background element */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${colorClasses.accent} blur-2xl`} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${colorClasses.bg}`}>
            <IconComponent className={`w-5 h-5 ${colorClasses.icon}`} />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-wider uppercase">{label}</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {value}
          </span>
        </div>
        
        {subValue && (
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.accent}`} />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {subValue}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function MainStatsCards({ results }) {
  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="w-full max-w-6xl mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Zap}
          label="NET WPM"
          value={Math.round(results.netWpm)}
          subValue={`Raw Speed: ${Math.round(results.rawWpm)}`}
          color="indigo"
          index={0}
        />
        <StatCard
          icon={Target}
          label="ACCURACY"
          value={`${Math.round(results.accuracy)}%`}
          subValue="Typing Precision"
          color="amber"
          index={1}
        />
        <StatCard
          icon={Clock}
          label="TIME"
          value={formatTime(results.totalTimeTaken)}
          subValue={results.timeTarget ? `Target: ${results.timeTarget}s` : "Total Duration"}
          color="rose"
          index={2}
        />
        <StatCard
          icon={CheckCircle2}
          label="COMPLETED"
          value={results.correctWords}
          subValue={`of ${results.totalWords} words`}
          color="emerald"
          index={3}
        />
      </div>
    </div>
  );
}
