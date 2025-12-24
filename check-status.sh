#!/bin/bash

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Tgridu Complete Startup Guide    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if backend is running
echo -e "${YELLOW}Checking backend status...${NC}"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 3001${NC}"
    BACKEND_RUNNING=true
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    BACKEND_RUNNING=false
fi

# Check if frontend is running
echo -e "${YELLOW}Checking frontend status...${NC}"
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 5173${NC}"
    FRONTEND_RUNNING=true
else
    echo -e "${RED}❌ Frontend is NOT running${NC}"
    FRONTEND_RUNNING=false
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Provide instructions
if [ "$BACKEND_RUNNING" = false ]; then
    echo -e "${YELLOW}📝 TO START BACKEND:${NC}"
    echo ""
    echo "   Open a terminal and run:"
    echo -e "   ${GREEN}cd backend && npm run dev${NC}"
    echo ""
fi

if [ "$FRONTEND_RUNNING" = false ]; then
    echo -e "${YELLOW}📝 TO START FRONTEND:${NC}"
    echo ""
    echo "   Open ANOTHER terminal and run:"
    echo -e "   ${GREEN}npm run dev${NC}"
    echo ""
fi

if [ "$BACKEND_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${GREEN}✅ EVERYTHING IS RUNNING!${NC}"
    echo ""
    echo "   🌐 Open browser: http://localhost:5173"
    echo "   📡 Backend API: http://localhost:3001"
    echo ""
    echo "   Ready to upload files to Telegram! 🚀"
else
    echo -e "${YELLOW}⚠️  Start the servers as shown above${NC}"
    echo ""
    echo "   You need TWO separate terminal windows:"
    echo "   1. Backend terminal"
    echo "   2. Frontend terminal"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
