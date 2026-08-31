import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking local storage or token validity on a new browser, show a loader
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
        Authenticating session...
      </div>
    );
  }

  // If no user exists after loading finishes, push them straight to login
  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}