import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';

// Import Routes
import authRoutes from './modules/auth/auth.routes.js';
import schoolRoutes from './modules/schools/schools.routes.js';
import syllabusRoutes from './modules/syllabus/syllabus.routes.js';
import userRoutes from './modules/users/users.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
