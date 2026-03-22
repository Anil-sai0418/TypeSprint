import React from 'react';
import { BarChart3, Target, Lightbulb, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DetailCard = ({ title, icon: IconComp, children, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
    className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl rounded-4xl p-8 border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col h-full"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
        <IconComp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
    </div>
    <div className="flex flex-col flex-1 space-y-0 text-sm">
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
    <div className={`flex justify-between items-center py-5 ${!isLast ? 'border-b border-gray-100 dark:border-gray-800/60' : 'pt-8 mt-auto'}`}>
      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{label}</span>
      <span className={`font-black ${isLast ? 'text-3xl tracking-tight' : 'text-xl'} ${colorMap[color]}`}>{value}</span>
    </div>
  );
};

export default function DetailedStats({ results }) {
  const { correctWords = 0, incorrectWords = 0, totalWords = 0 } = results;

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
          <StatRow label="Successful" value={correctWords} color="green" />
          <StatRow label="Failed" value={incorrectWords} color="red" />
          <StatRow label="Total Words" value={totalWords} color="gray" isLast={true} />
        </DetailCard>

        {/* Performance Insights */}
        <DetailCard title="Insights" icon={Lightbulb} index={2}>
          <div className="space-y-4 flex flex-col h-full">
            {results.accuracy >= 98 ? (
              <div className="flex items-center gap-3 p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Elite Precision</span>
              </div>
            ) : results.accuracy >= 90 ? (
              <div className="flex items-center gap-3 p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Solid Accuracy</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="text-sm font-bold text-rose-700 dark:text-rose-400">Focus on Accuracy</span>
              </div>
            )}
            
            {results.netWpm >= 80 ? (
              <div className="flex items-center gap-3 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">God-tier Speed</span>
              </div>
            ) : results.netWpm >= 50 ? (
              <div className="flex items-center gap-3 p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Fast Typer</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-5 rounded-3xl bg-slate-500/10 border border-slate-500/20">
                <Lightbulb className="w-5 h-5 text-slate-500 shrink-0" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-400">Keep Practicing</span>
              </div>
            )}
            <div className="mt-auto pt-6 text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Grandmaster Stats</span>
            </div>
          </div>
        </DetailCard>
      </div>
    </div>
  );
}
