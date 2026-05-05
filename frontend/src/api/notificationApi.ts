import { Log } from '../../../shared/logger';

export const fetchNotifications = async (page: number, typeFilter: string) => {
  await Log("frontend", "info", "api", `Fetching notifications: page ${page}, type ${typeFilter}`);
  try {
    const response = await fetch(`http://localhost:4000/api/notifications`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    await Log("frontend", "debug", "api", `Successfully fetched notifications from backend`);
    
    return data.data; 
  } catch (error: any) {
    await Log("frontend", "error", "api", `Failed to fetch notifications: ${error.message}`);
    throw error;
  }
};
