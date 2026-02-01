# Production-Grade Network Status Handling System

## Architecture Overview

This system implements a professional-grade network awareness layer inspired by GitHub, Google, Notion, Instagram, and Slack. It handles four distinct network states with appropriate UI/UX for each.

---

## Network States

### 1. **Online** (Normal)
- Default state when connection is stable
- No UI interference

### 2. **Offline** (No Internet)
- Full-page blocking state
- User cannot interact with the app
- Shows friendly offline screen with retry button
- Automatically retries when connection returns

### 3. **Slow Network**
- Triggered when requests take > 3 seconds
- Non-blocking banner at top of page
- Dismissible with button
- Warning tone but not alarming
- App remains fully usable

### 4. **Reconnecting**
- Shown briefly during network recovery
- Auto-dismisses after 2-3 seconds
- Optional toast notification

---

## Architecture Components

### Context Layer (`NetworkContext.jsx`)
**Responsibilities:**
- Tracks network state (online/offline/slow/reconnecting)
- Detects slow network using 3-second timeout
- Manages pending requests for auto-retry
- Exposes API for other components

**Key Exports:**
- `NetworkProvider` - Context provider component
- `NetworkContext` - Raw context (for hooks)

**State Management:**
```
networkStatus: 'online' | 'offline' | 'slow' | 'reconnecting'
isConnected: boolean
slowNetworkDetected: boolean
showReconnecting: boolean
```

### Hook (`useNetworkStatus.js`)
**Safe way to access network state** from any component:
```javascript
const { 
  networkStatus,        // Current state
  isConnected,          // Boolean
  slowNetworkDetected,  // Boolean
  showReconnecting,     // Boolean
  detectSlowNetwork,    // Function to trigger slow network detection
  clearSlowNetworkDetection, // Function to clear detection
  addPendingRequest,    // Function to queue requests for retry
  clearPendingRequests, // Function to clear queue
} = useNetworkStatus();
```

### UI Components (`components/NetworkStatus/index.jsx`)

#### 1. `<OfflineScreen />`
**When to use:** When user is completely offline
**Position:** Full page overlay (fixed inset-0, z-50)
**Features:**
- Centered icon and text
- Friendly copy
- Retry button
- Blocks all interactions

**Example:**
```jsx
<OfflineScreen />
```

#### 2. `<NetworkStatusBanner />`
**When to use:** Slow network or reconnecting
**Position:** Sticky top (below navbar)
**Features:**
- Fixed at top with z-40
- Animated icon (spinning for reconnecting)
- Dismissible for slow network
- Color-coded (amber for slow, blue for reconnecting)

**Example:**
```jsx
<NetworkStatusBanner />
```

#### 3. `<NetworkErrorFallback />`
**When to use:** Single component/API call failed (not whole app)
**Position:** Inline, where data should appear
**Features:**
- Card-style error state
- Compact message
- Retry button
- Used in individual components

**Example:**
```jsx
{error ? (
  <NetworkErrorFallback 
    onRetry={() => refetch()}
    title="Failed to load profile"
  />
) : (
  <ProfileData />
)}
```

#### 4. `<SkeletonLoader />`
**When to use:** Showing loading state (better than spinner)
**Features:**
- Configurable number of lines
- Animated shimmer effect
- Better perceived performance

**Example:**
```jsx
{loading ? (
  <SkeletonLoader lines={5} />
) : (
  <DataContent />
)}
```

#### 5. `<ReconnectedToast />`
**When to use:** Brief notification when reconnecting
**Position:** Bottom-right corner
**Features:**
- Auto-dismisses after 2 seconds
- Subtle green notification
- Shows "Back online" or "Reconnecting…"

**Example:**
```jsx
<ReconnectedToast />
```

---

## API Integration

### Using Network-Aware API (`lib/networkAwareApi.js`)

#### Method 1: Direct Function Calls
```javascript
import { createNetworkAwareApi } from '@/lib/networkAwareApi';

// In component
const { makeRequest } = createNetworkAwareApi();

const result = await makeRequest('/api/endpoint', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` },
});

if (result.error) {
  console.error(result.message);
  // Show error to user
  handleError(result.retry);
} else {
  console.log(result.data);
  // Success
}
```

#### Method 2: Pre-built API Methods
```javascript
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';

const api = createNetworkAwareApiMethods();

// Use auth methods
const loginResult = await api.auth.login(email, password);

// Use profile methods
const profileResult = await api.profile.getFullProfile(email, token);

// Use text methods
const textResult = await api.text.fetchRandomText(50, true, false);

// Use likes methods
const likeResult = await api.likes.addLike(resultId, token);
```

### Response Format
```javascript
// Success
{
  error: false,
  data: { /* API response */ },
  status: 200
}

// Error
{
  error: true,
  message: "Failed to load data",
  code: "NETWORK_ERROR",
  offline: false, // true if offline
  retry: () => { /* retry function */ }
}
```

---

## Integration in Components

### Example 1: Typing Test Page
```javascript
import { useNetworkStatus } from '@/context/useNetworkStatus';
import { NetworkErrorFallback, SkeletonLoader } from '@/components/NetworkStatus';
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';

