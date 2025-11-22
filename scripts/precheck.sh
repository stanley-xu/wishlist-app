#!/bin/bash
# Precheck script to verify Docker (Colima) and Supabase are running
# Note: this only works in my (@stanley-xu's) dev machine!

# Check if Colima is running
if ! colima status 2>/dev/null | grep -q "Running"; then
  echo "❌ Colima is not running"
  echo "   Start it with: colima start"
  exit 1
fi

# Check if Docker daemon is accessible
if ! docker info &>/dev/null; then
  echo "❌ Docker daemon is not accessible"
  echo "   Try: colima start"
  exit 1
fi

# Check if Supabase containers are running
if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q "supabase"; then
  echo "❌ Supabase containers are not running"
  echo "   Start them with: npm run db:start"
  exit 1
fi

echo "✅ Colima and Supabase are ready"
