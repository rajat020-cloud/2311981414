import { Request, Response } from 'express';
import { Log } from '../../../logging_middleware/logger';
import { getProcessedNotifications } from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response) => {
  await Log("backend", "info", "controller", "Handling GET /api/notifications request");
  
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const type = req.query.notification_type as string | undefined;

    const data = await getProcessedNotifications(limit, page, type);
    
    res.json({ success: true, data });
  } catch (error: any) {
    await Log("backend", "error", "controller", `Failed to get notifications: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
