# 🎯 Monkey Type - Complete Setup Guide

## 📋 Project Overview

Monkey Type is a full-stack typing speed test application built with:
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB running locally or remote connection
- npm or yarn

### Step 1: Start MongoDB
```bash
mongod
```

### Step 2: Start Backend Server
```bash
cd "Monkey type -B"
npm install  # First time only
npm start    # or `npm run dev` for development
```

Backend runs on: `http://localhost:8000`

### Step 3: Start Frontend Dev Server
```bash
cd ..
npm install  # First time only
npm run dev
```

Frontend runs on: `http://localhost:5175` (or next available port)

## 📁 Project Structure

### Frontend (`/src`)
```
src/
├── pages/              # All page components
│   ├── Home.jsx       # Typing test page
│   ├── Login.jsx      # Login page
│   ├── Register.jsx   # Registration page
│   ├── Profile.jsx    # User profile with LeetCode heatmap
│   ├── Result.jsx     # Test results page
│   ├── Leaderboard.jsx
│   ├── First.jsx      # Landing page
│   └── 404.jsx        # Not found page
├── components/        # Reusable components
│   ├── ThemeToggle.jsx
│   ├── DisplayChart.jsx
│   ├── ui/           # UI components (button, card, input, etc.)
│   └── ...
├── services/         # API calls
│   └── api.js        # Centralized API service
├── context/          # Global state
│   ├── ThemeContext.jsx
│   └── useTheme.js
├── lib/             # Utilities
│   ├── utils.js
│   └── wpm-utils.js
├── assets/
├── App.jsx          # Main App component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

### Backend (`/Monkey type -B`)
```
Monkey type -B/
├── models/              # Database schemas
│   ├── User.js         # User schema
│   └── UserProfile.js  # User profile with activity tracking
├── routes/             # API endpoints
│   ├── auth.js        # Auth routes (register, login)
│   ├── profile.js     # Profile routes
│   ├── typingTest.js  # Typing test routes
│   └── utils.js       # Utility routes
├── middleware/
│   └── verifyToken.js # JWT verification
├── server.js          # Main server file
├── package.json
└── README.md          # Backend documentation
```

## 🔑 Core Features

### 1. ✅ Authentication System
- **Register:** Create new account with name, email, password
- **Login:** Get JWT token for 7 days
- **Protected Routes:** All profile/stats endpoints require token

**Flow:**
```
Register → User created in DB → Profile auto-created
    ↓
Login → JWT token generated → Token stored in localStorage
    ↓
