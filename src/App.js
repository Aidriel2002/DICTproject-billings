import React, { useState } from 'react';
import AuthProvider from './components/Auth/AuthProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import NotificationBar from './components/Dashboard/NotificationBar';
import PaymentForm from './components/Payments/PaymentForm';
import PaymentList from './components/Payments/PaymentList';
import PaymentHistoryList from './components/PaymentsHistory/PaymentHistoryList';
import { usePayments } from './hooks/usePayment';
import { usePaymentHistory } from './hooks/usePaymentHistory';
import { getUpcomingPayments } from './utils/statusHelper';
import { styles } from './styles/styles';
import { styles as paymentStyles } from './styles/paymentStyles';

const MainApp = () => {
  const { payments, addPayment, updatePayment, deletePayment } = usePayments();
  const { paymentHistory, addHistory, updateHistory, deleteHistory } = usePaymentHistory();
  const [showForm, setShowForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingHistory, setEditingHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(true);

  const upcomingPayments = getUpcomingPayments(payments);

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

  return (
    <div style={styles.container}>
      <Header />

      {showNotifications && upcomingPayments.length > 0 && (
        <NotificationBar 
          notifications={upcomingPayments} 
          onClose={() => setShowNotifications(false)} 
        />
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={styles.main}>
        {activeTab === 'dashboard' && <Dashboard payments={payments} />}
        
        {activeTab === 'payments' && (
          <>
            <div style={paymentStyles.actionBar}>
              <button onClick={() => setShowForm(true)} style={paymentStyles.addButton}>
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
          <>
           
            <PaymentHistoryList
              history={paymentHistory}
              onEdit={handleEditHistory}
              onDelete={deleteHistory}
            />
            
          </>
        )}
      </main>
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