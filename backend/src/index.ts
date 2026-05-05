import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Log } from '../../shared/logger';
import { getNotifications } from './controllers/notification.controller';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(async (req: Request, res: Response, next: NextFunction) => {
  await Log("backend", "debug", "middleware", `Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Backend API is running. Please access /api/notifications');
});

app.get('/api/notifications', getNotifications);

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  await Log("backend", "error", "middleware", `Unhandled global error: ${err.message || err}`);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, async () => {
  await Log("backend", "info", "controller", `Server is running on port ${PORT}`);
});
