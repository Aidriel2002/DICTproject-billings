import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import * as paymentHistoryService from '../services/paymentHistoryService';

export const usePaymentHistory = () => {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const data = await paymentHistoryService.loadPaymentHistory(user.id);
      setPaymentHistory(data);
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHistory = async (history) => {
    try {
      const newHistory = await paymentHistoryService.addPaymentHistory(history, user.id);
      setPaymentHistory([newHistory, ...paymentHistory]);
      return newHistory;
    } catch (error) {
      console.error('Error adding payment history:', error);
      throw error;
    }
  };

  const updateHistory = async (history) => {
    try {
      await paymentHistoryService.updatePaymentHistory(history);
      setPaymentHistory(paymentHistory.map(h => h.id === history.id ? history : h));
    } catch (error) {
      console.error('Error updating payment history:', error);
      throw error;
    }
  };

  const deleteHistory = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment history?')) {
      try {
        await paymentHistoryService.deletePaymentHistory(id);
        setPaymentHistory(paymentHistory.filter(h => h.id !== id));
      } catch (error) {
        console.error('Error deleting payment history:', error);
        throw error;
      }
    }
  };

  const getHistoryByPaymentId = async (paymentId) => {
    try {
      return await paymentHistoryService.getPaymentHistoryByPaymentId(paymentId, user.id);
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  };

  return { paymentHistory, loading, addHistory, updateHistory, deleteHistory, getHistoryByPaymentId, refreshHistory: loadData };
};