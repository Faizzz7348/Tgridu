#!/bin/bash
# Final validation to ensure all fixes are applied correctly

echo "╔═══════════════════════════════════════════════╗"
echo "║   TGRIDU FIX VALIDATION                       ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

ERRORS=0

# Check 1: Folders route fix
echo "1. Checking folders.js fix..."
if grep -q "folders: folders" /workspaces/Tgridu/backend/routes/folders.js; then
    echo "   ✅ Folders route returns correct format"
else
    echo "   ❌ Folders route still has old format"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: .env.local proxy config
echo "2. Checking .env.local configuration..."
if grep -q "^VITE_API_URL=$" /workspaces/Tgridu/.env.local; then
    echo "   ✅ VITE_API_URL is empty (proxy mode enabled)"
else
    echo "   ❌ VITE_API_URL is not empty"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: CORS configuration
echo "3. Checking CORS configuration..."
if grep -q "github.dev" /workspaces/Tgridu/backend/server.js; then
    echo "   ✅ GitHub Codespaces origins added to CORS"
else
    echo "   ❌ CORS doesn't include Codespaces origins"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Vite config
echo "4. Checking Vite proxy configuration..."
if grep -q "/api.*localhost:3001" /workspaces/Tgridu/vite.config.js; then
    echo "   ✅ Vite proxy configured correctly"
else
    echo "   ⚠️  Vite proxy config may need review"
fi

# Check 5: Backend .env exists
echo "5. Checking backend .env file..."
if [ -f /workspaces/Tgridu/backend/.env ]; then
    echo "   ✅ Backend .env exists"
else
    echo "   ❌ Backend .env missing"
    ERRORS=$((ERRORS + 1))
fi

# Check 6: Startup scripts
echo "6. Checking startup scripts..."
if [ -f /workspaces/Tgridu/start-ipad.sh ]; then
    echo "   ✅ iPad startup script created"
else
    echo "   ❌ Startup script missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo "✅ ALL FIXES VALIDATED SUCCESSFULLY!"
    echo ""
    echo "You can now start the app with:"
    echo "   bash /workspaces/Tgridu/start-ipad.sh"
else
    echo "❌ Found $ERRORS issue(s) - please review above"
fi

echo "═══════════════════════════════════════════════"
