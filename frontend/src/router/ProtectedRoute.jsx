import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Public Route Component
 * Redirects to home if user is already authenticated
 */
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (token) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};
