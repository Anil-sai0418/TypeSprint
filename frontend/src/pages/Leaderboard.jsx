import React, { useState, useEffect, useRef } from "react";
import Navigation from "@/components/ui/Navigation";
import Footer from "./Footer";
import { useLeaderboardQuery } from "../hooks/useQueries";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("peak");
  const [expandedRow, setExpandedRow] = useState(null);

  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // OS detection for shortcut hint
  const [isMac, setIsMac] = useState(false);
  const [showShortcutPulse, setShowShortcutPulse] = useState(false);

  const itemsPerPage = 10;

  // Server-side query with search, sort, and pagination parameters
  const { data: qData, isLoading, error } = useLeaderboardQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedQuery,
    sortBy,
  });

  const currentLeaders = qData?.leaderboard || [];
  const totalCount = qData?.total || 0;
  const totalPages = qData?.totalPages || 1;

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(!!(token && email));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      setCurrentPage(1); // Reset page on new search
    }, 400);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset page on new sort
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

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
        
        {/* Header with filter/sort */}
        {isLoading ? (
          <div className="space-y-8 py-6">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-10 w-56" />
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Skeleton className="h-11 w-64" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              <Skeleton className="h-12 w-full rounded-none" />
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-7 gap-4 items-center px-4 py-3 border-t"
                >
                  <Skeleton className="h-6 w-10" />
                  <div className="flex items-center gap-3 col-span-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-14 justify-self-end" />
                  <Skeleton className="h-6 w-14 justify-self-end" />
                  <Skeleton className="h-4 w-10 justify-self-end" />
                  <Skeleton className="h-6 w-12 justify-self-end" />
                  <Skeleton className="h-6 w-12 justify-self-end" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-1">{t('leaderboard.title')}</h1>
                  <p className="text-muted-foreground">
                    {t('leaderboard.subtitle', { count: totalCount })}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      ref={searchInputRef}
                      placeholder={t('leaderboard.search_placeholder')}
                      value={searchQuery}
                      onChange={handleSearch}
                      onFocus={(e) => e.target.select()}
                      className="pl-10 pr-10 sm:pr-16 h-10 w-full"
                    />

                    <span
                      className={`hidden sm:inline-flex pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-transform duration-300 ${
                        showShortcutPulse ? "scale-110" : "scale-100"
                      }`}
                    >
                      {isMac ? "⌘ K" : "Ctrl K"}
                    </span>
                  </div>

                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="peak">Sort by Peak WPM</option>
                    <option value="avg">Sort by Avg WPM</option>
                    <option value="accuracy">Sort by Accuracy</option>
                    <option value="streak">Sort by Streak</option>
                    <option value="tests">Sort by Total Tests</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
                <p className="text-destructive mb-4">{error.message || "Error loading leaderboard. Make sure backend is running."}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-lg font-medium transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!error && currentLeaders.length > 0 && (
              <>
                <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="border-b hover:bg-muted/50">
                        <TableHead className="w-16 text-center font-bold">{t('leaderboard.rank')}</TableHead>
                        <TableHead className="font-bold">{t('leaderboard.player')}</TableHead>
                        <TableHead className="text-right font-bold">
                          {t('leaderboard.peak_wpm')}
                        </TableHead>
                        <TableHead className="text-right font-bold">
                          {t('leaderboard.avg_wpm')}
                        </TableHead>
                        <TableHead className="text-right font-bold">{t('leaderboard.accuracy')}</TableHead>
                        <TableHead className="text-right font-bold">
                          {t('leaderboard.streak')}
                        </TableHead>
                        <TableHead className="text-right font-bold">
                          {t('leaderboard.tests')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentLeaders.map((player) => (
                        <React.Fragment key={player.rank || player.userId}>
                          <TableRow
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
                            <TableCell className="max-w-30 sm:max-w-none">
                              <div className="flex items-center gap-3">
                                {player.profileImage ? (
                                  <img
                                    src={player.profileImage}
                                    alt={player.name}
                                    className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center font-semibold text-sm shrink-0">
                                    {player.name ? player.name.charAt(0).toUpperCase() : '?'}
                                  </div>
                                )}
                                <div className="truncate">
                                  <p className="font-semibold text-foreground truncate" title={player.name}>{player.name}</p>
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
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-4 py-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalCount)} of{" "}
                      {totalCount} players
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
        {!isLoading && !error && currentLeaders.length === 0 && (
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
                  setCurrentPage(1);
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