# OAuth Setup & Testing Checklist

## ✅ What's Already Done

- [x] Backend OAuth routes created
- [x] Frontend AuthContext and useAuth hook created
- [x] Navigation component updated to use AuthContext
- [x] Route protection updated
- [x] Passport.js configured (ready to accept credentials)
- [x] JWT generation and cookie management
- [x] Database User model updated
- [x] CORS properly configured
- [x] Error handling in place

## 📋 What You Need to Do

### Step 1: Get Google OAuth Credentials (20 min)

- [ ] Go to https://console.cloud.google.com
- [ ] Create a new project (or select existing)
- [ ] Enable "Google+ API"
- [ ] Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] Select "Web Application"
- [ ] Add Authorized redirect URIs:
  - [ ] `http://localhost:10000/oauth/google/callback`
- [ ] Copy the Client ID
- [ ] Copy the Client Secret

### Step 2: Get GitHub OAuth Credentials (5 min)

- [ ] Go to https://github.com/settings/developers → OAuth Apps
- [ ] Click "New OAuth App"
- [ ] Fill in:
  - [ ] Application name: "Monkey Type Local Dev"
  - [ ] Homepage URL: `http://localhost:5173`
  - [ ] Authorization callback URL: `http://localhost:10000/oauth/github/callback`
- [ ] Copy the Client ID
- [ ] Copy the Client Secret

### Step 3: Add Credentials to .env

Open `/backend/server/.env` and update:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

- [ ] Save the file

### Step 4: Restart Backend

```bash
# In backend/server directory
npm run dev
```

- [ ] Backend should start without errors
- [ ] Should NOT see warnings about missing OAuth credentials

### Step 5: Test the Flow

#### Test 1: Check Network Tab
- [ ] Open http://localhost:5173
- [ ] Open DevTools → Network tab
- [ ] Should see `GET /oauth/me` with status `401` (This is CORRECT!)

#### Test 2: Test Login Page
- [ ] Click "Login" button in top right
- [ ] Should see Google and GitHub buttons
- [ ] If buttons show errors, check console for details

#### Test 3: Test Google OAuth
- [ ] Click "Continue with Google" button
- [ ] Browser redirects to Google login
- [ ] Log in with your Google account
- [ ] Browser redirects back to `/home`
- [ ] Should see your profile in top right
- [ ] Network tab should show `/oauth/me` with status `200` (Success!)

#### Test 4: Test GitHub OAuth
- [ ] Click "Login" button again
- [ ] Click "Continue with GitHub" button
- [ ] Browser redirects to GitHub login
- [ ] Log in with your GitHub account
- [ ] Browser redirects back to `/home`
- [ ] Should see your profile with GitHub avatar
- [ ] Network tab should show `/oauth/me` with status `200`

#### Test 5: Test Logout
- [ ] Click profile icon in top right
- [ ] Click "Log out"
- [ ] Should redirect to `/login`
- [ ] Should see "Login" button again
- [ ] Network tab should show `/oauth/me` with status `401` again

### Step 6: Verify User Created in Database

```bash
# In MongoDB, check your database
use mokey_type_db
db.users.find().pretty()
```

- [ ] Should see new user with:
  - [ ] `provider: "google"` or `provider: "github"`
  - [ ] `providerId: ...`
  - [ ] `email: ...`
  - [ ] `avatar: ...`
  - [ ] `isVerified: true`

## 🚀 Quick Test Command

After adding credentials, test everything with:

```bash
# Terminal 1: Backend
cd backend/server
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Test
# Open http://localhost:5173 in browser
# Click Login → Continue with Google/GitHub → Test flow
```

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| OAuth buttons not working | Check credentials in `.env` are correct |
| "Cannot find module" errors | Run `npm install` in backend/server |
| Redirect goes to error page | Check callback URLs match exactly in OAuth provider |
| 401 after login | Refresh page or clear cookies |
| User not created in DB | Check MongoDB connection string in `.env` |
| CORS errors | Check `VITE_API_URL` is set in frontend/.env.local |

## 📊 Status Summary

```
Backend:      ✅ Ready
Frontend:     ✅ Ready
Database:     ✅ Ready
Google Auth:  ⏳ Waiting for credentials
GitHub Auth:  ⏳ Waiting for credentials
Testing:      ⏳ Ready to start once credentials added
```

## 💡 Important Notes

- 401 errors on `/oauth/me` when NOT logged in are **NORMAL** ✓
- Always use `http://localhost:*` for local development (not `127.0.0.1`)
- Different redirect URLs needed for production
- Keep `.env` file PRIVATE (never commit to git)
- Credentials should be different for prod/dev

---

**Next Action**: Get the OAuth credentials and add them to `.env` 🎯
