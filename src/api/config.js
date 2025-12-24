// API Configuration
// Use relative URLs for Vite proxy (in dev) or absolute URL (in production)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const TELEGRAM_ID = import.meta.env.VITE_TELEGRAM_ID || '934561422';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  telegramId: TELEGRAM_ID,
  endpoints: {
    files: '/api/files',
    upload: '/api/files/upload',
    folders: '/api/folders',
    health: '/health'
  },
  headers: {
    'X-Telegram-Id': TELEGRAM_ID
  }
};

// Helper function to build full URL
// In development, uses relative paths (proxied by Vite)
// In production, uses VITE_API_URL if provided
export const buildURL = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  return {
    'X-Telegram-Id': API_CONFIG.telegramId
  };
};
