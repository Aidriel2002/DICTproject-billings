import React from 'react';
import { getStatusColor } from '../../utils/statusHelper';
import { styles } from '../../styles/paymentStyles';

export const PaymentTable = ({ 
  phase, 
  payments, 
  onEdit, 
  onDelete, 
  onOpenPayBill 
}) => {

  const phasePayments = payments.filter(p => p.phase === phase);
  const total = phasePayments.reduce((sum, p) => sum + p.monthlyPayment, 0);

  if (phasePayments.length === 0) return null;

  return (
    <div style={styles.phaseSection}>
      <h3 style={styles.phaseTitle}>{phase}</h3>

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
              <th style={styles.th}>Remarks</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {phasePayments.map(payment => (
              <tr key={payment.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <span 
                    style={{
                      ...styles.statusBadge, 
                      backgroundColor: getStatusColor(payment)
                    }}
                  ></span>
                </td>

                <td style={styles.td}>{payment.siteName}</td>
                <td style={styles.td}>{payment.accountName}</td>
                <td style={styles.td}>{payment.accountNumber}</td>
                <td style={styles.td}>Day {payment.dueDate}</td>
                <td style={styles.td}>₱{payment.monthlyPayment.toLocaleString()}</td>
                <td style={styles.td}>{payment.remarks}</td>

                <td style={styles.td}>
                  <button onClick={() => onEdit(payment)} style={styles.editButton}>Edit</button>
                  <button onClick={() => onDelete(payment.id)} style={styles.deleteButton}>Delete</button>

                  <button
                    onClick={() => onOpenPayBill(payment)}
                    style={styles.payBillButton}
                  >
                    Pay Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr style={styles.totalRow}>
              <td colSpan="8" style={styles.totalLabel}>Phase Total:</td>
              <td style={styles.totalAmount}>₱{total.toLocaleString()}</td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};
