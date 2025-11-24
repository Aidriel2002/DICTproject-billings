export const getStatusColor = (payment) => {
  if (payment.remarks === 'Paid') return '#4ade80';
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const dueDate = new Date(currentYear, currentMonth, payment.dueDate);
  
  if (dueDate < today) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return '#ef4444';
  if (daysUntilDue <= 7) return '#fb923c';
  return '#4ade80';
};

export const getUpcomingPayments = (payments) => {
  return payments.filter(p => {
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    if (dueDate < today) dueDate.setMonth(dueDate.getMonth() + 1);
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0 && p.remarks === 'Unpaid';
  });
};