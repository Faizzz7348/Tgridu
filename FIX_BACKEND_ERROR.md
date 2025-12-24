# 🔧 Fixing "Failed to load files" Error

## Problem
Frontend showing: **"Failed to load files. Please check if backend is running."**

## Solution

### ✅ Backend is already running! 

The issue is likely that the **database tables haven't been created yet**.

---

## 🚀 Quick Fix:

### Option 1: Run Migration Script (Recommended)

In a NEW terminal window:

```bash
cd /workspaces/Tgridu/backend
npm run db:migrate
```

This will create all the necessary database tables (users, folders, files).

---

### Option 2: Manual Migration

If the script doesn't work, run this manually:

```bash
cd /workspaces/Tgridu/backend
node scripts/migrate.js
```

---

## ✅ After Migration:

1. **Refresh the frontend** (http://localhost:5173)
2. You should now see an empty file manager
3. Try uploading a file!

---

## 🧪 Test Backend:

```bash
# Test health
curl http://localhost:3001/health

# Test files endpoint
curl -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files
```

Expected response:
```json
{
  "success": true,
  "files": [],
  "count": 0
}
```

---

## 🐛 Still Not Working?

### Check if backend is actually running:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected",
  "telegram": "Configured"
}
```

### If backend is not running:
```bash
cd /workspaces/Tgridu/backend
npm run dev
```

---

## 📊 What the Migration Does:

Creates these tables in PostgreSQL:

1. **users** - User accounts (auto-created from Telegram ID)
2. **folders** - Folder structure (hierarchical)
3. **files** - File metadata + Telegram references

---

## ✨ After Setup Works:

- Upload files → Stored in Telegram channel
- Download files → Direct from Telegram CDN
- All metadata in PostgreSQL database
- Up to 2GB per file, unlimited total storage

---

**The database migration is the missing step! Run it and everything will work! 🚀**
