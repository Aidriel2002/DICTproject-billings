import React from 'react';
import { getStatusColor } from '../../utils/statusHelper';
import { styles } from '../../styles/dashboardStyles';

export const Dashboard = ({ payments }) => {
  const upcomingPayments = payments.filter(p => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDate = new Date(currentYear, currentMonth, p.dueDate);
    
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0 && p.remarks === 'Unpaid';
  });

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.dashboardTitle}>Dashboard - Upcoming Payments</h2>
      {upcomingPayments.length === 0 ? (
        <p style={styles.noData}>No upcoming payments within the next 7 days</p>
      ) : (
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
                <th style={styles.th}>Days Until Due</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map(payment => {
                const today = new Date();
                const dueDate = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
                if (dueDate < today) dueDate.setMonth(dueDate.getMonth() + 1);
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                
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
                    <td style={styles.td}>{daysUntilDue} days</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;  // Add default export