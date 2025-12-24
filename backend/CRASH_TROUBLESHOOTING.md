# 🔧 Backend Crash Troubleshooting

## ✅ FIXED: Server variable issue

**Fixed in:** `backend/server.js` line 142

Changed:
```javascript
app.listen(PORT, () => { ... });
```

To:
```javascript
const server = app.listen(PORT, () => { ... });
```

This fixes the crash from `server.close()` referencing undefined variable.

---

## 🚀 How to Restart Backend:

1. **Stop current process** (Ctrl+C in terminal)
2. **Start fresh:**
   ```bash
   cd backend
   npm run dev
   ```

---

## 🐛 Common Crash Reasons & Fixes:

### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Fix:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill it
kill -9 $(lsof -ti:3001)

# Or change port in .env
PORT=3002
```

---

### 2. Database Connection Error

**Error:** `connection timeout` or `ECONNREFUSED`

**Fix:**
```bash
# Verify DATABASE_URL in backend/.env
# Test connection
npm run db:verify
```

---

### 3. Missing Environment Variables

**Error:** `TG_BOT_TOKEN is not defined`

**Fix:** Check `backend/.env` contains:
```env
TG_BOT_TOKEN=5946129966:AAF_da-ZBE7XKI8sy3HdkvOmq8d7kIvi7xY
CHANNEL_ID=-1001948933224
OWNER_ID=934561422
DATABASE_URL=postgresql://...
PORT=3001
```

---

### 4. Import/Module Errors

**Error:** `Cannot find module` or `SyntaxError`

**Fix:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### 5. Database Tables Missing

**Error:** `relation "users" does not exist`

**Fix:**
```bash
cd backend
npm run db:migrate-simple
```

---

## 🧪 Test if Backend is Working:

```bash
# Test health
curl http://localhost:3001/health

# Test files API
curl -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files

# Test root
curl http://localhost:3001/
```

Expected responses:
```json
// Health
{"status":"OK","timestamp":"...","database":"Connected","telegram":"Configured"}

// Files
{"success":true,"files":[],"count":0}

// Root
{"success":true,"name":"Tgridu File Manager API",...}
```

---

## 📊 Check Server Logs:

The backend should show:
```
╔═══════════════════════════════════════════════╗
║   🚀 Tgridu File Manager API Server          ║
╠═══════════════════════════════════════════════╣
║   Port: 3001                                  ║
║   Environment: development                    ║
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
```

And database connection:
```
✅ Connected to PostgreSQL database
```

---

## 🔍 Debug Mode:

Run with more verbose logging:
```bash
NODE_ENV=development node server.js
```

---

## ✅ After Fix:

1. Restart backend: `npm run dev`
2. You should see the success banner
3. Test endpoints work
4. Frontend should now connect successfully

---

**Main issue (server variable) is now fixed! Backend should start without crashing! 🎉**