Access Profile → Token verified → User data fetched
```

### 2. ✅ Typing Test
- Fetch random text from backend
- Real-time WPM calculation
- Accuracy tracking
- Duration measurement
- Test results saved to database

### 3. ✅ User Profile with Statistics
- **Personal Info:** Name, email, phone, address
- **Typing Stats:**
  - Highest Speed (WPM)
  - Best Test Time
  - Total Tests Completed
  - Average Speed
  - Daily Streak
- **Achievements:** Dynamic badges based on milestones

### 4. ✅ Activity Heatmap (LeetCode Style)
- **Visual Calendar:** 52-week activity calendar
- **Color Coding:** 
  - Gray: No activity
  - Light Green: 1 test
  - Medium Green: 2-3 tests
  - Dark Green: 4-5 tests
  - Darkest: 6+ tests
- **Tracking:** Each day shows number of tests completed
- **Today Highlight:** Blue ring around today's box
- **Statistics:** Total tests, active days count

### 5. ✅ Theme System
- Light/Dark mode toggle
- Persisted to localStorage
- System preference detection
- Applied to entire app via TailwindCSS

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Profile
- `GET /profile/:email` - Get profile + user data
- `PUT /profile/:email` - Update profile (phone, address, image)
- `GET /profile/:email/stats` - Get statistics
- `GET /profile/:email/activity` - Get activity map (heatmap data)

### Typing Tests
- `POST /typing-test/result` - Save test result + update stats
- `GET /typing-test/stats/:email` - Get typing statistics

### Utilities
- `GET /random-text` - Get random text for typing
- `GET /health` - Server health check

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### UserProfile Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  phone: String,
  address: String,
  profileImage: String,
  
  // Statistics
  highestSpeed: Number,
  bestTest: Number,
  totalTests: Number,
  dailyStreak: Number,
  averageSpeed: Number,
  
  // Activity Map for Heatmap
  activityMap: {
    "2026-01-15": 5,  // 5 tests on this day
    "2026-01-16": 3,  // 3 tests on this day
    ...
  },
  
  // Test History
  typingTests: [
    {
      date: Date,
      wpm: Number,
      accuracy: Number,
      duration: Number,
      raw: Number
    }
  ],
  
  achievements: [String],
  lastTestDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 User Flow

### Signup & Login
```
1. User clicks Register
2. Enter name, email, password
3. Backend hashes password with bcrypt
4. User saved to database
5. UserProfile created automatically
6. User redirected to Login page
7. User enters email/password
8. Backend verifies credentials
9. JWT token generated
10. Token saved to localStorage
11. User redirected to Home page
```

### Taking a Typing Test
```
1. User on Home page
2. Random text fetched from backend
3. User types (real-time WPM calculation)
4. Test finished
5. Results calculated (WPM, accuracy, duration)
6. Results sent to backend with email + token
7. Backend saves test to typingTests array
8. Backend updates all statistics
9. Backend checks for new achievements
10. Activity map updated (+1 for today)
11. Results displayed on Result page
12. Stats reflected in Profile page
```

### Viewing Profile
```
1. User clicks Profile
2. Token & email retrieved from localStorage
3. Profile data fetched from /profile/:email
4. Stats fetched from /profile/:email/stats
5. Activity fetched from /profile/:email/activity
6. Heatmap rendered with activity data
7. Edit button allows updating phone/address
8. Logout button clears localStorage & redirects
```

## 🛠️ Development Commands

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# Start production server
npm start

# Start with auto-restart (development)
npm run dev

# Run tests
npm test
```

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + Vite + Tailwind CSS                               │
│  ✓ Pages: Home, Login, Register, Profile, Result           │
│  ✓ Components: ThemeToggle, DisplayChart, UI components    │
│  ✓ Services: api.js (centralized API calls)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/CORS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  Express.js + MongoDB                                       │
│  ✓ Routes: /auth, /profile, /typing-test                   │
│  ✓ Middleware: verifyToken (JWT)                           │
│  ✓ Models: User, UserProfile                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│  Collections:                                               │
│  ✓ users - User accounts                                   │
│  ✓ userprofiles - Profile & stats & activity              │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security Features

1. **Password Hashing:** bcrypt with salt rounds
2. **JWT Authentication:** 7-day expiration
3. **CORS:** Configured for frontend origin
4. **Token Verification:** All protected endpoints verify token
5. **Email Validation:** Regex validation + uniqueness check

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check connection string in `server.js`
- Default: `mongodb://localhost:27017/bro`

### "Profile page redirects to Login"
- Check if logged in (token in localStorage)
- Check browser console for error messages
- Ensure backend is running on port 8000
- Verify email is stored in localStorage

### "Activities heatmap not showing data"
- Take a test first (activity is logged when test is saved)
- Verify test result API is working
- Check MongoDB for typingTests data

### "CORS Error"
- CORS already enabled in `server.js`
- Frontend and backend on different ports (correct)
- Ensure API_BASE_URL in `api.js` is correct

### "Styles not applying / Theme not working"
- Clear browser cache
- Check if TailwindCSS is running: `npm run dev` rebuilds CSS
- Verify theme context is wrapping app in `App.jsx`

## 📈 Performance Optimization

1. **Database Indexes:** Email field indexed for faster queries
2. **JWT Caching:** Token stored in localStorage
3. **Lazy Loading:** Pages loaded on demand via React Router
4. **Bundle Splitting:** Vite automatically optimizes chunks
5. **Activity Map:** Only stores date-based activity count (not all tests)

## 🎓 Learning Resources

- **JWT:** https://jwt.io/
- **MongoDB:** https://docs.mongodb.com/
- **Express:** https://expressjs.com/
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/
- **TailwindCSS:** https://tailwindcss.com/

## 📝 Future Enhancements

- [ ] Real-time leaderboard
- [ ] Friends/social features
- [ ] Custom typing texts
- [ ] Multiplayer typing races
- [ ] Mobile app version
- [ ] Advanced analytics charts
- [ ] Export stats to CSV
- [ ] Discord integration
- [ ] More achievement badges
- [ ] Typing practice modes

## 👥 Contributors

- Anil Sai (Creator)

## 📄 License

ISC License

---

**Last Updated:** January 2026
**Version:** 1.0.0

For detailed backend documentation, see: `/Monkey type -B/README.md`
