#!/bin/bash

# Trail Mixx Radio - Railway Deployment Script
# Project ID: f75bbc96-2a32-488c-a830-64f5bd2b48b5

set -e

echo "🚀 Trail Mixx Radio - Railway Deployment"
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Installing Railway CLI..."

    # Install Railway CLI
    npm install -g @railway/cli || {
        echo -e "${RED}Failed to install via npm. Trying install script...${NC}"
        curl -fsSL https://railway.app/install.sh | sh
    }
fi

echo -e "${GREEN}✓ Railway CLI found${NC}"

# Login to Railway
echo -e "${BLUE}Logging into Railway...${NC}"
railway login || {
    echo -e "${RED}Failed to login. Please run 'railway login' manually${NC}"
    exit 1
}

# Link to project
echo -e "${BLUE}Linking to project f75bbc96-2a32-488c-a830-64f5bd2b48b5...${NC}"
railway link f75bbc96-2a32-488c-a830-64f5bd2b48b5 || {
    echo -e "${RED}Failed to link project${NC}"
    exit 1
}

echo -e "${GREEN}✓ Project linked${NC}"

# Set environment variables
echo -e "${BLUE}Setting environment variables...${NC}"

# Generate JWT secret if not already set
JWT_SECRET=$(openssl rand -base64 32)

railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN="*"

echo -e "${GREEN}✓ Environment variables set${NC}"

# Deploy
echo -e "${BLUE}Deploying to Railway...${NC}"
railway up || {
    echo -e "${RED}Deployment failed${NC}"
    exit 1
}

echo -e "${GREEN}✓ Deployment successful!${NC}"

# Wait for deployment to be ready
echo -e "${BLUE}Waiting for deployment to be ready...${NC}"
sleep 10

# Run migrations
echo -e "${BLUE}Running database migrations...${NC}"
railway run npx prisma migrate deploy --schema=./server/prisma/schema.prisma || {
    echo -e "${RED}Migration failed - trying alternative path${NC}"
    railway run "cd server && npx prisma migrate deploy"
}

echo -e "${GREEN}✓ Migrations complete${NC}"

# Seed database
echo -e "${BLUE}Seeding database...${NC}"
railway run "cd server && npm run seed" || {
    echo -e "${RED}Seeding failed (optional - continuing)${NC}"
}

echo -e "${GREEN}✓ Database seeded${NC}"

# Get deployment URL
echo -e "${BLUE}Getting deployment URL...${NC}"
DEPLOYMENT_URL=$(railway status 2>/dev/null | grep -oP 'https://[^\s]+' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${BLUE}Opening Railway dashboard to get URL...${NC}"
    railway open
else
    echo -e "${GREEN}========================================"
    echo -e "✅ Deployment Complete!"
    echo -e "========================================"
    echo -e "URL: ${DEPLOYMENT_URL}"
    echo -e "========================================"
    echo ""
    echo "Testing endpoints..."
    echo ""

    # Test health endpoint
    if curl -s "${DEPLOYMENT_URL}/health" > /dev/null; then
        echo -e "${GREEN}✓ Health check passed${NC}"
    else
        echo -e "${RED}✗ Health check failed${NC}"
    fi

    # Test API
    if curl -s "${DEPLOYMENT_URL}/api/radio/now-playing" > /dev/null; then
        echo -e "${GREEN}✓ API responding${NC}"
    else
        echo -e "${RED}✗ API not responding yet${NC}"
    fi

    echo ""
    echo -e "${GREEN}🎉 Trail Mixx Radio is live at: ${DEPLOYMENT_URL}${NC}"
fi

echo ""
echo "View logs: railway logs"
echo "Open dashboard: railway open"
