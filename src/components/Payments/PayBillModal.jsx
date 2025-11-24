import React, { useState, useEffect } from "react";
import { styles } from "../../styles/paymentStyles";

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
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  }
};

export const PayBillModal = ({ open, payment, onClose, onUpdate }) => {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [installationFee, setInstallationFee] = useState("");

  useEffect(() => {
    if (open) {
      // initialize inputs from payment if available
      setAmount(payment?.paidAmount ?? payment?.amountPaid ?? "");
      setReference(payment?.referenceNumber ?? "");
      setInstallationFee(payment?.installationFee ?? "");
      console.log("PayBillModal opened - payment prop:", payment);
    }
  }, [open, payment]);

  if (!open) return null;

  const handleSubmit = () => {
    // Validate required Reference Number
    if (!reference.trim()) {
      alert("Reference Number is required!");
      return;
    }

    const payload = {
      ...payment,
      remarks: "Paid",
      paidAmount: Number(amount),
      referenceNumber: reference,
      installationFee: installationFee ? Number(installationFee) : 0,
      payment_date: new Date().toISOString()
    };

    console.log("PayBillModal submit payload:", payload);
    onUpdate(payload);
  };

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.modal}>
        <h3>Pay Bill</h3>

        <label>Amount</label>
        <input
          type="number"
          style={modalStyles.input}
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Reference Number <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          style={modalStyles.input}
          placeholder="Reference #"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <label>Installation Fee (Optional)</label>
        <input
          type="number"
          style={modalStyles.input}
          placeholder="Enter installation fee"
          value={installationFee}
          onChange={(e) => setInstallationFee(e.target.value)}
        />

        <div style={modalStyles.buttonRow}>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={styles.payBillButton}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};
