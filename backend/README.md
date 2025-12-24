# Tgridu Backend API

Backend server untuk Tgridu File Manager dengan Telegram storage integration.

## 🚀 Features

- ✅ File upload ke Telegram channel
- ✅ File download dari Telegram
- ✅ File management (rename, delete)
- ✅ Folder organization
- ✅ PostgreSQL database untuk metadata
- ✅ RESTful API
- ✅ Rate limiting & security

## 📦 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon)
- Telegram Bot Token
- Telegram Private Channel

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Environment Variables

```env
# Telegram Bot
OWNER_ID=your_telegram_user_id
TG_BOT_TOKEN=your_bot_token
CHANNEL_ID=your_channel_id
APP_ID=your_app_id
API_HASH=your_api_hash

# Database
DATABASE_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

## 📡 API Endpoints

### Files

- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get file by ID
- `POST /api/files/upload` - Upload file
- `PATCH /api/files/:id/rename` - Rename file
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id/download` - Get download link

### Folders

- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create folder
- `DELETE /api/folders/:id` - Delete folder

### Health

- `GET /health` - Health check
- `GET /api` - API info

## 🔐 Authentication

API menggunakan Telegram ID untuk authentication. Kirim headers:

```
X-Telegram-Id: your_telegram_id
X-Telegram-Username: your_username (optional)
X-Telegram-Firstname: your_first_name (optional)
X-Telegram-Lastname: your_last_name (optional)
```

## 📊 Database Schema

- **users** - User accounts
- **folders** - Folder structure
- **files** - File metadata with Telegram file IDs

## 🚦 Rate Limiting

- 100 requests per 15 minutes per IP

## 📝 License

MIT
