#!/bin/bash

# MicroBridge Production Deployment Script
# This script handles the deployment process for the MicroBridge platform

set -e

echo "🚀 Starting MicroBridge deployment..."

# Change to project root
cd "$(dirname "$0")/../.."

# Pull latest changes (if using git)
echo "📥 Pulling latest changes..."
git pull origin main

# Build and deploy with Docker Compose
echo "🐳 Building and starting containers..."
docker-compose -f infrastructure/docker/docker-compose.yml down
docker-compose -f infrastructure/docker/docker-compose.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f infrastructure/docker/docker-compose.yml exec api ./migrate

# Health check
echo "🏥 Performing health check..."
curl -f http://localhost:8080/health || exit 1

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:8080"
echo "📊 Grafana: http://localhost:3001"