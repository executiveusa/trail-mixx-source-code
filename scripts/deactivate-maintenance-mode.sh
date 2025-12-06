#!/bin/bash
#
# Deactivate Maintenance Mode Script
# Part of the Railway Zero-Secrets Bootstrapper system
#
# This script guides you through resuming normal operations after maintenance mode.
#
# Usage: ./scripts/deactivate-maintenance-mode.sh
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
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Deactivate Maintenance Mode - Resume Operations        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
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
echo -e "${YELLOW}⚠️  You are about to resume normal operations${NC}"
echo ""
echo "This action will:"
echo "  • Restart the main application service"
echo "  • Remove the maintenance page"
echo "  • Resume normal resource usage and costs"
echo ""

read -p "Have you resolved the cost issues? (yes/no): " resolved

if [ "$resolved" != "yes" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Please address cost issues before resuming${NC}"
    echo ""
    echo "Options to reduce costs:"
    echo "  1. Upgrade Railway plan: https://railway.app/pricing"
    echo "  2. Optimize resource usage (see RAILWAY_DEPLOYMENT.md)"
    echo "  3. Migrate to Coolify (see COOLIFY_MIGRATION.md)"
    echo ""
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Pre-Resume Checklist${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Before resuming, ensure:"
echo ""
echo "✓ Cost management plan in place:"
echo "  • Upgraded to paid Railway plan, OR"
echo "  • Optimized application settings, OR"
echo "  • Planning to migrate to Coolify"
echo ""
echo "✓ Current usage reviewed:"
echo "  • Check Railway dashboard for current month usage"
echo "  • Verify free tier limit not immediately exceeded"
echo ""
echo "✓ Optimizations applied (if staying on free tier):"
echo "  • Resource limits configured"
echo "  • Unnecessary features disabled"
echo "  • Performance settings optimized"
echo ""

read -p "Confirm all items above are addressed (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo ""
    echo -e "${BLUE}ℹ Resume cancelled${NC}"
    echo "Please address the checklist items first."
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Verify/Apply Optimizations${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "If staying on Railway free tier, apply these optimizations:"
echo ""
echo "# Reduce resource usage"
echo "railway variables set PHP_FPM_MAX_CHILDREN=2"
echo "railway variables set NOW_PLAYING_DELAY_TIME=10"
echo "railway variables set SYNC_LONG_EXECUTION_TIME=600"
echo ""
echo "# Database optimization"
echo "railway variables set MYSQL_MAX_CONNECTIONS=30"
echo "railway variables set MYSQL_INNODB_BUFFER_POOL_SIZE=64M"
echo ""
echo "# Disable non-essential features"
echo "railway variables set PROFILING_EXTENSION_ENABLED=0"
echo ""

read -p "Press ENTER when optimizations are applied (or skip if upgraded plan)..."

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Resume Main Application${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Resuming main application service..."
echo ""
echo "⚠️  Manual steps required:"
echo ""
echo "1. Go to Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "2. Navigate to your main AzuraCast service"
echo ""
echo "3. If service is paused:"
echo "   • Settings → Deploys → Resume Deployments"
echo ""
echo "4. If service was deleted:"
echo "   • Create new service from Git repository"
echo "   • Configure environment variables (use .agents file)"
echo "   • Deploy"
echo ""
echo "5. Wait for deployment to complete"
echo ""
echo "6. Verify service is running:"
echo "   • Check logs for errors"
echo "   • Access the application URL"
echo "   • Test core functionality"
echo ""

read -p "Press ENTER once main service is running and verified..."

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3: Update Domain Configuration${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Updating domain to point back to main application..."
echo ""
echo "⚠️  Manual domain update required:"
echo ""
echo "If you have a custom domain:"
echo ""
echo "1. In Railway Dashboard, go to the MAINTENANCE service"
echo "2. Click on your custom domain"
echo "3. Click 'Remove Domain'"
echo ""
echo "4. Go to the MAIN service"
echo "5. Click 'Add Domain'"
echo "6. Add your custom domain back"
echo ""
echo "7. Wait for DNS propagation (may take 1-5 minutes)"
echo ""

echo "If using Railway-provided domain:"
echo "1. Use the main service URL again"
echo "2. Stop sharing the maintenance service URL"
echo ""

read -p "Press ENTER once domain is updated..."

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 4: Remove Maintenance Service${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Cleaning up maintenance service..."
echo ""
echo "⚠️  Manual cleanup:"
echo ""
echo "1. In Railway Dashboard, go to the maintenance service"
echo ""
echo "2. Settings → Danger Zone → Delete Service"
echo ""
echo "3. Confirm deletion"
echo ""
echo "This removes the maintenance page and eliminates its minimal cost."
echo ""

read -p "Press ENTER once maintenance service is removed..."

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 5: Verification${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Verifying application status..."
echo ""

echo "Please verify:"
echo ""
echo "✓ Application accessible at your domain"
echo "✓ Can log in successfully"
echo "✓ Radio stations functioning"
echo "✓ Media playback working"
echo "✓ No critical errors in logs"
echo "✓ Database connection stable"
echo ""

read -p "Confirm all verifications pass (yes/no): " verified

if [ "$verified" != "yes" ]; then
    echo ""
    echo -e "${RED}⚠️  Verification failed${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo ""
    echo "1. Check Railway logs:"
    echo "   railway logs --follow"
    echo ""
    echo "2. Verify environment variables:"
    echo "   railway variables"
    echo ""
    echo "3. Check service status:"
    echo "   railway status"
    echo ""
    echo "4. Review RAILWAY_DEPLOYMENT.md troubleshooting section"
    echo ""
    echo "If issues persist, you may need to re-activate maintenance mode."
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Maintenance Mode Deactivated${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📊 Status:"
echo "   • Main application: RUNNING"
echo "   • Maintenance page: REMOVED"
echo "   • Normal operations: RESUMED"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Ongoing Monitoring${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "⚠️  IMPORTANT: Monitor costs regularly"
echo ""
echo "1. Run weekly cost checks:"
echo "   ./scripts/railway-cost-monitor.sh"
echo ""
echo "2. Set up monitoring reminders:"
echo "   # Add to crontab for weekly Monday morning checks"
echo "   0 9 * * 1 cd /path/to/project && ./scripts/railway-cost-monitor.sh"
echo ""
echo "3. Watch for warning signs:"
echo "   • Usage approaching 80% of limit"
echo "   • Unexpected traffic spikes"
echo "   • Resource usage increases"
echo ""
echo "4. Have a plan ready:"
echo "   • Keep COOLIFY_MIGRATION.md handy"
echo "   • Consider paid plan upgrade path"
echo "   • Know your cost triggers"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Best Practices${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📋 Recommended practices to avoid future issues:"
echo ""
echo "1. Cost Management:"
echo "   • Check Railway dashboard weekly"
echo "   • Set up budget alerts if using paid plan"
echo "   • Document your cost baseline"
echo ""
echo "2. Performance Monitoring:"
echo "   • Monitor resource usage trends"
echo "   • Optimize inefficient queries"
echo "   • Review logs for issues"
echo ""
echo "3. Proactive Planning:"
echo "   • Plan for growth"
echo "   • Budget for scaling needs"
echo "   • Consider migration thresholds"
echo ""
echo "4. Documentation:"
echo "   • Keep deployment docs updated"
echo "   • Document optimizations applied"
echo "   • Note cost-saving measures"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Resources${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📚 Documentation:"
echo "   • Cost monitoring: ./scripts/railway-cost-monitor.sh"
echo "   • Railway guide: RAILWAY_DEPLOYMENT.md"
echo "   • System overview: ZERO_SECRETS_BOOTSTRAPPER.md"
echo "   • Migration guide: COOLIFY_MIGRATION.md"
echo ""

echo "🌐 External Resources:"
echo "   • Railway Dashboard: https://railway.app/dashboard"
echo "   • Railway Pricing: https://railway.app/pricing"
echo "   • AzuraCast Docs: https://www.azuracast.com/docs"
echo ""

echo -e "${GREEN}✓ Resume process complete${NC}"
echo ""
echo "Your application is now operational."
echo "Remember to monitor costs regularly!"
echo ""
