import { useState, useEffect, useCallback, useRef } from "react";
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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef(null);

  const [expandedRow, setExpandedRow] = useState(null);

  const searchInputRef = useRef(null);

  // OS detection for shortcut hint
  const [isMac, setIsMac] = useState(false);
  const [showShortcutPulse, setShowShortcutPulse] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdK = isMac && e.metaKey && e.key.toLowerCase() === "k";
      const isCtrlK = !isMac && e.ctrlKey && e.key.toLowerCase() === "k";
      const isEsc = e.key === "Escape";

      if (isCmdK || isCtrlK) {
        e.preventDefault();
        searchInputRef.current?.focus();

        // Trigger shortcut pulse animation
        setShowShortcutPulse(true);
        setTimeout(() => setShowShortcutPulse(false), 500);
      }

      if (isEsc && document.activeElement === searchInputRef.current) {
        searchInputRef.current.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);

  // Sort state
  const [sortBy, setSortBy] = useState("peak");
  
  const itemsPerPage = 10;

  const filterLeaders = useCallback(() => {
    let filtered = allLeaders;

    // Filter by name
    if (debouncedQuery.trim()) {
      filtered = allLeaders.filter((leader) =>
        leader.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "peak") {
      filtered = [...filtered].sort((a, b) => b.peakWpm - a.peakWpm);
    } else if (sortBy === "avg") {
      filtered = [...filtered].sort((a, b) => b.avgWpm - a.avgWpm);
    } else if (sortBy === "accuracy") {
      filtered = [...filtered].sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));
    } else if (sortBy === "streak") {
      filtered = [...filtered].sort((a, b) => b.streak - a.streak);
    }

    setFilteredLeaders(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [allLeaders, debouncedQuery, sortBy]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(!!(token && email));
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    filterLeaders();
  }, [filterLeaders]);

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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 400);
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
        
        {/* Premium Header with filter/sort */}
        {isLoading ? (
          <div className="space-y-8 py-6">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="h-10 w-56 rounded-md bg-muted/50 animate-pulse" />
                <div className="h-4 w-40 rounded-md bg-muted/40 animate-pulse" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="h-11 w-64 rounded-md bg-muted/50 animate-pulse" />
                <div className="h-10 w-40 rounded-md bg-muted/40 animate-pulse" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              <div className="bg-muted/50 h-12" />
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-7 gap-4 items-center px-4 py-3 border-t"
                >
                  {/* Rank */}
                  <div className="h-6 w-10 rounded-md bg-muted/40 animate-pulse" />

                  {/* Player */}
                  <div className="flex items-center gap-3 col-span-2">
                    <div className="h-10 w-10 rounded-full bg-muted/50 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-muted/50 animate-pulse" />
                      <div className="h-3 w-32 rounded bg-muted/40 animate-pulse" />
                    </div>
                  </div>

                  {/* Peak */}
                  <div className="h-6 w-14 rounded-md bg-muted/40 animate-pulse justify-self-end" />

                  {/* Avg */}
                  <div className="h-6 w-14 rounded-md bg-muted/40 animate-pulse justify-self-end" />

                  {/* Accuracy */}
                  <div className="h-4 w-10 rounded bg-muted/30 animate-pulse justify-self-end" />

                  {/* Streak */}
                  <div className="h-6 w-12 rounded-md bg-muted/40 animate-pulse justify-self-end" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Premium Header with filter/sort */}
            {!isLoading && (
              <div className="mb-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-1">Leaderboard</h1>
                    <p className="text-muted-foreground">
                      Ranked by performance · {filteredLeaders.length} players
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                      <Input
                        ref={searchInputRef}
                        placeholder="Search player…"
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={(e) => e.target.select()}
                        className="pl-10 pr-16 h-10"
                      />

                      <span
                        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-transform duration-300 ${
                          showShortcutPulse ? "scale-110" : "scale-100"
                        }`}
                      >
                        {isMac ? "⌘ K" : "Ctrl K"}
                      </span>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="peak">Sort by Peak WPM</option>
                      <option value="avg">Sort by Avg WPM</option>
                      <option value="accuracy">Sort by Accuracy</option>
                      <option value="streak">Sort by Streak</option>
                    </select>
                  </div>
                </div>
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

        {/* {!isLoading && !error && filteredLeaders.length >= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[0, 1, 2].map((i) => {
              const player = filteredLeaders[i];
              return (
                <div
                  key={player.rank}
                  className={`rounded-xl border bg-card p-4 text-center ${
                    i === 0 ? "border-yellow-400/50" : ""
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.peakWpm} WPM</p>
                </div>
              );
            })}
          </div>
        )} */}

            {/* Table */}
            {!error && filteredLeaders.length > 0 && (
              <>
                <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="border-b hover:bg-muted/50">
                        <TableHead className="w-16 text-center font-bold">Rank</TableHead>
                        <TableHead className="font-bold">Player</TableHead>
                        <TableHead className="text-right font-bold">
                          Peak WPM
                        </TableHead>
                        <TableHead className="text-right font-bold">
                          Avg WPM
                        </TableHead>
                        <TableHead className="text-right font-bold">Accuracy</TableHead>
                        <TableHead className="text-right font-bold">
                          Streak
                        </TableHead>
                        <TableHead className="text-right font-bold">
                          Tests
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentLeaders.map((player) => (
                        <>
                          <TableRow
                            key={player.rank}
                            onClick={() =>
                              setExpandedRow(expandedRow === player.rank ? null : player.rank)
                            }
                            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                              player.email === localStorage.getItem("userEmail")
                                ? "bg-primary/5"
                                : ""
                            }`}
                          >
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
                                <ChevronRight
                                  className={`h-3 w-3 ml-1 text-muted-foreground transition-transform ${
                                    expandedRow === player.rank ? "rotate-90" : ""
                                  }`}
                                />
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
                                  <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center font-semibold text-sm">
                                    {player.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-foreground">{player.name}</p>
                                  {/* <p className="text-xs text-muted-foreground">{player.email}</p> */}
                                </div>
                              </div>
                            </TableCell>

                            {/* Peak WPM */}
                            <TableCell className="text-right">
                              <div className="inline-flex items-center px-3 py-1 rounded-md bg-muted border">
                                <span className="font-semibold">
                                  {player.peakWpm}
                                </span>
                              </div>
                            </TableCell>

                            {/* Average WPM */}
                            <TableCell className="text-right">
                              <div className="inline-flex items-center px-3 py-1 rounded-md bg-muted border">
                                <span className="font-semibold">
                                  {player.avgWpm}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="text-right">
                              <span className="text-sm font-medium text-muted-foreground">
                                {player.accuracy ?? "--"}%
                              </span>
                            </TableCell>

                            {/* Streak */}
                            <TableCell className="text-right">
                              <div className="inline-flex items-center px-3 py-1 rounded-md bg-muted border">
                                <span className="font-semibold">
                                  {player.streak}
                                </span>
                              </div>
                            </TableCell>

                            {/* Tests */}
                            <TableCell className="text-right">
                              <div className="inline-flex items-center px-3 py-1 rounded-md bg-muted border">
                                <span className="font-semibold">
                                  {player.totalTests}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRow === player.rank && (
                            <TableRow className="bg-muted/20">
                              <TableCell colSpan={7}>
                                <div className="rounded-lg border bg-background p-5">
                              {/* Changed gap-40 to gap-10 (mobile) and added lg:gap-40 (desktop) */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-40">

  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">
      Email
    </span>
    <span className="text-sm font-medium">
      {player.email}
    </span>
  </div>

  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">
      Phone
    </span>
    <span className="text-sm font-medium">
      {player.phone ?? "—"}
    </span>
  </div>

  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">
      Location
    </span>
    <span className="text-sm font-medium">
      {player.location ?? "—"}
    </span>
  </div>

  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">
      Total Tests
    </span>
    <span className="text-sm font-medium">
      {player.totalTests}
    </span>
  </div>

</div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
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
          </>
        )}

        {/* Empty State */}
      {!isLoading && !error && filteredLeaders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-foreground mb-1">
            {searchQuery ? "No matching players" : "Leaderboard is empty"}
          </p>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            {searchQuery
              ? "Try a different name or clear the search to see all players."
              : "Once players complete typing tests, rankings will appear here."}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setDebouncedQuery("");
              }}
              className="h-10 px-4 rounded-md border border-input text-sm font-medium hover:bg-muted transition"
            >
              Clear search
            </button>
          )}
        </div>
      )}
      </div>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}