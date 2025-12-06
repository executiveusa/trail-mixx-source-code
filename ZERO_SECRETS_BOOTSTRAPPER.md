# Railway Zero-Secrets Bootstrapper System

## System Overview

The **Railway Zero-Secrets Bootstrapper** is an automated deployment orchestration system that enables **any repository** to be deployed on Railway (or alternative platforms) with:

✅ **Zero secrets committed to Git**  
✅ **Cost protection guardrails**  
✅ **Automated maintenance mode**  
✅ **Multi-platform migration support**  
✅ **Machine-readable secret specifications**  

This repository has been enhanced with the Zero-Secrets Bootstrapper system.

---

## What Has Been Added

### 1. `.agents` File - Machine-Readable Secrets Specification

**Location:** `/.agents`

This JSON file contains a comprehensive, structured specification of all secrets and configuration variables required by AzuraCast.

**Key Features:**
- Categorized secrets (database, cache, application, performance, etc.)
- Default values and formats for each variable
- Security level classification
- Required vs. optional designation
- Railway-specific deployment configuration
- Cost guardrail specifications

**Usage:**
- Reference when setting up Railway deployment
- Input for automated secret-provisioning agents
- Documentation for all environment variables

**Example Structure:**
```json
{
  "project": "AzuraCast",
  "core_secrets": [...],
  "infrastructure_config": [...],
  "optional_integrations": [...],
  "railway_specific": {
    "cost_guardrails": {
      "max_memory_mb": 512,
      "max_cpu_cores": 1,
      "free_tier_compatible": true
    }
  }
}
```

---

### 2. `master.secrets.json.template` - Local Secret Management

**Location:** `/master.secrets.json.template`

Template for managing secrets across all your projects locally.

**Key Features:**
- Multi-project secret storage structure
- Placeholder values (NEVER commit with real secrets)
- Deployment instructions included
- Secret rotation policy documentation

**Setup:**
```bash
# Create your local secrets file
cp master.secrets.json.template master.secrets.json

# Edit with real values
nano master.secrets.json

# This file is in .gitignore - will NOT be committed
```

**Usage:**
- Store all project secrets in one place locally
- Reference when deploying to Railway
- Backup securely (encrypted, offline)
- Update when adding new projects

---

### 3. `railway.toml` - Railway Deployment Configuration

**Location:** `/railway.toml`

Complete Railway deployment configuration with built-in cost protection.

**Key Features:**

**Cost Guardrails:**
- Memory limit: 512MB (prevents overages)
- CPU limit: 0.5 cores (shared)
- Autoscaling: Disabled
- Free-tier compatible settings

**Performance Optimization:**
- PHP-FPM worker limits
- Database connection limits
- Reduced sync frequency
- Disabled resource-intensive features

**Environment Variables:**
- Pre-configured defaults
- Optimized for minimal resources
- Security-hardened settings

**Monitoring Markers:**
- Cost threshold annotations
- Auto-shutdown triggers (documented)
- Maintenance mode integration

---

### 4. `maintenance.html` - Automated Maintenance Mode

**Location:** `/maintenance.html`

Static HTML page deployed when cost limits are approached or exceeded.

**Key Features:**
- Beautiful, responsive design
- Auto-refresh every 5 minutes
- Cost protection explanation
- Migration guidance
- Zero resource consumption (static file)

**Activation:**
When Railway usage approaches free tier limits, this page can be deployed to replace the main application, preventing cost overruns while maintaining a web presence.

**Manual Deployment:**
```bash
# Deploy as separate Railway service
railway up --service maintenance

# Point domain to maintenance service
# Stop main application to halt costs
```

---

### 5. `COOLIFY_SUPPORT.md` - Coolify Platform Support

**Location:** `/COOLIFY_SUPPORT.md`

Comprehensive guide for deploying on Coolify (self-hosted alternative to Railway).

**Key Features:**
- Coolify configuration stubs
- Docker Compose setup guidance
- Resource requirement specifications
- Hostinger VPN integration notes
- Cost comparison analysis

**Use Cases:**
- Migration from Railway when costs exceed free tier
- Self-hosted infrastructure preference
- Enhanced security requirements (VPN)
- Full control over deployment environment

---

### 6. `COOLIFY_MIGRATION.md` - Complete Migration Checklist

**Location:** `/COOLIFY_MIGRATION.md`

Step-by-step migration guide from Railway to Coolify.

**Key Features:**
- Comprehensive pre-migration checklist
- Phased migration approach (6 phases)
- Database and file migration procedures
- DNS and SSL configuration
- Rollback plan included
- Post-migration validation
- Hostinger VPN setup guide

