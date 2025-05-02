// src/components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// More flexible component that can protect routes based on specific roles
export const PrivateRoute = ({ roleRequired }) => {
  const { currentUser, isLoading } = useAuth();
  
  // Show loading indicator while checking auth status
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Not authenticated - go to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // No specific role required, or user has the required role
  if (!roleRequired || currentUser.role === roleRequired || 
      // Admin can access any route
      (currentUser.role === 'admin' && roleRequired !== 'customer')) {
    return <Outlet />;
  }
  
  // User doesn't have the required role - redirect to their dashboard
  return <Navigate to={`/${currentUser.role}`} />;
};