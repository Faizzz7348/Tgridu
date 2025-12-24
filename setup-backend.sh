#!/bin/bash

echo "🚀 Setting up Tgridu Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Start server
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  cd backend"
echo "  npm run dev"
