import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fleet-loader-screen">
        <div className="spinner-glow"></div>
        <p>Loading TTC Fleet360...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have the required permissions to access this module.</p>
      </div>
    );
  }

  return children;
};
