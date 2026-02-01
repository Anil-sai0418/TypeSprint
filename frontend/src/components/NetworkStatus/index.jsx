import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '../../context/useNetworkStatus';

/**
 * Full-page offline state
 * Shows when user has no internet connection
 * Blocks all interactions until connection is restored
 */
export function OfflineScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center px-6 max-w-md">
        {/* Icon */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <WifiOff size={48} className="text-gray-600 dark:text-gray-400" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          You're offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          Check your internet connection and try again
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>

        {/* Secondary text */}
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-6">
          We'll reconnect automatically when your connection returns
        </p>
      </div>
    </div>
  );
}

/**
 * Network status banner
 * Shows slow network or reconnecting states
 * Non-blocking, positioned at top
 */
export function NetworkStatusBanner() {
  const { networkStatus, showReconnecting } = useNetworkStatus();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Don't show offline state here (full page overlay handles it)
  if (networkStatus === 'offline') return null;
  if (networkStatus === 'online' && !showReconnecting) return null;
  if (isDismissed && networkStatus === 'slow') return null;

  const isSlow = networkStatus === 'slow';
  const isReconnecting = showReconnecting || networkStatus === 'reconnecting';

  return (
    <div
      className={`sticky top-0 z-40 px-4 py-3 border-b transition-colors duration-300 ${
        isReconnecting
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isReconnecting ? (
            <RefreshCw
              size={18}
              className="text-blue-600 dark:text-blue-400 animate-spin"
            />
          ) : (
            <AlertTriangle
              size={18}
              className="text-amber-600 dark:text-amber-400"
            />
          )}

          <div className="flex flex-col gap-1">
            <p
              className={`text-sm font-semibold ${
                isReconnecting
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-amber-900 dark:text-amber-100'
              }`}
            >
              {isReconnecting ? 'Reconnecting…' : 'Network is slow'}
            </p>
            {isSlow && (
              <p className="text-xs text-amber-700 dark:text-amber-200">
                Some actions may take longer than usual
              </p>
            )}
          </div>
        </div>

        {/* Dismiss button for slow network */}
        {isSlow && !isReconnecting && (
          <button
            onClick={() => setIsDismissed(true)}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-sm font-medium"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline error fallback component
 * Used when API requests fail at component level
 */
export function NetworkErrorFallback({ onRetry, title = 'Failed to load' }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
      <div className="inline-flex p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
        <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
      </div>

      <p className="text-gray-900 dark:text-white font-medium mb-2">
        {title}
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        We're having trouble loading this data. Please try again.
      </p>

      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors duration-200"
      >
        Retry
      </button>
    </div>
  );
}

/**
 * Skeleton loader component
 * Shows while data is loading (better UX than spinner)
 */
export function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * Connection restored toast
 * Brief notification when connection returns
 */
export function ReconnectedToast() {
  const { showReconnecting, networkStatus } = useNetworkStatus();
  const [show, setShow] = React.useState(showReconnecting);

  React.useEffect(() => {
    if (showReconnecting) {
      setShow(true);
    } else if (networkStatus === 'online') {
      // Show for 2 seconds then hide
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showReconnecting, networkStatus]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4">
      <div className="px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-3">
        <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
        <span className="text-sm font-medium">
          {showReconnecting ? 'Reconnecting…' : 'Back online'}
        </span>
      </div>
    </div>
  );
}

export default {
  OfflineScreen,
  NetworkStatusBanner,
  NetworkErrorFallback,
  SkeletonLoader,
  ReconnectedToast,
};
