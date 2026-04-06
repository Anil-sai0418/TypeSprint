<div align="center">
  <img src="./frontend/public/Type-logo.png" alt="Monkey Type Clone Logo" width="180" />
  <h1>⌨️ TypeSprint (MonkeyType Clone)</h1>
  
  <p>
    <strong>A highly advanced, minimalistic, and customizable real-time typing speed test platform.</strong><br>
    <em>Built for developers, enthusiasts, and anyone looking to master their typing speed and accuracy.</em>
  </p>

  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/Features-Extensive-orange?style=for-the-badge" alt="Features"></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge" alt="Tech Stack"></a>
    <a href="#-installation--setup"><img src="https://img.shields.io/badge/Setup-Easy-success?style=for-the-badge" alt="Setup"></a>
    <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
  </p>
</div>

<hr />

## 📖 About The Project

TypeSprint is a comprehensive, full-stack typing test application inspired by the popular *Monkeytype*. It provides a clean, distraction-free interface to practice typing while deeply tracking your performance metrics over time. 

Beyond a simple typing test, this platform features a rich ecosystem including **user accounts, authentication via Firebase, detailed contribution graphs (like GitHub's activity calendar), deep analytics using interactive charts, a fully customizable UI with dark/light themes, and an achievement system.**

Whether you're trying to surpass 150 WPM casually or strictly tracking your precision and consistency, TypeSprint provides the data and the environment you need.

---

## ✨ Comprehensive Feature List

### 🎮 Core Typing Experience
- **Fluid Typing Engine:** Zero-latency real-time tracking of keystrokes.
- **Dynamic Metrics:** Live Words Per Minute (WPM), Raw WPM, Accuracy, and Consistency calculations.
- **Caret Engine:** Smooth, animated caret that follows your typing naturally.
- **Error Tracking:** Distinguishes between corrected errors, uncorrected errors, and extra characters.
- **Multiple Modes:** (Configurable) Time-based tests (15s, 30s, 60s, 120s) and Word-count based tests.

### 📊 Advanced Analytics & Visualization
- **Session Results:** Comprehensive breakdown of your test including a timeline chart showing WPM/Errors per second.
- **Contribution Graph:** Visual heatmap demonstrating your daily typing activity and streaks (similar to GitHub).
- **Historical Data:** Persistent storage of all tests taken, viewable through interactive Recharts and Chart.js graphs.
- **Performance Distribution:** Analyze your strongest vs. weakest keys and specific typing habits.

### 👤 User Management & Social
- **Secure Authentication:** Firebase OAuth integration (Google Sign-in) alongside traditional JWT-based local authentication.
- **Custom Profiles:** Personalized user profiles with avatars, biographies, and customizable social links.
- **Global Leaderboard:** Compete globally and view top typists ranked by WPM and accuracy.
- **Achievement/Badge System:** Unlockable milestones based on typing speed, tests completed, and login streaks.
- **Sharing & Export:** Instantly generate beautiful result cards and QR codes to share on social media.

### ⚙️ System & UI Architecture
- **PWA Ready:** Installable as a Progressive Web App with offline caching via Service Workers.
- **Internationalization (i18n):** Multi-language UI support.
- **Network Resilience:** Custom hooks for network-aware API fetching. Continues working during brief disconnects.
- **Scheduled Workers:** Automated backend cron jobs mapping user streaks and sending out notifications.
- **Theme Engine:** Context-based dark/light dynamic theming using Tailwind CSS, Radix UI, and Framer Motion.

---

## 🛠️ Tech Stack & Architecture

### 💻 Client-Side (Frontend)
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) for lightning-fast HMR and optimized builds.
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/) alongside [Radix UI](https://www.radix-ui.com/) primitives for accessible components.
- **State & Data Fetching:** React Context API + [React Query (@tanstack)](https://tanstack.com/query/latest) for efficient server-state management.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) and [Three.js](https://threejs.org/) for fluid visual feedback.
- **Visuals/Charts:** [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/).
- **Utilities:** `canvas-confetti`, `qr-code-styling`, `i18next`.

### ⚙️ Server-Side (Backend)
- **Runtime:** [Node.js](https://nodejs.org/)
- **API Framework:** [Express.js v5](https://expressjs.com/)
- **Security:** Helmet, Express Rate Limit, CORS.
- **Authentication:** [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) & JSON Web Tokens (JWT) + Passport.js.
- **Task Scheduling:** `node-cron` for automated streak and notification jobs.
- **Email Delivery:** Nodemailer for password resets and notifications.

### 🗄️ Database
- **Primary Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize](https://sequelize.org/) (Handles complex joins, model associations, and migrations).

---

## 🚀 Installation & Setup

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **PostgreSQL** (running locally or a cloud instance like Supabase/Render)
- A **Firebase** project for authentication (optional, but recommended for full features)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/typesprint.git
cd typesprint
```

### 2. Backend Environment Configuration
Navigate to the backend server folder and install dependencies:
```bash
cd backend/server
npm install
```

Create a `.env` file in the `backend/server` directory and populate it with your credentials:
```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (PostgreSQL)
DATABASE_URL=postgres://username:password@localhost:5432/typesprint_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Firebase Admin SDK (Obtained from Firebase Console -> Project Settings -> Service Accounts)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

Start the API Backend:
```bash
npm run dev
# Server should now be running on http://localhost:5000
```

### 3. Frontend Environment Configuration
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```ini
# API Connection
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Client Configuration (Firebase Console -> General -> Web App)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start up the React Vite development server:
```bash
npm run dev
# App should now be running on http://localhost:5173
```

---

## 📡 API Documentation (Core Endpoints)

The RESTful Express API powers the application. Here are the primary routes:

### Authentication (`/api/auth`)
- `POST /register`: Register a new local account.
- `POST /login`: Login and receive JWT.
- `GET /me`: Get current authenticated user details.

### Typing Tests (`/api/typingTest`)
- `POST /save`: Save a newly completed typing test.
- `GET /history`: Fetch user's historical test data (paginated).
- `GET /stats`: Get aggregated statistics (averages, high scores, totals).

### User Profiles (`/api/profile`)
- `GET /:username`: Fetch public profile data for a specific user.
- `PUT /update`: Update avatar, bio, and settings.
- `GET /achievements`: Fetch unlocked user badges.

### Daily Activity (`/api/contribution`)
- `GET /heatmap`: Fetch the daily activity array for rendering the GitHub-style graph.

---

## 📂 Advanced Project Structure

```text
├── backend/
│   └── server/
│       ├── config/             # DB, Firebase, and Passport init setups
│       ├── jobs/               # Background Cron Jobs (e.g., streakNotificationJob.js)
│       ├── middleware/         # Security & Auth (verifyToken.js)
│       ├── models/             # Sequelize PostgreSQL schemas
│       ├── routes/             # Grouped Express router controllers
│       ├── utils/              # Email services and Date formatters
│       └── server.js           # Core Express Application Entry
│
├── frontend/
│   ├── public/                 # Static assets, Web App Manifests, Service Workers
│   └── src/
│       ├── assets/             # SVGs and Images
│       ├── components/         # Atomic UI Components (Buttons, Modals, SEO, Nav)
│       │   ├── charts/         # DisplayChart, ContributionGraph
│       │   ├── ui/             # Radix generic components
│       │   └── notification/   # Toast & push notification UI
│       ├── context/            # React Context (Theme, Network, Auth)
│       ├── hooks/              # Custom Hooks (useNetworkAwareFetch, useAuth)
│       ├── lib/                # Pure utility functions (WPM math, utils)
│       ├── pages/              # Main Route Views (Home, Profile, Result, Leaderboard)
│       ├── router/             # Protected Routes logic
│       └── services/           # Axios interceptors and API wrapper methods
└── README.md
```

---

## 🎨 Screenshots & Previews
> **Note:** Add visual assets to your repository (`frontend/public/screenshots/`) and link them here to dramatically improve the appeal of your repository.

| Home / Typing Test | User Profile & Graph |
| :---: | :---: |
| *(Add Screenshot Here)* | *(Add Screenshot Here)* |
| **Dark/Light Mode** | **Detailed Analytics Result** |
| *(Add Screenshot Here)* | *(Add Screenshot Here)* |

---

## 🧠 Core Logic Insight: WPM Calculation

The typing engine uses standard typographic calculations.
- **Word Definition:** 1 Word = 5 keystrokes (including spaces).
- **WPM Formula:** `(Total Valid Characters Typed / 5) / (Time in Minutes)`
- **Accuracy Formula:** `(Correct Keystrokes / Total Keystrokes) * 100`

The system utilizes React window event listeners to intercept keystrokes without needing traditional input tags, allowing for completely custom rendering of the caret and text.

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's adding a new theme, optimizing the WPM calculator, or fixing a bug.

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally.
3. **Create a new branch** for your feature (`git checkout -b feat/super-cool-theme`).
4. **Commit your changes** with descriptive messages (`git commit -m "Added Dracula Theme"`).
5. **Push to your branch** (`git push origin feat/super-cool-theme`).
6. **Open a Pull Request** against the `main` branch.

Please ensure your code passes `npm run lint` before submitting!

---

## 📜 License

This project is open-source and available under the **[MIT License](LICENSE)**. Feel free to use, modify, and distribute it.

---

<div align="center">
  <p>Building the future of typing speed analysis.</p>
  <strong>Don't forget to ⭐ star the repo if you like what you see!</strong>
</div>
