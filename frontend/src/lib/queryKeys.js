/**
 * Centralized Query Key Factory
 * Standardizes query keys across UI components, AuthContext, and background notification hooks.
 */
export const queryKeys = {
  // User Profile & Stats
  userProfile: (email) => ['userProfile', email],
  userStats: (email) => ['userStats', email],
  userActivity: (email) => ['userActivity', email],

  // Leaderboard
  leaderboard: (params = 10) => ['leaderboard', typeof params === 'object' ? params : { limit: params }],

  // Text generation
  randomText: (wordLimit, includePunctuation, includeNumbers) => [
    'randomText',
    { wordLimit, includePunctuation, includeNumbers }
  ],

  // Likes
  likesCount: () => ['likes', 'count'],
  likeStatus: (email) => ['likes', 'status', email],

  // Contribution Heatmap
  contributionActivity: (email, days = 365) => ['contribution', 'activity', email, days],
  contributionStats: (email) => ['contribution', 'stats', email],
};
