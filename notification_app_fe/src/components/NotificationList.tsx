import React, { useEffect, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationType } from '../hooks/types';
import { Log } from '../../../logging_middleware/logger';
import './NotificationList.css';

export const NotificationList: React.FC = () => {
  const { allNotifications, priorityNotifications, loading, error, loadNotifications } = useNotifications();
  const [page, setPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'priority'>('priority');
  const limit = 10;

  useEffect(() => {
    Log("frontend", "info", "component", "NotificationList mounted or updated");
    loadNotifications(page, limit, typeFilter);
  }, [page, typeFilter]);

  const activeData = activeTab === 'all' ? allNotifications : priorityNotifications;

  return (
    <div className="notification-container">
      <h2>Campus Notifications</h2>
      
      <div className="tabs">
        <button className={activeTab === 'priority' ? 'active' : ''} onClick={() => setActiveTab('priority')}>
          Priority Notifications
        </button>
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
          All Notifications
        </button>
      </div>

      <div className="controls">
        <label>Filter: </label>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="All">All</option>
          <option value="Placement">Placement</option>
          <option value="Result">Result</option>
          <option value="Event">Event</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && (
        <>
          <ul className="notification-list">
            {activeData.map((notif: NotificationType) => (
              <li key={notif.ID} className={`notification-item ${notif.isRead === false ? 'unread' : ''}`}>
                <div className="header">
                  <span className={`badge ${notif.Type.toLowerCase()}`}>{notif.Type}</span>
                </div>
                <p>{notif.Message}</p>
                <small>{new Date(notif.Timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
          
          {activeTab === 'all' && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <span>Page {page}</span>
              <button onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
