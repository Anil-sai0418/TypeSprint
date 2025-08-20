import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Home from './home'
import Login from './Login'
import Register from './Register'
import Result from './Result'
import Nav from './components/ui/nav'
import Leaderboard from './Leader'
import TypingTest from './routes/type/page'
import NotFound from './404'
import First from './First'
import Page from './routes/type/page'

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
      <BrowserRouter>
        <Routes>
          <Route path='*'element={<NotFound/>}/>
          <Route path='/' element={<First />} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/first' element= {<First/>}/>
          <Route path='/Login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/Register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path='/Result' element={<ProtectedRoute><Result /></ProtectedRoute>} />
          <Route path='/leader' element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path='/type' element={<ProtectedRoute><TypingTest /></ProtectedRoute>} />
          <Route path='/page' element={<ProtectedRoute><Page /></ProtectedRoute>} />
          
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
