import React, { useState } from 'react';
import { getStatusColor } from '../../utils/statusHelper';
import { PayBillModal } from '../Payments/PayBillModal';
import { styles } from '../../styles/dashboardStyles';

export const Dashboard = ({ payments, onUpdate, onAddHistory }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPayModalOpen, setPayModalOpen] = useState(false);

  const openPayBill = (payment) => {
    setSelectedPayment(payment);
    setPayModalOpen(true);
  };

  const handleConfirmPayment = async (updatedPayment) => {
    await onUpdate(updatedPayment);

    if (updatedPayment.remarks === "Paid" && typeof onAddHistory === "function") {
      await onAddHistory({
        paymentId: updatedPayment.id,
        siteName: updatedPayment.siteName,
        accountName: updatedPayment.accountName,
        accountNumber: updatedPayment.accountNumber,
        amountPaid: updatedPayment.paidAmount,
        installationFee: updatedPayment.installationFee,
        referenceNumber: updatedPayment.referenceNumber,
        paymentDate: updatedPayment.paymentDate,
      });
    }

    setPayModalOpen(false);
    setSelectedPayment(null);
  };

  const dueLessThan7Days = payments.filter(p => {
    const today = new Date();
    const due = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    if (due < today) due.setMonth(due.getMonth() + 1);

    const diff = Math.ceil((due - today) / 86400000);
    return diff <= 7 && diff >= 0 && p.remarks === 'Unpaid';
  });

  const upcomingUnpaidBills = payments.filter(p => {
    const today = new Date();
    const due = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    if (due < today) due.setMonth(due.getMonth() + 1);

    const diff = Math.ceil((due - today) / 86400000);
    return p.remarks === 'Unpaid' && diff > 7;
  });

  const renderPaymentTable = (paymentList, showDaysLeft = false) => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Site Name</th>
            <th style={styles.th}>Account Name</th>
            <th style={styles.th}>Account Number</th>
            <th style={styles.th}>Due Date</th>
            <th style={styles.th}>Monthly Payment</th>
            {showDaysLeft && <th style={styles.th}>Days Left</th>}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paymentList.map(payment => {
            const today = new Date();
            const due = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
            if (due < today) due.setMonth(due.getMonth() + 1);
            const days = Math.ceil((due - today) / 86400000);

            return (
              <tr key={payment.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(payment) }}></span>
                </td>
                <td style={styles.td}>{payment.siteName}</td>
                <td style={styles.td}>{payment.accountName}</td>
                <td style={styles.td}>{payment.accountNumber}</td>
                <td style={styles.td}>Day {payment.dueDate}</td>
                <td style={styles.td}>₱{payment.monthlyPayment.toLocaleString()}</td>
                {showDaysLeft && <td style={styles.td}>{days} days</td>}

                <td style={styles.td}>
                  <button 
                    onClick={() => openPayBill(payment)}
                    style={styles.payBillButton}
                  >
                    Pay Bill
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.dashboardTitle}>Due Less Than 7 Days</h2>

      {dueLessThan7Days.length === 0 ? (
        <p style={styles.noData}>No payments due within the next 7 days</p>
      ) : (
        renderPaymentTable(dueLessThan7Days, true)
      )}

      <h2 style={{ ...styles.dashboardTitle, marginTop: '40px' }}>Upcoming Unpaid Bills</h2>

      {upcomingUnpaidBills.length === 0 ? (
        <p style={styles.noData}>No upcoming unpaid bills</p>
      ) : (
        renderPaymentTable(upcomingUnpaidBills, false)
      )}

      <PayBillModal
        open={isPayModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setPayModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdate={handleConfirmPayment}
      />
    </div>
  );
};

export default Dashboard;