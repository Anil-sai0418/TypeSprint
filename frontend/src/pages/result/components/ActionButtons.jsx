import React from 'react';
import { RotateCcw, Plus, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ActionButtons({ onTryAgain, onNewTest }) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6">
        <ActionButton
          icon={RotateCcw}
          label="Try Again"
          description="Same text"
          onClick={onTryAgain}
          color="indigo"
          index={0}
        />
        <ActionButton
          icon={Plus}
          label="New Test"
          description="Fresh challenge"
          onClick={onNewTest}
          color="purple"
          index={1}
        />
        <ActionButton
          icon={Trophy}
          label="Leaderboard"
          description="See rankings"
          onClick={() => navigate('/leaderboard')}
          color="amber"
          index={2}
        />
      </div>
    </div>
  );
}

const ActionButton = ({ icon: IconComp, label, description, onClick, color, index }) => {
  const colors = {
    indigo: "group-hover:text-indigo-400 group-hover:bg-indigo-500/10 border-indigo-500/10",
    purple: "group-hover:text-purple-400 group-hover:bg-purple-500/10 border-purple-500/10",
    amber: "group-hover:text-amber-400 group-hover:bg-amber-500/10 border-amber-500/10"
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex items-center gap-5 rounded-4xl px-8 py-6 bg-white/3 hover:bg-white/6 backdrop-blur-xl border border-white/10 transition-all duration-300 text-left w-full sm:w-auto min-w-[280px]"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-gray-400 transition-all duration-300 ${colors[color]}`}>
        <IconComp className="h-6 w-6" />
      </div>

      <div className="flex-1">
        <p className="text-lg font-bold text-white tracking-tight">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-500">
          {description}
        </p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
};
