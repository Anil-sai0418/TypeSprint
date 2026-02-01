/*
 * NETWORK STATUS SYSTEM - QUICK REFERENCE
 * ========================================
 *
 * This is a reference file showing common patterns.
 * Not meant to be imported - use as copy-paste guide.
 */

// 1. USE NETWORK STATUS IN ANY COMPONENT
// ======================================
// import { useNetworkStatus } from '@/context/useNetworkStatus';
//
// function MyComponent() {
//   const { 
//     networkStatus,              // 'online' | 'offline' | 'slow' | 'reconnecting'
//     isConnected,                // boolean
//     slowNetworkDetected,        // boolean
//     showReconnecting,           // boolean
//   } = useNetworkStatus();
//
//   return (
//     <div>
//       {isConnected ? 'Online' : 'Offline'}
//     </div>
//   );
// }

// 2. FETCH DATA WITH NETWORK AWARENESS
// =====================================
// import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';
//
// async function loadData() {
//   const api = createNetworkAwareApiMethods();
//
//   const result = await api.auth.login(email, password);
//   if (result.error) {
//     console.error(result.message);
//     // Show retry button with: result.retry()
//   } else {
//     console.log(result.data);
//   }
// }

// 3. SHOW ERRORS TO USER
// ======================
// import { NetworkErrorFallback } from '@/components/NetworkStatus';
//
// function MyComponent() {
//   const [error, setError] = useState(null);
//
//   if (error) {
//     return (
//       <NetworkErrorFallback 
//         onRetry={() => loadData()}
//         title="Failed to load data"
//       />
//     );
//   }
//   return <div>Content</div>;
// }

// 4. LOADING STATE (SKELETON NOT SPINNER)
// ========================================
// import { SkeletonLoader } from '@/components/NetworkStatus';
//
// function MyComponent() {
//   if (loading) {
//     return <SkeletonLoader lines={4} className="mb-4" />;
//   }
//   return <div>Content</div>;
// }

// ============================================

// 5. AVAILABLE API METHODS
// ========================
// Auth
api.auth.register(name, email, password)
api.auth.login(email, password)

// Profile
api.profile.getFullProfile(email, token)
api.profile.updateProfile(email, data, token)
api.profile.getStats(email, token)

// Text (Typing Test)
api.text.fetchRandomText(wordLimit, includePunctuation, includeNumbers)

// Likes
api.likes.addLike(resultId, token)
api.likes.removeLike(resultId, token)

// ============================================

// 6. RESPONSE FORMAT
// ==================
// Success
{
  error: false,
  data: { /* API response */ },
  status: 200
}

// Offline
{
  error: true,
  message: "You are currently offline...",
  offline: true,
  retry: () => { /* retry function */ }
}

// Error
{
  error: true,
  message: "Failed to complete request",
  code: "NETWORK_ERROR",
  retry: () => { /* retry function */ }
}

// ============================================

// 7. CONDITIONAL RENDERING PATTERN
// ==================================
function DataComponent({ email, token }) {
  const { isConnected } = useNetworkStatus();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = createNetworkAwareApiMethods();

  useEffect(() => {
    const loadData = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      const result = await api.profile.getFullProfile(email, token);
      
      if (result.error) {
        setError(result);
      } else {
        setData(result.data);
        setError(null);
      }
      setLoading(false);
    };

    loadData();
  }, [isConnected, email, token]); // eslint-disable-line

  // Offline
  if (!isConnected) {
    return <div>You're offline. This will load when connected.</div>;
  }

  // Loading
  if (loading) {
    return <SkeletonLoader lines={3} />;
  }

  // Error
  if (error) {
    return <NetworkErrorFallback onRetry={loadData} />;
  }

  // Success
  return <div>{data?.name}</div>;
}

// ============================================

// 8. CUSTOM REQUEST OPTIONS
// ==========================
const { makeRequest } = createNetworkAwareApi();

