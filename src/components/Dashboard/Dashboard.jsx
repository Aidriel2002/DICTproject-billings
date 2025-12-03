import React, { useState } from 'react';
import { getStatusColor, getDaysOverdue, isCoveredByAdvancePayment } from '../../utils/statusHelper';
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

    if ((updatedPayment.remarks === "Paid" || updatedPayment.remarks?.startsWith("Paid until")) && typeof onAddHistory === "function") {
      await onAddHistory({
        paymentId: updatedPayment.id,
        siteName: updatedPayment.siteName,
        accountName: updatedPayment.accountName,
        accountNumber: updatedPayment.accountNumber,
        amountPaid: updatedPayment.paidAmount,
        totalPaid: updatedPayment.totalPaid,
        installationFee: updatedPayment.installationFee,
        referenceNumber: updatedPayment.referenceNumber,
        paymentDate: updatedPayment.paymentDate,
        isAdvancePayment: updatedPayment.isAdvancePayment,
        advanceMonths: updatedPayment.advanceMonths,
        paidUntil: updatedPayment.paidUntil
      });
    }

    setPayModalOpen(false);
    setSelectedPayment(null);
  };

  const overduePayments = payments.filter(p => {
    if (isCoveredByAdvancePayment(p)) return false;
    
    if (p.remarks === 'Paid') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return today > dueDate;
  });

  const dueLessThan7Days = payments.filter(p => {
    if (isCoveredByAdvancePayment(p)) return false;
    
    if (p.remarks === 'Paid') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    due.setHours(0, 0, 0, 0);

    const diff = Math.ceil((due - today) / 86400000);
    return diff <= 7 && diff >= 0;
  });

  const upcomingUnpaidBills = payments.filter(p => {
    if (isCoveredByAdvancePayment(p)) return false;
    
    if (p.remarks === 'Paid') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    due.setHours(0, 0, 0, 0);

    const diff = Math.ceil((due - today) / 86400000);
    return diff > 7;
  });

  const renderPaymentTable = (paymentList, showDaysColumn = false, columnLabel = "Days Left") => (
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
            {showDaysColumn && <th style={styles.th}>{columnLabel}</th>}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paymentList.map(payment => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const due = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
            due.setHours(0, 0, 0, 0);
            
            const days = Math.ceil((due - today) / 86400000);
            const daysOverdue = getDaysOverdue(payment);

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
                {showDaysColumn && (
                  <td style={styles.td}>
                    {daysOverdue > 0 ? `${daysOverdue} days` : `${days} days`}
                  </td>
                )}

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
      {overduePayments.length > 0 && (
        <>
          <h2 style={{ ...styles.dashboardTitle, color: '#ef4444' }}>Overdue Payments</h2>
          {renderPaymentTable(overduePayments, true, "Days Overdue")}
        </>
      )}

      <h2 style={{ ...styles.dashboardTitle, marginTop: overduePayments.length > 0 ? '40px' : '0' }}>
        Due Less Than 7 Days
      </h2>

      {dueLessThan7Days.length === 0 ? (
        <p style={styles.noData}>No payments due within the next 7 days</p>
      ) : (
        renderPaymentTable(dueLessThan7Days, true, "Days Left")
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