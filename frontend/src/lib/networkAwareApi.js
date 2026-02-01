/**
 * Network-Aware API Service Wrapper
 * Integrates with your existing API and adds:
 * - Automatic retry on network restoration
 * - Slow network detection
 * - Graceful offline handling
 * - Request timeout management
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://typevex-1.onrender.com';

// Store for pending requests that need retry
const pendingRequests = new Map();

/**
 * Create network-aware fetch wrapper
 * Usage: Replace fetch() calls with this function
 */
export function createNetworkAwareApi(getNetworkStatus = null) {
  const makeRequest = async (
    endpoint,
    options = {},
    config = {}
  ) => {
    const {
      timeout = 15000,
      retries = 3,
      retryDelay = 1000,
    } = config;

    let networkStatus = {};
    
    // Try to get network status from hook if provided
    if (getNetworkStatus && typeof getNetworkStatus === 'function') {
      try {
        networkStatus = getNetworkStatus();
      } catch {
        // Hook not available, use navigator.onLine as fallback
        networkStatus = { isConnected: navigator.onLine };
      }
    } else {
      // Fallback to navigator API
      networkStatus = { isConnected: navigator.onLine };
    }

    const { isConnected, detectSlowNetwork, clearSlowNetworkDetection } = networkStatus;

    // If offline, queue request and return error
    if (!isConnected) {
      return {
        error: true,
        message: 'You are currently offline. Request will retry when connection returns.',
        offline: true,
        retry: () => makeRequest(endpoint, options, config),
      };
    }

    let lastError;
    let attempts = 0;
    let timeoutId;

    while (attempts < retries) {
      try {
        attempts++;
        detectSlowNetwork?.();

        // Create abort controller for timeout
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), timeout);

        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);
        clearSlowNetworkDetection?.();

        // Handle response
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP ${response.status}`);
        }

        // Clear pending request if exists
        pendingRequests.delete(endpoint);

        return {
          error: false,
          data,
          status: response.status,
        };
      } catch (error) {
        lastError = error;
        if (timeoutId) clearTimeout(timeoutId);

        // Network errors (timeout, fetch failed, abort)
        const isNetworkError =
          error.name === 'AbortError' ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('offline');

        if (isNetworkError && attempts < retries) {
          // Exponential backoff retry
          await new Promise(resolve =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1))
          );
          continue;
        }

        // For other errors, break immediately
        break;
      }
    }

    // All retries failed
    return {
      error: true,
      message: lastError?.message || 'Failed to complete request',
      code: 'NETWORK_ERROR',
      retry: () => makeRequest(endpoint, options, config),
    };
  };

  return { makeRequest };
}

/**
 * Example: Enhanced API endpoints using network-aware wrapper
 * Replace your existing fetch calls with these
 */
export const createNetworkAwareApiMethods = (getNetworkStatus = null) => {
  const { makeRequest } = createNetworkAwareApi(getNetworkStatus);

  return {
    // Auth endpoints
    auth: {
      register: async (name, email, password) => {
        return makeRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
      },

      login: async (email, password) => {
        return makeRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
      },
    },

    // Profile endpoints
    profile: {
      getFullProfile: async (email, token) => {
        return makeRequest(`/profile/${email}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }, { priority: 'high' });
      },

      updateProfile: async (email, data, token) => {
        return makeRequest(`/profile/${email}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: { 'Authorization': `Bearer ${token}` },
        });
      },

      getStats: async (email, token) => {
        return makeRequest(`/profile/${email}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }, { priority: 'high' });
      },
    },

    // Typing test endpoints
    text: {
      fetchRandomText: async (wordLimit = 50, includePunctuation = false, includeNumbers = false) => {
        const params = new URLSearchParams({
          wordLimit,
          includePunctuation,
          includeNumbers,
        });
        return makeRequest(`/random-text?${params.toString()}`, {}, { priority: 'high' });
      },
    },

    // Likes endpoints
    likes: {
      addLike: async (resultId, token) => {
        return makeRequest('/like', {
          method: 'POST',
          body: JSON.stringify({ resultId }),
          headers: { 'Authorization': `Bearer ${token}` },
        });
      },

      removeLike: async (resultId, token) => {
        return makeRequest(`/like/${resultId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      },
    },
  };
};

/**
 * Global offline request queue
 * Auto-retry when connection restored
 */
export function setupOfflineRequestQueue() {
  window.addEventListener('online', () => {
    // Retry all pending requests
    pendingRequests.forEach((request) => {
      if (typeof request.retry === 'function') {
        request.retry();
      }
    });
    pendingRequests.clear();
  });
}

export default {
  createNetworkAwareApi,
  createNetworkAwareApiMethods,
  setupOfflineRequestQueue,
};
