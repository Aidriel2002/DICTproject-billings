import React from 'react';
import { styles } from '../../styles/dashboardStyles';

export const NotificationBar = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  return (
    <div style={styles.notificationBar}>
      <div style={styles.notificationContent}>
        <strong>⚠️ Payment Reminders:</strong> {notifications.length} payment(s) due within 7 days
      </div>
      <button onClick={onClose} style={styles.notificationClose}>×</button>
    </div>
  );
};

export default NotificationBar;  // Add default export