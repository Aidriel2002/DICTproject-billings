import { supabase } from './supabaseClient';

export const loadPaymentHistory = async (userId) => {
  const { data, error } = await supabase
    .from('payment_history')
    .select('*')
    .eq('user_id', userId)
    .order('payment_date', { ascending: false });
  
  if (error) {
    console.error('Error loading payment history:', error);
    throw error;
  }
  
  return (data || []).map(history => ({
    id: history.id,
    paymentId: history.payment_id,
    userId: history.user_id,
    siteName: history.site_name,
    accountName: history.account_name,
    accountNumber: history.account_number,
    amountPaid: history.amount_paid,
    paymentDate: history.payment_date,
    paymentMethod: history.payment_method,
    referenceNumber: history.reference_number,
    notes: history.notes,
    createdAt: history.created_at
  }));
};

export const addPaymentHistory = async (history, userId) => {
  const newHistory = {
    id: Date.now(),
    payment_id: history.paymentId,
    user_id: userId,
    site_name: history.siteName,
    account_name: history.accountName,
    account_number: history.accountNumber,
    amount_paid: history.amountPaid,
    payment_date: history.paymentDate,
    payment_method: history.paymentMethod,
    reference_number: history.referenceNumber,
    notes: history.notes
  };
  
  const { error } = await supabase
    .from('payment_history')
    .insert([newHistory]);

  if (error) {
    console.error('Error adding payment history:', error);
    throw error;
  }
  
  return {
    id: newHistory.id,
    paymentId: newHistory.payment_id,
    userId: newHistory.user_id,
    siteName: newHistory.site_name,
    accountName: newHistory.account_name,
    accountNumber: newHistory.account_number,
    amountPaid: newHistory.amount_paid,
    paymentDate: newHistory.payment_date,
    paymentMethod: newHistory.payment_method,
    referenceNumber: newHistory.reference_number,
    notes: newHistory.notes
  };
};

export const updatePaymentHistory = async (history) => {
  const updateData = {
    amount_paid: history.amountPaid,
    payment_date: history.paymentDate,
    payment_method: history.paymentMethod,
    reference_number: history.referenceNumber,
    notes: history.notes
  };
  
  const { error } = await supabase
    .from('payment_history')
    .update(updateData)
    .eq('id', history.id);

  if (error) {
    console.error('Error updating payment history:', error);
    throw error;
  }
  
  return history;
};

export const deletePaymentHistory = async (id) => {
  const { error } = await supabase
    .from('payment_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payment history:', error);
    throw error;
  }
};

export const getPaymentHistoryByPaymentId = async (paymentId, userId) => {
  const { data, error } = await supabase
    .from('payment_history')
    .select('*')
    .eq('payment_id', paymentId)
    .eq('user_id', userId)
    .order('payment_date', { ascending: false });
  
  if (error) {
    console.error('Error loading payment history:', error);
    throw error;
  }
  
  return (data || []).map(history => ({
    id: history.id,
    paymentId: history.payment_id,
    userId: history.user_id,
    siteName: history.site_name,
    accountName: history.account_name,
    accountNumber: history.account_number,
    amountPaid: history.amount_paid,
    paymentDate: history.payment_date,
    paymentMethod: history.payment_method,
    referenceNumber: history.reference_number,
    notes: history.notes,
    createdAt: history.created_at
  }));
};