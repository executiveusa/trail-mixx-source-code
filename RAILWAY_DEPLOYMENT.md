# Railway Zero-Secrets Deployment Guide for AzuraCast

This guide provides comprehensive instructions for deploying AzuraCast on Railway using the Zero-Secrets Bootstrapper approach with cost-protection guardrails.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Understanding the Zero-Secrets Architecture](#understanding-the-zero-secrets-architecture)
4. [Quick Start](#quick-start)
5. [Detailed Deployment Steps](#detailed-deployment-steps)
6. [Cost Protection Features](#cost-protection-features)
7. [Secret Management](#secret-management)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## Overview

This repository has been configured with the **Railway Zero-Secrets Bootstrapper** system, which provides:

- ✅ **Zero-secrets initialization**: Deploy without committing secrets to Git
- ✅ **Cost protection**: Automatic guardrails to stay within free tier limits
- ✅ **Maintenance mode**: Auto-deploy static page when limits exceeded
- ✅ **Multi-platform ready**: Migration paths to Coolify/Hostinger
- ✅ **Machine-readable secrets**: `.agents` file for automated provisioning
- ✅ **Local secret management**: Template for managing secrets across projects

### What This Means For You

1. **First deploy will work** - All external integrations are disabled/stubbed by default
2. **Costs are controlled** - Resource limits prevent unexpected charges
3. **Secrets are documented** - The `.agents` file lists everything you need
4. **Migration is planned** - Coolify migration guide ready when needed

---

## Prerequisites

### Required

- Railway account (free tier is sufficient to start)
- Git repository access
- Basic understanding of environment variables
- Terminal access for Railway CLI (optional but recommended)

### Optional

- Custom domain (can be added later)
- Coolify instance (for future migration)
- Hostinger VPN access (for enhanced security)

### System Requirements

Railway will provide:
- **CPU**: 0.5 cores (shared)
- **Memory**: 512MB
- **Storage**: 1GB (included with database plugins)
- **Bandwidth**: 100GB/month (free tier)

### Important Note: Docker-Based Application

AzuraCast is designed to run via Docker with multiple services (web server, PHP-FPM, workers, etc.). Railway's single-process model may require adaptation:

1. **For Production**: Consider using Railway's Docker support with the existing Dockerfile
2. **For Testing**: The `railway.toml` provides a simplified configuration
3. **Alternative**: Deploy individual services separately on Railway
4. **Recommended**: For full functionality, use Coolify (see `COOLIFY_MIGRATION.md`) which has better Docker Compose support

---

## Understanding the Zero-Secrets Architecture

### Key Files

1. **`.agents`** - Machine-readable secrets specification
   - Lists all required environment variables
   - Provides default values and formats
   - Groups secrets by category
   - Used by automated secret-provisioning agents

2. **`master.secrets.json.template`** - Local secrets management
   - Template for storing secrets locally
   - **Never commit the actual `master.secrets.json` file**
   - Provides structure for multi-project secret management

3. **`railway.toml`** - Railway deployment configuration
   - Cost protection guardrails
   - Resource limits (512MB RAM, 0.5 CPU cores)
   - Environment variable defaults
   - Build and deploy commands

4. **`maintenance.html`** - Maintenance mode page
   - Deployed when cost limits are approached
   - Static HTML page (no resource usage)
   - Auto-refresh every 5 minutes

5. **`COOLIFY_MIGRATION.md`** - Migration checklist
   - Step-by-step guide for moving to Coolify
   - Triggered when Railway costs exceed free tier

### Secret Management Flow

```
┌─────────────────┐
│  .agents file   │ ← Machine-readable secret spec
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ master.secrets  │ ← Local storage (NOT committed)
│  .json.template │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Railway UI/CLI │ ← Actual secrets set here
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Deployed App   │ ← Secrets available as env vars
└─────────────────┘
```

---

## Quick Start

### Option 1: Deploy via Railway UI (Easiest)

1. **Click "Deploy on Railway"**
   ```
   https://railway.app/new/template?template=<your-repo>
   ```

2. **Railway will prompt for required variables:**
   - MySQL credentials (auto-generated)
   - Redis credentials (auto-generated)
   - Application environment settings

3. **Click "Deploy"** - First deployment starts automatically

4. **Get your URL** - Railway provides a public URL automatically

### Option 2: Deploy via Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to existing project (or create new)
railway link

# Add MySQL plugin
railway add mysql

# Add Redis plugin (optional)
railway add redis

# Set environment variables from .agents file
railway variables set APPLICATION_ENV=production
railway variables set SHOW_DETAILED_ERRORS=false
# ... (see detailed steps below for complete list)

# Deploy
railway up

# Get deployment URL
railway domain
```

---

## Detailed Deployment Steps

### Step 1: Prepare Local Environment

```bash
# Clone repository
git clone <your-repo-url>
cd trail-mixx-source-code

# Create local secrets file (DO NOT COMMIT)
cp master.secrets.json.template master.secrets.json

# Edit master.secrets.json with your preferred editor
# Replace PLACEHOLDER values with real secrets
nano master.secrets.json
```

### Step 2: Install Railway CLI

```bash
# Install
npm install -g @railway/cli

# Or use Homebrew on macOS
brew install railway

# Verify installation
railway --version

# Login
railway login
```

### Step 3: Create Railway Project

```bash
# Initialize in current directory
railway init

# You'll be prompted to:
# - Create new project or link existing
# - Choose a name for your project
# - Select team (if applicable)
```

### Step 4: Add Database Services

```bash
# Add MySQL (required)
railway add mysql

# This creates a MySQL instance and sets:
# - MYSQL_URL
# - MYSQL_HOST
# - MYSQL_PORT
# - MYSQL_USER
# - MYSQL_PASSWORD
# - MYSQL_DATABASE

# Add Redis (optional, improves performance)
railway add redis

# This creates Redis instance and sets:
# - REDIS_URL
# - REDIS_HOST
# - REDIS_PORT
```

### Step 5: Configure Environment Variables

Reference the `.agents` file for all required variables. Set them using Railway CLI:

```bash
# Core Application Settings
railway variables set APPLICATION_ENV=production
railway variables set SHOW_DETAILED_ERRORS=false
railway variables set COMPOSER_PLUGIN_MODE=false

# Database (if not auto-set by plugin)
# Usually MySQL plugin sets these automatically
# railway variables set MYSQL_PASSWORD=<secure-password>

# Cache Settings
railway variables set ENABLE_REDIS=true
# Redis plugin usually sets REDIS_HOST automatically

# Performance Tuning (optimized for 512MB RAM)
railway variables set PHP_MEMORY_LIMIT=128M
railway variables set PHP_MAX_EXECUTION_TIME=30
railway variables set PHP_MAX_FILE_SIZE=25M
railway variables set PHP_FPM_MAX_CHILDREN=3

# Station Configuration
railway variables set AUTO_ASSIGN_PORT_MIN=8000
railway variables set AUTO_ASSIGN_PORT_MAX=8099

# Logging
railway variables set LOG_LEVEL=notice

# Database Optimization (for low-resource environment)
railway variables set MYSQL_MAX_CONNECTIONS=50
railway variables set MYSQL_INNODB_BUFFER_POOL_SIZE=64M

# Sync Optimization
railway variables set NOW_PLAYING_DELAY_TIME=5
railway variables set NOW_PLAYING_MAX_CONCURRENT_PROCESSES=2

# Disable resource-intensive features
railway variables set PROFILING_EXTENSION_ENABLED=0
railway variables set MYSQL_SLOW_QUERY_LOG=0
```

### Step 6: Deploy Application

```bash
# Deploy to Railway
railway up

# Monitor deployment
railway logs

# The deployment process will:
# 1. Build the application (npm run build)
# 2. Start PHP-FPM
# 3. Run database migrations
# 4. Initialize services
```

### Step 7: Configure Domain (Optional)

```bash
# Railway provides a default domain
railway domain

# Add custom domain
railway domain add yourdomain.com

# Configure DNS:
# Add CNAME record: yourdomain.com → <railway-provided-domain>
```

### Step 8: Verify Deployment

```bash
# Get deployment URL
railway open

# Check logs for errors
railway logs --follow

# Verify services
railway status
```

Visit your deployment URL and verify:
- ✅ Application loads without errors
- ✅ Can access login page
- ✅ Database connection working
- ✅ No critical errors in logs

---

## Cost Protection Features

### Automatic Guardrails

The `railway.toml` file enforces:

- **Memory Limit**: 512MB (prevents memory overages)
- **CPU Limit**: 0.5 cores (reduces compute costs)
- **No Autoscaling**: Prevents unexpected scaling costs
- **Optimized Settings**: All performance variables tuned for minimal resources

### Monitoring Usage

```bash
# Check current usage
railway usage

# View in dashboard
# Navigate to: Project → Settings → Usage
```

### Free Tier Limits

Railway free tier includes:
- **$5/month** execution time credit
- **100GB** bandwidth
- **1GB** storage per database
- Unlimited projects

**Cost calculation:** ~$0.02 per GB-hour of compute

### When Limits Are Approached

The system is designed to:

1. **Monitor usage** (check Railway dashboard weekly)
2. **Alert at 80%** of free tier consumption (manual check recommended)
3. **Deploy maintenance page** when approaching limits
4. **Suspend main service** to prevent overages
5. **Provide migration guide** to Coolify

### Manual Maintenance Mode Activation

If you need to activate maintenance mode manually:

```bash
# 1. Deploy maintenance page as new service
railway up --service maintenance

# 2. Point domain to maintenance service
# (Do this in Railway dashboard: Settings → Domains)

# 3. Stop main application
railway down --service web

# 4. Check COOLIFY_MIGRATION.md for migration steps
```

---

## Secret Management

### Best Practices

1. **Never commit secrets to Git**
   - `master.secrets.json` is in `.gitignore`
   - Always use Railway's secret management

2. **Use Railway's Variables feature**
   - Secrets are encrypted at rest
   - Accessible only to your team
   - Can be environment-specific

3. **Rotate secrets regularly**
   - Change passwords every 90 days
   - Update API keys as needed
   - Document rotation in `master.secrets.json`

4. **Backup secrets securely**
   - Store `master.secrets.json` in password manager
   - Keep encrypted backup offline
   - Don't email or message secrets

### Viewing Current Variables

```bash
# List all variables
railway variables

# View specific variable
railway variables get MYSQL_PASSWORD

# Export all variables to .env file (for local development)
railway variables export
```

### Updating Variables

```bash
# Update single variable
railway variables set VARIABLE_NAME=new_value

# Update multiple variables
railway variables set VAR1=value1 VAR2=value2

# Delete variable
railway variables delete VARIABLE_NAME
```

### Environment-Specific Variables

```bash
# Set variable for specific environment
railway variables set --environment production VARIABLE_NAME=value

# Common environments: production, staging, development
```

---

## Troubleshooting

### Application Won't Start

**Check logs:**
```bash
railway logs --follow
```

**Common issues:**
- Missing environment variables → Check `.agents` file for required vars
- Database connection failed → Verify MySQL plugin is running
- Out of memory → Application using more than 512MB limit

**Solutions:**
```bash
# Verify MySQL service
railway service list

# Restart application
railway restart

# Check variable configuration
railway variables
```

### Database Connection Errors

**Error:** `SQLSTATE[HY000] [2002] Connection refused`

**Solutions:**
```bash
# Verify MySQL plugin is running
railway plugins

# Check MYSQL_HOST is set correctly
railway variables get MYSQL_HOST

# Restart MySQL service
railway restart --service mysql

# Check logs for MySQL
railway logs --service mysql
```

### High Resource Usage

**Monitor resource usage:**
```bash
railway usage
```

**If approaching limits:**
1. Check for inefficient queries
2. Reduce `PHP_FPM_MAX_CHILDREN`
3. Increase `NOW_PLAYING_DELAY_TIME`
4. Consider migration to Coolify

**Optimize settings:**
```bash
railway variables set PHP_FPM_MAX_CHILDREN=2
railway variables set NOW_PLAYING_DELAY_TIME=10
railway variables set SYNC_LONG_EXECUTION_TIME=600
```

### Build Failures

**Check build logs:**
```bash
railway logs --service web
```

**Common issues:**
- Node.js build failed → Check `package.json` scripts
- Composer dependencies failed → Verify PHP version compatibility
- Out of disk space → Contact Railway support

### 404 or Blank Page

**Verify deployment:**
```bash
# Check if service is running
railway status

# Verify domain configuration
railway domain

# Check environment
railway variables get APPLICATION_ENV
```

---

## Maintenance

### Regular Tasks

#### Daily
- Monitor application logs for errors
- Check uptime via Railway dashboard

#### Weekly
- Review usage metrics
- Verify backups are running
- Check for security updates

#### Monthly
- Review cost usage trends
- Rotate database passwords
- Update AzuraCast to latest version
- Review and optimize resource usage

### Updating AzuraCast

```bash
# Pull latest changes
git pull origin main

# Deploy update
railway up

# Monitor deployment
railway logs --follow

# Verify application after update
railway open
```

### Backup Strategy

**Database Backup:**
```bash
# Manual backup
railway run mysqldump -u \$MYSQL_USER -p\$MYSQL_PASSWORD \$MYSQL_DATABASE > backup.sql

# Schedule automated backups via Railway
# (Configure in Railway dashboard: Service → Settings → Backups)
```

**Configuration Backup:**
```bash
# Export environment variables
railway variables export > variables_backup.env

# Store securely offline
```

### Scaling Considerations

When you outgrow the free tier:

1. **Upgrade Railway Plan**
   - Starter: $20/month (better for steady usage)
   - Pro: $50/month (includes more resources)

2. **Migrate to Coolify**
   - See `COOLIFY_MIGRATION.md`
   - More cost-effective for high usage
   - Full control over infrastructure

3. **Optimize Further**
   - Profile application for bottlenecks
   - Cache more aggressively
   - Optimize database queries
   - Use CDN for static assets

---

## Next Steps

After successful deployment:

- [ ] Configure custom domain
- [ ] Set up SSL certificate (automatic with Railway)
- [ ] Create admin user account
- [ ] Configure first radio station
- [ ] Upload media files
- [ ] Set up streaming schedule
- [ ] Test playback on multiple devices
- [ ] Configure backup strategy
- [ ] Set up monitoring/alerting
- [ ] Document station-specific settings

### Additional Resources

- **AzuraCast Documentation**: https://www.azuracast.com/docs
- **Railway Documentation**: https://docs.railway.app
- **Cost Calculator**: https://railway.app/pricing
- **Community Support**: https://discord.gg/azuracast

### Related Files

- `.agents` - Complete secrets specification
- `master.secrets.json.template` - Local secrets template
- `railway.toml` - Deployment configuration
- `maintenance.html` - Maintenance mode page
- `COOLIFY_SUPPORT.md` - Coolify deployment guide
- `COOLIFY_MIGRATION.md` - Migration checklist

---

## Support

### Getting Help

1. **Check logs first:**
   ```bash
   railway logs --follow
   ```

2. **Review `.agents` file** for configuration requirements

3. **Search issues** in repository

4. **Ask in community:**
   - AzuraCast Discord: https://discord.gg/azuracast
   - Railway Discord: https://discord.gg/railway

### Reporting Issues

When reporting issues, include:
- Railway logs output
- Environment variable configuration (sanitize secrets!)
- Steps to reproduce
- Expected vs. actual behavior
- Railway service region

---

**Last Updated:** 2025-12-06  
**Version:** 1.0.0  
**System:** Railway Zero-Secrets Bootstrapper  
**Status:** Production Ready
