#!/bin/bash
set -e

echo "🔥 EMERGENCY STARTUP SCRIPT"
echo "=========================="

# Kill everything
echo ""
echo "Killing all node processes..."
killall node 2>/dev/null || pkill -9 node 2>/dev/null || true
sleep 2

echo "✅ Processes killed"
echo ""

# Start backend
echo "Starting BACKEND on port 3001..."
cd /workspaces/Tgridu/backend
PORT=3001 node server.js &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Waiting 5 seconds for backend to start..."
sleep 5

# Test backend
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ BACKEND IS RUNNING!"
else
    echo "❌ BACKEND FAILED!"
    echo "Showing last 30 lines of output:"
    sleep 1
    exit 1
fi

echo ""
echo "Starting FRONTEND on port 3000..."
cd /workspaces/Tgridu
export VITE_API_URL=""
npm run dev:frontend &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "=========================="
echo "✅ ALL STARTED!"
echo ""
echo "Open: http://localhost:3000"
echo ""
echo "PIDs: Backend=$BACKEND_PID Frontend=$FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop everything"

# Keep script running
wait
