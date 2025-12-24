#!/bin/bash

echo "🔍 Testing Frontend-Backend Connection"
echo "======================================"
echo ""

# Check if backend is running
echo "1. Testing Backend (Port 3001):"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Backend is UP"
    curl -s http://localhost:3001/health | jq . 2>/dev/null
else
    echo "   ❌ Backend is DOWN"
    echo "   Run: cd backend && npm run dev"
fi

echo ""

# Check if frontend is running
echo "2. Testing Frontend (Port 3000):"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is UP"
else
    echo "   ❌ Frontend is DOWN"
    echo "   Run: npm run dev:frontend"
fi

echo ""

# Test API through proxy
echo "3. Testing API Proxy (Frontend -> Backend):"
if curl -s http://localhost:3000/api/folders -H "X-Telegram-Id: 934561422" > /dev/null 2>&1; then
    echo "   ✅ Proxy is working!"
    curl -s http://localhost:3000/api/folders -H "X-Telegram-Id: 934561422" | jq . 2>/dev/null
else
    echo "   ❌ Proxy not working"
    echo ""
    echo "   Possible issues:"
    echo "   - Backend not running on port 3001"
    echo "   - Frontend not running on port 3000"
    echo "   - Vite proxy not configured properly"
fi

echo ""
echo "======================================"
echo "Quick Fix:"
echo "  1. npm run kill-ports"
echo "  2. npm run dev"
echo "======================================"
