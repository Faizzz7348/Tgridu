#!/bin/bash

echo "🔍 Diagnosing Backend Issue..."
echo ""

# Check if backend is running
echo "1. Checking if backend is running on port 3001..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ✅ Process found on port 3001"
    lsof -Pi :3001 -sTCP:LISTEN
else
    echo "   ❌ No process listening on port 3001"
    echo "   Backend is NOT running!"
fi

echo ""
echo "2. Checking backend files..."
if [ -f "backend/server.js" ]; then
    echo "   ✅ server.js exists"
else
    echo "   ❌ server.js not found"
fi

if [ -f "backend/.env" ]; then
    echo "   ✅ .env exists"
else
    echo "   ❌ .env not found"
fi

if [ -d "backend/node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ❌ node_modules not found - run: cd backend && npm install"
fi

echo ""
echo "🚀 To start backend:"
echo ""
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "Backend should start on http://localhost:3001"
