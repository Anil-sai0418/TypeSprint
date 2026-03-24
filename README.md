# 🚀 TypeSprint

TypeSprint is a premium, state-of-the-art typing speed test application built for developers and typing enthusiasts. Designed with a focus on **Rich Aesthetics** and **Visual Excellence**, TypeSprint provides a high-performance environment to measure, track, and improve your typing skills with real-time feedback and detailed analytics.

## ✨ Features

- ⌨️ **Real-Time Typing Mechanics**: Smooth text-input detection with live WPM (Words Per Minute) and accuracy calculations.
- 📊 **Performance Analytics**: Visualized progress reports using interactive graphs (Recharts/Chart.js) to track your improvement over time.
- 👤 **Personalized Profiles**: Secure user accounts to store history, track high scores, and manage social details.
- 🌓 **Dynamic Theme System**: Seamless transition between stunning Dark Mode and Radiant Light Mode.
- 📱 **QR Social Sharing**: One-click sharing modal with dynamic, high-quality QR code generation for instant mobile access.
- ⚡ **Production-Grade Security**: Global rate limiting, Helmet headers, and JWT-authenticated routes for data protection.
- 🧬 **Responsive Glassmorphism UI**: A modern interface built with Tailwind CSS and powered by Framer Motion for buttery-smooth animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS & Modern Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons
- **Visualization**: Recharts & Chart.js
- **Utility**: Axios, Bowser (Browser Detection)

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Validation**: JSON Web Tokens (JWT), Bcrypt
- **Middleware**: Helmet, Compression, Morgan, Express Rate Limit

### Database
- **ORM**: Sequelize
- **Engine**: PostgreSQL

## 📂 Project Structure

```text
├── backend
│   └── server
│       ├── config/        # Database and Sequelize configuration
│       ├── middleware/    # Auth and security middlewares
│       ├── models/        # Sequelize data models (User, Profile, etc.)
│       ├── routes/        # API route definitions
│       └── server.js      # Main Express entry point
├── frontend
│   └── src
│       ├── components/    # Reusable UI components (Modals, Nav, etc.)
│       ├── context/       # Auth and state management contexts
│       ├── pages/         # Page-level components (Landing, Result, Type)
│       └── services/      # API communication logic
└── package.json           # Top-level dependencies
```

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Anil-sai0418/TypeSprint.git
   cd TypeSprint
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend/server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../../frontend
   npm install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in `backend/server/` and `frontend/` (see variables below).

5. **Run the Application**
   - **Backend**: `npm run dev` (from `backend/server`)
   - **Frontend**: `npm run dev` (from `frontend/`)

## 🔑 Environment Variables

### Backend (`/backend/server/.env`)
- `PORT`: Server port (e.g., 10000)
- `DB_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure string for token signing
- `NODE_ENV`: `development` or `production`
- `CLIENT_URL`: URL of your frontend (for CORS)

### Frontend (`/frontend/.env`)
- `VITE_API_BASE_URL`: The URL where your backend is running

## 📡 API Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Authenticate and receive a JWT |
| `GET` | `/profile` | Fetch authenticated user profile |
| `POST` | `/typing-test/save` | Save a completed test result |
| `GET` | `/health` | Server and Database health check |

## 🧠 How It Works

1. **Typing Logic**: The application utilizes a custom-built React state machine to monitor keypresses. It compares the user's input against a target text array, calculating accuracy on the fly.
2. **Performance Calculation**: WPM is calculated using the standard formula: `(Characters / 5) / (Time in Minutes)`.
3. **Data Persistence**: Once a test is completed, results are asynchronously sent to the Node server and stored in a PostgreSQL database via Sequelize.
4. **Visual Mapping**: The results page pulls history data and maps it into Recharts components to provide a visual timeline of the user's "Typing Journey."

## 🚧 Future Improvements

- [ ] **Multiplayer Battles**: Real-time typing races using WebSockets.
- [ ] **Custom Text Injection**: Allow users to upload their own text or PDFs to type.
- [ ] **Global Leaderboard**: A competitive ranking system for top typists worldwide.
- [ ] **AI Coaching**: Personalized tips based on character-specific typing errors.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
⭐ If you found this project helpful, please consider giving it a star on GitHub!

---
