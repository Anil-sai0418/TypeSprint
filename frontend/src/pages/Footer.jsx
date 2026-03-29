import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLikeStatus, toggleLike, getLikeCount } from '../services/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '../context/useAuth';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

function Footer({ isLoggedIn = false }) {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState("offline");
  const [networkInfo, setNetworkInfo] = useState({
    type: "unknown",
    downlink: null,
  });
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Fetch like status and count
  useEffect(() => {
    const fetchLikeData = async () => {
      setIsLikeLoading(true);
      try {
        // Get total likes count
        const countRes = await getLikeCount();
        if (countRes.success) {
          setLikes(countRes.totalLikes);
        }

        // Get user like status if logged in
        if (isLoggedIn) {
          const email = localStorage.getItem("userEmail");
          const token = localStorage.getItem("token");
          
          if (email && token) {
            const statusRes = await getLikeStatus(email, token);
            if (statusRes.success) {
              setLiked(statusRes.userLiked);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching like data:", error);
      } finally {
        setIsLikeLoading(false);
      }
    };

    fetchLikeData();
  }, [isLoggedIn]);

  // Connection status tracking
  useEffect(() => {
    const updateConnectionStatus = () => {
      if (!navigator.onLine) {
        setConnectionStatus("offline");
        return;
      }

      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (connection && connection.effectiveType) {
        setNetworkInfo({
          type: connection.effectiveType,
          downlink: connection.downlink || null,
        });

        if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
          setConnectionStatus("slow");
        } else {
          setConnectionStatus("online");
        }
      } else {
        setNetworkInfo({ type: "unknown", downlink: null });
        setConnectionStatus("online");
      }
    };

    updateConnectionStatus();

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      connection.addEventListener("change", updateConnectionStatus);
    }

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
      if (connection) {
        connection.removeEventListener("change", updateConnectionStatus);
      }
    };
  }, []);

  // Handle like toggle
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      alert("Please login to like this application");
      return;
    }

    try {
      setLoading(true);
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token");

      const res = await toggleLike(email, token);
      if (res.success) {
        setLiked(res.userLiked);
        setLikes(res.totalLikes);
        
        if (res.userLiked) {
          // Trigger Confetti Effect
          const duration = 2500;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#34D399', '#10B981', '#FCD34D', '#EF4444', '#A855F7']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#34D399', '#10B981', '#FCD34D', '#EF4444', '#A855F7']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();

          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Error updating like status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white overflow-hidden font-sans mt-auto border-t border-zinc-200 dark:border-zinc-800">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 pointer-events-auto"
          >
            <div className="relative overflow-hidden px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl flex items-center gap-4 min-w-[300px]">
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]" />

              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-2xl">
                <span className="drop-shadow-sm animate-bounce">💖</span>
              </div>
              
              <div className="relative z-10 flex flex-col flex-1">
                <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  Thank you!
                </span>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300 mt-0.5">
                  Warm greetings, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user?.name || localStorage.getItem('userEmail')?.split('@')[0] || 'Guest'}</span>! 🎉
                </span>
              </div>
              
              <button 
                onClick={() => setShowToast(false)} 
                className="relative z-10 p-2 ml-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              >
                <span className="sr-only">Close</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background "Type" Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[15rem] sm:text-[20rem] md:text-[30rem] font-black text-zinc-100 dark:text-[#18181b] leading-none tracking-tighter opacity-100 dark:opacity-100 translate-y-[5%]">
          Type
        </span>
        <span className="absolute bottom-0 right-0 text-[10rem] sm:text-[16rem] md:text-[30rem] font-bold text-zinc-100 dark:text-[#18181b] leading-none translate-y-[5%] translate-x-1/4 opacity-100 dark:opacity-100">
          *
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* ABOUT Column */}
          <div className="md:col-span-1 space-y-6">
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 tracking-widest uppercase">ABOUT</h3>
            
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-lg shadow-sm">
                ⌨️
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                A clean and minimal typing practice application designed to improve
                <span className="text-zinc-900 dark:text-zinc-100 font-bold mx-1">speed, accuracy</span>, and
                <span className="text-zinc-900 dark:text-zinc-100 font-bold mx-1">focus</span>.
              </p>
            </div>
          </div>

          {/* SITEMAP Column */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 tracking-widest uppercase">SITEMAP</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-500">
              <li><Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-zinc-300 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors"></span>Home</Link></li>
              <li><Link to="/home" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-zinc-300 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors"></span>Type</Link></li>
              <li><Link to="/leaderboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-zinc-300 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors"></span>Leaderboard</Link></li>
            </ul>
          </div>

          {/* CONTACT Column */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 tracking-widest uppercase">CONTACT</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-500">
              <li>
                <a href="mailto:anilsainunna@gmail.com" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-zinc-300 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors"></span>
                  anilsainunna@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+916300915551" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-zinc-300 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors"></span>
                  +91 63009 15551
                </a>
              </li>
            </ul>
          </div>

          {/* STATUS Column */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 tracking-widest uppercase">STATUS</h3>
            <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
                
    {/* Connection Status */}
    <div className="flex items-center justify-between text-sm group/connection">
      <span className="text-zinc-500 dark:text-zinc-400 font-medium">Connection</span>
      <span
        className={`relative flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all duration-300 ${
          connectionStatus === "online"
            ? "text-emerald-500"
            : connectionStatus === "slow"
            ? "text-yellow-500"
            : "text-red-500"
        }`}
      >
        <span className="relative flex h-2 w-2">
          {connectionStatus === "online" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              connectionStatus === "online"
                ? "bg-emerald-500"
                : connectionStatus === "slow"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></span>
        </span>
        {connectionStatus === "online"
          ? "Online"
          : connectionStatus === "slow"
          ? "Slow Network"
          : "Offline"}
        
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 
                   opacity-0 scale-95 group-hover/connection:opacity-100 group-hover/connection:scale-100
                   pointer-events-none transition-all duration-300
                   whitespace-nowrap rounded-lg bg-zinc-900 text-white
                   px-3 py-1.5 text-[0.65rem] shadow-xl z-20">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === "online" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-zinc-500"}`}></span>
            {networkInfo.type.toUpperCase()} • {networkInfo.downlink || '??'} Mbps
          </span>
          {/* Triangle arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                     border-l-[6px] border-l-transparent 
                     border-r-[6px] border-r-transparent 
                     border-t-[6px] border-t-zinc-900"></span>
        </span>
      </span>
    </div>

    <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800"></div>

    {/* Like Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Like this app?</span>
          {isLoggedIn ? null : <span className="opacity-70 text-[10px]">Log in to like</span>}
      </div>
      {isLikeLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ) : (
        <button
          onClick={handleLikeClick}
          disabled={loading || !isLoggedIn}
          className={`
              w-full relative group overflow-hidden rounded-xl border transition-all duration-300
              px-4 py-3 flex items-center justify-center gap-2
              ${liked 
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer" 
                  : isLoggedIn
                      ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                      : "bg-zinc-100/50 border-zinc-200 text-zinc-400 opacity-70 cursor-not-allowed dark:bg-zinc-800/30 dark:border-zinc-800"
              }
          `}
        >
          <span className={`transform transition-transform duration-300 ${liked ? "scale-110" : "group-hover:scale-110"}`}>
              {liked ? "❤️" : "🤍"}
          </span>
          <span className="font-semibold text-xs tracking-wide">
              {liked ? "Liked" : "Like"}
          </span>
          <span className="ml-1 text-[10px] font-mono opacity-60">
              ({likes > 999 ? (likes/1000).toFixed(1) + 'k' : likes})
          </span>
        </button>
      )}
    </div>
  </div>
</div>
          </div>
        </div>

      
      {/* Bottom Section */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-[0.65rem] font-bold text-zinc-400 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} TypeVex. All rights reserved.</p>
          
          <div className="relative mt-4 md:mt-0 flex gap-4 items-center">
            
            <span className="text-zinc-500">
              Developed by 
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://anilsai-portfolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-900 dark:text-zinc-100 font-semibold px-1 hover:underline cursor-pointer"
                  >
                    Anil
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Portfolio</p>
                </TooltipContent>
              </Tooltip>
            </span>

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;