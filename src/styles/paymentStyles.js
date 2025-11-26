
export const styles = {
  actionBar: {
    marginBottom: '20px'
  },
  addButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  addButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  formTitle: {
    marginTop: 0,
    fontSize: '18px'
  },
  formDiv: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px'
  },
  formButtons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1
  },
  phaseSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  phaseTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '8px',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '12px',
    color: '#4b5563',
  },
  statusBadge: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    borderRadius: '50%'
  },
  editButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px'
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  totalRow: {
    backgroundColor: '#f9fafb',
    fontWeight: '600'
  },
  totalLabel: {
    textAlign: 'right',
    padding: '12px',
    color: '#1f2937',
    fontSize: '16px',
  },
  totalAmount: {
    padding: '12px',
    color: '#3b82f6',
    fontSize: '16px',
    fontWeight: '700',
  },
  overallTotal: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '20px',
    borderRadius: '12px 12px 0 0',
    textAlign: 'right',
    fontSize: '20px',
    position: 'sticky',
    bottom: '0',
    zIndex: 900,
    boxShadow: '0 -10px 25px rgba(0,0,0,0.2)'
  },
  emptyState: {
    padding: '24px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    color: '#6b7280',
    width: '100%'
  },
  payBillButton: {
    backgroundColor: "#4CAF50",
    padding: "6px 10px",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    marginLeft: "6px",
    cursor: "pointer"
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '20px',
  },
  pageButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  pageButtonActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderColor: '#3b82f6',
  },
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pageInfo: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
  },
  printButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '16px',
    transition: 'background-color 0.2s',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  logo: {
    maxWidth: '300px',
    height: 'auto',
  },
    filtersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(15,23,42,0.08)'
  },
  searchInput: {
    flex: '1 1 240px',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px'
  },
  filterSelect: {
    flex: '1 1 180px',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: '#fff'
  },
};

export const printStyles = "@media print { @page { size: landscape; margin: 0.5cm; } body * { visibility: hidden; } #printable-area, #printable-area * { visibility: visible; } #printable-area { position: absolute; left: 0; top: 0; width: 100%; } .no-print { display: none !important; } .print-only { display: none; } @media print { .print-only { display: block !important; } } #printable-area h3 { font-size: 16px !important; margin-bottom: 10px !important; } #printable-area table { font-size: 10px !important; } #printable-area th { padding: 6px !important; font-size: 10px !important; } #printable-area td { padding: 6px !important; font-size: 10px !important; } #printable-area tfoot td { font-size: 11px !important; font-weight: bold !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; page-break-after: auto; } thead { display: table-header-group; } tfoot { display: table-footer-group; } } .print-only { display: none; } @media print { .print-only { display: block !important; } }";