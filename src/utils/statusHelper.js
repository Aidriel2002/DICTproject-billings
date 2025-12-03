export const getStatusColor = (payment) => {
  // Check if advance payment is still valid
  if (payment.remarks && payment.remarks.startsWith('Paid until')) {
    const today = new Date();
    if (payment.paidUntil) {
      const paidUntilDate = new Date(payment.paidUntil);
      if (today <= paidUntilDate) {
        return '#4ade80'; // Still covered by advance payment
      }
    }
  }
  
  // Regular paid check
  if (payment.remarks === 'Paid') return '#4ade80';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
  
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const dueDate = new Date(currentYear, currentMonth, payment.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  // If due date has passed (today > dueDate), it's overdue
  if (today > dueDate) return '#ef4444'; // Red - Overdue
  if (daysUntilDue <= 7) return '#fb923c'; // Orange - Due soon (within 7 days)
  return '#4ade80'; // Green - Not due yet
};

export const getUpcomingPayments = (payments) => {
  return payments.filter(p => {
    // Skip if covered by advance payment
    if (p.paidUntil) {
      const today = new Date();
      const paidUntilDate = new Date(p.paidUntil);
      if (today <= paidUntilDate) return false;
    }
    
    // Skip if marked as paid
    if (p.remarks === 'Paid') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // Only show upcoming if within 7 days and not yet overdue
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });
};

export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(today.getFullYear(), today.getMonth(), dueDate);
  due.setHours(0, 0, 0, 0);
  
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
};

export const getOverduePayments = (payments) => {
  return payments.filter(p => {
    // Skip if currently covered by advance payment
    if (p.paidUntil) {
      const today = new Date();
      const paidUntilDate = new Date(p.paidUntil);
      if (today <= paidUntilDate) return false;
    }
    
    // Skip if marked as paid
    if (p.remarks === 'Paid') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    // Overdue if today is AFTER the due date
    return today > dueDate;
  });
};

// Helper function to get how many days overdue
export const getDaysOverdue = (payment) => {
  // Not overdue if covered by advance payment
  if (payment.paidUntil) {
    const today = new Date();
    const paidUntilDate = new Date(payment.paidUntil);
    if (today <= paidUntilDate) return 0;
  }
  
  if (payment.remarks === 'Paid') return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  // Not overdue yet
  if (today <= dueDate) return 0;
  
  const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
  return daysOverdue;
};

// Helper to check if payment is currently covered by advance payment
export const isCoveredByAdvancePayment = (payment) => {
  if (!payment.paidUntil) return false;
  
  const today = new Date();
  const paidUntilDate = new Date(payment.paidUntil);
  return today <= paidUntilDate;
};