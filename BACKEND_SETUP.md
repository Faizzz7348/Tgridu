# 🚀 Tgridu File Manager - SETUP GUIDE

## ✅ Backend sudah dibuat dengan lengkap!

### 📁 Structure yang telah dibuat:

```
backend/
├── .env                    # ✅ Credentials anda (SUDAH CONFIGURED)
├── .env.example            # Template untuk reference
├── package.json            # Dependencies
├── server.js               # Main server
├── database/
│   ├── db.js              # PostgreSQL connection
│   └── schema.sql         # Database schema
├── services/
│   ├── telegram.js        # Telegram Bot integration
│   └── fileService.js     # File operations
├── routes/
│   ├── files.js           # File API endpoints
│   └── folders.js         # Folder API endpoints
├── middleware/
│   └── auth.js            # Authentication
└── scripts/
    └── migrate.js         # Database migration script
```

## 🔧 Setup Steps:

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Database Migration
```bash
npm run db:migrate
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 📡 API akan running di:
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Info**: http://localhost:3001/api

## 🎯 API Endpoints:

### Files
- `GET    /api/files` - List files
- `POST   /api/files/upload` - Upload file
- `GET    /api/files/:id` - Get file details
- `PATCH  /api/files/:id/rename` - Rename file
- `DELETE /api/files/:id` - Delete file
- `GET    /api/files/:id/download` - Get download URL

### Folders
- `GET    /api/folders` - List folders
- `POST   /api/folders` - Create folder
- `DELETE /api/folders/:id` - Delete folder

## 🔐 Authentication

API menggunakan Telegram ID. Kirim headers:
```
X-Telegram-Id: 934561422
```

## ✨ Features:

✅ **Telegram Storage**
- Files disimpan di Telegram channel
- Max 2GB per file
- Unlimited storage
- Fast CDN delivery

✅ **PostgreSQL Database**
- Metadata storage (nama, size, type, etc)
- Fast queries & search
- Folder organization
- User management

✅ **Security**
- Rate limiting (100 req/15min)
- Helmet.js protection
- CORS configured
- Input validation

✅ **File Operations**
- Upload: Multiple files, drag & drop
- Download: Direct Telegram CDN links
- Rename: Update metadata & Telegram
- Delete: Soft delete with Telegram cleanup
- Search: Fast database queries
- Sort: By name, date, size, type

## 🧪 Test API:

### Upload File
```bash
curl -X POST http://localhost:3001/api/files/upload \
  -H "X-Telegram-Id: 934561422" \
  -F "file=@/path/to/file.pdf"
```

### List Files
```bash
curl http://localhost:3001/api/files \
  -H "X-Telegram-Id: 934561422"
```

### Health Check
```bash
curl http://localhost:3001/health
```

## 📊 Database Tables:

- **users** - User accounts (auto-created)
- **folders** - Folder structure (hierarchical)
- **files** - File metadata + Telegram IDs

## 🔥 Next Steps:

1. **Install dependencies**: `cd backend && npm install`
2. **Run migrations**: `npm run db:migrate`
3. **Start server**: `npm run dev`
4. **Update frontend** to connect to API (saya akan buat next)

## 💡 Credentials Configured:

✅ Telegram Bot Token  
✅ Channel ID  
✅ Owner ID  
✅ Database URL (Neon PostgreSQL)  

Semua sudah configured dalam `.env` file!

## 🐛 Troubleshooting:

**Port already in use?**
```bash
# Change PORT in .env
PORT=3002
```

**Database connection error?**
- Check DATABASE_URL dalam .env
- Ensure database accessible

**Telegram error?**
- Verify bot token valid
- Ensure bot is admin di channel
- Check channel ID correct (with -100 prefix)

---

**Ready untuk start! 🚀**
