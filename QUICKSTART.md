# 🚀 Tgridu - Quick Start Guide

## ✅ Setup Complete!

Backend dan Frontend sudah fully integrated dengan Telegram storage!

---

## 🎯 Start Application

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

Backend akan running di: **http://localhost:3001**

### 2. Start Frontend (Terminal 2)
```bash
npm install
npm run dev
```

Frontend akan running di: **http://localhost:5173**

---

## 🔥 Features Yang Sudah Integrated:

### ✅ Backend API
- **Upload files** → Tersimpan di Telegram channel
- **Download files** → Direct link dari Telegram CDN
- **Rename files** → Update metadata & Telegram caption
- **Delete files** → Soft delete dengan cleanup di Telegram
- **Create folders** → Hierarchical folder structure
- **List files** → Fast database queries

### ✅ Frontend UI
- **SVAR-style design** → Clean & modern interface
- **Table/Cards view** → Toggle view modes
- **Image viewer** → View & download images from Telegram
- **Drag & drop upload** → Multiple files support
- **Search & sort** → By name, date, size, type
- **Dark/Light mode** → Theme toggle
- **Select all** → Bulk operations
- **Context menu** → Right-click actions

---

## 🔐 Configuration

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://neondb_owner:npg_YZO92BQemuqv@ep-billowing-cake-a4lr2a3q-pooler.us-east-1.aws.neon.tech/neondb
TG_BOT_TOKEN=5946129966:AAF_da-ZBE7XKI8sy3HdkvOmq8d7kIvi7xY
CHANNEL_ID=-1001948933224
OWNER_ID=934561422
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_ID=934561422
VITE_TG_BOT_TOKEN=5946129966:AAF_da-ZBE7XKI8sy3HdkvOmq8d7kIvi7xY
```

---

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Upload File
```bash
curl -X POST http://localhost:3001/api/files/upload \
  -H "X-Telegram-Id: 934561422" \
  -F "file=@/path/to/file.jpg"
```

### List Files
```bash
curl http://localhost:3001/api/files \
  -H "X-Telegram-Id: 934561422"
```

### Create Folder
```bash
curl -X POST http://localhost:3001/api/folders \
  -H "X-Telegram-Id: 934561422" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Folder"}'
```

### Rename File
```bash
curl -X PATCH http://localhost:3001/api/files/{file_id}/rename \
  -H "X-Telegram-Id: 934561422" \
  -H "Content-Type: application/json" \
  -d '{"name":"NewName.jpg"}'
```

### Delete File
```bash
curl -X DELETE http://localhost:3001/api/files/{file_id} \
  -H "X-Telegram-Id: 934561422"
```

### Get Download URL
```bash
curl http://localhost:3001/api/files/{file_id}/download \
  -H "X-Telegram-Id: 934561422"
```

---

## 📊 Database Schema

### Users Table
```sql
- id (UUID, PK)
- telegram_id (BIGINT, UNIQUE)
- username (VARCHAR)
- created_at, updated_at
```

### Folders Table
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- name (VARCHAR)
- parent_id (UUID, FK → folders)
- created_at, updated_at
```

### Files Table
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- folder_id (UUID, FK → folders, nullable)
- name (VARCHAR)
- size (BIGINT)
- mime_type (VARCHAR)
- telegram_file_id (VARCHAR, UNIQUE)
- telegram_message_id (BIGINT)
- created_at, updated_at, deleted_at
```

---

## 🎨 UI Components

### File Manager Toolbar
- Upload button (multiple files)
- New folder button
- Delete button (bulk delete)
- Select all checkbox
- Search bar
- View toggle (table/cards)
- Dark mode toggle

### Table View
- Sortable columns (Name, Type, Size, Date)
- Checkbox selection
- Context menu (right-click)
- Double-click to open folders

### Cards View
- Visual grid layout
- File type icons
- Hover effects
- Quick actions

### Image Viewer
- Full-size preview
- Rename button
- Download button
- Loads images from Telegram CDN

---

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS Variables** - SVAR-style theming

### Backend
- **Express.js** - REST API
- **PostgreSQL** - Database (Neon)
- **Telegram Bot API** - File storage
- **Multer** - File upload handling

### Storage
- **Telegram Channel** - Actual file storage (2GB per file)
- **PostgreSQL** - Metadata storage

---

## ✨ How It Works

### Upload Flow:
1. User selects files in frontend
2. Files sent to backend via multipart/form-data
3. Backend uploads files to Telegram channel
4. Telegram returns file_id & message_id
5. Metadata saved to PostgreSQL
6. Frontend refreshes file list

### Download Flow:
1. User clicks download
2. Frontend requests download URL from backend
3. Backend retrieves file_id from database
4. Backend generates Telegram file URL
5. Frontend opens URL (direct from Telegram CDN)

### Delete Flow:
1. User selects files and clicks delete
2. Frontend sends delete request
3. Backend soft-deletes in database (sets deleted_at)
4. Backend deletes message from Telegram
5. Frontend refreshes file list

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Restart backend
npm run dev
```

### Database connection error?
- Verify DATABASE_URL in backend/.env
- Check if Neon database is accessible
- Test connection: `psql <DATABASE_URL>`

### Telegram errors?
- Verify bot token is valid
- Check if bot is admin in channel
- Ensure channel ID is correct (with -100 prefix)

### Frontend not connecting to backend?
- Check if backend is running
- Verify VITE_API_URL in .env.local
- Check browser console for errors

### CORS errors?
- Backend should allow http://localhost:5173
- Check ALLOWED_ORIGINS in backend/.env

---

## 🚀 Production Deployment

### Backend
```bash
# Build backend
npm run build

# Start production
NODE_ENV=production npm start
```

### Frontend
```bash
# Build frontend
npm run build

# Serve build
npm run preview
```

### Environment Variables
- Update VITE_API_URL to production API URL
- Update ALLOWED_ORIGINS to production frontend URL
- Use production database URL
- Keep bot tokens secure (use secrets management)

---

## 📖 Documentation

- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend setup guide
- [FEATURES.md](FEATURES.md) - Complete features list
- [README.md](README.md) - Project overview

---

**🎉 Everything is ready! Start both servers and test upload/download!**
