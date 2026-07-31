import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFullUserProfile,
  getUserStats,
  getLeaderboard,
  getLikeCount,
  getLikeStatus,
  toggleLike,
  updateProfileData,
  saveTestResult,
  fetchRandomText,
  getContributionActivity
} from '../services/api';
import { queryKeys } from '../lib/queryKeys';

// --- USER PROFILE & STATS HOOKS ---

export const useUserProfileQuery = (email, token, options = {}) => {
  return useQuery({
    queryKey: queryKeys.userProfile(email),
    queryFn: () => getFullUserProfile(email, token),
    enabled: Boolean(email && token),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if token is invalid or request fails
    ...options
  });
};

export const useUserStatsQuery = (email, token, options = {}) => {
  return useQuery({
    queryKey: queryKeys.userStats(email),
    queryFn: () => getUserStats(email, token),
    enabled: Boolean(email && token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, data, token }) => updateProfileData(email, data, token),
    onSuccess: (response, variables) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(variables.email) });
      }
    }
  });
};

// --- LEADERBOARD HOOKS ---

export const useLeaderboardQuery = (limit = 100, options = {}) => {
  return useQuery({
    queryKey: queryKeys.leaderboard(limit),
    queryFn: () => getLeaderboard(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options
  });
};

// --- LIKES HOOKS ---

export const useLikeCountQuery = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.likesCount(),
    queryFn: getLikeCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

export const useLikeStatusQuery = (email, token, options = {}) => {
  return useQuery({
    queryKey: queryKeys.likeStatus(email),
    queryFn: () => getLikeStatus(email, token),
    enabled: Boolean(email && token),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options
  });
};

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, token }) => toggleLike(email, token),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.likesCount() });
      if (variables.email) {
        queryClient.invalidateQueries({ queryKey: queryKeys.likeStatus(variables.email) });
      }
    }
  });
};

// --- CONTRIBUTION HEATMAP HOOK ---

export const useContributionActivityQuery = (email, days = 365, token = null, options = {}) => {
  return useQuery({
    queryKey: queryKeys.contributionActivity(email, days),
    queryFn: () => getContributionActivity(email, days, token),
    enabled: Boolean(email && token),
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    retry: false,
    ...options
  });
};

// --- TYPING TEST RESULT MUTATION ---

export const useSaveTestResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testData, token }) => saveTestResult(testData, token),
    onSuccess: (data, variables) => {
      const email = variables.testData?.email;
      if (email) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userStats(email) });
        queryClient.invalidateQueries({ queryKey: queryKeys.userActivity(email) });
        queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(email) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contributionActivity(email) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contributionStats(email) });
      }
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    }
  });
};

// --- RANDOM TEXT QUERY ---

export const useRandomTextQuery = (wordLimit = 50, includePunctuation = false, includeNumbers = false, options = {}) => {
  return useQuery({
    queryKey: queryKeys.randomText(wordLimit, includePunctuation, includeNumbers),
    queryFn: () => fetchRandomText(wordLimit, includePunctuation, includeNumbers),
    staleTime: 1 * 60 * 1000, // 1 minute cache for identical text settings
    ...options
  });
};
