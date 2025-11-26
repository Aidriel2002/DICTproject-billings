import { useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import * as accessService from '../services/accessService';

export const useAccessControl = () => {
  const { user } = useAuth();
  const [grantedAccesses, setGrantedAccesses] = useState([]);
  const [sharedAccesses, setSharedAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAccess = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [granted, shared] = await Promise.all([
        accessService.fetchGrantedAccess(user.id),
        accessService.fetchAccessibleAccounts(user.email)
      ]);

      setGrantedAccesses(granted);
      setSharedAccesses(shared);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load access data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAccess();
    }
  }, [user?.id, user?.email]);

  const accessibleAccounts = useMemo(() => {
    if (!user) return [];

    const baseAccount = [{
      id: user.id,
      email: user.email,
      label: `${user.email} (You)`,
      type: 'owner'
    }];

    const sharedAccounts = sharedAccesses.map(access => ({
      id: access.owner_id,
      email: access.owner_email,
      label: `${access.owner_email}`,
      type: 'shared',
      accessId: access.id
    }));

    return [...baseAccount, ...sharedAccounts];
  }, [sharedAccesses, user]);

  const grantAccess = async (email) => {
    if (!user) return;

    await accessService.addAccess({
      ownerId: user.id,
      ownerEmail: user.email,
      sharedEmail: email
    });

    await loadAccess();
  };

  const revokeAccess = async (accessId) => {
    await accessService.removeAccess(accessId);
    await loadAccess();
  };

  return {
    grantedAccesses,
    sharedAccesses,
    accessibleAccounts,
    loadingAccess: loading,
    accessError: error,
    grantAccess,
    revokeAccess,
    refreshAccess: loadAccess
  };
};


