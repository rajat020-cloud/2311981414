import express from 'express';
import cors from 'cors';
import { Log } from '../../logging_middleware/logger';
import { getNotifications } from './controllers/notification.controller';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await Log("backend", "info", "middleware", `Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/api/notifications', getNotifications);

app.use(async (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  await Log("backend", "fatal", "middleware", `Unhandled error: ${err.message}`);
  res.status(500).json({ success: false, message: 'Server error' });
});

app.listen(PORT, async () => {
  await Log("backend", "info", "controller", `Server running on port ${PORT}`);
});
