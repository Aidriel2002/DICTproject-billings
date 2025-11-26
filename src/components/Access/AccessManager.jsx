import React, { useState } from 'react';
import { accessStyles } from '../../styles/accessStyles';

export const AccessManager = ({
  grantedAccesses,
  onAddAccess,
  onRemoveAccess,
  loading,
  isOwner,
  currentEmail
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Please enter an email address.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onAddAccess(email.trim());
      setSuccess('Access granted successfully.');
      setEmail('');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to add access.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={accessStyles.managerContainer}>
      <div style={accessStyles.managerHeader}>
        <h2 style={accessStyles.managerTitle}>Account Access</h2>
        <p style={accessStyles.managerSubtitle}>
          Grant other users permission to view and manage your payments in real time.
        </p>
      </div>

      {!isOwner && (
        <div style={accessStyles.infoBanner}>
          Only the account owner can grant or remove access. You are currently signed in as {currentEmail}.
        </div>
      )}

      {isOwner && (
        <form onSubmit={handleSubmit} style={accessStyles.form}>
          <label style={accessStyles.label}>
            Add collaborator email
          </label>
          <div style={accessStyles.inputRow}>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={accessStyles.input}
              disabled={submitting}
              required
            />
            <button
              type="submit"
              style={accessStyles.addButton}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Access'}
            </button>
          </div>
          {error && <div style={accessStyles.errorText}>{error}</div>}
          {success && <div style={accessStyles.successText}>{success}</div>}
        </form>
      )}

      <div style={accessStyles.listHeader}>
        <h3 style={accessStyles.listTitle}>People with access</h3>
        <span style={accessStyles.listCount}>{grantedAccesses.length} total</span>
      </div>

      {loading ? (
        <div style={accessStyles.emptyState}>Loading access list...</div>
      ) : grantedAccesses.length === 0 ? (
        <div style={accessStyles.emptyState}>
          No collaborators yet. Add an email above to grant access.
        </div>
      ) : (
        <ul style={accessStyles.list}>
          {grantedAccesses.map((access) => (
            <li key={access.id} style={accessStyles.listItem}>
              <div>
                <div style={accessStyles.listEmail}>{access.shared_email}</div>
                <div style={accessStyles.listMeta}>
                  Added on {new Date(access.created_at).toLocaleString()}
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => onRemoveAccess(access.id)}
                  style={accessStyles.removeButton}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccessManager;


