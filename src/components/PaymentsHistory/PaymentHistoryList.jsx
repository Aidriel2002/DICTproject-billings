import React from "react";
import { styles } from "../../styles/paymentStyles";

const PaymentHistoryList = ({ history = [] }) => {

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Total Paid = paidAmount + installation_fee
  const totalPaid = (history || []).reduce((sum, h) => {
    const paid = Number(h?.paidAmount ?? h?.amountPaid ?? 0);
    const fee = Number(h?.installation_fee ?? 0);
    return sum + (isNaN(paid) ? 0 : paid) + (isNaN(fee) ? 0 : fee);
  }, 0);

  return (
    <div style={styles.phaseSection}>
      <h3 style={styles.phaseTitle}>Payment History</h3>

      {(!history || history.length === 0) ? (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
          No payment history records yet
        </p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Site Name</th>
                <th style={styles.th}>Payment ID</th>
                <th style={styles.th}>Amount Paid</th>
                <th style={styles.th}>Installation Fee</th>
                <th style={styles.th}>Reference</th>
                <th style={styles.th}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {(history || []).map((h, idx) => (
                <tr key={h?.paymentId ?? h?.id ?? idx} style={styles.tableRow}>
                  <td style={styles.td}>{formatDateTime(h?.payment_date)}</td>
                  <td style={styles.td}>{h?.siteName ?? "-"}</td>
                  <td style={styles.td}>{h?.paymentId ?? h?.id ?? "-"}</td>
                  <td style={styles.td}>₱{(Number(h?.paidAmount ?? 0)).toLocaleString()}</td>
                  <td style={styles.td}>₱{(Number(h?.installation_fee ?? 0)).toLocaleString()}</td>
                  <td style={styles.td}>{h?.referenceNumber ?? "-"}</td>
                  <td style={styles.td}>{h?.remarks ?? "-"}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr style={styles.totalRow}>
                <td colSpan="3" style={styles.totalLabel}>Total Paid:</td>
                <td colSpan="4" style={styles.totalAmount}>
                  ₱{totalPaid.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryList;