export function TypingTest() {
  const { isConnected } = useNetworkStatus();
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = createNetworkAwareApiMethods();

  const loadText = async () => {
    setLoading(true);
    const result = await api.text.fetchRandomText(50, true, false);
    
    if (result.error) {
      setError(result);
      return;
    }
    
    setText(result.data);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    loadText();
  }, []);

  if (loading) return <SkeletonLoader lines={5} />;
  
  if (error) {
    return (
      <NetworkErrorFallback 
        onRetry={loadText}
        title="Failed to load typing test"
      />
    );
  }

  return (
    <div>
      <p>{text?.text}</p>
      {/* Input, stats, etc. */}
    </div>
  );
}
```

### Example 2: Profile Component
```javascript
import { useNetworkStatus } from '@/context/useNetworkStatus';
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';

export function Profile({ email, token }) {
  const { isConnected } = useNetworkStatus();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const api = createNetworkAwareApiMethods();

  useEffect(() => {
    const loadProfile = async () => {
      if (!isConnected) return; // Skip if offline

      const result = await api.profile.getFullProfile(email, token);
      
      if (result.error) {
        setError(result);
        return;
      }
      
      setProfile(result.data);
      setError(null);
    };

    loadProfile();
  }, [email, token, isConnected]);

  if (error) {
    return (
      <NetworkErrorFallback 
        onRetry={() => { /* reload */ }}
        title="Failed to load profile"
      />
    );
  }

  return profile ? <ProfileView data={profile} /> : null;
}
```

---

## UX Copywriting Guide

### Offline Screen
- **Headline:** "You're offline"
- **Description:** "Check your internet connection and try again"
- **Button:** "Try Again"
- **Secondary:** "We'll reconnect automatically when your connection returns"

### Slow Network Banner
- **Status:** "Network is slow"
- **Description:** "Some actions may take longer than usual"
- **Action:** "Dismiss"

### Reconnecting Banner
- **Status:** "Reconnecting…"
- **Auto-message after:** "Back online"

### Error Fallback
- **Title:** "Failed to load [component name]"
- **Description:** "We're having trouble loading this data. Please try again."
- **Button:** "Retry"

### Toast
- **Reconnecting:** "Reconnecting…"
- **Connected:** "Back online"

---

## Best Practices

### 1. **Always Provide a Retry Option**
Never leave user stuck with error. Always show a retry button or auto-retry.

### 2. **Use Skeleton Loaders**
Prefer skeleton screens over spinners for perceived performance.

### 3. **Handle Slow Network Gracefully**
Don't block entire app. Show warning banner and let user continue.

### 4. **Clear Language**
- Avoid technical terms
- Use friendly, conversational tone
- Never show raw error messages

### 5. **Auto-Retry When Connection Restored**
User shouldn't need to manually refresh. Queue requests and retry automatically.

### 6. **Optimize Request Timeouts**
- Short operations: 5-10 seconds
- Long operations: 15-30 seconds
- Image uploads: 30-60 seconds

### 7. **Test on Slow Networks**
Use Chrome DevTools throttling to simulate:
- "Slow 4G" (20 Mbps)
- "Fast 3G" (4 Mbps)
- Custom throttle (0.5 Mbps)

---

## Integration Checklist

- [x] NetworkProvider wraps App
- [x] OfflineScreen displayed when offline
- [x] NetworkStatusBanner for slow/reconnecting
- [x] ReconnectedToast on reconnection
- [x] API methods use createNetworkAwareApiMethods
- [x] Components handle error states
- [x] Skeleton loaders used for loading
- [x] Error retry buttons functional
- [x] Tested on slow networks
- [x] Mobile responsive

---

## Performance Considerations

### Re-render Optimization
- Network context only triggers re-renders on state change
- Banner component optimized with React.memo
- Pending requests stored in useRef (no re-renders)

### Memory Management
- Timers cleaned up on unmount
- Pending requests cleared after retry
- No memory leaks on rapid online/offline

### Bundle Size Impact
- Core system: ~8 KB
- With UI components: ~12 KB
- Can be code-split for lazy load

---

## Troubleshooting

### Banner not showing
1. Check NetworkProvider wraps App
2. Verify useNetworkStatus hook used correctly
3. Check z-index values aren't conflicting

### Requests not retrying
1. Verify error is network-related
2. Check retry function being called
3. Look for console errors

### Offline screen stuck
1. Check for CSS conflicts with modal
2. Verify z-index is highest (50)
3. Check onClick handler on retry button

### Slow network not detected
1. Verify timeout is set correctly (3000ms default)
2. Check request isn't finishing too quickly
3. Use DevTools throttle to simulate

---

## Future Enhancements

- [ ] Service Worker for offline-first experience
- [ ] WebSocket connection health monitoring
- [ ] Request batching during slow network
- [ ] Per-feature network error handling
- [ ] Analytics integration
- [ ] A/B testing different error messages
- [ ] Offline-capable data persistence

---

## References

### Similar Implementations
- GitHub: Yellow banner for slow network
- Notion: Full-page offline view
- Slack: Reconnecting indicator
- Instagram: Retry with exponential backoff
- Google: Skeleton loaders instead of spinners

### Browser APIs Used
- `navigator.onLine` - Online/offline status
- `fetch() with AbortController` - Request timeout
- `online/offline events` - Connection change events
- `setTimeout/clearTimeout` - Delay management
