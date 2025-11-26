import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import * as paymentHistoryService from '../services/paymentHistoryService';
import { logActivity } from '../services/activityLogService';

export const usePaymentHistory = (accountIdOverride = null) => {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const targetAccountId = accountIdOverride || user?.id;

  useEffect(() => {
    if (user && targetAccountId) {
      loadData(targetAccountId);
    }
  }, [user, targetAccountId]);

  const loadData = async (accountId = targetAccountId) => {
    if (!accountId) return;
    try {
      const data = await paymentHistoryService.loadPaymentHistory(accountId);
      setPaymentHistory(data);
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (action, entityId, details = {}) => {
    if (!user || !targetAccountId) return;
    await logActivity({
      ownerId: targetAccountId,
      actorId: user.id,
      actorEmail: user.email,
      action,
      entityType: 'history',
      entityId,
      details
    });
  };

  const addHistory = async (history) => {
    try {
      const ownerId = targetAccountId || user.id;
      const newHistory = await paymentHistoryService.addPaymentHistory(history, ownerId);
      setPaymentHistory([newHistory, ...paymentHistory]);
      await logAction('history_added', newHistory.id, { siteName: newHistory.siteName });
      return newHistory;
    } catch (error) {
      console.error('Error adding payment history:', error);
      throw error;
    }
  };

  const updateHistory = async (history) => {
    try {
      await paymentHistoryService.updatePaymentHistory(history);
      setPaymentHistory(
        paymentHistory.map(h => h.id === history.id ? history : h)
      );
      await logAction('history_updated', history.id, { siteName: history.siteName });
    } catch (error) {
      console.error('Error updating payment history:', error);
      throw error;
    }
  };

  const deleteHistory = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment history?')) {
      const existing = paymentHistory.find(h => h.id === id);
      try {
        await paymentHistoryService.deletePaymentHistory(id);
        setPaymentHistory(paymentHistory.filter(h => h.id !== id));
        await logAction('history_deleted', id, { siteName: existing?.siteName });
      } catch (error) {
        console.error('Error deleting payment history:', error);
        throw error;
      }
    }
  };

  const getHistoryByPaymentId = async (paymentId) => {
    try {
      return await paymentHistoryService.getPaymentHistoryByPaymentId(paymentId, targetAccountId || user.id);
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  };

  return { paymentHistory, loading, addHistory, updateHistory, deleteHistory, getHistoryByPaymentId, refreshHistory: loadData };
};
