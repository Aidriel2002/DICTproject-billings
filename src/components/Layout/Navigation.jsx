import React from 'react';
import { styles } from '../../styles/styles';

const Navigation = ({ activeTab, setActiveTab,onDownloadData }) => {
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

      <button
        onClick={() => setActiveTab('access')}
        style={activeTab === 'access' ? styles.navButtonActive : styles.navButton}
      >
        Access
      </button>

      <button
        onClick={() => setActiveTab('activity')}
        style={activeTab === 'activity' ? styles.navButtonActive : styles.navButton}
      >
        Activity Logs
      </button>
      
       <button onClick={onDownloadData} style={styles.shareButton}>
                Download Data
              </button>
    </nav>
  );
};

export default Navigation;
