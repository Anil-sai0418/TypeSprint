import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLikeStatus, toggleLike, getLikeCount } from '../services/api';

function Footer({ isLoggedIn = false }) {
  const [connectionStatus, setConnectionStatus] = useState("offline");
  const [networkInfo, setNetworkInfo] = useState({
    type: "unknown",
    downlink: null,
  });
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch like status and count
  useEffect(() => {
    const fetchLikeData = async () => {
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
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Error updating like status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-white text-zinc-900 dark:bg-black dark:text-white overflow-hidden font-sans">
      {/* Background "Osmo" Logo Layer */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[10rem] sm:text-[16rem] md:text-[36rem] font-bold text-zinc-200 dark:text-zinc-800/50 leading-none tracking-tighter translate-y-1/4">
          Type
        </span>
        <span className="absolute bottom-0 right-0 text-[10rem] sm:text-[16rem] md:text-[36rem] font-bold text-zinc-200 dark:text-zinc-800/50 leading-none translate-y-1/4 translate-x-1/4">
          *
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          
          {/* ABOUT Column */}
          <div className="md:pr-20 space-y-5">
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 tracking-widest uppercase">ABOUT</h3>

            {/* Icon + Text */}
            <div className="flex items-start gap-4">
              {/* Icon placeholder */}
              <div className="shrink-0 w-10 h-10 rounded-md bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                ⌨️
              </div>

              {/* About text */}
              <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                A clean and minimal typing practice application designed to improve
                <span className="text-black dark:text-white"> speed</span>,
                <span className="dark:text-white text-black"> accuracy</span>, and
                <span className="dark:text-white text-black"> focus</span> through consistent daily practice.
              </p>
            </div>
          </div>

          {/* SITEMAP Column */}
          <div className="md:ml-20">
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500   uppercase mb-6">SITEMAP</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="hover:text-zinc-400 transition-colors">Home</Link></li>
              <li><Link to="/home" className="hover:text-zinc-400 transition-colors">Type</Link></li>
              <li>
                <Link to="/leaderboard" className="hover:text-zinc-400 transition-colors flex items-start">
                  Leaderboard
                </Link>
              </li>
              {!isLoggedIn && (
                <>
                  <li>
                    <a href="/Login" className="hover:text-zinc-400 transition-colors">
                      Log In
                    </a>
                  </li>
                  <li>
                    <a href="/Register" className="hover:text-zinc-400 transition-colors">
                      Sign Up
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* CONTACT Column */}
          <div>
            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase mb-6">CONTACT</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a
                  href="mailto:anilsainunna@gmail.com"
                  className="hover:text-zinc-400 transition-colors"
                >
                  anilsainunna@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+916300915551"
                  className="hover:text-zinc-400 transition-colors"
                >
                  +91 63009 15551
                </a>
              </li>
            </ul>

<div className="mt-8">
  <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase mb-4">
    STATUS
  </h3>

  <div
    className="relative group overflow-hidden w-full max-w-xs rounded-xl
    bg-linear-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black
    border border-zinc-200 dark:border-zinc-800
    p-5 space-y-5 shadow-lg
    transition-all duration-300
    hover:border-zinc-300 dark:hover:border-zinc-700
    hover:shadow-xl hover:-translate-y-0.5
    after:absolute after:inset-0 after:content-['']
    after:bg-linear-to-r after:from-transparent after:via-white/80 after:to-transparent
    dark:after:via-white/10
    after:translate-x-[-120%] hover:after:translate-x-[120%]
    after:transition-transform after:duration-700"
  >
    
    {/* Connection Status */}
    <div className="flex items-center justify-between text-sm p-2.5 -mx-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all duration-300 group/connection">
      <span className="text-zinc-500 dark:text-zinc-400 group-hover/connection:text-zinc-900 dark:group-hover/connection:text-zinc-100 transition-colors">Connection</span>
      <span
        className={`relative flex items-center gap-2 font-semibold transition-all duration-300 ${
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
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {isLoggedIn ? "Like this app?" : "Login to like"}
      </p>

      <button
        onClick={handleLikeClick}
        disabled={loading}
        className={`w-full text-xs font-semibold py-2.5 rounded-lg transition-all
          flex items-center justify-center gap-2
          ${
            liked
              ? "bg-emerald-500/10 text-emerald-400 cursor-default"
              : isLoggedIn
              ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
              : "bg-zinc-300 hover:bg-zinc-400 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-300"
          }
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {liked ? "❤️ Liked" : "🤍 Like"} 
        <span className="text-[0.65rem] text-zinc-500 dark:text-zinc-400">({likes})</span>
      </button>
    </div>

  </div>
</div>
          </div>

        </div>

        {/* Bottom Section */}
       <div className="w-full h-px bg-gray-500 dark:bg-gray-600 "></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[0.65rem] font-bold text-zinc-400 uppercase tracking-wider border-t border-zinc-900/10 pt-10">
         <p>© {new Date().getFullYear()} Typing Sprint. All rights reserved.</p>
          
          <div className="relative mt-4 md:mt-0 group">
            {/* Desktop & Tablet (hover shows tooltip) */}
            <span className="hidden md:inline text-gray-500 cursor-default">
              Developed by 
              <span className="text-black dark:text-white ml-2">Anil</span>
            </span>

            <a
              href="https://anilsai-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block absolute bottom-full left-18 mb-2 opacity-0 group-hover:opacity-100 bg-gray-300 dark:text-white text-gray-800 dark:bg-gray-900 px-2 py-1 rounded-sm transition-opacity  text-[0.65rem]"
            >
              Portfolio
            </a>

            {/* Mobile (click navigates directly) */}
            <a
              href="https://anilsai-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden text-gray-500 cursor-pointer"
            >
              Developed by <span className="text-black dark:text-white  ml-2">Anil</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;