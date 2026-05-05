import { useState } from 'react';
import { fetchNotifications } from '../api/notificationApi';
import { Log } from '../../../shared/logger';

export interface NotificationType {
  id: string;
  type: 'Placement' | 'Result' | 'Event';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async (page: number, typeFilter: string) => {
    setLoading(true);
    await Log("frontend", "debug", "hook", "Starting notification load cycle in useNotifications hook");
    
    try {
      const data = await fetchNotifications(page, typeFilter);
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      await Log("frontend", "error", "hook", "Error state updated due to fetch failure");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, loading, error, loadNotifications };
};
