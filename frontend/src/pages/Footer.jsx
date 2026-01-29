import React, { useEffect, useState } from 'react';

function Footer({ isLoggedIn = false }) {
  const [connectionStatus, setConnectionStatus] = useState("offline");
  const [networkInfo, setNetworkInfo] = useState({
    type: "unknown",
    downlink: null,
  });
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(128);

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
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
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
              <li><a href="#" className="hover:text-zinc-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-zinc-400 transition-colors">Pricing</a></li>
              <li>
                <a href="#" className="hover:text-zinc-400 transition-colors flex items-start">
                  Resources <span className="text-[0.6rem] ml-1 relative -top-1 text-zinc-500 dark:text-zinc-400">74</span>
                </a>
              </li>
              {!isLoggedIn && (
                <>
                  <li>
                    <a href="#" className="hover:text-zinc-400 transition-colors">
                      Log In
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-zinc-400 transition-colors">
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
    className="relative overflow-hidden w-full max-w-xs rounded-xl
    bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black
    border border-zinc-200 dark:border-zinc-800
    p-5 space-y-5 shadow-lg
    transition-all duration-300
    hover:shadow-xl hover:-translate-y-0.5
    after:absolute after:inset-0 after:content-['']
    after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent
    dark:after:via-white/10
    after:translate-x-[-120%] hover:after:translate-x-[120%]
    after:transition-transform after:duration-700"
  >
    
    {/* Connection Status */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">Connection</span>
      <span
        className={`relative group flex items-center gap-2 font-semibold ${
          connectionStatus === "online"
            ? "text-emerald-400"
            : connectionStatus === "slow"
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            connectionStatus === "online"
              ? "bg-emerald-400"
              : connectionStatus === "slow"
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
        ></span>
        {connectionStatus === "online"
          ? "Online"
          : connectionStatus === "slow"
          ? "Slow Network"
          : "Offline"}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                   hidden group-hover:block
                   whitespace-nowrap rounded-md bg-white dark:bg-zinc-900
                   border border-zinc-200 dark:border-zinc-700
                   px-2 py-1 text-[0.65rem] text-zinc-500 dark:text-zinc-400 shadow-lg">
          Network: {networkInfo.type}
          {networkInfo.downlink && (
            <span className="ml-1 text-zinc-500 dark:text-zinc-400">
              • {networkInfo.downlink} Mbps
            </span>
          )}
        </span>
      </span>
    </div>

    <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800"></div>

    {/* Like Section */}
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Found this helpful?
      </p>

      <button
        onClick={() => {
          if (!liked) {
            setLiked(true);
            setLikes(likes + 1);
          }
        }}
        className={`w-full text-xs font-semibold py-2.5 rounded-lg transition-all
          flex items-center justify-center gap-2
          ${
            liked
              ? "bg-emerald-500/10 text-emerald-400 cursor-default"
              : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
          }`}
      >
        {liked ? "❤️ Liked" : "👍 Like this"} 
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