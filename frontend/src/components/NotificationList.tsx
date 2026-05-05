import React, { useEffect, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationType } from '../hooks/useNotifications';
import { Log } from '../../../shared/logger';
import './NotificationList.css';

export const NotificationList: React.FC = () => {
  const { notifications, loading, error, loadNotifications } = useNotifications();
  const [page, setPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<string>('All');

  useEffect(() => {
    Log("frontend", "info", "component", `NotificationList mounted or dependencies changed (page: ${page}, filter: ${typeFilter})`);
    loadNotifications(page, typeFilter);
  }, [page, typeFilter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    Log("frontend", "debug", "component", `User changed filter to ${newFilter}`);
    setTypeFilter(newFilter);
    setPage(1);
  };

  const handleNextPage = () => {
    Log("frontend", "debug", "component", `User navigating to next page`);
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      Log("frontend", "debug", "component", `User navigating to previous page`);
      setPage((prev) => prev - 1);
    }
  };

  const filteredData = notifications.filter((n: NotificationType) => 
    typeFilter === 'All' || n.type === typeFilter
  );

  return (
    <div className="notification-container">
      <h2>Campus Notifications</h2>
      
      <div className="controls">
        <label>Filter by Type: </label>
        <select value={typeFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Placement">Placement</option>
          <option value="Result">Result</option>
          <option value="Event">Event</option>
        </select>
      </div>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="error">Error: {error}</p>}
      
      {!loading && !error && (
        <>
          <ul className="notification-list">
            {filteredData.map((notif: NotificationType) => (
              <li key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                <div className="header">
                  <span className={`badge ${notif.type.toLowerCase()}`}>{notif.type}</span>
                  {!notif.isRead && <span className="unread-dot" title="Unread"></span>}
                </div>
                <h3>{notif.title}</h3>
                <p>{notif.message}</p>
                <small>{new Date(notif.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
            <span>Page {page}</span>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};
