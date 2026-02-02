# 🔧 Cluster IP Configuration Guide

## Problem: Data Not Coming Due to Cluster IP Issues

**Error:** CORS errors or connection refused when using cluster IP `157.50.99.17/32`

**Root Cause:** Backend CORS configuration didn't whitelist the cluster IP

---

## Solution Applied

### 1. Backend CORS Update ✅

**File:** `backend/server/index.js`

Added cluster IP to CORS whitelist:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://typevex.vercel.app",
    "https://157.50.99.17",      // ← New
    "http://157.50.99.17",       // ← New
    "http://157.50.99.17:*",     // ← New (any port)
    "https://157.50.99.17:*"     // ← New (any port)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
```

### 2. Frontend API Update ✅

**File:** `frontend/.env`

Updated to use cluster IP:
```bash
VITE_API_BASE_URL=https://157.50.99.17
```

---

## Deployment Steps

### Step 1: Deploy Backend Changes

```bash
cd backend/server
git add index.js
git commit -m "fix: add cluster IP to CORS whitelist"
git push
```

### Step 2: Redeploy Backend

```bash
# If using a build pipeline, trigger redeploy
# Or manually redeploy your cluster
```

### Step 3: Update Frontend

```bash
cd frontend
# Verify .env has cluster IP
cat .env
# Should show: VITE_API_BASE_URL=https://157.50.99.17
```

### Step 4: Rebuild Frontend

```bash
npm run build
# Deploy dist/ folder to your hosting
```

### Step 5: Test Connection

Open browser DevTools (F12) → Network tab

Make any API call and check:
- ✅ Status: 200 (not 403)
- ✅ No CORS errors in console
- ✅ Response has data

---

## Troubleshooting

### Issue: Still Getting CORS Error

**Solution:** Try these variants:

```javascript
// Add to backend CORS origin array:
"https://157.50.99.17",
"http://157.50.99.17",
"http://157.50.99.17:3000",
"https://157.50.99.17:3000",
"http://157.50.99.17:8000",
"https://157.50.99.17:8000",
"*" // ⚠️ Last resort only for testing
```

### Issue: Connection Refused

**Check:**
1. Is backend running on cluster IP? → `curl https://157.50.99.17/health`
2. Is SSL/TLS configured? → Use `https://` not `http://`
3. Is firewall allowing traffic? → Check security groups

### Issue: Timeout Errors

**Solution:** Backend might be slow to respond

Add timeout handling in frontend:
```javascript
const response = await fetch(url, {
  signal: AbortSignal.timeout(30000) // 30 second timeout
});
```

---

## Environment Variables

### Development (`.env.local`)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Production (`.env`)
```bash
VITE_API_BASE_URL=https://157.50.99.17
```

### Staging (Optional)
```bash
VITE_API_BASE_URL=https://staging.cluster.ip
```

---

## Backend Configuration

### Current Setup

```javascript
// CORS allowed origins
const allowedOrigins = [
  "http://localhost:5173",      // Local dev
  "https://typevex.vercel.app", // Vercel
  "https://157.50.99.17",       // Cluster
  "http://157.50.99.17",        // Cluster
  "http://157.50.99.17:*",      // Cluster any port
  "https://157.50.99.17:*"      // Cluster any port HTTPS
];
```

### Add More Origins If Needed

```javascript
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
```

---

## SSL/TLS Certificate

If using HTTPS on cluster IP, ensure:

✅ Certificate is valid  
✅ Certificate matches IP or use wildcard  
✅ Certificate not expired  
✅ Intermediate certificates included  

Check certificate:
```bash
curl -I https://157.50.99.17/health
```

---

## Network Architecture

```
Browser (Frontend)
    ↓
    └─→ https://157.50.99.17 (Cluster IP)
        ↓
        └─→ Backend Server
            ├─ CORS check ✅ (now includes cluster IP)
            ├─ Route handling
            └─ Database query
        ↓
    Response (with CORS headers)
    ↓
Browser (Data displayed) ✅
```

---

## Verification Checklist

- [ ] Backend CORS includes cluster IP
- [ ] Frontend .env points to cluster IP
- [ ] Frontend rebuilt after .env change
- [ ] Backend redeployed with changes
- [ ] SSL certificate valid (for HTTPS)
- [ ] No firewall blocking traffic
- [ ] Network latency acceptable (<2s)

---

## API Response Debug

### Check Headers in Browser

DevTools → Network → Click request → Headers

**Should include:**
```
Access-Control-Allow-Origin: https://157.50.99.17
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### If Missing:

CORS isn't configured correctly. Update backend.

---

## Rollback Plan

If cluster IP doesn't work:

### Quick Rollback to Render
```bash
# frontend/.env
VITE_API_BASE_URL=https://typevex-1.onrender.com
```

```bash
npm run build
# Redeploy
```

---

## Performance Optimization

For cluster IP, ensure:

✅ Connection pooling enabled  
✅ Response compression (gzip)  
✅ Request timeout reasonable (15-30s)  
✅ Database queries optimized  
✅ Caching enabled where applicable  

---

## Additional Frontend Handling

The network system you have handles this gracefully:

```javascript
// Uses cluster IP with auto-retry
const api = createNetworkAwareApiMethods();
const result = await api.auth.login(email, password);

if (result.error) {
  // Shows error, allows retry
  console.log(result.message);
} else {
  // Use data
  console.log(result.data);
}
```

---

## Files Updated

✅ `backend/server/index.js` - CORS whitelist  
✅ `frontend/.env` - API URL  

## Files to Verify

- `backend/.env` - Backend environment variables
- `frontend/.env.local` - Local dev override (if needed)
- `frontend/.env.production` - Production override (if using)

---

## Next Steps

1. ✅ Apply changes above
2. ✅ Redeploy backend
3. ✅ Rebuild frontend
4. ✅ Test in production
5. ✅ Monitor network tab for CORS errors
6. ✅ Check API responses in DevTools

---

## Support

If still having issues:

1. Check browser console for exact error message
2. Look at Network tab → failed request → Response
3. Verify cluster IP is correct: `157.50.99.17`
4. Check backend logs for CORS rejection
5. Try fallback: `VITE_API_BASE_URL=https://typevex-1.onrender.com`

---

**Your cluster IP connection should now work! 🚀**