**When to Use:**
- Railway costs consistently exceed $5-10/month
- Need more resources (2GB+ RAM)
- Want complete infrastructure control
- Organization requires self-hosted solutions

---

### 7. `RAILWAY_DEPLOYMENT.md` - Complete Deployment Guide

**Location:** `/RAILWAY_DEPLOYMENT.md`

Comprehensive guide for deploying AzuraCast on Railway.

**Key Features:**
- Zero-secrets architecture explanation
- Quick start (UI and CLI options)
- Detailed step-by-step deployment
- Cost protection feature documentation
- Secret management best practices
- Troubleshooting guide
- Maintenance procedures

**Covers:**
- Railway CLI installation
- Project initialization
- Database setup (MySQL, Redis)
- Environment variable configuration
- Domain configuration
- SSL/TLS setup
- Monitoring and maintenance

---

### 8. Updated `.gitignore` - Secret Protection

**Location:** `/.gitignore`

Enhanced to prevent committing sensitive files.

**Added Patterns:**
```
# Railway Zero-Secrets Bootstrapper
master.secrets.json
*.secrets.json
secrets.local.json
.railway
railway.json
.env.local
.env.*.local
```

**Protection:**
- Prevents accidental secret commits
- Excludes Railway CLI configuration
- Protects local development overrides

---

## System Architecture

### Secret Management Flow

```
┌──────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                            │
├──────────────────────────────────────────────────────────┤
│  1. Developer reads .agents file                         │
│  2. Copies master.secrets.json.template                  │
│  3. Fills in real values locally                         │
│  4. File stays on local machine (gitignored)             │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│                    DEPLOYMENT                             │
├──────────────────────────────────────────────────────────┤
│  1. Railway CLI or UI used to set variables              │
│  2. Secrets stored in Railway's secure vault             │
│  3. Never passed through Git                             │
│  4. Encrypted at rest, in transit                        │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│                    RUNTIME                                │
├──────────────────────────────────────────────────────────┤
│  1. App reads environment variables                       │
│  2. Railway injects secrets securely                      │
│  3. No secrets in code or logs                           │
│  4. Cost guardrails enforce limits                       │
└──────────────────────────────────────────────────────────┘
```

### Cost Protection Flow

```
┌──────────────────────────────────────────────────────────┐
│            NORMAL OPERATION                               │
│  • Application running on Railway                         │
│  • Within free tier limits ($5/month)                    │
│  • Cost guardrails enforce 512MB RAM, 0.5 CPU            │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│            APPROACHING LIMITS                             │
│  • Usage reaches 80% of free tier                        │
│  • Manual monitoring recommended (weekly checks)          │
│  • Consider optimization or migration                     │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│            MAINTENANCE MODE TRIGGER                       │
│  • Free tier limit exceeded or approaching               │
│  • Admin manually activates maintenance mode             │
│  • maintenance.html deployed as static service           │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│            MAINTENANCE MODE ACTIVE                        │
│  • Main application suspended (costs stop)               │
│  • Maintenance page served (minimal cost)                │
│  • User sees explanation and migration options           │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│            RESOLUTION                                     │
│  Option A: Upgrade Railway plan                          │
│  Option B: Optimize application                          │
│  Option C: Migrate to Coolify (see COOLIFY_MIGRATION.md)│
└──────────────────────────────────────────────────────────┘
```

---

## Quick Start Guide

### 1. Understand Your Secrets

```bash
# Review the .agents file
cat .agents | jq .

# Identify required secrets
cat .agents | jq '.core_secrets'
```

### 2. Set Up Local Secret Management

```bash
# Copy template
cp master.secrets.json.template master.secrets.json

# Edit with your editor
code master.secrets.json

# Fill in real values (this file is gitignored)
```

### 3. Deploy to Railway

**Option A: Railway UI**
1. Visit https://railway.app
2. Create new project from GitHub repo
3. Railway will prompt for required variables
4. Use `.agents` file as reference
5. Click Deploy

**Option B: Railway CLI**
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add services
railway add mysql
railway add redis

# Set variables (reference .agents file)
railway variables set APPLICATION_ENV=production
# ... (see RAILWAY_DEPLOYMENT.md for complete list)

# Deploy
railway up

# Get URL
railway open
```

### 4. Monitor Costs

```bash
# Check usage regularly
railway usage

