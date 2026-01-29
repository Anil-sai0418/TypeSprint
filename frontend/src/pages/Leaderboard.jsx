import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navagation";
import Footer from "./Footer";
import { getLeaderboard } from "../services/api";
import { Zap, Trophy, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLeaderboard(10);
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

  // Helper to get styling for top ranks
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
      case 2:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
      case 3:
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700";
      default:
        return "bg-transparent text-gray-500 border-transparent dark:text-gray-400";
    }
  };

  // Helper to get medal icon
  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return <span className="text-sm font-medium">#{rank}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0b1220] dark:to-[#0f172a] text-foreground font-sans pt-28">
      <Navigation />
      
      <div className="flex-1 flex flex-col items-center pt-12 px-4 pb-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            🏆 Leaderboard
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Top typists ranked by speed. Can you make it to the top?
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
          
          {/* Loading State */}
          {isLoading && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-12 flex flex-col items-center justify-center">
              <p className="text-red-600 dark:text-red-400 text-center mb-4">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Leaderboard Table */}
          {!isLoading && !error && leaders.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200/60 dark:border-slate-800 bg-gray-100/60 dark:bg-slate-900/60">
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tests</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Peak WPM</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Avg WPM</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {leaders.map((player) => (
                      <tr 
                        key={player.rank} 
                        className="group hover:bg-gray-100/70 dark:hover:bg-slate-800/60 transition-all duration-200"
                      >
                        {/* Rank Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${getRankStyle(player.rank)}`}>
                            <span className="text-lg">{getMedal(player.rank)}</span>
                          </div>
                        </td>

                        {/* Name Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {/* Avatar Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shadow-inner">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                {player.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {player.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Tests Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {player.totalTests}
                          </span>
                        </td>

                        {/* Peak WPM Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              {player.wpm}
                            </span>
                          </div>
                        </td>

                        {/* Average WPM Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {Math.round(player.averageSpeed) || 0}
                            </span>
                          </div>
                        </td>

                        {/* Streak Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {player.dailyStreak} days
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer / Call to Action */}
              <div className="bg-gray-100/60 dark:bg-slate-900/60 p-5 border-t border-gray-200/60 dark:border-slate-800 text-center">
                <p className="text-xs text-muted-foreground">
                  Rankings update after each test. Keep typing to climb the leaderboard! 🚀
                </p>
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !error && leaders.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No users on leaderboard yet.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Complete your first test to appear here!</p>
            </div>
          )}
        </div>
      </div>

      <Footer isLoggedIn={true} />
    </div>
  );
}