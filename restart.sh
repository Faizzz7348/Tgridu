#!/bin/bash
# Quick restart script - use this after fixes are applied

echo "Restarting Tgridu services..."

# Kill existing processes
echo "Stopping existing services..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 2

echo "Starting fresh..."
# Start with the main startup script
bash /workspaces/Tgridu/start-ipad.sh
