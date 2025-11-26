import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { styles } from '../../styles/styles';

export const Header = ({ notifications = [], onNotificationClick }) => {
  const { user, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Transform notifications to match the expected format
  const formattedNotifications = notifications.map(payment => {
    // Calculate days remaining using same logic as Dashboard
    const today = new Date();
    const due = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
    if (due < today) due.setMonth(due.getMonth() + 1);
    const daysRemaining = Math.ceil((due - today) / 86400000);
    
    return {
      dueDate: `Day ${payment.dueDate}`,
      amount: payment.monthlyPayment,
      clientName: payment.accountName,
      projectName: payment.siteName,
      daysRemaining: daysRemaining,
      originalPayment: payment // Keep original payment data
    };
  });

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked in Header:', notification);
    console.log('Original payment:', notification.originalPayment);
    console.log('onNotificationClick function exists:', !!onNotificationClick);
    
    if (onNotificationClick) {
      onNotificationClick(notification.originalPayment);
      setShowModal(false); // Close modal after clicking
    } else {
      console.error('onNotificationClick is not defined!');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Payment Tracker System</h1>
        <div style={styles.headerActions}>
          <div style={styles.notificationBellContainer}>
            <button onClick={toggleModal} style={styles.notificationBell}>
              🔔
              {formattedNotifications.length > 0 && (
                <span style={styles.notificationBadge}>
                  {formattedNotifications.length}
                </span>
              )}
            </button>
          </div>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={signOut} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      {showModal && (
        <div style={styles.modalOverlay} onClick={handleOverlayClick}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Payment Reminders</h2>
              <button 
                onClick={toggleModal} 
                style={styles.modalClose}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>
            <div style={styles.notificationList}>
              {formattedNotifications.length > 0 ? (
                formattedNotifications.map((notification, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.notificationItem,
                      ...(hoveredItem === index ? styles.notificationItemHover : {})
                    }}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div style={styles.notificationDate}>
                      Due: {notification.dueDate || 'N/A'}
                    </div>
                    <div style={styles.notificationAmount}>
                      Amount: ₱ {notification.amount?.toFixed(2) || '0.00'}
                    </div>
                    <div style={styles.notificationDetails}>
                      {notification.projectName || 'Client'} - {notification.clientName || 'Project'}
                    </div>
                    <div style={styles.notificationDetails}>
                      Days remaining: {notification.daysRemaining || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <p>No upcoming payments within 7 days</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;