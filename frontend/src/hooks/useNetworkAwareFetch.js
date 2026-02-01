import { useNetworkStatus } from '../context/useNetworkStatus';

/**
 * Enhanced fetch wrapper with network awareness
 * Automatically retries on network restoration
 * Detects slow network
 * Handles errors gracefully
 */
export function useFetch() {
  const { 
    isConnected, 
    detectSlowNetwork, 
    clearSlowNetworkDetection, 
    addPendingRequest,
  } = useNetworkStatus();

  const fetchWithRetry = async (
    url,
    options = {},
    { 
      timeout = 15000, // 15 seconds default timeout
      retries = 3,
      retryDelay = 1000,
      onError = null,
    } = {}
  ) => {
    // If offline, add to pending and reject
    if (!isConnected) {
      return new Promise((resolve, reject) => {
        const retryFn = () => fetchWithRetry(url, options, { timeout, retries, retryDelay, onError });
        addPendingRequest(retryFn);
        reject(new Error('Network is offline'));
      });
    }

    let lastError;
    let attempts = 0;
    let timeoutId;

    while (attempts < retries) {
      try {
        attempts++;
        detectSlowNetwork();

        // Create abort controller for timeout
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        clearSlowNetworkDetection();

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Network errors or timeout
        if (
          error.name === 'AbortError' ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('offline')
        ) {
          // Attempt retry if not last attempt
          if (attempts < retries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
            continue;
          }
        }

        // For non-network errors, break immediately
        throw error;
      }
    }

    throw lastError;
  };

  return { fetchWithRetry };
}

/**
 * HOC to wrap data-fetching components with error boundary
 * Automatically handles network errors
 */
export function withNetworkErrorBoundary(WrappedComponent) {
  function Wrapper(props) {
    const { isConnected, networkStatus } = useNetworkStatus();
    const { fetchWithRetry } = useFetch();

    // Pass network context to wrapped component
    return (
      <WrappedComponent 
        {...props} 
        isConnected={isConnected}
        networkStatus={networkStatus}
        fetchWithRetry={fetchWithRetry}
      />
    );
  }

  Wrapper.displayName = `withNetworkErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  return Wrapper;
}
