# Network Status System - Testing & Implementation Guide

## Quick Start Integration

### Step 1: Verify Files Created
Check that these files exist:
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
```

### Step 2: Update App.jsx (Already Done)
Your app is now wrapped with NetworkProvider and shows network UI.

### Step 3: Start Using in Components
Replace old fetch calls with network-aware API:

```javascript
// OLD
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// NEW
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';
const api = createNetworkAwareApiMethods();
const result = await api.auth.login(email, password);

if (result.error) {
  // Handle error with retry button
} else {
  // Use result.data
}
```

---

## Testing Network States

### Test 1: Complete Offline (No Internet)
**Expected Behavior:**
- Full-page offline screen appears
- No navigation possible
- "Try Again" button visible
- Cannot access app until reconnected

**How to Test:**
1. Chrome DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page
4. Should see offline screen
5. Uncheck "Offline"
6. Should automatically reconnect

**Pass Criteria:**
- ✓ Offline screen appears
- ✓ App is blocked
- ✓ Retry button works
- ✓ Auto-reconnect works

---

### Test 2: Slow Network Detection
**Expected Behavior:**
- Yellow/amber banner appears at top after 3 seconds of no response
- App remains fully usable
- Message: "Network is slow. Some actions may take longer."
- Dismissible

**How to Test:**
1. Chrome DevTools → Network tab → Throttling
2. Select "Slow 4G" (20 Mbps) or custom (0.5 Mbps)
3. Load a page with API call
4. Wait 3+ seconds
5. Banner should appear
6. Click "Dismiss"
7. Should disappear

**Pass Criteria:**
- ✓ Banner appears after 3 seconds
- ✓ Amber color (not red/alarming)
- ✓ App still usable
- ✓ Dismiss button works

---

### Test 3: API Request Failure
**Expected Behavior:**
- Only the failing component shows error
- Other components work normally
- Error card with "Retry" button
- User can retry specific failed component

**How to Test:**
1. Open DevTools → Network tab
2. Simulate network failure for specific API call
3. Load component that makes that call
4. Should show NetworkErrorFallback
5. Click "Retry"
6. Should attempt request again

**Code to Add to Component:**
```javascript
{error ? (
  <NetworkErrorFallback 
    onRetry={loadData}
    title="Failed to load data"
  />
) : (
  <DataView />
)}
```

**Pass Criteria:**
- ✓ Error appears only in that component
- ✓ Retry button works
- ✓ Other components unaffected

---

### Test 4: Reconnecting State
**Expected Behavior:**
- Brief blue banner showing "Reconnecting…"
- Auto-disappears when reconnected
- Optional toast notification
- Pending requests auto-retry

**How to Test:**
1. Go offline (see Test 1)
2. Go back online
3. Should see brief "Reconnecting…" message
4. Then shows "Back online" toast
5. Both auto-disappear after 2-3 seconds

**Pass Criteria:**
- ✓ Reconnecting message shows
- ✓ Auto-disappears
- ✓ Toast notification appears
- ✓ Pending requests auto-retry

---

### Test 5: Slow Network with Requests
**Expected Behavior:**
- Requests still work (just slower)
- Banner shows network is slow
- Skeleton loaders while waiting
- No error messages

**How to Test:**
1. Throttle to Slow 4G
2. Click to load data
3. See skeleton loader
4. After ~3 seconds, see "Network is slow" banner
5. Data eventually loads
6. Success state shows

**Pass Criteria:**
- ✓ Skeleton loader appears
- ✓ Slow network banner appears
- ✓ Data eventually loads
- ✓ No error messages

---

### Test 6: Mobile Responsiveness
**Expected Behavior:**
- All components responsive on mobile
- Banner doesn't hide important UI
- Error cards properly sized
- Touch-friendly buttons

**How to Test:**
1. Chrome DevTools → Toggle device toolbar
2. Test on iPhone 12, iPad, Android
3. Trigger each network state
4. Check all text readable
5. Check all buttons tappable

**Pass Criteria:**
- ✓ Offline screen centered on mobile
- ✓ Banner doesn't overlap content
- ✓ Buttons large enough to tap
- ✓ No horizontal scroll

---

### Test 7: Dark Mode
**Expected Behavior:**
- All components visible in dark mode
- Colors don't create contrast issues
- Icons visible
- Text readable

**How to Test:**
1. In app, toggle dark mode
2. Trigger each network state
3. Verify colors
4. Check text contrast with WCAG checker

**Pass Criteria:**
- ✓ All text readable
- ✓ Icons visible
- ✓ No color contrast issues
- ✓ Consistent theming

---

### Test 8: Auto-Retry Pending Requests
**Expected Behavior:**
- When offline, requests are queued
- When online, queued requests automatically retry
- No user action needed
- Results appear seamlessly

**How to Test:**
1. Go online
2. Trigger a data fetch
3. Immediately go offline
4. Request should fail gracefully
5. Go back online
6. Request should auto-retry
7. Data should appear

**Pass Criteria:**
- ✓ No error shown to user
- ✓ Request auto-retries
- ✓ Data loads without user clicking retry

---

### Test 9: Request Timeout
**Expected Behavior:**
- Requests timeout after 15 seconds (default)
- Shows error with retry option
- Timeout detection works on slow networks

**How to Test:**
1. Mock API that never responds
2. Make request
3. Wait 15+ seconds
4. Should see error: "Failed to complete request"
5. Click retry

**Pass Criteria:**
- ✓ Request times out after 15 seconds
- ✓ Error displayed
- ✓ Retry available

---

## Implementation Checklist

### Phase 1: Core Setup
- [ ] Verify all files created successfully
- [ ] No TypeScript errors
- [ ] App.jsx wraps NetworkProvider
- [ ] No console errors on load

### Phase 2: Manual Testing
- [ ] Test offline state
- [ ] Test slow network
- [ ] Test error recovery
- [ ] Test reconnecting
- [ ] Test mobile view
- [ ] Test dark mode

### Phase 3: Component Integration
- [ ] Replace fetch() in Auth component
- [ ] Replace fetch() in Profile component
- [ ] Replace fetch() in Typing Test component
- [ ] Add error handling to all data-fetching components
- [ ] Add skeleton loaders instead of spinners

### Phase 4: User Testing
- [ ] Test on real network (using DevTools throttle)
- [ ] Test on mobile device
- [ ] Test on slow WiFi
- [ ] Test with intermittent connection
- [ ] Gather user feedback

---

## Example: Converting a Component

### Before (Your Current Code)
```javascript
export const getFullUserProfile = async (email, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// In component
export function ProfilePage({ email, token }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFullUserProfile(email, token)
      .then(setProfile)
      .catch(err => setError(err.message));
  }, [email, token]);

  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Loading...</div>;
  return <div>{profile.name}</div>;
}
```

### After (Network-Aware)
```javascript
import { useNetworkStatus } from '@/context/useNetworkStatus';
import { createNetworkAwareApiMethods } from '@/lib/networkAwareApi';
import { NetworkErrorFallback, SkeletonLoader } from '@/components/NetworkStatus';

