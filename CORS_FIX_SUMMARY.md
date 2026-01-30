# 🔧 CORS & API Connection - FIXED ✅

## Problem
Frontend on Vercel was trying to call `localhost:8000` (local backend) instead of deployed backend on Render.

```
❌ Error: POST http://localhost:8000/auth/login net::ERR_CONNECTION_REFUSED
```

## Solution Applied

### 1. Updated Frontend API URL
**File**: `frontend/src/services/api.js`

```javascript
// BEFORE
const API_BASE_URL = 'http://localhost:8000';

// AFTER
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://typevex-1.onrender.com';
```

### 2. Added CORS Configuration to Backend
**File**: `backend/server/server.js`

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',              // Local dev
    'http://localhost:5174',              // Local alt
    'https://type-sprint-psi.vercel.app'  // Vercel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### 3. Created Environment Variables
**Files Created:**
- `frontend/.env` - Production config
- `frontend/.env.example` - Template
- `frontend/.env.local` - Local development

```
# frontend/.env
VITE_API_BASE_URL=https://typevex-1.onrender.com
```

---

## ✅ What to Do Now

### Option A: Quick Fix (Immediate)
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL=https://typevex-1.onrender.com`
3. Redeploy project
4. Wait 2-5 minutes for deployment

### Option B: Push Code Changes
1. Pull latest changes from repo (includes updated api.js & server.js)
2. Frontend will auto-redeploy on Vercel
3. Backend will auto-redeploy on Render (if connected to git)
4. Wait 5-10 minutes

---

## 🧪 Verify It's Working

1. Open https://type-sprint-psi.vercel.app/
2. Try to **Login** or **Register**
3. Open DevTools (F12) → Console
4. You should see API calls to `https://typevex-1.onrender.com` ✅
5. No more connection refused errors ✅

---

## 📚 Full Documentation
See `DEPLOYMENT_GUIDE.md` for complete setup instructions
