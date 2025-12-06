#!/bin/bash
#
# Railway Cost Monitor Script
# Part of the Railway Zero-Secrets Bootstrapper system
#
# This script helps monitor Railway usage and provides alerts when approaching free tier limits.
# Run this weekly to stay aware of your resource consumption.
#
# Usage: ./scripts/railway-cost-monitor.sh
#
# Requirements:
# - Railway CLI installed (npm install -g @railway/cli)
# - Logged into Railway (railway login)
# - Linked to a Railway project (railway link)

set -e

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FREE_TIER_LIMIT=5.00  # $5 USD
WARNING_THRESHOLD=4.00  # Alert at $4 (80%)
CRITICAL_THRESHOLD=4.50  # Critical at $4.50 (90%)

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Railway Zero-Secrets Bootstrapper Cost Monitor       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
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

# Get current usage (Note: railway usage command format may vary)
echo -e "${BLUE}ℹ Fetching usage data...${NC}"
echo ""

# Run railway usage and capture output with error handling
# Note: The actual output format depends on Railway CLI version
# This is a template - adjust based on actual CLI output
if railway usage 2>/dev/null; then
    echo ""
else
    echo -e "${YELLOW}⚠️  'railway usage' command not available in this CLI version${NC}"
    echo ""
    echo "Please check usage manually in Railway Dashboard:"
    echo "  https://railway.app/dashboard → Your Project → Settings → Usage"
    echo ""
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Cost Analysis${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Note: Railway CLI doesn't provide direct cost access via command line
# This section provides guidance on manual checking
echo "📊 Free Tier Limits:"
echo "   • Monthly Credit: \$$FREE_TIER_LIMIT"
echo "   • Warning Threshold: \$$WARNING_THRESHOLD (80%)"
echo "   • Critical Threshold: \$$CRITICAL_THRESHOLD (90%)"
echo ""

echo "🔍 Manual Check Required:"
echo "   1. Visit Railway Dashboard: https://railway.app/dashboard"
echo "   2. Navigate to: Your Project → Settings → Usage"
echo "   3. Check current month's usage"
echo ""

echo "⚠️  Action Required If:"
echo ""
echo -e "${YELLOW}   WARNING (80% - \$$WARNING_THRESHOLD):${NC}"
echo "   • Review resource usage patterns"
echo "   • Identify optimization opportunities"
echo "   • Consider implementing cost-saving measures"
echo "   • Review railway.toml settings"
echo ""

echo -e "${RED}   CRITICAL (90% - \$$CRITICAL_THRESHOLD):${NC}"
echo "   • IMMEDIATE action required"
echo "   • Activate maintenance mode (see below)"
echo "   • Plan migration to Coolify"
echo "   • Or upgrade Railway plan"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Optimization Recommendations${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "💡 Cost Optimization Tips:"
echo ""
echo "1. Reduce Resource Usage:"
echo "   railway variables set PHP_FPM_MAX_CHILDREN=2"
echo "   railway variables set NOW_PLAYING_DELAY_TIME=10"
echo "   railway variables set SYNC_LONG_EXECUTION_TIME=600"
echo ""

echo "2. Disable Non-Essential Features:"
echo "   railway variables set PROFILING_EXTENSION_ENABLED=0"
echo "   railway variables set MYSQL_SLOW_QUERY_LOG=0"
echo ""

echo "3. Review Database Configuration:"
echo "   railway variables set MYSQL_MAX_CONNECTIONS=30"
echo "   railway variables set MYSQL_INNODB_BUFFER_POOL_SIZE=64M"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Maintenance Mode Activation${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "🛑 If you need to activate maintenance mode:"
echo ""
echo "Step 1: Create maintenance service"
echo "   railway service create maintenance"
echo ""
echo "Step 2: Deploy maintenance page"
echo "   railway up --service maintenance"
echo ""
echo "Step 3: Point domain to maintenance service"
echo "   (Do this in Railway Dashboard: Settings → Domains)"
echo ""
echo "Step 4: Stop main application"
echo "   railway down --service web"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Migration Planning${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📋 When consistent usage exceeds free tier:"
echo ""
echo "Option A: Upgrade Railway"
echo "   • Starter: \$20/month"
echo "   • Pro: \$50/month"
echo "   • Visit: https://railway.app/pricing"
echo ""

echo "Option B: Migrate to Coolify (Self-Hosted)"
echo "   • VPS Cost: \$5-20/month"
echo "   • Complete control"
echo "   • See: COOLIFY_MIGRATION.md"
echo ""

echo "To start migration planning:"
echo "   cat COOLIFY_MIGRATION.md"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Resources${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📚 Documentation:"
echo "   • Railway Deployment: RAILWAY_DEPLOYMENT.md"
echo "   • Cost Protection: ZERO_SECRETS_BOOTSTRAPPER.md"
echo "   • Coolify Migration: COOLIFY_MIGRATION.md"
echo "   • Coolify Support: COOLIFY_SUPPORT.md"
echo "   • Secrets Reference: .agents"
echo ""

echo "🌐 External Links:"
echo "   • Railway Dashboard: https://railway.app/dashboard"
echo "   • Railway Pricing: https://railway.app/pricing"
echo "   • AzuraCast Docs: https://www.azuracast.com/docs"
echo ""

echo -e "${GREEN}✓ Cost monitoring check complete${NC}"
echo ""
echo "💡 Tip: Run this script weekly to stay informed about your usage."
echo "   Add to crontab for automatic reminders:"
echo "   0 9 * * 1 cd /path/to/project && ./scripts/railway-cost-monitor.sh"
echo ""
