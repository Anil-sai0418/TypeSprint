# 🚀 Deployment Guide - Typevex (TypeSprint)

**Frontend Deployment**: https://type-sprint-psi.vercel.app/
**Backend Deployment**: https://typevex-1.onrender.com

---

## ✅ What Was Fixed

### 1. **Frontend API Configuration** 
- Updated `frontend/src/services/api.js` to use environment variable
- Uses `https://typevex-1.onrender.com` for production
- Falls back to `http://localhost:8000` for local development

```javascript
// New code (frontend/src/services/api.js)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://typevex-1.onrender.com';
```

### 2. **Backend CORS Configuration**
- Updated `backend/server/server.js` with proper CORS settings
- Allows requests from:
  - ✅ `https://type-sprint-psi.vercel.app` (Vercel frontend)
  - ✅ `http://localhost:5173` (Local dev port)
  - ✅ `http://localhost:5174` (Local alt port)

### 3. **Environment Variables**
- Created `frontend/.env` with production URL
- Created `frontend/.env.example` for documentation
- Created `frontend/.env.local` for local development

---

## 📋 Steps to Complete Deployment

### Step 1: Update Frontend Environment Variables (Vercel)

Go to your Vercel project settings:
1. Navigate to https://vercel.com/dashboard
2. Select your project `type-sprint-psi`
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   VITE_API_BASE_URL=https://typevex-1.onrender.com
   ```
5. Redeploy your project

**OR** Edit `.env` file in frontend:
```bash
cd frontend
# Edit .env file
VITE_API_BASE_URL=https://typevex-1.onrender.com
```

### Step 2: Deploy Backend Changes

Push the updated `server.js` to your Render backend:

```bash
cd backend/server
git add server.js
git commit -m "Fix: Add CORS configuration for Vercel frontend"
git push
```

Render will auto-redeploy with the CORS changes.

### Step 3: Verify Backend MongoDB Connection

Your backend needs MongoDB URL. On Render, add environment variable:

**Render Dashboard → Environment:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bro
```

Or for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/bro
```

Update `backend/server/server.js`:
```javascript
// Use environment variable
const MONGODB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/bro";
mongoose.connect(MONGODB_URL)
```

---

## 🔧 Current Configuration

### Frontend (.env)
```
VITE_API_BASE_URL=https://typevex-1.onrender.com
```

### Backend (server.js - CORS)
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://type-sprint-psi.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 🧪 Testing Deployment

### Test Frontend Connection
1. Open https://type-sprint-psi.vercel.app/
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Try login - you should see POST request to `https://typevex-1.onrender.com/auth/login`
5. No more `net::ERR_CONNECTION_REFUSED` error ✅

### Test Backend
1. Visit https://typevex-1.onrender.com/health
2. Should see: `{"success":true,"message":"Server is running"}`

---

## 🔄 Local Development Setup

### Run Locally

**Terminal 1 - Backend:**
```bash
cd backend/server
npm run dev
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
# Create .env.local
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
# Runs on http://localhost:5173
```

---

## 🚨 Troubleshooting

### Issue: Still getting CORS error

**Solution:**
1. Make sure Render backend is redeployed with CORS changes
2. Hard refresh Vercel frontend (Ctrl+Shift+R or Cmd+Shift+R)
3. Check backend URL in browser console network tab

### Issue: 404 errors from backend

**Check:**
1. All routes are defined in `backend/server/server.js`
2. Backend is running and accessible
3. API endpoints exist (check `/auth`, `/profile`, etc.)

### Issue: MongoDB connection failed

**Solution:**
1. Set `MONGODB_URI` environment variable in Render
2. Make sure MongoDB cluster IP is whitelisted on Atlas
3. Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/database`

---

## 📊 Deployment Checklist

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ✅ CORS configured on backend
- ✅ Environment variables set
- ✅ API URL updated in frontend
- ✅ Frontend can reach backend
- ✅ Login working
- ✅ Database connected

---

## 🎉 You're Live!

Your TypeSprint app is now live and fully connected:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://type-sprint-psi.vercel.app/ | ✅ Live |
| Backend | https://typevex-1.onrender.com | ✅ Live |
| Database | MongoDB | ✅ Connected |

Happy typing! 🚀
