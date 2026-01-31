import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navagation";
import Footer from "./Footer";
import { getLeaderboard } from "../services/api";
import { Zap, TrendingUp, Flame, Target, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function Leaderboard() {
  const [allLeaders, setAllLeaders] = useState([]);
  const [filteredLeaders, setFilteredLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(!!(token && email));
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    filterAndPaginateLeaders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLeaders, searchQuery, currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLeaderboard(100);
      if (response.success) {
        setAllLeaders(response.leaderboard);
        setCurrentPage(1);
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

  const filterAndPaginateLeaders = () => {
    let filtered = allLeaders;

    // Filter by name
    if (searchQuery.trim()) {
      filtered = allLeaders.filter((leader) =>
        leader.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLeaders(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Pagination
  const totalPages = Math.ceil(filteredLeaders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaders = filteredLeaders.slice(startIndex, endIndex);

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-600 dark:text-yellow-400 font-bold";
    if (rank === 2) return "text-gray-600 dark:text-gray-400 font-bold";
    if (rank === 3) return "text-orange-600 dark:text-orange-400 font-bold";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pt-24">
      <Navigation />

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
            <p className="text-muted-foreground">
              Top typists ranked by peak speed. {filteredLeaders.length} players
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by player name..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 py-2 h-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-lg font-medium transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && filteredLeaders.length > 0 && (
          <>
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-b hover:bg-muted/50">
                    <TableHead className="w-16 text-center font-bold">Rank</TableHead>
                    <TableHead className="font-bold">Player</TableHead>
                    <TableHead className="text-right font-bold">
                      <div className="flex items-center justify-end gap-1">
                        <Zap className="h-4 w-4" />
                        Peak WPM
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-bold">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Avg WPM
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-bold">
                      <div className="flex items-center justify-end gap-1">
                        <Flame className="h-4 w-4" />
                        Streak
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-bold">
                      <div className="flex items-center justify-end gap-1">
                        <Target className="h-4 w-4" />
                        Tests
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLeaders.map((player) => (
                    <TableRow key={player.rank} className="hover:bg-muted/50 transition-colors">
                      {/* Rank */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {getMedalIcon(player.rank) ? (
                            <span className="text-2xl">{getMedalIcon(player.rank)}</span>
                          ) : (
                            <span className={`text-lg font-bold ${getRankColor(player.rank)}`}>
                              #{player.rank}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Player Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {player.profileImage ? (
                            <img
                              src={player.profileImage}
                              alt={player.name}
                              className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Peak WPM */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <span className="font-bold text-green-700 dark:text-green-400">
                            {player.peakWpm}
                          </span>
                        </div>
                      </TableCell>

                      {/* Average WPM */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                          <span className="font-bold text-purple-700 dark:text-purple-400">
                            {player.avgWpm}
                          </span>
                        </div>
                      </TableCell>

                      {/* Streak */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                          <span className="font-bold text-orange-700 dark:text-orange-400">
                            {player.streak}
                          </span>
                        </div>
                      </TableCell>

                      {/* Tests */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <span className="font-bold text-blue-700 dark:text-blue-400">
                            {player.totalTests}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-4 py-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredLeaders.length)} of{" "}
                  {filteredLeaders.length} players
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-input hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredLeaders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl text-muted-foreground mb-2">
              {searchQuery ? "No players found matching your search" : "No leaderboard data yet"}
            </p>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try searching for a different player name"
                : "Complete your first typing test to appear on the leaderboard!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}