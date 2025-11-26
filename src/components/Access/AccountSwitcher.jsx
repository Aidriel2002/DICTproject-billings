import React from 'react';
import { accessStyles } from '../../styles/accessStyles';

export const AccountSwitcher = ({ accounts, activeAccountId, onChange }) => {
  if (!accounts || accounts.length <= 1) {
    return null;
  }

  return (
    <div style={accessStyles.switcher}>
      <div style={accessStyles.switcherLabel}>
        Viewing account:
      </div>
      <select
        value={activeAccountId || accounts[0]?.id}
        onChange={(event) => onChange(event.target.value)}
        style={accessStyles.switcherSelect}
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSwitcher;


