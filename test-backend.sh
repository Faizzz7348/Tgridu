#!/bin/bash

echo "🔍 Testing Backend Connection..."
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint:"
curl -s http://localhost:3001/health | jq . || echo "❌ Backend not responding"
echo ""

# Test root endpoint
echo "2. Testing Root Endpoint:"
curl -s http://localhost:3001/ | jq . || echo "❌ Root endpoint not responding"
echo ""

# Test API info
echo "3. Testing API Info:"
curl -s http://localhost:3001/api | jq . || echo "❌ API info not responding"
echo ""

echo "✅ If you see JSON responses above, backend is working!"
echo ""
echo "If backend is not responding, run:"
echo "  cd backend && npm run dev"
