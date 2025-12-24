#!/bin/bash

echo "🚀 Starting Tgridu File Manager Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if database exists
echo "📊 Step 1: Checking database..."
cd backend

# Check if tables exist by trying to query
if node -e "
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_YZO92BQemuqv@ep-billowing-cake-a4lr2a3q-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require', ssl: { rejectUnauthorized: false } });
pool.query('SELECT 1 FROM users LIMIT 1').then(() => { console.log('exists'); process.exit(0); }).catch(() => { console.log('missing'); process.exit(1); });
" 2>/dev/null | grep -q "exists"; then
    echo -e "${GREEN}✅ Database tables exist${NC}"
else
    echo -e "${YELLOW}⚠️  Database tables not found. Running migrations...${NC}"
    npm run db:migrate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database migration completed${NC}"
    else
        echo -e "${RED}❌ Migration failed. Please check database connection.${NC}"
        exit 1
    fi
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now start the servers:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: npm run dev"
