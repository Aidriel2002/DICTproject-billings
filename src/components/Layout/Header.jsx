import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { styles } from '../../styles/styles';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header style={styles.header}>
      <h1 style={styles.headerTitle}>Payment Tracker System</h1>
      <div style={styles.headerActions}>
        <span style={styles.userEmail}>{user?.email}</span>
        <button onClick={signOut} style={styles.logoutButton}>Logout</button>
      </div>
    </header>
  );
};

export default Header;  // Add default export