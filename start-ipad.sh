#!/bin/bash
# ========================================
# TGRIDU - iPad/Browser Startup Script
# ========================================
# This script is optimized for GitHub Codespaces
# and browser-based VS Code environments

set -e

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🚀 TGRIDU FILE MANAGER - STARTUP    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Step 1: Clean up any existing processes
echo "📋 Step 1: Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"
echo ""

# Step 2: Verify backend .env file
echo "📋 Step 2: Verifying backend configuration..."
if [ ! -f /workspaces/Tgridu/backend/.env ]; then
    echo "❌ Backend .env file not found!"
    echo "   Please ensure /workspaces/Tgridu/backend/.env exists"
    exit 1
fi
echo "✅ Backend .env exists"
echo ""

# Step 3: Start backend
echo "📋 Step 3: Starting backend server (port 3001)..."
cd /workspaces/Tgridu/backend
PORT=3001 NODE_ENV=development node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo "   Waiting for backend to start..."
sleep 3

# Verify backend is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 3001"
else
    echo "❌ Backend failed to start!"
    echo "   Check logs: tail -n 50 /tmp/backend.log"
    exit 1
fi
echo ""

# Step 4: Start frontend
echo "📋 Step 4: Starting frontend server (port 3000)..."
cd /workspaces/Tgridu
npm run dev:frontend > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo "   Waiting for frontend to start..."
sleep 4

# Verify frontend is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on port 3000"
else
    echo "⚠️  Frontend may still be starting..."
fi
echo ""

# Step 5: Test connection
echo "📋 Step 5: Testing frontend-backend connection..."
if curl -s http://localhost:3000/api/files -H "X-Telegram-Id: 934561422" > /dev/null 2>&1; then
    echo "✅ Frontend can reach backend through proxy"
else
    echo "⚠️  Connection test inconclusive (may still work)"
fi
echo ""

# Final status
echo "╔════════════════════════════════════════╗"
echo "║          ✅ STARTUP COMPLETE!          ║"
echo "╠════════════════════════════════════════╣"
echo "║  Backend PID:  $BACKEND_PID"
echo "║  Frontend PID: $FRONTEND_PID"
echo "╠════════════════════════════════════════╣"
echo "║  📱 For iPad/Browser:                  ║"
echo "║  1. Click 'Ports' tab in VS Code       ║"
echo "║  2. Find port 3000                     ║"
echo "║  3. Click the globe icon to open       ║"
echo "╠════════════════════════════════════════╣"
echo "║  Logs:                                 ║"
echo "║  Backend:  tail -f /tmp/backend.log    ║"
echo "║  Frontend: tail -f /tmp/frontend.log   ║"
echo "╠════════════════════════════════════════╣"
echo "║  To stop:                              ║"
echo "║  kill $BACKEND_PID $FRONTEND_PID"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🎉 App is ready! Open port 3000 from the Ports tab."
echo ""