export function ProfilePage({ email, token }) {
  const { isConnected } = useNetworkStatus();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = createNetworkAwareApiMethods();

  const loadProfile = async () => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await api.profile.getFullProfile(email, token);

    if (result.error) {
      setError(result);
    } else {
      setProfile(result.data);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [email, token, isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <SkeletonLoader lines={3} />;
  if (error) return <NetworkErrorFallback onRetry={loadProfile} />;
  return <div>{profile?.name}</div>;
}
```

---

## Performance Metrics

### Expected Performance
- **Offline detection:** <100ms
- **Slow network detection:** 3000ms (configurable)
- **Reconnect detection:** <1000ms
- **Auto-retry:** Exponential backoff (1s, 2s, 4s)
- **Bundle size:** ~12 KB (gzipped ~4 KB)

### Optimization Tips
1. Use SkeletonLoader instead of spinner
2. Cache responses when possible
3. Lazy-load network components
4. Use `useCallback` for event handlers
5. Memoize expensive computations

---

## Troubleshooting

### Issue: Banner stuck on screen
**Solution:**
- Check NetworkProvider wraps App
- Verify NetworkStatusBanner in App.jsx
- Clear browser cache and hard refresh

### Issue: Requests not retrying
**Solution:**
- Check error is network-related (not 500 error)
- Verify retry function being called
- Check network becomes online again
- Look for console errors

### Issue: Dark mode colors wrong
**Solution:**
- Check dark class on html element
- Verify Tailwind dark mode enabled
- Check color values in components
- Use Chrome DevTools to inspect

### Issue: Offline screen not showing
**Solution:**
- Verify OfflineScreen component imported
- Check z-index isn't blocked by other elements
- Verify isConnected state is false
- Check for CSS conflicts

### Issue: Performance degradation
**Solution:**
- Profile with Chrome DevTools
- Check for unnecessary re-renders
- Verify timers are cleaned up
- Use React DevTools Profiler
- Consider code-splitting

---

## Next Steps

1. **Immediate:**
   - Run tests in this guide
   - Fix any issues
   - Get approval

2. **Short-term (Week 1):**
   - Convert main API calls
   - Add error states to components
   - User testing on throttled network

3. **Medium-term (Week 2-3):**
   - Add Service Worker for offline support
   - Implement request batching
   - Add analytics tracking

4. **Long-term:**
   - WebSocket connection monitoring
   - Per-feature network handling
   - Offline-first data sync

---

## Support

For issues or questions:
1. Check NETWORK_SYSTEM_DOCS.md
2. Review Examples.jsx for patterns
3. Check linter errors
4. Test with DevTools throttling
5. Inspect browser console for errors

Good luck! 🚀
