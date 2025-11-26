import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import * as activityLogService from '../services/activityLogService';

export const useActivityLogs = (accountId) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLogs = async () => {
    if (!user || !accountId) return;
    setLoading(true);
    setError(null);

    try {
      const data = await activityLogService.fetchActivityLogs(accountId);
      setLogs(data);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      loadLogs();
    }
  }, [accountId]);

  return { logs, loading, error, refreshLogs: loadLogs };
};


