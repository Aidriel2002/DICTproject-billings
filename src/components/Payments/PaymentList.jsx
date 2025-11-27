import React, { useMemo, useState } from 'react';
import { PaymentTable } from './PaymentTable';
import { EditPaymentModal } from './EditPaymentModal';
import { styles } from '../../styles/paymentStyles';
import { getDaysUntilDue } from '../../utils/statusHelper';

const getStatusLabel = (payment) => {
  if (payment.remarks === 'Paid') return 'paid';
  const days = getDaysUntilDue(payment.dueDate);
  if (days < 0) return 'overdue';
  if (days <= 7) return 'due_soon';
  return 'on_track';
};

export const PaymentList = ({ payments, onEdit, onDelete, onUpdate }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const projectOptions = useMemo(
    () => [...new Set(payments.map(p => p.siteName).filter(Boolean))],
    [payments]
  );

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = searchTerm
        ? [payment.siteName, payment.accountName, payment.accountNumber]
            .filter(Boolean)
            .some(value =>
              value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        : true;

      const matchesProject = projectFilter ? payment.siteName === projectFilter : true;
      const matchesRemarks = remarksFilter ? payment.remarks === remarksFilter : true;
      const matchesStatus = statusFilter ? getStatusLabel(payment) === statusFilter : true;

      return matchesSearch && matchesProject && matchesRemarks && matchesStatus;
    });
  }, [payments, searchTerm, projectFilter, remarksFilter, statusFilter]);

  const phases = [...new Set(filteredPayments.map(p => p.phase || "Unassigned"))];

  const overallTotal = filteredPayments.reduce(
    (sum, p) => sum + (p.monthlyPayment || 0),
    0
  );

  const handleOpenEdit = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async (updatedPayment) => {
    await onUpdate(updatedPayment);

    setEditModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <>
      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Search site / account / number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Projects</option>
          {projectOptions.map(project => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        <select
          value={remarksFilter}
          onChange={(e) => setRemarksFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Remarks</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="due_soon">Due Soon</option>
          <option value="on_track">On Track</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filteredPayments.length === 0 && (
        <div style={styles.emptyState}>
          No payments match your filters.
        </div>
      )}

      {phases.map((phase) => (
        <PaymentTable
          key={phase}
          phase={phase}
          payments={filteredPayments.filter(p => (p.phase || "Unassigned") === phase)}
          onEdit={handleOpenEdit}
          onDelete={onDelete}
        />
      ))}

      {filteredPayments.length > 0 && (
        <div style={styles.overallTotal}>
          <strong>Overall Total: ₱{overallTotal.toLocaleString()}</strong>
        </div>
      )}

      <EditPaymentModal
        open={isEditModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdate={handleConfirmEdit}
      />
    </>
  );
};

export default PaymentList;