const result = await makeRequest(
  '/api/endpoint',
  {
    method: 'POST',
    body: JSON.stringify({ data: 'value' }),
    headers: { 'Authorization': `Bearer ${token}` },
  },
  {
    timeout: 20000,      // 20 seconds
    retries: 5,          // retry up to 5 times
    retryDelay: 1000,    // start with 1 second
  }
);

// ============================================

// 9. NETWORK STATE IN HOOKS
// ==========================
// Check if offline
const { isConnected } = useNetworkStatus();
if (!isConnected) {
  // Disable functionality
}

// Check if slow
const { slowNetworkDetected } = useNetworkStatus();
if (slowNetworkDetected) {
  // Show warning or disable heavy operations
}

// Check if reconnecting
const { showReconnecting } = useNetworkStatus();
if (showReconnecting) {
  // Maybe disable user input
}

// ============================================

// 10. COMPONENT STRUCTURE EXAMPLE
// ================================
import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/context/useNetworkStatus';
import { NetworkErrorFallback, SkeletonLoader } from '@/components/NetworkStatus';
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';

export function ExamplePage() {
  // 1. Network status
  const { isConnected } = useNetworkStatus();

  // 2. State
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. API
  const api = createNetworkAwareApiMethods();

  // 4. Fetch function
  const loadData = async () => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    const result = await api.text.fetchRandomText(50);
    if (result.error) {
      setError(result);
    } else {
      setData(result.data);
    }
    setLoading(false);
  };

  // 5. Effects
  useEffect(() => {
    loadData();
  }, [isConnected]); // eslint-disable-line

  // 6. Render
  if (!isConnected) return <div>Offline</div>;
  if (loading) return <SkeletonLoader lines={4} />;
  if (error) return <NetworkErrorFallback onRetry={loadData} />;
  
  return <div>{data?.text}</div>;
}

// ============================================

// BEST PRACTICES
// ==============
// ✓ Always check isConnected before fetching
// ✓ Use SkeletonLoader instead of spinner
// ✓ Show NetworkErrorFallback for failures
// ✓ Add onRetry handler to error states
// ✓ Include error states in components
// ✓ Use createNetworkAwareApiMethods
// ✓ Never show raw error messages
// ✓ Handle offline gracefully
// ✓ Test with DevTools throttling
// ✓ Add proper TypeScript types

// ============================================

// TESTING CHECKLIST
// =================
// [ ] Test offline (DevTools > Offline checkbox)
// [ ] Test slow network (DevTools > Slow 4G throttle)
// [ ] Test error recovery (reconnect)
// [ ] Test mobile view
// [ ] Test dark mode
// [ ] Test all API calls
// [ ] Test error boundaries
// [ ] Test accessibility
// [ ] Verify bundle size < 15 KB
// [ ] Check no memory leaks

// ============================================

// TROUBLESHOOTING
// ===============
// Problem: Banner not showing
// Solution: Check NetworkProvider wraps App, verify z-index

// Problem: Requests not retrying
// Solution: Check error is network-related, verify retry called

// Problem: Performance issue
// Solution: Profile with DevTools, check re-renders, verify timers cleaned

// Problem: Dark mode colors wrong
// Solution: Check dark class, verify Tailwind config, inspect colors

// ============================================

// FILES CREATED
// =============
// frontend/src/
//   context/
//     NetworkContext.jsx (Provider component)
//     NetworkContextConfig.js (Context definition)
//     useNetworkStatus.js (Hook)
//   components/NetworkStatus/
//     index.jsx (UI components)
//     Examples.jsx (Example implementations)
//   hooks/
//     useNetworkAwareFetch.js (Fetch hook)
//   lib/
//     networkAwareApi.js (API wrapper)
//   App.jsx (Modified with NetworkProvider)
// 
// frontend/
//   NETWORK_SYSTEM_DOCS.md (Full documentation)
//   NETWORK_TESTING_GUIDE.md (Testing instructions)
//   NETWORK_QUICK_REFERENCE.js (This file)

// ============================================

export default {
  // Reference implementation
};
