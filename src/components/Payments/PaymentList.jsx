import React, { useState } from 'react';
import { PaymentTable } from './PaymentTable';
import { PayBillModal } from './PayBillModal';
import { EditPaymentModal } from './EditPaymentModal';
import { styles } from '../../styles/paymentStyles';

export const PaymentList = ({ payments, onEdit, onDelete, onUpdate, onAddHistory }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const phases = [...new Set(payments.map(p => p.phase || "Unassigned"))];

  const overallTotal = payments.reduce(
    (sum, p) => sum + (p.monthlyPayment || 0),
    0
  );

  const handleOpenPayBill = (payment) => {
    setSelectedPayment(payment);
    setPayModalOpen(true);
  };

  const handleOpenEdit = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleConfirmPayment = async (updatedPayment) => {
    try {
      await onUpdate(updatedPayment);

      const timestamp = new Date()
        .toLocaleString('en-CA', { hour12: false })
        .replace(',', '');

      if (typeof onAddHistory === 'function') {
        await onAddHistory({
          paymentId: updatedPayment.id,
          siteName: updatedPayment.siteName,
          accountName: updatedPayment.accountName,
          accountNumber: updatedPayment.accountNumber,
          amountPaid: updatedPayment.paidAmount,
          paymentMethod: updatedPayment.paymentMethod,
          referenceNumber: updatedPayment.referenceNumber,
          notes: updatedPayment.notes || '',
          paymentDate: timestamp,
        });
      }
    } catch (err) {
      console.error("Payment update error:", err);
    }

    setPayModalOpen(false);
    setEditModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <>
      {phases.map((phase) => (
        <PaymentTable
          key={phase}
          phase={phase}
          payments={payments.filter(p => p.phase === phase)}
          onEdit={handleOpenEdit}  // open edit modal
          onDelete={onDelete}
          onOpenPayBill={handleOpenPayBill}
        />
      ))}

      {payments.length > 0 && (
        <div style={styles.overallTotal}>
          <strong>Overall Total: ₱{overallTotal.toLocaleString()}</strong>
        </div>
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

      <EditPaymentModal
        open={isEditModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdate={handleConfirmPayment}
      />
    </>
  );
};

export default PaymentList;
