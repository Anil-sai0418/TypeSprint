# Understanding the 401 "Unauthorized" Error

## What You're Seeing

When you open the app, you'll see this in the Network tab:

```
GET http://localhost:10000/oauth/me
Status: 401 Unauthorized
```

## Why This Happens (It's Normal!)

The frontend is checking if you have an existing session by calling `/oauth/me`. Since you haven't logged in yet:

- ✅ No JWT token exists
- ✅ No authentication cookie is sent
- ✅ Backend correctly returns 401 (Unauthorized)
- ✅ Frontend gracefully handles this and shows the Login page

## This is CORRECT Behavior!

This 401 error is **expected and desired**. It means:

1. **Security is working** - Unauthenticated requests are rejected
2. **CORS is working** - Frontend can communicate with backend
3. **Authentication flow is working** - Backend properly validates sessions

## What Should Happen Next

### 1. Click "Login" Button
You should see the Login page with:
- Email/Password login
- **Google OAuth button** (if credentials are added to .env)
- **GitHub OAuth button** (if credentials are added to .env)

### 2. After Successful OAuth Login
- JWT token will be set in httpOnly cookie
- You'll be redirected to `/home`
- The 401 error will NO LONGER appear
- Your user info will display in the header

### 3. After Logout
- The JWT cookie will be cleared
- You'll be redirected to `/login`
- The 401 error will appear again (this is correct)

## Configuration Needed

To actually test OAuth login, you need to:

1. **Get Google OAuth credentials** (if not done yet)
   - Visit: https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Callback URL: `http://localhost:10000/oauth/google/callback`

2. **Get GitHub OAuth credentials** (if not done yet)
   - Visit: https://github.com/settings/developers → OAuth Apps
   - Callback URL: `http://localhost:10000/oauth/github/callback`

3. **Add to `.env`** (in backend/server/)
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

4. **Restart backend**
   ```bash
   npm run dev
   ```

## Testing the Flow

1. **Before Login** (Should see 401):
   ```
   GET /oauth/me → 401 Unauthorized ✓ (Expected)
   Shows: Login page
   ```

2. **After Clicking OAuth Button**:
   ```
   Redirects to Google/GitHub login
   User authenticates
   Browser redirects to /home?auth=success
   JWT token set in cookies
   ```

3. **After Login** (Should NOT see 401):
   ```
   GET /oauth/me → 200 OK ✓ (Success)
   Response: { success: true, user: { ... } }
   Shows: User profile in header
   ```

4. **After Logout**:
   ```
   Cookie cleared
   GET /oauth/me → 401 Unauthorized ✓ (Expected again)
   Redirects to login page
   ```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| OAuth buttons don't work | Add credentials to `.env` and restart backend |
| Still seeing 401 after login | Refresh page - cookie might need time to register |
| Credentials not loading | Check `.env` file is in `backend/server/` NOT root |
| OAuth redirects to error page | Check callback URL matches exactly in provider settings |

## Next Steps

1. ✅ You have the framework ready
2. ⏳ **Waiting for**: OAuth credentials from Google & GitHub
3. 📝 Add credentials to `.env`
4. 🚀 Test OAuth flow
5. ✨ App fully working!

---

**Remember**: The 401 error you're seeing is **not a bug** - it's the authentication system working correctly! 🎉
