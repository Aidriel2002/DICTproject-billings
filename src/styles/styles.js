export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#03310eff',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    position: 'sticky',
    top: 0,
    zIndex: 1200
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userEmail: {
    fontSize: '14px'
  },
  shareButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  nav: {
    backgroundColor: 'white',
    padding: '15px',
    display: 'flex',
    gap: '10px',
    borderBottom: '1px solid #e5e7eb'
  },
  navButton: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#6b7280',
    borderRadius: '4px'
  },
  navButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '4px'
  },
  main: {
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  notificationWrapper: {
    position: 'sticky',
    top: '92px',
    zIndex: 1100,
  },
  sharedAccountBanner: {
    backgroundColor: '#ecfccb',
    border: '1px solid #bef264',
    color: '#3f6212',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  // New notification bell styles
  notificationBellContainer: {
    position: 'relative',
    cursor: 'pointer'
  },
  notificationBell: {
    fontSize: '24px',
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '0 5px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingTop: '70px',
    paddingRight: '20px',
    zIndex: 1300
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '360px',
    maxHeight: '500px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
  },
  notificationList: {
    overflowY: 'auto',
    maxHeight: '400px'
  },
  notificationItem: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  notificationItemHover: {
    backgroundColor: '#f9fafb'
  },
  notificationDate: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px',
    fontSize: '14px'
  },
  notificationAmount: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '16px'
  },
  notificationDetails: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px'
  },
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    color: '#6b7280'
  }
};