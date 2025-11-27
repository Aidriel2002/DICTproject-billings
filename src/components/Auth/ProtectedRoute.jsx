import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginPage from './LoginPage';
import { styles } from '../../styles/authStyles';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  return user ? children : <LoginPage />;
};

export default ProtectedRoute; 