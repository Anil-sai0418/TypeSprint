# Monkey Type Backend - Project Structure

## 📁 Directory Structure

```
Monkey type -B/
├── models/                 # Database schemas
│   ├── User.js            # User authentication schema
│   └── UserProfile.js     # User profile and stats schema
├── routes/                # API route handlers
│   ├── auth.js            # Authentication endpoints (register, login)
│   ├── profile.js         # Profile management endpoints
│   ├── typingTest.js      # Typing test and stats endpoints
│   └── utils.js           # Utility endpoints (random text)
├── middleware/            # Express middleware
│   └── verifyToken.js     # JWT token verification middleware
├── server.js              # Main server entry point
├── package.json           # Dependencies and scripts
└── node_modules/          # Installed dependencies
```

## 🔧 API Endpoints

### Authentication Routes (`/auth`)
- **POST** `/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Response: `{ success, message, user }`

- **POST** `/auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ success, token, user }`

### Profile Routes (`/profile`)
- **GET** `/profile/:email` - Get user profile and basic info
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, user, profile }`

- **PUT** `/profile/:email` - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ phone, address, profileImage }`
  - Response: `{ success, message, profile }`

- **GET** `/profile/:email/stats` - Get user statistics
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, stats }`

- **GET** `/profile/:email/activity` - Get activity map for heatmap
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, activityMap }`

### Typing Test Routes (`/typing-test`)
- **POST** `/typing-test/result` - Save typing test result
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ email, wpm, accuracy, duration, raw }`
  - Response: `{ success, message, stats }`

- **GET** `/typing-test/stats/:email` - Get typing statistics
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, stats }`

### Utility Routes
- **GET** `/random-text` - Get random typing text
  - Query: `?wordLimit=50&includePunctuation=false&includeNumbers=false`
  - Response: `{ success, text, wordCount }`

- **GET** `/health` - Server health check
  - Response: `{ success, message }`

## 📊 Database Schemas

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### UserProfile Schema
```javascript
{
  userId: ObjectId (ref: users),
  phone: String,
  address: String,
  profileImage: String,
  
  // Stats
  highestSpeed: Number,
  bestTest: Number,
  totalTests: Number,
  dailyStreak: Number,
  averageSpeed: Number,
  
  // Activity Map for LeetCode-style heatmap
  activityMap: Map<Date, Number>, // { "2026-01-15": 5, ... }
  
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

## 🚀 Getting Started

### Installation
```bash
cd "Monkey type -B"
npm install
```

### Running the Server

**Development (with auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:8000`

## 🔑 Key Features

### 1. User Authentication
- Registration with bcrypt password hashing
- Login with JWT token generation
- Token verification middleware for protected routes

### 2. Profile Management
- Create/update user profile
- Store phone, address, profile image
- Automatic profile creation on first test

### 3. Typing Stats Tracking
- WPM (Words Per Minute) tracking
- Accuracy percentage
- Test duration
- Highest speed and average speed calculations
- Daily streak tracking

### 4. Activity Heatmap (LeetCode Style)
- Track daily typing activity
- `activityMap` stores test count per day
- Perfect for visualizing consistency
- Supports 52-week view

### 5. Achievements System
- 100 WPM Club - Reach 100 WPM
- 150 WPM Club - Reach 150 WPM
- 7-Day Streak - Type for 7 consecutive days
- Speed Improver - Complete 10+ tests
- Can be extended with more achievements

## 📝 Environment Variables

Create `.env` file (optional):
```
PORT=8000
MONGODB_URL=mongodb://localhost:27017/bro
JWT_SECRET=your-secret-key
```

Default MongoDB connection: `mongodb://localhost:27017/bro`

## 🛠️ Development Notes

### Adding New Endpoints
1. Create route file in `/routes`
2. Define router with express.Router()
3. Add middleware for authentication if needed
4. Export router
5. Import and use in `server.js`

### Modifying Schemas
1. Edit schema in `/models`
2. Update corresponding routes if needed
3. Update API service in frontend (`src/services/api.js`)

### Testing
Use tools like Postman or curl to test endpoints:
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Profile (use token from login)
curl -X GET http://localhost:8000/profile/john@example.com \
  -H "Authorization: Bearer <token>"
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in code

### Token Expired
- Re-login to get new token
- Token expires in 7 days by default

### CORS Error
- CORS is already enabled in `server.js`
- Frontend should be on different port (5174)

## 📦 Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `nodemon` - Auto-restart (dev only)

---

**Last Updated:** January 2026
**Version:** 1.0.0
