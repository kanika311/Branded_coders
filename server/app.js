import express, { Router } from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import portfolioRoutes from './routes/portfolio.js';
import messagesRoutes from './routes/messages.js';

const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Database connection middleware with error catching
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection warning:', err.message);
  }
  next();
});

// Create API router
const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'BrandedCoders API', timestamp: new Date().toISOString() });
});

// Resource routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/services', servicesRoutes);
apiRouter.use('/portfolio', portfolioRoutes);
apiRouter.use('/messages', messagesRoutes);

// Mount API router under both /api and / to handle Vercel rewrites reliably
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ error: 'Internal server error', detail: err.message });
});

export default app;
