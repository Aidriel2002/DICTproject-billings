import React, { useState, useEffect } from "react";

const modalStyles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  select: {
    width: "95%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  checkbox: {
    marginRight: "8px",
    cursor: "pointer"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    cursor: "pointer"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  totalRow: {
    padding: "10px",
    background: "#f5f5f5",
    borderRadius: "5px",
    marginBottom: "12px",
    fontWeight: "bold"
  },
  cancelButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer"
  },
  payButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer"
  }
};

export const PayBillModal = ({ open, payment, onClose, onUpdate }) => {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [installationFee, setInstallationFee] = useState("");
  const [isAdvancePayment, setIsAdvancePayment] = useState(false);
  const [advanceMonths, setAdvanceMonths] = useState(1);

  useEffect(() => {
    if (open) {
      setAmount(payment?.paidAmount ?? payment?.amountPaid ?? payment?.monthlyPayment ?? "");
      setReference(payment?.referenceNumber ?? "");
      setInstallationFee(payment?.installationFee ?? "");
      setIsAdvancePayment(false);
      setAdvanceMonths(1);
    }
  }, [open, payment]);

  if (!open) return null;

  const calculateTotal = () => {
    const monthlyAmount = Number(amount || 0);
    const fee = Number(installationFee || 0);
    const months = isAdvancePayment ? Number(advanceMonths) : 1;
    return (monthlyAmount * months) + fee;
  };

  const handleSubmit = () => {
    if (!reference.trim()) {
      alert("Reference Number is required!");
      return;
    }

    const fee = Number(installationFee || 0);
    const months = isAdvancePayment ? Number(advanceMonths) : 1;
    const totalPaid = (Number(amount) * months) + fee;
    
    const now = new Date();
    const phFormatter = new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila"
    });
    
    const phDisplayString = phFormatter.format(now);

    // Calculate the "paid until" date
    const dueDate = new Date(payment.dueDate);
    const paidUntilDate = new Date(dueDate);
    paidUntilDate.setMonth(paidUntilDate.getMonth() + months);
    
    const paidUntilFormatted = new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Manila"
    }).format(paidUntilDate);

    const remarksText = isAdvancePayment 
      ? `Paid until ${paidUntilFormatted} (${months} month${months > 1 ? 's' : ''})`
      : "Paid";

    const payload = {
      ...payment,
      remarks: remarksText,
      paidAmount: Number(amount),
      totalPaid: totalPaid,
      referenceNumber: reference,
      installationFee: fee,
      paymentDate: phDisplayString,
      payment_date: phDisplayString,
      isAdvancePayment: isAdvancePayment,
      advanceMonths: isAdvancePayment ? months : 1,
      paidUntil: isAdvancePayment ? paidUntilDate.toISOString() : null
    };

    onUpdate(payload);
  };

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.modal}>
        <h3>Pay Bill</h3>

        <label>Monthly Payment</label>
        <input
          type="number"
          style={modalStyles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label style={modalStyles.checkboxLabel}>
          <input
            type="checkbox"
            style={modalStyles.checkbox}
            checked={isAdvancePayment}
            onChange={(e) => setIsAdvancePayment(e.target.checked)}
          />
          Advance Payment
        </label>

        {isAdvancePayment && (
          <>
            <label>Number of Months</label>
            <select
              style={modalStyles.select}
              value={advanceMonths}
              onChange={(e) => setAdvanceMonths(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'month' : 'months'}
                </option>
              ))}
            </select>
          </>
        )}

        <label>
          Reference Number <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          style={modalStyles.input}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <label>Installation Fee (Optional)</label>
        <input
          type="number"
          style={modalStyles.input}
          value={installationFee}
          onChange={(e) =>
            setInstallationFee(e.target.value === "" ? "" : e.target.value)
          }
        />

        <div style={modalStyles.totalRow}>
          Total Amount: ₱{calculateTotal().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {isAdvancePayment && (
            <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '5px' }}>
              ({advanceMonths} month{advanceMonths > 1 ? 's' : ''} × ₱{Number(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })} 
              {installationFee ? ` + ₱${Number(installationFee).toLocaleString('en-PH', { minimumFractionDigits: 2 })} fee` : ''})
            </div>
          )}
        </div>

        <div style={modalStyles.buttonRow}>
          <button onClick={onClose} style={modalStyles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={modalStyles.payButton}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};