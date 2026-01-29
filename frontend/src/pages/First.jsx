import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Trophy, ChevronRight, Activity, Terminal, Star } from 'lucide-react';
import Navigation from '../components/ui/Navagation'; // Keeping your import
import Footer from './Footer';

const TypeSprintHome = () => {
  const navigate = useNavigate();

  // Smoother, more subtle animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 20 },
    },
  };

  return (
    // Changed dark:bg-[#0B0F19] to dark:bg-[#020617] for a deeper, premium black
    <div className="relative min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      
      {/* --- PROFESSIONAL BACKGROUND SYSTEM --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern - Tuned opacity for dark mode */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Ambient Glows - Made slightly stronger in dark mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-[100%] blur-[100px]" />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navigation />
      </div>

      <main className="relative mt-20 z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          
          {/* Badge: Improved Dark Mode contrast and border */}
          <motion.div variants={itemVariants} className="mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/80 dark:bg-indigo-950/30 text-slate-600 dark:text-indigo-200 border border-slate-200 dark:border-indigo-500/30 backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 Now Available
            </span>
          </motion.div>

          {/* Headline: Clean, Tight, High Contrast */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-8 max-w-4xl mx-auto">
            The standard for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              touch typing mastery.
            </span>
          </motion.h1>

          {/* Subheadline: Better readability */}
          <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the ultimate typing platform. Zero latency, minimalist design, 
            and deep analytics designed to help you break your personal limits.
          </motion.p>

          {/* CTA Buttons: Refined shadows and hover states */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
            <button
              onClick={() => navigate('/type')}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-500 hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Typing
              <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/leader')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
            >
              Leaderboard
            </button>
          </motion.div>
        
        </motion.div>
      </main>

      {/* Features Grid: Refined Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-slate-200 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Everything you need to type faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Zap className="w-5 h-5" />, 
              title: "Instant Feedback", 
              desc: "Visual cues appear instantly. No latency, just pure flow state typing.",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
              darkBg: "dark:bg-amber-500/10" // added specific dark handling for icons
            },
            { 
              icon: <Trophy className="w-5 h-5" />, 
              title: "Global Leagues", 
              desc: "Compete in daily sprints. Climb the ranks from Novice to Grandmaster.",
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
              darkBg: "dark:bg-indigo-500/10"
            },
            { 
              icon: <Activity className="w-5 h-5" />, 
              title: "Detailed Analytics", 
              desc: "Identify your weak keys and track your progress with professional charts.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              darkBg: "dark:bg-emerald-500/10"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              // Huge upgrade here: Lighter background than body, subtle border, hover glow
              className="group p-8 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-indigo-500/30 dark:hover:shadow-[0_0_20px_-10px_rgba(99,102,241,0.15)] transition-all duration-300"
            >
              <div className={`mb-6 p-3 w-fit rounded-lg ${feature.bg} ${feature.darkBg} ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default TypeSprintHome;