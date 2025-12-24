#!/bin/bash
# Kill processes using ports 3000 and 3001

echo "🔍 Checking for processes on port 3000 and 3001..."

# Kill port 3000
PORT_3000=$(lsof -ti:3000)
if [ ! -z "$PORT_3000" ]; then
  echo "⚡ Killing process on port 3000 (PID: $PORT_3000)"
  kill -9 $PORT_3000 2>/dev/null || true
else
  echo "✅ Port 3000 is free"
fi

# Kill port 3001
PORT_3001=$(lsof -ti:3001)
if [ ! -z "$PORT_3001" ]; then
  echo "⚡ Killing process on port 3001 (PID: $PORT_3001)"
  kill -9 $PORT_3001 2>/dev/null || true
else
  echo "✅ Port 3001 is free"
fi

echo "✨ Ports cleared! Ready to start servers."
