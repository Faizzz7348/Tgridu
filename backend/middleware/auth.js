import fileService from '../services/fileService.js';

// Simple auth middleware - uses Telegram ID from header
// In production, you should use proper JWT tokens
export const authMiddleware = async (req, res, next) => {
  try {
    // Get telegram ID from header
    const telegramId = req.headers['x-telegram-id'] || process.env.OWNER_ID;
    
    if (!telegramId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Telegram ID not provided'
      });
    }

    // Get or create user
    const user = await fileService.getOrCreateUser(parseInt(telegramId), {
      username: req.headers['x-telegram-username'],
      first_name: req.headers['x-telegram-firstname'],
      last_name: req.headers['x-telegram-lastname']
    });

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
