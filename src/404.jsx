import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-2">Oops! Page not found.</p>
      <p className="text-md text-gray-500 mb-6">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}