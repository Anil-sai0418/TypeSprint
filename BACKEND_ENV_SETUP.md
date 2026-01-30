# 🔐 Backend Environment Setup Guide

## ✅ Created Files

1. **`.env`** - Your actual environment variables (⚠️ DO NOT COMMIT THIS)
2. **`.env.example`** - Template for documentation
3. **`dotenv` package** - Installed in `package.json`

---

## 📋 Backend Environment Variables

### `backend/server/.env`
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/typevex?retryWrites=true&w=majority
PORT=10000
NODE_ENV=production
```

---

## 🔧 How to Set Up

### Step 1: Get MongoDB Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your MongoDB Atlas account
3. Click **Connect** on your cluster
4. Choose **Drivers** → **Node.js**
5. Copy the connection string
6. Replace `<username>` and `<password>` with your actual credentials

### Step 2: Update `.env` File
Edit `backend/server/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/typevex?retryWrites=true&w=majority
PORT=10000
NODE_ENV=production
```

### Step 3: For Render Deployment
1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Add the same variables:
   - `MONGO_URI` = Your MongoDB connection string
   - `PORT` = 10000
   - `NODE_ENV` = production

---

## 🚀 Running Backend

### Local Development
```bash
cd backend/server
npm install
npm run dev
```

The server will:
- ✅ Load variables from `.env`
- ✅ Connect to MongoDB
- ✅ Run on port 10000
- ✅ Show connected status

### Production (Render)
Render will automatically:
- Read environment variables from dashboard
- Start the server with `npm start`
- Run on the PORT specified

---

## 📝 .env File Structure

```env
# Database Connection (Required)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Configuration
PORT=10000
NODE_ENV=production

# Optional: Add these later
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://type-sprint-psi.vercel.app
```

---

## ⚠️ Security Notes

### DO NOT COMMIT `.env` File!
The `.env` file is already in `.gitignore`. Never push it to GitHub!

```bash
# Check .gitignore
cat backend/server/.gitignore
# Should contain: .env
```

### Safe Way to Share Credentials
1. Share `.env` values privately (not in code)
2. Use only `.env.example` in git
3. Team members copy `.env.example` to `.env`
4. Each person adds their own credentials

---

## 🧪 Test Connection

### Test Locally
```bash
cd backend/server
npm run dev
# Should output:
# ✅ MongoDB Atlas connected
# 🚀 Server running on port 10000
```

### Test Production (Render)
```bash
curl https://typevex-1.onrender.com/health
# Should return: {"success":true,"message":"Server is running"}
```

---

## 🔍 MongoDB Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

- **username** - Your MongoDB user
- **password** - Your MongoDB password (URL encoded)
- **cluster** - Your Atlas cluster name
- **database** - Your database name (typevex)

### Example:
```
mongodb+srv://anil:securePass123@cluster0.abc123.mongodb.net/typevex?retryWrites=true&w=majority
```

---

## 📚 Files Summary

| File | Purpose | Commit to Git? |
|------|---------|---|
| `.env` | Actual credentials | ❌ NO - Add to .gitignore |
| `.env.example` | Template | ✅ YES - Share with team |
| `.gitignore` | Ignore files | ✅ YES - Already set |
| `server.js` | Requires dotenv | ✅ YES - Updated |

---

## ✅ Checklist

- ✅ Created `backend/server/.env`
- ✅ Created `backend/server/.env.example`
- ✅ Installed `dotenv` package
- ✅ Updated `server.js` to load `.env`
- ✅ Ready for production deployment
- ✅ Environment variables configured

---

## 🎉 You're Ready!

Your backend now uses environment variables for:
- MongoDB connection
- Server port
- Environment mode

Push changes and redeploy on Render! 🚀
