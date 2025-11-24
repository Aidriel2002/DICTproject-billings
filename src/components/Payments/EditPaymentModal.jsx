import React from 'react';
import { PaymentForm } from './PaymentForm';
import { styles } from '../../styles/paymentStyles';

export const EditPaymentModal = ({ open, payment, onClose, onUpdate }) => {
  if (!open) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <PaymentForm
          editData={payment}
          onAdd={onUpdate}  
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
