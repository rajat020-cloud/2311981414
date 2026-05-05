import { Log } from '../../../logging_middleware/logger';
import { fetchNotificationsFromExternalApi } from '../repositories/notification.repository';

export const getProcessedNotifications = async (limit?: number, page?: number, type?: string) => {
  await Log("backend", "info", "service", "Processing notifications and applying priority logic");
  
  const rawData = await fetchNotificationsFromExternalApi();
  
  let all_notifications = [...rawData.all_notifications];
  let priority_notifications = [...rawData.priority_notifications];

  if (type && type !== 'All') {
    all_notifications = all_notifications.filter((n: any) => n.Type.toLowerCase() === type.toLowerCase());
    priority_notifications = priority_notifications.filter((n: any) => n.Type.toLowerCase() === type.toLowerCase());
  }

  if (limit) {
    const pageNum = page || 1;
    const startIndex = (pageNum - 1) * limit;
    all_notifications = all_notifications.slice(startIndex, startIndex + limit);
  }

  await Log("backend", "debug", "service", `Returning processed and sorted priority notifications`);
  
  return {
    all_notifications,
    priority_notifications
  };
};
