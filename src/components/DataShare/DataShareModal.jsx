import React, { useState } from 'react';
import { styles } from '../../styles/styles';

const modalStyles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '450px',
    maxWidth: '90vw',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    color: '#1f2937'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  shareButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  shareButtonDisabled: {
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'not-allowed',
    fontSize: '14px'
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    marginBottom: '10px'
  },
  success: {
    color: '#10b981',
    fontSize: '14px',
    marginBottom: '10px'
  },
  info: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '5px'
  }
};

export const DataShareModal = ({ open, onClose, payments, paymentHistory, onShare }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleShare = async () => {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await onShare(email, payments, paymentHistory);
      setSuccess('Data shared successfully!');
      setTimeout(() => {
        setEmail('');
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to share data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  return (
    <div style={modalStyles.backdrop} onClick={handleClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={modalStyles.title}>Share Data</h3>
        
        <div style={modalStyles.info}>
          This will share all your payments data ({payments?.length || 0} payments) and payment history ({paymentHistory?.length || 0} records) to the specified email address.
        </div>

        {error && <div style={modalStyles.error}>{error}</div>}
        {success && <div style={modalStyles.success}>{success}</div>}

        <label style={modalStyles.label}>
          Email Address <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="email"
          style={modalStyles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="recipient@example.com"
          disabled={loading}
        />

        <div style={modalStyles.buttonRow}>
          <button 
            onClick={handleClose} 
            style={modalStyles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleShare} 
            style={loading ? modalStyles.shareButtonDisabled : modalStyles.shareButton}
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataShareModal;

