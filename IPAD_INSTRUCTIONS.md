# 🚀 Tgridu File Manager - iPad/Browser Setup

## Quick Start for iPad/GitHub Codespaces

### Method 1: One-Command Startup (Recommended)

1. Open a new Terminal in VS Code
2. Run this single command:
```bash
bash /workspaces/Tgridu/start-ipad.sh
```

3. Wait for the startup to complete (about 10 seconds)
4. Go to the **PORTS** tab in VS Code (bottom panel)
5. Find port **3000** 
6. Click the **🌐 globe icon** next to it
7. Your app will open in a new tab!

---

### Method 2: Manual Startup (If script fails)

#### Terminal 1 - Backend:
```bash
cd /workspaces/Tgridu/backend
PORT=3001 node server.js
```

#### Terminal 2 - Frontend:
```bash
cd /workspaces/Tgridu
npm run dev:frontend
```

Then follow steps 4-7 from Method 1.

---

## What Was Fixed

### Issues Found:
1. **API Response Format Mismatch**: Backend returned `{data: folders}` but frontend expected `{folders: []}`
2. **Wrong Proxy Configuration**: Frontend .env.local had direct backend URL which bypassed Vite proxy
3. **CORS Issues**: Backend didn't allow GitHub Codespaces origins

### Fixes Applied:
1. ✅ Fixed folder API response format in `backend/routes/folders.js`
2. ✅ Configured frontend to use Vite proxy (cleared VITE_API_URL in `.env.local`)
3. ✅ Added GitHub Codespaces origins to CORS whitelist
4. ✅ Created iPad-optimized startup script

---

## Troubleshooting

### "Failed to load files" error:
1. Check if both services are running:
   ```bash
   ps aux | grep -E "node server.js|vite"
   ```

2. Test backend directly:
   ```bash
   curl http://localhost:3001/health
   ```

3. Test frontend proxy:
   ```bash
   curl http://localhost:3000/api/files -H "X-Telegram-Id: 934561422"
   ```

### Ports not showing up:
- Click the "+" icon in the PORTS tab
- Add port 3000 manually
- Set visibility to "Public"

### Services won't start:
1. Kill all processes:
   ```bash
   pkill -f node
   ```

2. Wait 3 seconds, then run the startup script again

---

## Log Files

Check logs if something goes wrong:

**Backend log:**
```bash
tail -f /tmp/backend.log
```

**Frontend log:**
```bash
tail -f /tmp/frontend.log
```

---

## Configuration Files

### Frontend Config (Vite Proxy):
- File: `/workspaces/Tgridu/vite.config.js`
- Proxies `/api/*` and `/health` to backend at `http://localhost:3001`

### Backend Config:
- File: `/workspaces/Tgridu/backend/.env`
- Contains database and Telegram credentials

### API Config:
- File: `/workspaces/Tgridu/src/api/config.js`
- Uses relative URLs (empty VITE_API_URL) for proxy

---

## How It Works

```
┌─────────────────────────────────────────────┐
│  Your iPad/Browser                          │
│  (viewing through GitHub Codespaces)        │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTPS (port forwarded)
                   ▼
┌─────────────────────────────────────────────┐
│  Frontend (Vite Dev Server)                 │
│  Port: 3000                                 │
│  - Serves React app                         │
│  - Proxies /api/* to backend                │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP proxy (internal)
                   ▼
┌─────────────────────────────────────────────┐
│  Backend (Express Server)                   │
│  Port: 3001                                 │
│  - Handles file operations                  │
│  - Connects to PostgreSQL                   │
│  - Uploads to Telegram                      │
└─────────────────────────────────────────────┘
```

---

## Important Notes for iPad Users

1. **Always use the Ports tab**: Don't try to access `localhost:3000` directly - it won't work on iPad

2. **Port forwarding is automatic**: GitHub Codespaces automatically forwards ports securely

3. **Public vs Private ports**: 
   - Private: Only you can access (more secure)
   - Public: Anyone with the URL can access

4. **The app stays running**: Even if you close the browser tab, the servers keep running in Codespaces

5. **To fully stop**:
   ```bash
   pkill -f node
   ```

---

## Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Run the diagnostic test:
   ```bash
   bash /workspaces/Tgridu/test-connection-full.sh
   ```
3. Check both log files for errors
4. Restart using the startup script

Enjoy your file manager! 🎉
