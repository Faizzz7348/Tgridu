import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import filesRouter from './routes/files.js';
import foldersRouter from './routes/folders.js';

// Import middleware
import { authMiddleware, errorHandler } from './middleware/auth.js';

// Import database
import pool from './database/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or proxied requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow GitHub Codespaces origins
    if (origin && (origin.includes('github.dev') || origin.includes('app.github.dev') || origin.includes('preview.app.github.dev'))) {
      return callback(null, true);
    }
    
    console.log('Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'Tgridu File Manager API',
    version: '1.0.0',
    description: 'Backend API for file management with Telegram storage',
    documentation: '/api',
    health: '/health',
    telegram_storage: 'Enabled',
    database: 'PostgreSQL (Neon)',
    max_file_size: '2GB per file',
    endpoints: {
      info: 'GET /api',
      health: 'GET /health',
      files: 'GET /api/files',
      upload: 'POST /api/files/upload',
      folders: 'GET /api/folders'
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      telegram: 'Configured'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Tgridu File Manager API',
    version: '1.0.0',
    description: 'Backend API for file management with Telegram storage',
    endpoints: {
      files: '/api/files',
      folders: '/api/folders',
      health: '/health'
    }
  });
});

// API routes with authentication
app.use('/api/files', authMiddleware, filesRouter);
app.use('/api/folders', authMiddleware, foldersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   🚀 Tgridu File Manager API Server          ║
╠═══════════════════════════════════════════════╣
║   Port: ${PORT}                                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Database: PostgreSQL (Neon)                ║
║   Storage: Telegram Bot                      ║
╠═══════════════════════════════════════════════╣
║   Endpoints:                                  ║
║   • GET  /health                              ║
║   • GET  /api                                 ║
║   • GET  /api/files                           ║
║   • POST /api/files/upload                    ║
║   • GET  /api/folders                         ║
╚═══════════════════════════════════════════════╝
  `);
  
  // Test database connection
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('⚠️  Database connection failed:', error.message);
    console.error('    Server running but database operations will fail');
  }
  
  // Verify environment variables
  const requiredEnv = ['TG_BOT_TOKEN', 'CHANNEL_ID', 'DATABASE_URL'];
  const missing = requiredEnv.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    pool.end(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  console.error('Server will continue running...');
});

export default app;
