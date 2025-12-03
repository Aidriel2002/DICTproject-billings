import React, { useEffect, useMemo, useState } from 'react';
import AuthProvider from './components/Auth/AuthProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import NotificationBar from './components/Dashboard/NotificationBar';
import PaymentForm from './components/Payments/PaymentForm';
import PaymentList from './components/Payments/PaymentList';
import PaymentHistoryList from './components/PaymentsHistory/PaymentHistoryList';
import AccessManager from './components/Access/AccessManager';
import AccountSwitcher from './components/Access/AccountSwitcher';
import ActivityLogList from './components/Activity/ActivityLogList';
import { usePayments } from './hooks/usePayment';
import { usePaymentHistory } from './hooks/usePaymentHistory';
import { useAccessControl } from './hooks/useAccessControl';
import { useActivityLogs } from './hooks/useActivityLogs';
import { useAuth } from './hooks/useAuth';
import { isCoveredByAdvancePayment } from './utils/statusHelper';
import { styles } from './styles/styles';
import { styles as paymentStyles } from './styles/paymentStyles';
import { PayBillModal } from './components/Payments/PayBillModal';
import './App.css'

const MainApp = () => {
  const { user } = useAuth();
  const {
    grantedAccesses,
    accessibleAccounts,
    loadingAccess,
    grantAccess,
    revokeAccess
  } = useAccessControl();
  const [activeAccountId, setActiveAccountId] = useState(null);

  useEffect(() => {
    if (!activeAccountId && accessibleAccounts.length > 0) {
      setActiveAccountId(accessibleAccounts[0].id);
    }
  }, [accessibleAccounts, activeAccountId]);

  const activeAccount = useMemo(
    () => accessibleAccounts.find((account) => account.id === activeAccountId),
    [accessibleAccounts, activeAccountId]
  );

  const { payments, addPayment, updatePayment, deletePayment } = usePayments(activeAccountId);
  const { paymentHistory, addHistory, updateHistory, deleteHistory } = usePaymentHistory(activeAccountId);
  const { logs: activityLogs, loading: loadingLogs } = useActivityLogs(activeAccountId);
  const [showForm, setShowForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingHistory, setEditingHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(true);

  // Get all notification-worthy payments (overdue + due within 7 days)
  const notificationPayments = useMemo(() => {
    return payments.filter(p => {
      // Skip if covered by advance payment
      if (isCoveredByAdvancePayment(p)) return false;
      // Skip if paid
      if (p.remarks === 'Paid') return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      const daysUntilDue = Math.ceil((dueDate - today) / 86400000);
      
      // Include if overdue OR due within 7 days
      return today > dueDate || (daysUntilDue <= 7 && daysUntilDue >= 0);
    });
  }, [payments]);

  const handleAdd = async (payment) => {
    if (editingPayment) {
      await updatePayment({ ...payment, id: editingPayment.id });
      setEditingPayment(null);
    } else {
      await addPayment(payment);
    }
    setShowForm(false);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleAddHistory = async (history) => {
    if (editingHistory) {
      await updateHistory({ ...history, id: editingHistory.id });
      setEditingHistory(null);
    } else {
      await addHistory(history);
    }
    setShowHistoryForm(false);
  };

  const handleEditHistory = (history) => {
    setEditingHistory(history);
    setShowHistoryForm(true);
  };

  const handleCancelHistory = () => {
    setShowHistoryForm(false);
    setEditingHistory(null);
  };

  const downloadCSV = (filename, data, headers) => {
    const csvHeaders = headers.join(',');
    const csvRows = (data || []).map(row =>
      headers.map(header => {
        const value = row[header] ?? '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadData = () => {
    const paymentData = payments.map(payment => ({
      'Site Name': payment.siteName,
      'Account Name': payment.accountName,
      'Account Number': payment.accountNumber,
      'Due Date': payment.dueDate,
      'Monthly Payment': payment.monthlyPayment,
      'Installation Fee': payment.installationFee,
      'Status': payment.remarks,
      'Phase': payment.phase
    }));

    const paymentHistoryData = paymentHistory.map(history => ({
      'Site Name': history.siteName,
      'Account Name': history.accountName,
      'Account Number': history.accountNumber,
      'Amount Paid': history.amountPaid,
      'Installation Fee': history.installationFee,
      'Payment Date': history.paymentDate,
      'Reference Number': history.referenceNumber,
      'Notes': history.notes
    }));

    if (paymentData.length === 0 && paymentHistoryData.length === 0) {
      alert('No data available to download.');
      return;
    }

    if (paymentData.length > 0) {
      downloadCSV('payments.csv', paymentData, Object.keys(paymentData[0]));
    }
    if (paymentHistoryData.length > 0) {
      downloadCSV('payment_history.csv', paymentHistoryData, Object.keys(paymentHistoryData[0]));
    }
  };

  const [selectedPaymentForBill, setSelectedPaymentForBill] = useState(null);
  const [showPayBillModal, setShowPayBillModal] = useState(false);

  const handleNotificationClick = (payment) => {
    setSelectedPaymentForBill(payment);
    setShowPayBillModal(true);
  };

  const handleClosePayBillModal = () => {
    setShowPayBillModal(false);
    setSelectedPaymentForBill(null);
  };

  return (
    <div style={styles.container}>

      <Header 
        notifications={notificationPayments} 
        onNotificationClick={handleNotificationClick}
      />

      {showNotifications && notificationPayments.length > 0 && (
        <div style={styles.notificationWrapper}>
          <NotificationBar 
            notifications={notificationPayments} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onDownloadData={handleDownloadData} />

      <main style={styles.main}>
        <AccountSwitcher
          accounts={accessibleAccounts}
          activeAccountId={activeAccountId}
          onChange={setActiveAccountId}
        />
        {activeAccount?.type === 'shared' && (
          <div style={styles.sharedAccountBanner}>
            Viewing {activeAccount.email}'s account. Changes are saved directly to their data.
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            payments={payments}
            onUpdate={updatePayment}
            onAddHistory={addHistory}
          />
        )}
        
        {activeTab === 'payments' && (
          <>
            <div style={paymentStyles.actionBar}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  ...paymentStyles.addButton,
                  ...(activeAccount?.id !== user?.id ? paymentStyles.addButtonDisabled : {})
                }}
                disabled={activeAccount?.id !== user?.id}
              >
                + Add Payment
              </button>
            </div>

            {showForm && (
              <PaymentForm
                onAdd={handleAdd}
                onCancel={handleCancel}
                editData={editingPayment}
              />
            )}

            <PaymentList
              payments={payments}
              onEdit={handleEdit}
              onDelete={deletePayment}
              onUpdate={updatePayment} 
              onAddHistory={addHistory}
            />
          </>
        )}

        {activeTab === 'history' && (
          <PaymentHistoryList
            history={paymentHistory}
            onEdit={handleEditHistory}
            onDelete={deleteHistory}
          />
        )}

        {activeTab === 'access' && (
          <AccessManager
            grantedAccesses={grantedAccesses}
            onAddAccess={grantAccess}
            onRemoveAccess={revokeAccess}
            loading={loadingAccess}
            isOwner
            currentEmail={user?.email}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityLogList logs={activityLogs} loading={loadingLogs} />
        )}
   
      </main>

      {showPayBillModal && selectedPaymentForBill && (
        <PayBillModal
          open={showPayBillModal}
          payment={selectedPaymentForBill}
          onClose={handleClosePayBillModal}
          onUpdate={async (updatedPayment) => {
            try {
              await updatePayment(updatedPayment);
              
              if (updatedPayment.remarks === "Paid" || updatedPayment.remarks?.startsWith("Paid until")) {
                await addHistory({
                  paymentId: selectedPaymentForBill.id,
                  siteName: updatedPayment.siteName,
                  accountName: updatedPayment.accountName,
                  accountNumber: updatedPayment.accountNumber,
                  amountPaid: updatedPayment.paidAmount,
                  totalPaid: updatedPayment.totalPaid,
                  installationFee: updatedPayment.installationFee || 0,
                  referenceNumber: updatedPayment.referenceNumber,
                  paymentDate: updatedPayment.paymentDate,
                  isAdvancePayment: updatedPayment.isAdvancePayment,
                  advanceMonths: updatedPayment.advanceMonths,
                  paidUntil: updatedPayment.paidUntil
                });
              }
              
              handleClosePayBillModal();
            } catch (error) {
              console.error('Error in onUpdate:', error);
              alert('Error updating payment: ' + error.message);
            }
          }}
        />
      )}

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <MainApp />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;