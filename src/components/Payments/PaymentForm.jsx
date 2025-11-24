import React, { useState } from 'react';
import { styles } from '../../styles/paymentStyles';

export const PaymentForm = ({ onAdd, onCancel, editData }) => {
  const [formData, setFormData] = useState(editData || {
    siteName: '',
    accountName: '',
    accountNumber: '',
    dueDate: '',
    monthlyPayment: '',
    remarks: 'Unpaid',
    phase: ''
  });

  const handleSubmit = () => {
    onAdd({
      ...formData,
      monthlyPayment: parseFloat(formData.monthlyPayment) || 0,
      dueDate: parseInt(formData.dueDate) || 1
    });
  };

  return (
    <div style={styles.formContainer}>
      <h3 style={styles.formTitle}>{editData ? 'Edit Payment' : 'Add New Payment'}</h3>
      <div style={styles.formDiv}>
        
        <input
          type="text"
          placeholder="Site Name"
          value={formData.siteName}
          onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Account Name"
          value={formData.accountName}
          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          style={styles.input}
          required
        />

        <input
          type="number"
          placeholder="Due Date (Day of Month)"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          style={styles.input}
          min="1"
          max="31"
          required
        />

        <input
          type="number"
          placeholder="Monthly Payment"
          value={formData.monthlyPayment}
          onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
          style={styles.input}
          step="0.01"
          required
        />

        <select
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          style={styles.input}
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <input
          type="text"
          placeholder="Project"
          value={formData.phase}
          onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
          style={styles.input}
          required
        />

        <div style={styles.formButtons}>
          <button onClick={handleSubmit} style={styles.button}>
            {editData ? 'Update' : 'Add'}
          </button>
          <button onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
