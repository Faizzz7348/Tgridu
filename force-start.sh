#!/bin/bash

echo "🚀 FORCE START - Frontend & Backend"
echo "===================================="
echo ""

# Step 1: Kill everything
echo "1️⃣ Killing all Node processes..."
pkill -9 node 2>/dev/null || true
sleep 2

# Step 2: Start Backend FIRST
echo ""
echo "2️⃣ Starting Backend (Port 3001)..."
cd /workspaces/Tgridu/backend
nohup node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 3

# Check if backend is up
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Backend RUNNING!"
else
    echo "   ❌ Backend FAILED TO START"
    echo "   Checking logs:"
    tail -20 /tmp/backend.log
    exit 1
fi

# Step 3: Start Frontend
echo ""
echo "3️⃣ Starting Frontend (Port 3000)..."
cd /workspaces/Tgridu
nohup npm run dev:frontend > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 5

# Check if frontend is up
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend RUNNING!"
else
    echo "   ⚠️  Frontend might still be starting..."
fi

echo ""
echo "===================================="
echo "✅ SERVICES STARTED!"
echo ""
echo "Backend:  http://localhost:3001/health"
echo "Frontend: http://localhost:3000"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To view logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
