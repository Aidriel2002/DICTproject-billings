import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import * as paymentService from '../services/paymentService';
import { logActivity } from '../services/activityLogService';

export const usePayments = (accountIdOverride = null) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const timeoutsRef = useRef({});
  const targetAccountId = accountIdOverride || user?.id;

  useEffect(() => {
    if (user && targetAccountId) {
      loadData(targetAccountId);
    }
  }, [user, targetAccountId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  const loadData = async (accountId = targetAccountId) => {
    if (!accountId) return;
    try {
      const data = await paymentService.loadPayments(accountId);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
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
      entityType: 'payment',
      entityId,
      details
    });
  };

  const addPayment = async (payment) => {
    try {
      const ownerId = targetAccountId || user.id;
      const newPayment = await paymentService.addPayment(payment, ownerId);
      setPayments([...payments, newPayment]);
      await logAction('payment_created', newPayment.id, { siteName: newPayment.siteName });
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const updatePayment = async (payment, addToHistory = null) => {
    try {
      await paymentService.updatePayment(payment);
      setPayments(payments.map(p => p.id === payment.id ? payment : p));
      await logAction(
        payment.remarks === 'Paid' ? 'payment_paid' : 'payment_updated',
        payment.id,
        { siteName: payment.siteName, remarks: payment.remarks }
      );

      // If payment was marked as Paid and we have payment details, add to history
      if (payment.remarks === 'Paid' && addToHistory && payment.paidAmount) {
        const historyEntry = {
          paymentId: payment.id,
          siteName: payment.siteName,
          accountName: payment.accountName,
          accountNumber: payment.accountNumber,
          amountPaid: payment.paidAmount,
          installationFee: payment.installationFee || 0,
          paymentDate: payment.paymentDate || new Date().toISOString(),
          referenceNumber: payment.referenceNumber,
          notes: payment.notes || ''
        };
        
        await addToHistory(historyEntry);
      }

      // If the payment was marked as Paid, set up auto-revert
      if (payment.remarks === 'Paid') {
        // Clear any existing timeout for this payment
        if (timeoutsRef.current[payment.id]) {
          clearTimeout(timeoutsRef.current[payment.id]);
        }

        // Set new timeout to revert after 15 days
        timeoutsRef.current[payment.id] = setTimeout(async () => {
          const revertedPayment = { ...payment, remarks: 'Unpaid' };
          try {
            await paymentService.updatePayment(revertedPayment);
            setPayments(prev => prev.map(p => 
              p.id === payment.id ? revertedPayment : p
            ));
          } catch (error) {
            console.error('Error reverting payment:', error);
          }
          delete timeoutsRef.current[payment.id];
        }, 15 * 24 * 60 * 60 * 1000); // 15 days in milliseconds
      } else {
        // If marked as Unpaid manually, clear any existing timeout
        if (timeoutsRef.current[payment.id]) {
          clearTimeout(timeoutsRef.current[payment.id]);
          delete timeoutsRef.current[payment.id];
        }
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const deletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      const existing = payments.find(p => p.id === id);
      try {
        if (timeoutsRef.current[id]) {
          clearTimeout(timeoutsRef.current[id]);
          delete timeoutsRef.current[id];
        }
        
        await paymentService.deletePayment(id);
        setPayments(payments.filter(p => p.id !== id));
        await logAction('payment_deleted', id, { siteName: existing?.siteName });
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return { payments, loading, addPayment, updatePayment, deletePayment, refreshPayments: loadData };
};