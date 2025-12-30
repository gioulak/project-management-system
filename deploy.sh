#!/bin/bash

# Deployment script for Project Management System

set -e #exit if error

echo "Starting Deployment"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NONE='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NONE} $1"
}

print_err() {
    echo -e "${RED}x${NONE} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NONE} $1"
}

# check .env.production exists
if [ ! -f .env.production ]; then
    print_err ".env.production file not found"
    exit 1
fi

print_status ".env.production found"

# load env vars
export $(cat .env.production | xargs)

# stop containers if running
print_status "Stopping conatainers"
docker compose --env-file .env -f docker-compose.prod.yml down 2>/dev/null || true

# build
print_status "Building docker images"
docker compose --env-file .env -f docker-compose.prod.yml build --no-cache

# start
print_status "Starting services"
docker compose --env-file .env -f docker-compose.prod.yml up -d

sleep 10

# chech the status of the services
print_status "Checking status service"
docker compose --env-file .env -f docker-compose.prod.yml ps

#health starus
echo ""
echo "Health Status"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

#logs
echo ""
echo "Logs"
docker compose --env-file .env -f docker-compose.prod.yml logs --tail=20

EXTERNAL_IP=$(curl -s ifconfig.me)

echo ""
print_status "Deployment completed"
echo "Access the app at:"
echo "http://$EXTERNAL_IP:3000"

echo "User Service: http://$EXTERNAL_IP:8080"
echo "Team Service: http://$EXTERNAL_IP:8081"
echo "Task Service: http://$EXTERNAL_IP:8082"
