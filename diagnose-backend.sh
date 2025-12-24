#!/bin/bash

echo "🔧 Checking and fixing backend setup..."
echo ""

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 3001"
    echo ""
    
    # Test database connection
    echo "Testing database connection..."
    HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
    echo "$HEALTH_RESPONSE" | jq .
    
    if echo "$HEALTH_RESPONSE" | grep -q "Connected"; then
        echo "✅ Database connected"
    else
        echo "❌ Database connection issue"
        echo "Run: cd backend && npm run db:migrate"
    fi
else
    echo "❌ Backend is NOT running"
    echo ""
    echo "To start backend:"
    echo "  cd backend"
    echo "  npm install"
    echo "  npm run db:migrate"
    echo "  npm run dev"
fi

echo ""
echo "Testing API endpoints..."
echo ""

# Test files endpoint
echo "Testing /api/files..."
FILES_RESPONSE=$(curl -s -H "X-Telegram-Id: 934561422" http://localhost:3001/api/files)
if [ $? -eq 0 ]; then
    echo "$FILES_RESPONSE" | jq .
else
    echo "❌ Cannot reach /api/files"
fi

echo ""
echo "🔍 Diagnosis:"
if curl -s http://localhost:3001/health | grep -q "Connected"; then
    echo "✅ Backend working properly!"
    echo "✅ You can now use the frontend"
else
    echo "⚠️  Backend may need database migration"
    echo "    Run: cd backend && npm run db:migrate"
fi
