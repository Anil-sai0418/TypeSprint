# Network Status System - Quick Reference

## 1. Use Network Status in Any Component

```javascript
import { useNetworkStatus } from '@/context/useNetworkStatus';

function MyComponent() {
  const { 
    networkStatus,              // 'online' | 'offline' | 'slow' | 'reconnecting'
    isConnected,                // boolean
    slowNetworkDetected,        // boolean
    showReconnecting,           // boolean
  } = useNetworkStatus();

  return (
    <div>
      {isConnected ? 'Online' : 'Offline'}
    </div>
  );
}
```

## 2. Fetch Data with Network Awareness

```javascript
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';

async function loadData() {
  const api = createNetworkAwareApiMethods();

  const result = await api.auth.login(email, password);
  
  if (result.error) {
    console.error(result.message);
    // Show retry button with: result.retry()
  } else {
    console.log(result.data); // Success
  }
}
```

## 3. Show Errors to User

```javascript
import { NetworkErrorFallback } from '@/components/NetworkStatus';

function MyComponent() {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <NetworkErrorFallback 
        onRetry={() => loadData()}
        title="Failed to load data"
      />
    );
  }

  return <div>Content</div>;
}
```

## 4. Loading State (Skeleton Not Spinner)

```javascript
import { SkeletonLoader } from '@/components/NetworkStatus';

function MyComponent() {
  if (loading) {
    return <SkeletonLoader lines={4} className="mb-4" />;
  }
  return <div>Content</div>;
}
```

## 5. Available API Methods

```javascript
const api = createNetworkAwareApiMethods();

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
```

## 6. Response Format

```javascript
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
```

## 7. Conditional Rendering Pattern

```javascript
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
  }, [isConnected, email, token]); // eslint-disable-line react-hooks/exhaustive-deps

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
```

## 8. Custom Request Options

```javascript
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
```

## 9. Network State Checks

```javascript
const { isConnected } = useNetworkStatus();

// Check if offline
if (!isConnected) {
  // Disable functionality
}

// Check if slow
const { slowNetworkDetected } = useNetworkStatus();
if (slowNetworkDetected) {
  // Show warning
}

// Check if reconnecting
const { showReconnecting } = useNetworkStatus();
if (showReconnecting) {
  // Maybe disable user input
}
```

## Best Practices

✅ Always check `isConnected` before fetching  
✅ Use `SkeletonLoader` instead of spinner  
✅ Show `NetworkErrorFallback` for failures  
✅ Add `onRetry` handler to error states  
✅ Include error states in all components  
✅ Use `createNetworkAwareApiMethods`  
✅ Never show raw error messages  
✅ Handle offline gracefully  
✅ Test with DevTools throttling  

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Banner not showing | Check NetworkProvider wraps App, verify z-index |
| Requests not retrying | Check error is network-related, verify retry called |
| Performance issue | Profile with DevTools, check re-renders |
| Dark mode colors wrong | Check dark class, verify Tailwind config |
| Offline screen stuck | Check z-index conflicts, verify click handler |

## Testing Checklist

- [ ] Test offline (DevTools > Network > Offline)
- [ ] Test slow network (DevTools > Network > Slow 4G)
- [ ] Test error recovery (go back online)
- [ ] Test mobile view
- [ ] Test dark mode
- [ ] Test all API calls
- [ ] Test error boundaries
- [ ] Verify bundle size < 15 KB

## Files Created

```
frontend/src/
├── context/
│   ├── NetworkContext.jsx
│   ├── NetworkContextConfig.js
│   └── useNetworkStatus.js
├── components/NetworkStatus/
│   ├── index.jsx
│   └── Examples.jsx
├── hooks/
│   └── useNetworkAwareFetch.js
├── lib/
│   └── networkAwareApi.js
└── App.jsx (modified)

frontend/
├── NETWORK_SYSTEM_DOCS.md
├── NETWORK_TESTING_GUIDE.md
└── NETWORK_QUICK_REFERENCE.md
```
