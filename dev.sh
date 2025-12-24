#!/bin/bash

# Tgridu File Manager - Development Script
# Usage: ./dev.sh [command]

case "$1" in
  start)
    echo "🚀 Starting Tgridu File Manager..."
    npm run dev
    ;;
  
  build)
    echo "📦 Building for production..."
    npm run build
    ;;
  
  preview)
    echo "👀 Previewing production build..."
    npm run preview
    ;;
  
  install)
    echo "📥 Installing dependencies..."
    npm install
    ;;
  
  clean)
    echo "🧹 Cleaning build files..."
    rm -rf dist node_modules package-lock.json
    echo "✅ Clean completed!"
    ;;
  
  reset)
    echo "🔄 Resetting localStorage..."
    echo "Open browser console and run: localStorage.removeItem('fileManagerData')"
    ;;
  
  *)
    echo "Tgridu File Manager - Development Commands"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start    - Start development server"
    echo "  build    - Build for production"
    echo "  preview  - Preview production build"
    echo "  install  - Install dependencies"
    echo "  clean    - Remove build files and dependencies"
    echo "  reset    - Instructions to reset data"
    echo ""
    ;;
esac
