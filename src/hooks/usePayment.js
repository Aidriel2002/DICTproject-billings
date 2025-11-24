import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import * as paymentService from '../services/paymentService';

export const usePayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const data = await paymentService.loadPayments(user.id);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (payment) => {
    try {
      const newPayment = await paymentService.addPayment(payment, user.id);
      setPayments([...payments, newPayment]);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const updatePayment = async (payment) => {
    try {
      await paymentService.updatePayment(payment);
      setPayments(payments.map(p => p.id === payment.id ? payment : p));
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const deletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentService.deletePayment(id);
        setPayments(payments.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return { payments, loading, addPayment, updatePayment, deletePayment };
};