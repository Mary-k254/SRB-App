import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { globalRateLimiter } from '../backend/src/middleware/rateLimiter';
import authRoutes from '../backend/src/routes/authRoutes';
import bookingRoutes from '../backend/src/routes/bookingRoutes';
import commentRoutes from '../backend/src/routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(globalRateLimiter);

// Health check and root route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Smart Booking API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/comments', commentRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('SERVER ERROR:', err);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
