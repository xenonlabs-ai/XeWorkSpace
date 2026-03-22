#!/bin/sh
set -e

echo "🚀 Starting XeWorkspace..."

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss

# Run seed (will upsert, so safe to run multiple times)
echo "🌱 Seeding database..."
npx prisma db seed 2>/dev/null || echo "Seed completed or skipped"

# Start the server
echo "✅ Starting server..."
exec node server.js
