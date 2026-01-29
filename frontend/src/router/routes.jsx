import { Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Result from '../pages/Result';
import First from '../pages/First';
import Leaderboard from '../pages/Leaderboard';
import NotFound from '../pages/404';
import Profile from '../pages/Profile';
import TypingTest from '../routes/type/page';
import TypingLoader from '../Loding/Loading';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

/**
 * App Routes Configuration
 * Define all application routes here
 */
const routes = [
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: '/',
    element: <First />
  },
  {
    path: '/first',
    element: <First />
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/type',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/Login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/Register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    )
  },
  {
    path: '/Result',
    element: (
      <ProtectedRoute>
        <Result />
      </ProtectedRoute>
    )
  },
  {
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/loading',
    element: <TypingLoader />
  }
];

export default routes;
