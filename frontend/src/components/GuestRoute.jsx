import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If the user is already logged in, redirect them to the home page.
    return <Navigate to="/" replace />;
  }

  return children;
}

export default GuestRoute;
