import React from 'react';
import { BarChart3, Target, Lightbulb, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DetailCard = ({ title, icon: IconComp, children, index }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
    className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <IconComp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </motion.div>
);

const StatRow = ({ label, value, color = 'gray', isLast = false }) => {
  const colorMap = {
    green: 'text-emerald-500 dark:text-emerald-400',
    red: 'text-rose-500 dark:text-rose-400',
    gray: 'text-gray-900 dark:text-white',
    indigo: 'text-indigo-600 dark:text-indigo-400'
  };

  return (
    <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-800/60' : ''}`}>
      <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-lg font-black ${colorMap[color]}`}>{value}</span>
    </div>
  );
};

export default function DetailedStats({ results }) {
  const accuracy = results.totalWords > 0 ? Math.round((results.correctWords / results.totalWords) * 100) : 0;
  
  return (
    <div className="w-full max-w-6xl mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Character Stats */}
        <DetailCard title="Characters" icon={BarChart3} index={0}>
          <StatRow label="Correct" value={results.correctChars} color="green" />
          <StatRow label="Incorrect" value={results.incorrectChars} color="red" />
          <StatRow label="Total Typed" value={results.correctChars + results.incorrectChars} color="gray" isLast={true} />
        </DetailCard>

        {/* Word Stats */}
        <DetailCard title="Words" icon={Target} index={1}>
          <StatRow label="Successful" value={results.correctWords} color="green" />
          <StatRow label="Failed" value={results.incorrectWords} color="red" />
          <StatRow label="Total Words" value={results.totalWords} color="gray" isLast={true} />
        </DetailCard>

        {/* Performance Insights */}
        <DetailCard title="Insights" icon={Lightbulb} index={2}>
          <div className="space-y-4 pt-2">
            {results.accuracy >= 98 ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Elite Precision</span>
              </div>
            ) : results.accuracy >= 90 ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Solid Accuracy</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="text-sm font-bold text-rose-700 dark:text-rose-400">Focus on Accuracy</span>
              </div>
            )}
            
            {results.netWpm >= 80 ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">God-tier Speed</span>
              </div>
            ) : results.netWpm >= 50 ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Fast Typer</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20">
                <Lightbulb className="w-5 h-5 text-slate-500 shrink-0" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-400">Keep Practicing</span>
              </div>
            )}
          </div>
        </DetailCard>
      </div>
    </div>
  );
}