# Visit dashboard for detailed metrics
# Project → Settings → Usage
```

### 5. Plan for Growth

When approaching limits:
1. Review `COOLIFY_MIGRATION.md`
2. Consider Railway paid tier
3. Optimize resource usage
4. Activate maintenance mode if needed

---

## Cost Protection Features

### Built-in Guardrails

1. **Memory Limit: 512MB**
   - Hard limit in `railway.toml`
   - Prevents memory-based overages
   - Application crashes before runaway costs

2. **CPU Limit: 0.5 Cores**
   - Shared CPU allocation
   - Reduces compute costs
   - Sufficient for small-medium traffic

3. **No Autoscaling**
   - Prevents automatic scale-up
   - Predictable costs
   - Manual control required

4. **Optimized Configuration**
   - Reduced PHP-FPM workers (3 instead of 5)
   - Lower database connections (50 instead of 100)
   - Increased sync delays
   - Disabled profiling and debugging

### Free Tier Breakdown

**Railway Free Tier:**
- $5/month credit
- ~500 GB-hours of compute
- 100GB bandwidth
- 1GB database storage

**Cost Formula:**
```
Cost = (GB-RAM × Hours × $0.02) + (Bandwidth/GB × Rate)

Example with 512MB RAM:
= (0.5 GB × 720 hours × $0.02) = $7.20/month
With optimizations: ~$4-6/month (within free tier)
```

### Monitoring Strategy

**Weekly:**
```bash
railway usage
```

**Check for:**
- Memory usage trends
- CPU utilization
- Bandwidth consumption
- Database growth

**Thresholds:**
- **Green**: < 60% of free tier
- **Yellow**: 60-80% of free tier (optimize)
- **Red**: > 80% of free tier (consider migration)

---

## Migration Paths

### When to Migrate

**Upgrade Railway Plan:**
- Consistent usage < $20/month
- Prefer managed infrastructure
- Need quick scaling
- Want zero DevOps overhead

**Migrate to Coolify:**
- Consistent usage > $20/month
- Have VPS or dedicated server
- Want complete control
- Need custom configurations
- Prefer self-hosted solutions

**Cost Comparison:**

| Scenario | Railway | Coolify |
|----------|---------|---------|
| Small (512MB) | $5-7/month | $5/month VPS |
| Medium (2GB) | $20-30/month | $10/month VPS |
| Large (4GB+) | $50+/month | $20/month VPS |

### Migration Process

See `COOLIFY_MIGRATION.md` for complete guide:

1. **Preparation** (30-45 min)
   - Set up Coolify instance
   - Configure services
   - Set environment variables

2. **Data Migration** (30-60 min)
   - Export database from Railway
   - Transfer to Coolify
   - Migrate files

3. **Deployment** (15-30 min)
   - Deploy on Coolify
   - Verify functionality

4. **Cutover** (10-20 min)
   - Update DNS
   - Decommission Railway

---

## Maintenance Mode

### Purpose

Maintenance mode provides a cost-protective safety net:
- Prevents unexpected charges
- Maintains web presence
- Explains situation to users
- Provides migration guidance

### Activation

**Automatic Trigger (Manual Implementation):**
When approaching free tier limits, manually activate:

```bash
# 1. Deploy maintenance page
railway up --service maintenance

# 2. Update domain to point to maintenance service
# (Do in Railway dashboard)

# 3. Stop main application
railway down --service web
```

**Manual Activation:**
```bash
# Create maintenance service
railway service create maintenance

# Deploy maintenance.html
railway up --service maintenance

# Configure domain
railway domain add yourdomain.com --service maintenance
```

### The Maintenance Page

- Static HTML (zero compute cost)
- Responsive design
- Auto-refreshes every 5 minutes
- Explains cost protection activation
- Provides next steps
- Links to migration guide

### Deactivation

When ready to resume:

```bash
# Start main application
railway up --service web

# Point domain back to main app
railway domain add yourdomain.com --service web

