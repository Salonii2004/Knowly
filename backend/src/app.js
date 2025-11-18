// backend/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chatRoutes from './routes/chat.js';
import { authenticate, authorize, adminOnly } from './middleware/auth.js';
import searchRoutes from './routes/search.js';
import integrationRoutes from './routes/integrations.js';
import dataRoutes from './routes/data.js';
import authRoutes from './routes/auth.js'; // Ensure this import is present
import ragRoutes from './routes/rag.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000' // Restrict origins for security
}));
app.use(express.json());
app.use(morgan('dev'));

// Public routes
app.get('/', (_req, res) => res.send('API is working!'));
app.post('/echo', (req, res) => {
  const { message } = req.body;
  res.json({ echo: message || 'No message sent!' });
});

// Authentication routes (public)
app.use('/api/auth', authRoutes);

// Authenticated routes
app.use('/api/search', authenticate, searchRoutes);
app.use('/api/chat', authenticate, chatRoutes);
app.use('/api/integrations', authenticate, integrationRoutes);
app.use('/api/data', authenticate, dataRoutes);
app.use('/api/rag', authenticate, ragRoutes); // Add authenticate middleware

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;