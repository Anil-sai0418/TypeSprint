import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navagation";
import Footer from "./Footer";
import { getLeaderboard } from "../services/api";
import { Zap, Trophy, TrendingUp, Flame, Target, Calendar } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(!!(token && email));
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLeaderboard(50);
      if (response.success) {
        setLeaders(response.leaderboard);
      } else {
        setError(response.message || "Failed to load leaderboard");
      }
    } catch (err) {
      setError("Error loading leaderboard. Make sure backend is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-300 to-yellow-500";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-br from-orange-300 to-orange-500";
      default:
        return "bg-gradient-to-br from-blue-400 to-indigo-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground font-sans pt-24">
      <Navigation />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="text-5xl">🏆</div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Top typists ranked by peak speed. Can you make it to the top 10?
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mb-4"></div>
            <p className="text-muted-foreground text-lg">Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaderboard Grid */}
        {!isLoading && !error && leaders.length > 0 && (
          <div className="space-y-4">
            {leaders.map((player, index) => (
              <div
                key={player.rank}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  player.rank <= 3
                    ? "border-transparent bg-gradient-to-r"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                } ${
                  player.rank === 1
                    ? "from-yellow-300/30 to-yellow-500/30"
                    : player.rank === 2
                    ? "from-gray-300/30 to-gray-500/30"
                    : player.rank === 3
                    ? "from-orange-300/30 to-orange-500/30"
                    : ""
                }`}
              >
                {/* Animated background for top 3 */}
                {player.rank <= 3 && (
                  <div className={`absolute inset-0 opacity-10 ${getRankBgColor(player.rank)}`} />
                )}

                <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                  
                  {/* Rank & Player Info */}
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 w-full sm:w-auto">
                    
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl ${getRankBgColor(player.rank)} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                        {getMedalIcon(player.rank) || player.rank}
                      </div>
                    </div>

                    {/* Player Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {player.profileImage ? (
                          <img
                            src={player.profileImage}
                            alt={player.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-slate-700">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                            {player.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {player.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto">
                    
                    {/* Peak WPM */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-3 sm:p-4 text-center border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                          Peak
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                        {player.peakWpm}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">WPM</p>
                    </div>

                    {/* Average WPM */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-3 sm:p-4 text-center border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          Avg
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {player.avgWpm}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">WPM</p>
                    </div>

                    {/* Streak */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-3 sm:p-4 text-center border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                          Streak
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {player.streak}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">days</p>
                    </div>

                    {/* Tests */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-3 sm:p-4 text-center border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Tests
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {player.totalTests}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">done</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && leaders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl text-muted-foreground mb-2">No leaderboard data yet.</p>
            <p className="text-muted-foreground">
              Complete your first typing test to appear on the leaderboard!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}