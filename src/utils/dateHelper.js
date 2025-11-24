export const calculateDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(today.getFullYear(), today.getMonth(), dueDate);
  if (due < today) due.setMonth(due.getMonth() + 1);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};