import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getDaysOverdue, isCoveredByAdvancePayment } from '../../utils/statusHelper';
import { styles } from '../../styles/styles';

export const Header = ({ notifications = [], onNotificationClick }) => {
  const { user, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const processedNotifications = notifications
    .filter(payment => {
      if (isCoveredByAdvancePayment(payment)) return false;
      if (payment.remarks === 'Paid') return false;
      return true;
    })
    .map(payment => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      const daysRemaining = Math.ceil((dueDate - today) / 86400000);
      const daysOverdue = getDaysOverdue(payment);
      const isOverdue = today > dueDate;
      
      return {
        dueDate: `Day ${payment.dueDate}`,
        amount: payment.monthlyPayment,
        clientName: payment.accountName,
        projectName: payment.siteName,
        daysRemaining: isOverdue ? daysOverdue : daysRemaining,
        isOverdue: isOverdue,
        originalPayment: payment,
        sortPriority: isOverdue ? -daysOverdue : daysRemaining 
      };
    })
    .sort((a, b) => a.sortPriority - b.sortPriority); 

  const overdueCount = processedNotifications.filter(n => n.isOverdue).length;
  const dueSoonCount = processedNotifications.filter(n => !n.isOverdue).length;

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification.originalPayment);
      setShowModal(false); 
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const getNotificationStyle = (notification, isHovered) => {
    const baseStyle = {
      ...styles.notificationItem,
      ...(isHovered ? styles.notificationItemHover : {})
    };

    if (notification.isOverdue) {
      return {
        ...baseStyle,
        borderLeft: '4px solid #ef4444',
        backgroundColor: isHovered ? '#ecebeaff' : '#ffffffff'
      };
    } else {
      return {
        ...baseStyle,
        borderLeft: '4px solid #fb923c',
        backgroundColor: isHovered ? '#ecebeaff' : '#ffffffff'
      };
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
              {processedNotifications.length > 0 && (
                <span style={styles.notificationBadge}>
                  {processedNotifications.length}
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
            
            {processedNotifications.length > 0 && (
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                gap: '20px',
                fontSize: '14px'
              }}>
                {overdueCount > 0 && (
                  <div style={{ color: '#ef4444', fontWeight: '600' }}>
                    🔴 {overdueCount} Overdue
                  </div>
                )}
                {dueSoonCount > 0 && (
                  <div style={{ color: '#fb923c', fontWeight: '600' }}>
                    🟠 {dueSoonCount} Due Soon
                  </div>
                )}
              </div>
            )}

            <div style={styles.notificationList}>
              {processedNotifications.length > 0 ? (
                processedNotifications.map((notification, index) => (
                  <div
                    key={index}
                    style={getNotificationStyle(notification, hoveredItem === index)}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={styles.notificationDate}>
                        Due: {notification.dueDate}
                      </div>
                      {notification.isOverdue ? (
                        <div style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          OVERDUE
                        </div>
                      ) : (
                        <div style={{
                          backgroundColor: '#fb923c',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          DUE SOON
                        </div>
                      )}
                    </div>
                    <div style={styles.notificationAmount}>
                      Amount: ₱{notification.amount?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={styles.notificationDetails}>
                      {notification.projectName} - {notification.clientName}
                    </div>
                    <div style={{
                      ...styles.notificationDetails,
                      color: notification.isOverdue ? '#dc2626' : '#ea580c',
                      fontWeight: '600',
                      marginTop: '4px'
                    }}>
                      {notification.isOverdue 
                        ? `${notification.daysRemaining} day${notification.daysRemaining !== 1 ? 's' : ''} overdue`
                        : `${notification.daysRemaining} day${notification.daysRemaining !== 1 ? 's' : ''} remaining`
                      }
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <p>No upcoming payments or overdue bills</p>
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