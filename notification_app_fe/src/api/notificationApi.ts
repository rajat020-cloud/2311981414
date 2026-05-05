import { Log } from '../../../logging_middleware/logger';

export const fetchNotifications = async (page: number, limit: number, typeFilter: string) => {
  await Log("frontend", "info", "api", `Calling backend API for notifications. Page: ${page}`);
  try {
    let url = `http://localhost:4000/api/notifications?page=${page}&limit=${limit}`;
    if (typeFilter && typeFilter !== 'All') {
      url += `&notification_type=${typeFilter}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    await Log("frontend", "error", "api", `Fetch failed: ${error.message}`);
    throw error;
  }
};
