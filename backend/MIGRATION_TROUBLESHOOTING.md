# 🔧 Database Migration Troubleshooting

## Error saat run `npm run db:migrate`?

### ✅ Solution 1: Use Simple Migration

Try the alternative migration script:

```bash
cd backend
npm run db:migrate-simple
```

This script runs each SQL statement separately, making it easier to debug.

---

### ✅ Solution 2: Manual Migration via psql

If Node script fails, use PostgreSQL directly:

```bash
# Using psql command line
psql "postgresql://neondb_owner:npg_YZO92BQemuqv@ep-billowing-cake-a4lr2a3q-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -f backend/database/schema.sql
```

Or connect and paste SQL manually:

```bash
psql "postgresql://neondb_owner:npg_YZO92BQemuqv@ep-billowing-cake-a4lr2a3q-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

Then paste contents of `backend/database/schema.sql`

---

### ✅ Solution 3: Use Neon Dashboard

1. Go to https://console.neon.tech
2. Open your database
3. Go to SQL Editor
4. Copy & paste contents of `backend/database/schema.sql`
5. Click Run

---

## Common Errors & Fixes:

### Error: "permission denied to create extension"

**Fix:** Your user might not have superuser privileges. Ask database admin or:

```sql
-- Run this as database admin/superuser
ALTER USER neondb_owner WITH SUPERUSER;
```

Or skip the extension and use `gen_random_uuid()` instead:

```sql
-- In schema.sql, replace:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- with:
-- Extension not needed, using gen_random_uuid()
```

---

### Error: "relation already exists"

**Good news!** Tables already exist. Your migration was successful before.

Test if tables exist:

```bash
cd backend
node -e "import pool from './database/db.js'; const c = await pool.connect(); const r = await c.query('SELECT * FROM users LIMIT 1'); console.log('✅ Tables exist!'); process.exit(0);"
```

---

### Error: "connection timeout" or "ECONNREFUSED"

**Fix:** Check your DATABASE_URL in `backend/.env`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_YZO92BQemuqv@ep-billowing-cake-a4lr2a3q-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Test connection:

```bash
curl -I https://ep-billowing-cake-a4lr2a3q-pooler.us-east-1.aws.neon.tech
```

---

### Error: "password authentication failed"

**Fix:** Database password might be wrong. Get fresh connection string from Neon dashboard.

---

## ✅ Verify Migration Succeeded

Run this to check if tables exist:

```bash
cd backend
node scripts/verify-db.js
```

Or manually:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'folders', 'files');
```

Should return:
```
 tablename
-----------
 files
 folders
 users
```

---

## 🚀 After Successful Migration

1. **Restart backend** (if running):
   ```bash
   cd backend
   npm run dev
   ```

2. **Test API**:
   ```bash
   curl -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files
   ```

3. **Refresh frontend** and try uploading a file!

---

## 💡 Quick Commands Reference

```bash
# Try simple migration
npm run db:migrate-simple

# Check if backend is running
curl http://localhost:3001/health

# Test files API
curl -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files

# Start backend
npm run dev
```

---

**Still having issues? Share the exact error message! 🤝**
