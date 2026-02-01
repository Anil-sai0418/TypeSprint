import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../context/useNetworkStatus';
import { NetworkErrorFallback, SkeletonLoader } from './NetworkStatus';
import { createNetworkAwareApiMethods } from '../lib/networkAwareApi';

/**
 * Example Component: Typing Test with Network Awareness
 * 
 * This demonstrates best practices for:
 * - Fetching data with network awareness
 * - Handling loading states
 * - Displaying network errors
 * - Using skeleton loaders
 * - Auto-retry on connection restored
 */
export function ExampleTypingTestComponent() {
  const { isConnected, networkStatus } = useNetworkStatus();
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wordLimit, setWordLimit] = useState(50);

  // Create network-aware API methods
  const api = createNetworkAwareApiMethods();

  /**
   * Fetch random text for typing test
   */
  const loadText = async () => {
    // Don't fetch if offline
    if (!isConnected) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await api.text.fetchRandomText(wordLimit, true, false);

    if (result.error) {
      setError(result);
      setLoading(false);
      return;
    }

    setText(result.data);
    setLoading(false);
  };

  /**
   * Initial load and reload on connection restored
   */
  useEffect(() => {
    const initLoad = async () => {
      await loadText();
    };
    initLoad();
  }, [isConnected, wordLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Typing Test
        </h2>

        {/* Word limit selector */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-700 dark:text-gray-300">Words:</label>
          <select
            value={wordLimit}
            onChange={(e) => setWordLimit(Number(e.target.value))}
            disabled={loading || !isConnected}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
          >
            <option value={25}>25 words</option>
            <option value={50}>50 words</option>
            <option value={100}>100 words</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <SkeletonLoader lines={4} />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <NetworkErrorFallback 
          onRetry={loadText}
          title="Failed to load typing test"
        />
      )}

      {/* Success state */}
      {!loading && !error && text && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-2xl text-gray-900 dark:text-white leading-relaxed mb-8">
            {text.text}
          </p>

          {/* Input area */}
          <input
            type="text"
            placeholder="Start typing..."
            className="w-full px-4 py-3 border-2 border-blue-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />

          {/* Metadata */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>{text.text.split(' ').length} words • {text.text.length} characters</p>
          </div>
        </div>
      )}

      {/* Offline notice */}
      {!isConnected && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded text-amber-800 dark:text-amber-100">
          You're offline. Content will load when your connection returns.
        </div>
      )}

      {/* Network status indicator (for demo) */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
        <p>Network Status: <span className="font-mono font-semibold">{networkStatus}</span></p>
        <p>Connected: <span className="font-mono font-semibold">{isConnected ? 'Yes' : 'No'}</span></p>
      </div>
    </div>
  );
}

/**
 * Example Component: Profile with Inline Error Handling
 * 
 * Demonstrates:
 * - Component-level error states
 * - Inline NetworkErrorFallback
 * - Proper data fetching pattern
 */
export function ExampleProfileComponent({ email, token }) {
  const { isConnected } = useNetworkStatus();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const api = createNetworkAwareApiMethods();

  const loadProfile = async () => {
    if (!isConnected || !email || !token) return;

    setLoading(true);
    const result = await api.profile.getFullProfile(email, token);

    if (result.error) {
      setProfileError(result);
    } else {
      setProfile(result.data);
      setProfileError(null);
    }
  };

  const loadStats = async () => {
    if (!isConnected || !email || !token) return;

    const result = await api.profile.getStats(email, token);

    if (result.error) {
      setStatsError(result);
    } else {
      setStats(result.data);
      setStatsError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const initLoad = async () => {
      if (isConnected && email && token) {
        await loadProfile();
        await loadStats();
      }
    };
    initLoad();
  }, [email, token, isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Profile Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Profile
        </h2>

        {loading && <SkeletonLoader lines={3} />}

        {profileError && (
          <NetworkErrorFallback 
            onRetry={loadProfile}
            title="Failed to load profile"
          />
        )}

        {!loading && !profileError && profile && (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Statistics
        </h2>

        {loading && <SkeletonLoader lines={4} />}

        {statsError && (
          <NetworkErrorFallback 
            onRetry={loadStats}
            title="Failed to load statistics"
          />
        )}

        {!loading && !statsError && stats && (
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              label="Tests Completed"
              value={stats.testsCompleted || 0}
            />
            <StatCard 
              label="Average WPM"
              value={stats.averageWpm || 0}
            />
            <StatCard 
              label="Best WPM"
              value={stats.bestWpm || 0}
            />
            <StatCard 
              label="Accuracy"
              value={`${stats.accuracy || 0}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable Stat Card Component
 */
function StatCard({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export default {
  ExampleTypingTestComponent,
  ExampleProfileComponent,
};
