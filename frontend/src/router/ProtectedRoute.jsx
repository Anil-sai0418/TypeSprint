import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Supports both JWT tokens and OAuth sessions
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem('token');
  const location = useLocation();

  // User is authenticated via OAuth or has JWT token
  // Let the component render to show its own skeleton loaders while data fetches
  if (isAuthenticated || token) {
    return children;
  }

  // Still loading auth status from server and no token available
  if (loading) {
    return null;
  }

  // Not authenticated - redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

/**
 * Public Route Component
 * Redirects to home if user is already authenticated
 * Supports both JWT tokens and OAuth sessions
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem('token');
  const location = useLocation();

  // User is already authenticated - redirect away from login/register
  if (isAuthenticated || token) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // Still loading auth status from server
  if (loading) {
    return children; // Allow login/register to render (they can show their own loaders if needed)
  }

  return children;
};
