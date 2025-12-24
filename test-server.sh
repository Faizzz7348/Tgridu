#!/bin/bash

echo "🧪 Testing Backend Server..."
echo ""

# Kill any existing process on port 3001
echo "1. Checking if port 3001 is in use..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 3001 is in use. Killing process..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "   ✅ Port 3001 is available"
echo ""

# Start server in background
echo "2. Starting backend server..."
cd backend
node server.js &
SERVER_PID=$!

echo "   Server PID: $SERVER_PID"
echo "   Waiting for server to start..."
sleep 3

# Test health endpoint
echo ""
echo "3. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)

if [ $? -eq 0 ]; then
    echo "   ✅ Server is responding!"
    echo "   Response:"
    echo "$HEALTH_RESPONSE" | jq . 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo "   ❌ Server is not responding"
fi

# Test files endpoint
echo ""
echo "4. Testing files API..."
FILES_RESPONSE=$(curl -s -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files)

if [ $? -eq 0 ]; then
    echo "   ✅ Files API is working!"
    echo "   Response:"
    echo "$FILES_RESPONSE" | jq . 2>/dev/null || echo "$FILES_RESPONSE"
else
    echo "   ❌ Files API failed"
fi

# Kill test server
echo ""
echo "5. Stopping test server..."
kill $SERVER_PID 2>/dev/null
sleep 1

echo ""
echo "✅ Test complete!"
echo ""
echo "To start the server for real:"
echo "  cd backend && npm run dev"
