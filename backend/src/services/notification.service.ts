import { Log } from '../../../shared/logger';
import { getNotificationsFromDB } from '../repositories/notification.repository';

const PRIORITY_MAP: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export const fetchNotificationsService = async (limit?: number) => {
  await Log("backend", "info", "service", "Fetching notifications from repository layer");
  
  try {
    const data: any[] = await getNotificationsFromDB() as any[];
    await Log("backend", "debug", "service", `Successfully fetched ${data.length} notifications from DB`);
    
    await Log("backend", "debug", "service", "Applying priority sorting (Type Priority + Recency)");
    
    const sortedData = data.sort((a, b) => {
      const priorityDiff = (PRIORITY_MAP[b.type] || 0) - (PRIORITY_MAP[a.type] || 0);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });

    const finalData = limit ? sortedData.slice(0, limit) : sortedData;
    
    if (limit) {
      await Log("backend", "debug", "service", `Applied Top N limit, returning ${finalData.length} notifications`);
    }

    return finalData;
  } catch (error: any) {
    await Log("backend", "error", "service", `Error fetching notifications: ${error.message}`);
    throw error;
  }
};
