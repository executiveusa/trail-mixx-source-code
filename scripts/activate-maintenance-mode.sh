#!/bin/bash
#
# Activate Maintenance Mode Script
# Part of the Railway Zero-Secrets Bootstrapper system
#
# This script automates the process of activating maintenance mode when cost limits are reached.
# It deploys the static maintenance.html page and suspends the main application.
#
# Usage: ./scripts/activate-maintenance-mode.sh
#
# Requirements:
# - Railway CLI installed (npm install -g @railway/cli)
# - Logged into Railway (railway login)
# - Linked to a Railway project (railway link)

set -e

# Cleanup function for temporary files
cleanup() {
    if [ -f "Dockerfile.maintenance" ]; then
        rm -f Dockerfile.maintenance
    fi
}

# Register cleanup function to run on exit
trap cleanup EXIT

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║     Activate Maintenance Mode - Cost Protection          ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Error: Railway CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @railway/cli"
    echo ""
    exit 1
fi

# Check if logged in and linked
echo -e "${BLUE}ℹ Checking Railway connection...${NC}"
if ! railway status &> /dev/null; then
    echo -e "${RED}❌ Error: Not connected to Railway project${NC}"
    echo ""
    echo "Please run:"
    echo "  railway login    # Login to Railway"
    echo "  railway link     # Link to your project"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Connected to Railway${NC}"
echo ""

# Confirmation prompt
echo -e "${YELLOW}⚠️  WARNING: This will activate maintenance mode${NC}"
echo ""
echo "This action will:"
echo "  • Stop the main application service"
echo "  • Deploy a static maintenance page"
echo "  • Reduce costs to near-zero"
echo "  • Inform users about the maintenance"
echo ""
echo -e "${YELLOW}⚠️  The main application will be UNAVAILABLE${NC}"
echo ""

read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo ""
    echo -e "${BLUE}ℹ Activation cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Create Maintenance Service${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if maintenance.html exists
if [ ! -f "maintenance.html" ]; then
    echo -e "${RED}❌ Error: maintenance.html not found${NC}"
    echo "Please ensure you're in the project root directory."
    exit 1
fi

echo "Creating maintenance service in Railway..."
echo ""

# Note: Railway CLI commands may vary based on version
# This is a template implementation

# Create a simple Dockerfile for maintenance page
echo -e "${CYAN}Creating temporary Dockerfile for maintenance service...${NC}"

cat > Dockerfile.maintenance << 'EOF'
FROM nginx:alpine
COPY maintenance.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

echo -e "${GREEN}✓ Dockerfile.maintenance created${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Deploy Maintenance Page${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "⚠️  Manual steps required:"
echo ""
echo "Since Railway CLI doesn't support creating services directly,"
echo "please follow these steps in the Railway Dashboard:"
echo ""

echo "1. Go to: https://railway.app/dashboard"
echo ""

echo "2. Select your AzuraCast project"
echo ""

echo "3. Click 'New Service' → 'Empty Service'"
echo ""

echo "4. Name it: 'maintenance'"
echo ""

echo "5. In the maintenance service settings:"
echo "   • Go to Settings → Deploy"
echo "   • Set Root Directory: /"
echo "   • Set Dockerfile Path: Dockerfile.maintenance"
echo ""

echo "6. In the maintenance service settings:"
echo "   • Go to Settings → Networking"
echo "   • Click 'Generate Domain' to create a public URL"
echo ""

echo "7. Deploy the service:"
echo "   • Click 'Deploy' or trigger a deployment"
echo ""

read -p "Press ENTER once the maintenance service is deployed..."

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3: Update Domain Configuration${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "⚠️  Manual domain update required:"
echo ""
echo "If you have a custom domain:"
echo ""
echo "1. In Railway Dashboard, go to the MAIN service"
echo "2. Click on your custom domain"
echo "3. Click 'Remove Domain'"
echo ""
echo "4. Go to the MAINTENANCE service"
echo "5. Click 'Add Domain'"
echo "6. Add your custom domain"
echo ""

echo "If using Railway-provided domain:"
echo "1. Note the maintenance service URL"
echo "2. Share this URL instead of the main service URL"
echo ""

read -p "Press ENTER once domain is configured..."

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 4: Stop Main Application${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Stopping main application service..."
echo ""
echo "⚠️  Manual stop required:"
echo ""
echo "1. In Railway Dashboard, go to your main AzuraCast service"
echo "2. Click Settings → Deploys"
echo "3. Click 'Pause Deployments' or remove the service temporarily"
echo ""

echo "Alternative: Remove the main service entirely to eliminate costs:"
echo "1. Settings → Danger Zone → Delete Service"
echo "2. (You can restore from Git later when ready)"
echo ""

read -p "Press ENTER once main service is stopped..."

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Maintenance Mode Activated${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📊 Status:"
echo "   • Main application: STOPPED (costs paused)"
echo "   • Maintenance page: ACTIVE (minimal cost)"
echo "   • Users see: Maintenance mode explanation"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Next Steps${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "1. Monitor costs in Railway Dashboard:"
echo "   https://railway.app/dashboard → Your Project → Usage"
echo ""

echo "2. Choose your path forward:"
echo ""
echo "   Option A: Upgrade Railway Plan"
echo "   • Visit: https://railway.app/pricing"
echo "   • Starter: \$20/month for more resources"
echo ""
echo "   Option B: Optimize and Resume"
echo "   • Review optimization tips in RAILWAY_DEPLOYMENT.md"
echo "   • Reduce resource usage"
echo "   • Resume main service when optimized"
echo ""
echo "   Option C: Migrate to Coolify"
echo "   • Follow: COOLIFY_MIGRATION.md"
echo "   • Self-hosted alternative"
echo "   • Better for high-usage scenarios"
echo ""

echo "3. To deactivate maintenance mode later:"
echo "   • Run: ./scripts/deactivate-maintenance-mode.sh"
echo "   • Or manually reverse the steps above"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Documentation${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📚 Related files:"
echo "   • ZERO_SECRETS_BOOTSTRAPPER.md - System overview"
echo "   • RAILWAY_DEPLOYMENT.md - Railway guide"
echo "   • COOLIFY_MIGRATION.md - Migration checklist"
echo "   • maintenance.html - The maintenance page"
echo ""

echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Cost Protection Active${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Your Railway costs should now be minimal (maintenance page only)."
echo "Plan your next steps and resume when ready."
echo ""
echo -e "${GREEN}✓ Maintenance mode activation process complete${NC}"
echo -e "${CYAN}Note: Temporary files will be cleaned up automatically${NC}"
echo ""
