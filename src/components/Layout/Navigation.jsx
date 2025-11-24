import React from 'react';
import { styles } from '../../styles/styles';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav style={styles.nav}>
      <button
        onClick={() => setActiveTab('dashboard')}
        style={activeTab === 'dashboard' ? styles.navButtonActive : styles.navButton}
      >
        Dashboard
      </button>

      <button
        onClick={() => setActiveTab('payments')}
        style={activeTab === 'payments' ? styles.navButtonActive : styles.navButton}
      >
        Payments
      </button>

      <button
        onClick={() => setActiveTab('history')}
        style={activeTab === 'history' ? styles.navButtonActive : styles.navButton}
      >
        Payment History
      </button>
    </nav>
  );
};

export default Navigation;
