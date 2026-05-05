import { Request, Response } from 'express';
import { Log } from '../../../shared/logger';
import { fetchNotificationsService } from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response) => {
  await Log("backend", "info", "controller", `Received GET request for notifications. Query parameters: ${JSON.stringify(req.query)}`);
  
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const notifications = await fetchNotificationsService(limit);
    
    await Log("backend", "info", "controller", `Successfully processed GET request, returning ${notifications.length} items`);
    
    res.status(200).json({ 
      success: true, 
      data: notifications 
    });
  } catch (error: any) {
    await Log("backend", "error", "controller", `Failed to process notifications request: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error' 
    });
  }
};
