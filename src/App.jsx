import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Result from './pages/Result'
import First from './pages/First'
import Leaderboard from './pages/Leaderboard'
import NotFound from './pages/404'
import Profile from './pages/Profile'
import TypingTest from './routes/type/page'
import Page from './routes/type/page'
import TypingLoader from './Loding/Loading'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (token) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='*' element={<NotFound/>}/>
            <Route path='/' element={<First />} />
            <Route path='/type' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/first' element= {<First/>}/>
            <Route path='/profile' element= {<Profile/>}/>
            <Route path='/Loding' element= {<TypingLoader/>}/>
            <Route path='/Login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/Register' element={<PublicRoute><Register /></PublicRoute>} />
            <Route path='/Result' element={<ProtectedRoute><Result /></ProtectedRoute>} />
            <Route path='/leader' element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path='/type' element={<ProtectedRoute><TypingTest /></ProtectedRoute>} />
            <Route path='/page' element={<ProtectedRoute><Page /></ProtectedRoute>} />
            
          </Routes>
        </BrowserRouter>
      </ThemeProvider>


    </>
  )
}

export default App
