import { lazy, Suspense } from 'react';
import TypingLoader from '../Loding/Loading';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Lazy load components for performance optimization & code splitting
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Result = lazy(() => import('../pages/Result'));
const First = lazy(() => import('../pages/First'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));
const NotFound = lazy(() => import('../pages/404'));
const Profile = lazy(() => import('../pages/Profile'));
const NotificationList = lazy(() => import('../components/notification/NotificationList'));

// Extracted Suspense wrapper helper
const withSuspense = (LazyComponent) => (
  <Suspense fallback={<TypingLoader />}>
    <LazyComponent />
  </Suspense>
);

/**
 * App Routes Configuration
 * Define all application routes here
 */
const routes = [
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        {withSuspense(NotificationList)}
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: withSuspense(NotFound)
  },
  {
    path: '/',
    element: withSuspense(First)
  },
  {
    path: '/first',
    element: withSuspense(First)
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        {withSuspense(Home)}
      </ProtectedRoute>
    )
  },
  {
    path: '/type',
    element: (
      <ProtectedRoute>
        {withSuspense(Home)}
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        {withSuspense(Login)}
      </PublicRoute>
    )
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        {withSuspense(Register)}
      </PublicRoute>
    )
  },
  {
    path: '/result',
    element: (
      <ProtectedRoute>
        {withSuspense(Result)}
      </ProtectedRoute>
    )
  },
  {
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        {withSuspense(Leaderboard)}
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        {withSuspense(Profile)}
      </ProtectedRoute>
    )
  },
  {
    path: '/loading',
    element: <TypingLoader />
  }
];

export default routes;
