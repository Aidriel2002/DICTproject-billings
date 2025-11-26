import React, { useMemo, useState } from 'react';
import { activityStyles } from '../../styles/activityStyles';

const actionLabels = {
  payment_created: 'Created payment',
  payment_updated: 'Updated payment',
  payment_deleted: 'Deleted payment',
  payment_paid: 'Paid bill',
  history_added: 'Logged payment history',
  history_updated: 'Updated payment history',
  history_deleted: 'Deleted payment history'
};

export const ActivityLogList = ({ logs, loading }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = useMemo(() => Math.max(1, Math.ceil((logs?.length || 0) / pageSize)), [logs]);
  const currentPage = Math.min(page, totalPages);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return (logs || []).slice(start, start + pageSize);
  }, [logs, currentPage]);

  if (loading) {
    return <div style={activityStyles.emptyState}>Loading activity logs...</div>;
  }

  if (!logs || logs.length === 0) {
    return <div style={activityStyles.emptyState}>No activity logged yet.</div>;
  }

  return (
    <div style={activityStyles.container}>
      <h2 style={activityStyles.title}>Activity Logs</h2>
      <table style={activityStyles.table}>
        <thead>
          <tr>
            <th style={activityStyles.th}>Action</th>
            <th style={activityStyles.th}>Details</th>
            <th style={activityStyles.th}>Actor</th>
            <th style={activityStyles.th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.map((log) => (
            <tr key={log.id} style={activityStyles.tr}>
              <td style={activityStyles.td}>
                <span style={activityStyles.actionBadge}>
                  {actionLabels[log.action] || log.action}
                </span>
              </td>
              <td style={activityStyles.td}>
                <div style={activityStyles.detailTitle}>{log.details?.siteName || log.entity_type}</div>
                {log.details?.note && <div style={activityStyles.detailNote}>{log.details.note}</div>}
              </td>
              <td style={activityStyles.td}>
                <div style={activityStyles.actorEmail}>{log.actor_email}</div>
              </td>
              <td style={activityStyles.td}>
                {new Date(log.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={activityStyles.pagination}>
        <button
          style={{
            ...activityStyles.pageButton,
            ...(currentPage === 1 ? activityStyles.pageButtonDisabled : {})
          }}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span style={activityStyles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          style={{
            ...activityStyles.pageButton,
            ...(currentPage === totalPages ? activityStyles.pageButtonDisabled : {})
          }}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityLogList;


