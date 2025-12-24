#!/bin/bash

echo "================================"
echo "FULL CONNECTION DIAGNOSTIC TEST"
echo "================================"
echo ""

# Test 1: Check if processes are running
echo "1. Checking running processes..."
echo "-----------------------------------"
BACKEND_PROC=$(ps aux | grep "node server.js" | grep -v grep | wc -l)
FRONTEND_PROC=$(ps aux | grep "vite" | grep -v grep | wc -l)

echo "Backend processes (node server.js): $BACKEND_PROC"
echo "Frontend processes (vite): $FRONTEND_PROC"
echo ""

# Test 2: Check if ports are listening
echo "2. Checking listening ports..."
echo "-----------------------------------"
PORT_3000=$(netstat -tln 2>/dev/null | grep ":3000 " || ss -tln 2>/dev/null | grep ":3000 ")
PORT_3001=$(netstat -tln 2>/dev/null | grep ":3001 " || ss -tln 2>/dev/null | grep ":3001 ")

if [ -n "$PORT_3000" ]; then
    echo "✅ Port 3000 is LISTENING"
else
    echo "❌ Port 3000 is NOT listening"
fi

if [ -n "$PORT_3001" ]; then
    echo "✅ Port 3001 is LISTENING"
else
    echo "❌ Port 3001 is NOT listening"
fi
echo ""

# Test 3: Test backend directly
echo "3. Testing backend (port 3001) directly..."
echo "-----------------------------------"
echo "Testing: http://localhost:3001/health"
BACKEND_HEALTH=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3001/health 2>&1)
echo "$BACKEND_HEALTH"
echo ""

echo "Testing: http://localhost:3001/api/files"
BACKEND_API=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files 2>&1)
echo "$BACKEND_API"
echo ""

# Test 4: Test frontend proxy
echo "4. Testing frontend proxy (port 3000)..."
echo "-----------------------------------"
echo "Testing: http://localhost:3000/api/files (through Vite proxy)"
PROXY_TEST=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -H "X-Telegram-Id: 934561422" http://localhost:3000/api/files 2>&1)
echo "$PROXY_TEST"
echo ""

# Test 5: Check environment variables
echo "5. Checking environment setup..."
echo "-----------------------------------"
cd /workspaces/Tgridu/backend
if [ -f .env ]; then
    echo "✅ Backend .env file exists"
    echo "   DATABASE_URL: $(grep DATABASE_URL .env | cut -d= -f1)"
    echo "   TG_BOT_TOKEN: $(grep TG_BOT_TOKEN .env | cut -d= -f1)"
    echo "   CHANNEL_ID: $(grep CHANNEL_ID .env | cut -d= -f1)"
else
    echo "❌ Backend .env file NOT found"
fi
echo ""

# Test 6: Database connection
echo "6. Testing database connection..."
echo "-----------------------------------"
cd /workspaces/Tgridu/backend
node -e "import('pg').then(({default: pg}) => {
  import('dotenv').then((dotenv) => {
    dotenv.config();
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    pool.query('SELECT 1').then(() => {
      console.log('✅ Database connection OK');
      pool.end();
    }).catch(err => {
      console.log('❌ Database connection FAILED:', err.message);
      pool.end();
    });
  });
});"
echo ""

echo "================================"
echo "DIAGNOSIS COMPLETE"
echo "================================"
