import { supabase } from './supabaseClient';

export const loadPayments = async (userId) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error loading payments:', error);
    throw error;
  }
  
  // Convert snake_case to camelCase
  return (data || []).map(payment => ({
    id: payment.id,
    userId: payment.user_id,
    siteName: payment.site_name,
    accountName: payment.account_name,
    accountNumber: payment.account_number,
    dueDate: payment.due_date,
    installationFee: payment.installation_fee,
    monthlyPayment: payment.monthly_payment,
    remarks: payment.remarks,
    phase: payment.phase,
    createdAt: payment.created_at
  }));
};

export const addPayment = async (payment, userId) => {
  // Convert camelCase to snake_case
  const newPayment = {
    id: Date.now(),
    user_id: userId,
    site_name: payment.siteName,
    account_name: payment.accountName,
    account_number: payment.accountNumber,
    due_date: payment.dueDate,
    installation_fee: payment.installationFee,
    monthly_payment: payment.monthlyPayment,
    remarks: payment.remarks,
    phase: payment.phase
  };
  
  const { error } = await supabase
    .from('payments')
    .insert([newPayment]);

  if (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
  
  // Return in camelCase format
  return {
    id: newPayment.id,
    userId: newPayment.user_id,
    siteName: newPayment.site_name,
    accountName: newPayment.account_name,
    accountNumber: newPayment.account_number,
    dueDate: newPayment.due_date,
    installationFee: newPayment.installation_fee,
    monthlyPayment: newPayment.monthly_payment,
    remarks: newPayment.remarks,
    phase: newPayment.phase
  };
};

export const updatePayment = async (payment) => {
  // Convert camelCase to snake_case
  const updateData = {
    site_name: payment.siteName,
    account_name: payment.accountName,
    account_number: payment.accountNumber,
    due_date: payment.dueDate,
    installation_fee: payment.installationFee,
    monthly_payment: payment.monthlyPayment,
    remarks: payment.remarks,
    phase: payment.phase
  };
  
  const { error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', payment.id);

  if (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
  
  return payment;
};

export const deletePayment = async (id) => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};