# Stop maintenance service
railway down --service maintenance
```

---

## Multi-Platform Support

### Supported Platforms

1. **Railway** (Primary)
   - Managed PaaS
   - Free tier available
   - Configuration: `railway.toml`

2. **Coolify** (Backup)
   - Self-hosted PaaS
   - Docker-based
   - Configuration: `COOLIFY_SUPPORT.md`

3. **Hostinger VPN** (Optional)
   - Secure access layer
   - Private networking
   - Integration: `COOLIFY_MIGRATION.md`

### Platform Comparison

| Feature | Railway | Coolify | Coolify+VPN |
|---------|---------|---------|-------------|
| Setup Time | 10 min | 60 min | 90 min |
| Cost | $0-50/mo | $5-20/mo | $10-30/mo |
| Control | Low | High | High |
| Security | Good | Good | Excellent |
| Scaling | Auto | Manual | Manual |
| DevOps | None | Some | Some |

---

## Agent Instructions

### For Automated Agents

The `.agents` file provides machine-readable specifications for automated secret provisioning:

```json
{
  "agent_instructions": {
    "purpose": "Machine-readable secret specification",
    "usage": "Read this file to understand required secrets",
    "security_notes": [
      "Never commit actual secrets",
      "Use Railway's secret management",
      "Rotate passwords regularly"
    ]
  }
}
```

### Integration Points

1. **CI/CD Pipelines**
   - Read `.agents` for required variables
   - Validate all secrets are set
   - Deploy using `railway.toml`

2. **Secret Provisioning Agents**
   - Parse `.agents` file
   - Prompt user for missing secrets
   - Set variables via Railway CLI

3. **Monitoring Agents**
   - Track resource usage
   - Compare against guardrails
   - Alert when approaching limits

---

## Best Practices

### Secret Management

✅ **DO:**
- Use Railway's variables feature
- Store `master.secrets.json` locally only
- Rotate passwords every 90 days
- Use strong, unique passwords
- Backup secrets encrypted offline

❌ **DON'T:**
- Commit secrets to Git
- Share secrets via email/chat
- Use the same password across projects
- Store secrets in plain text online
- Ignore the `.agents` file

### Cost Management

✅ **DO:**
- Check usage weekly
- Optimize before scaling
- Plan for growth
- Consider migration early
- Use maintenance mode proactively

❌ **DON'T:**
- Ignore usage warnings
- Enable autoscaling blindly
- Deploy without resource limits
- Forget to monitor costs
- Wait until overages occur

### Deployment

✅ **DO:**
- Follow `RAILWAY_DEPLOYMENT.md`
- Test in staging first
- Verify all services running
- Monitor logs after deploy
- Document custom changes

❌ **DON'T:**
- Deploy without testing
- Skip environment variables
- Ignore build failures
- Deploy on Friday afternoon
- Forget to configure backups

---

## Troubleshooting

### Common Issues

**1. Missing Environment Variables**
```bash
# List all current variables
railway variables

# Compare with .agents file
cat .agents | jq '.core_secrets[].name'

# Set missing variables
railway variables set VARIABLE_NAME=value
```

**2. Application Won't Start**
```bash
# Check logs
railway logs --follow

# Verify services
railway status

# Restart
railway restart
```

**3. Approaching Cost Limits**
```bash
# Check usage
railway usage

# Optimize settings
railway variables set PHP_FPM_MAX_CHILDREN=2
railway variables set NOW_PLAYING_DELAY_TIME=10

# Or activate maintenance mode
# See Maintenance Mode section above
```

**4. Database Connection Issues**
```bash
# Verify MySQL service
railway service list

# Check connection variables
railway variables get MYSQL_HOST
railway variables get MYSQL_PASSWORD

# Restart MySQL
railway restart --service mysql
```

---

## Support and Resources

### Documentation

- **This System**: Read this file
- **Railway Deployment**: `RAILWAY_DEPLOYMENT.md`
- **Coolify Migration**: `COOLIFY_MIGRATION.md`
- **Coolify Support**: `COOLIFY_SUPPORT.md`
- **Secret Spec**: `.agents`

### External Resources

- **Railway Docs**: https://docs.railway.app
- **AzuraCast Docs**: https://www.azuracast.com/docs
- **Coolify Docs**: https://coolify.io/docs

### Community

- **AzuraCast Discord**: https://discord.gg/azuracast
- **Railway Discord**: https://discord.gg/railway

### Getting Help

1. Check documentation first
2. Search existing issues
3. Review logs: `railway logs`
4. Ask in community Discord
5. Open issue with details

---

## Version History

**v1.0.0** (2025-12-06)
- Initial implementation
- `.agents` file created
- `master.secrets.json.template` added
- `railway.toml` with cost guardrails
- `maintenance.html` page
- Complete documentation set
- Migration guides included

---

## Conclusion

The Railway Zero-Secrets Bootstrapper transforms any repository into a deployment-ready project with:

✅ Secure secret management  
✅ Cost protection built-in  
✅ Clear migration paths  
✅ Comprehensive documentation  
✅ Multi-platform support  

**Next Steps:**
1. Review `.agents` file
2. Create `master.secrets.json`
3. Deploy to Railway (see `RAILWAY_DEPLOYMENT.md`)
4. Monitor costs regularly
5. Plan for growth (see `COOLIFY_MIGRATION.md` when needed)

---

**System Version**: 1.0.0  
**Last Updated**: 2025-12-06  
**Status**: Production Ready  
**Maintainer**: Railway Zero-Secrets Bootstrapper Agent
