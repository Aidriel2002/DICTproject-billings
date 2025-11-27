import React, {useState} from "react";
import { styles,printStyles } from "../../styles/paymentStyles";


const PaymentHistoryList = ({ history = [], logoUrl = "/logo.png" }) => {
 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

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
      hour12: true,
    });
  };

  const filteredHistory = history.filter((h) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    const siteName = (h?.siteName || "").toLowerCase();
    const accountName = (h?.accountName || "").toLowerCase();
    const accountNumber = (h?.accountNumber || "").toLowerCase();
    const referenceNumber = (h?.referenceNumber || "").toLowerCase();
    
    return (
      siteName.includes(search) ||
      accountName.includes(search) ||
      accountNumber.includes(search) ||
      referenceNumber.includes(search)
    );
  });

  const totalPaid = (filteredHistory || []).reduce((sum, h) => {
    const paid = Number(h?.amountPaid ?? h?.paidAmount ?? 0);
    const instFee = Number(h?.installationFee ?? h?.installation_fee ?? 0);
    return sum + paid + instFee;
  }, 0);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const searchBarStyle = {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  const searchInputStyle = {
    flex: 1,
    padding: "10px 15px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s"
  };

  return (
    <>
      <style>{printStyles}</style>
      <div style={styles.phaseSection} id="printable-area">
        <div style={styles.logoContainer} className="print-only">
          {logoUrl && <img src={logoUrl} alt="Company Logo" style={styles.logo} />}
        </div>
        <div style={styles.headerSection}>
          
          <h3 style={styles.phaseTitle}>Payment History</h3>
          <button 
            onClick={handlePrint} 
            style={styles.printButton}
            className="no-print"
            onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
          >
            🖨️ Print Page
          </button>
        </div>

        <div style={searchBarStyle} className="no-print">
          <input
            type="text"
            placeholder="Search by site name, account name, account number, or reference..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={searchInputStyle}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
            >
              Clear
            </button>
          )}
        </div>

        {(!history || history.length === 0) ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
            No payment history records yet
          </p>
        ) : filteredHistory.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
            No results found for "{searchTerm}"
          </p>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Date & Time</th>
                    <th style={styles.th}>Site Name</th>
                    <th style={styles.th}>Account Name</th>
                    <th style={styles.th}>Account Number</th>
                    <th style={styles.th}>Monthly</th>
                    <th style={styles.th}>Installation Fee</th>
                    <th style={styles.th}>Reference</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((h, idx) => {
                    const paidAmount = Number(h?.amountPaid ?? h?.paidAmount ?? 0);
                    const installationFee = Number(h?.installationFee ?? h?.installation_fee ?? 0);
                    const paymentDate = h?.paymentDate ?? h?.payment_date;
                    const combinedTotal = paidAmount + installationFee;

                    return (
                      <tr key={h?.id ?? idx} style={styles.tableRow}>
                        <td style={styles.td}>{formatDateTime(paymentDate)}</td>
                        <td style={styles.td}>{h?.siteName ?? "-"}</td>
                        <td style={styles.td}>{h?.accountName ?? "-"}</td>
                        <td style={styles.td}>{h?.accountNumber ?? "-"}</td>

                        <td style={styles.td}>
                          ₱{paidAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>

                        <td style={styles.td}>
                          ₱{installationFee.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>

                        <td style={styles.td}>{h?.referenceNumber ?? "-"}</td>

                        <td style={styles.td}>
                          ₱{combinedTotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr style={styles.totalRow}>
                    <td colSpan="7" style={styles.totalLabel}>
                      Grand Total ({filteredHistory.length} records):
                    </td>
                    <td style={styles.totalAmount}>
                      ₱{totalPaid.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination} className="no-print">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === 1 ? styles.pageButtonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                  }}
                >
                  ← Previous
                </button>

                <span style={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === totalPages ? styles.pageButtonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PaymentHistoryList;