import { useState } from 'react';
import { fetchNotifications } from '../api/notificationApi';
import { Log } from '../../../logging_middleware/logger';
import type { NotificationType } from './types';

export const useNotifications = () => {
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>([]);
  const [priorityNotifications, setPriorityNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async (page: number, limit: number, typeFilter: string) => {
    setLoading(true);
    await Log("frontend", "info", "hook", "Loading notifications state");
    try {
      const data = await fetchNotifications(page, limit, typeFilter);
      setAllNotifications(data?.all_notifications || []);
      setPriorityNotifications(data?.priority_notifications || []);
      setError(null);
    } catch (err: any) {
      await Log("frontend", "error", "hook", "Error in useNotifications hook");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { allNotifications, priorityNotifications, loading, error, loadNotifications };
};
