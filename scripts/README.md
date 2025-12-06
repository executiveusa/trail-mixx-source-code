# Railway Zero-Secrets Bootstrapper Scripts

This directory contains automation scripts for managing the Railway deployment with cost protection features.

## Available Scripts

### 1. `railway-cost-monitor.sh`

**Purpose:** Monitor Railway usage and provide cost alerts.

**Usage:**
```bash
./scripts/railway-cost-monitor.sh
```

**Features:**
- Checks Railway CLI connectivity
- Displays current usage information
- Provides cost threshold warnings
- Offers optimization recommendations
- Links to migration guides when needed

**When to use:**
- Run weekly to monitor costs
- Before making infrastructure changes
- When experiencing performance issues
- To check free tier usage status

**Recommended Schedule:**
```bash
# Add to crontab for weekly Monday 9 AM checks
0 9 * * 1 cd /path/to/project && ./scripts/railway-cost-monitor.sh
```

---

### 2. `activate-maintenance-mode.sh`

**Purpose:** Activate maintenance mode when cost limits are reached.

**Usage:**
```bash
./scripts/activate-maintenance-mode.sh
```

**Features:**
- Guides through maintenance mode activation
- Creates maintenance service configuration
- Provides step-by-step Railway dashboard instructions
- Helps stop main application to reduce costs
- Includes confirmation prompts for safety

**When to use:**
- Free tier limit reached or exceeded
- Need to pause application while planning migration
- Addressing critical cost overruns
- During planned maintenance with cost concerns

**What it does:**
1. Verifies Railway CLI connection
2. Creates Dockerfile for maintenance page
3. Guides through creating maintenance service
4. Helps configure domain switching
5. Assists in stopping main application
6. Provides next steps and migration options

---

### 3. `deactivate-maintenance-mode.sh`

**Purpose:** Resume normal operations after maintenance mode.

**Usage:**
```bash
./scripts/deactivate-maintenance-mode.sh
```

**Features:**
- Guides through resuming operations
- Includes pre-resume checklist
- Helps apply optimizations before restart
- Assists with domain reconfiguration
- Provides verification steps
- Sets up ongoing monitoring

**When to use:**
- After resolving cost issues
- When upgraded to paid Railway plan
- After migrating to Coolify (if temporarily active)
- After applying optimizations

**Prerequisites:**
- Cost issues resolved (upgraded plan, optimized, or ready to migrate)
- All optimizations applied if staying on free tier
- Ready to resume normal resource usage

**What it does:**
1. Verifies pre-resume checklist
2. Guides through optimization application
3. Helps restart main application
4. Assists with domain switching back
5. Removes maintenance service
6. Provides verification checklist
7. Sets up ongoing monitoring recommendations

---

## Prerequisites

All scripts require:

### Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Or using Homebrew (macOS)
brew install railway

# Verify installation
railway --version
```

### Authentication

```bash
# Login to Railway
railway login

# Link to your project
cd /path/to/project
railway link
```

### Project Setup

- Project must be deployed on Railway
- Environment variables should be configured
- Services should be running (for monitoring)

---

## Quick Reference

### Check Cost Status
```bash
./scripts/railway-cost-monitor.sh
```

### Approaching Limits?
```bash
# Review optimization tips
cat RAILWAY_DEPLOYMENT.md | grep -A 20 "Optimization"

# Apply optimizations
railway variables set PHP_FPM_MAX_CHILDREN=2
railway variables set NOW_PLAYING_DELAY_TIME=10
```

### Exceeded Limits?
```bash
# Activate maintenance mode
./scripts/activate-maintenance-mode.sh

# Review migration options
cat COOLIFY_MIGRATION.md
```

### Ready to Resume?
```bash
# Deactivate maintenance mode
./scripts/deactivate-maintenance-mode.sh

# Verify everything works
railway logs --follow
```

---

## Script Workflow

### Normal Operations
```
┌──────────────────────┐
│  Weekly Monitoring   │
│  (cost-monitor.sh)   │
└──────────┬───────────┘
           │
           ↓
    ┌──────────────┐
    │ Usage < 80%? │
    └──────┬───────┘
           │ YES: Continue normal operations
           │
           │ NO: Approaching limits
           ↓
┌──────────────────────┐
│  Apply Optimizations │
│  Review usage        │
└──────────────────────┘
```

### Cost Protection Activation
```
┌──────────────────────┐
│   Limits Exceeded    │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ Activate Maintenance │
│ (activate-maint.sh)  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ Maintenance Mode     │
│ Active (low cost)    │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Resolve Issues:     │
│  • Upgrade plan      │
│  • Optimize          │
│  • Migrate           │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Deactivate Maint    │
│ (deactivate-maint.sh)│
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Normal Operations   │
│  (with monitoring)   │
└──────────────────────┘
```

---

## Troubleshooting

### Script Won't Run

**Issue:** Permission denied
```bash
# Solution: Make executable
chmod +x scripts/*.sh
```

**Issue:** Railway CLI not found
```bash
# Solution: Install Railway CLI
npm install -g @railway/cli
```

### Railway CLI Issues

**Issue:** Not logged in
```bash
# Solution: Login
railway login
```

**Issue:** Project not linked
```bash
# Solution: Link project
cd /path/to/project
railway link
```

### Can't Find Project

**Issue:** Wrong directory
```bash
# Solution: Navigate to project root
cd /home/runner/work/trail-mixx-source-code/trail-mixx-source-code
```

---

## Best Practices

### Regular Monitoring
- Run `railway-cost-monitor.sh` weekly
- Set up cron job for automated reminders
- Review Railway dashboard regularly
- Track usage trends over time

### Proactive Management
- Don't wait for limits to be exceeded
- Apply optimizations early
- Plan migration before emergency
- Keep cost buffer (aim for < 80% usage)

### Documentation
- Document when scripts are run
- Note any manual steps taken
- Track cost trends in a spreadsheet
- Keep migration plan updated

### Safety
- Always confirm before activating maintenance
- Verify backups before major changes
- Test in staging if possible
- Keep rollback plan ready

---

## Integration with Other Files

### Related Documentation

- **`.agents`** - Environment variables reference
- **`railway.toml`** - Cost guardrails configuration
- **`maintenance.html`** - Maintenance mode page
- **`RAILWAY_DEPLOYMENT.md`** - Complete deployment guide
- **`COOLIFY_MIGRATION.md`** - Migration checklist
- **`ZERO_SECRETS_BOOTSTRAPPER.md`** - System overview

### Workflow Integration

```
Scripts (automation)
    ↓
Railway.toml (configuration)
    ↓
.agents (secrets spec)
    ↓
Documentation (guidance)
```

---

## Support

### Getting Help

1. **Check documentation first:**
   - `RAILWAY_DEPLOYMENT.md` for deployment issues
   - `ZERO_SECRETS_BOOTSTRAPPER.md` for system overview
   - `COOLIFY_MIGRATION.md` for migration questions

2. **Review logs:**
   ```bash
   railway logs --follow
   ```

3. **Check Railway status:**
   ```bash
   railway status
   railway usage
   ```

4. **Community support:**
   - AzuraCast Discord: https://discord.gg/azuracast
   - Railway Discord: https://discord.gg/railway

### Reporting Issues

When reporting script issues, include:
- Script name and version
- Railway CLI version (`railway --version`)
- Error messages
- Steps to reproduce
- Operating system

---

## Contributing

These scripts are part of the Railway Zero-Secrets Bootstrapper system. If you improve them:

1. Test thoroughly
2. Update this README
3. Document changes in commit message
4. Consider PR to main repository

---

## Version History

**v1.0.0** (2025-12-06)
- Initial script set
- Cost monitoring script
- Maintenance mode activation/deactivation
- Complete documentation

---

**Last Updated:** 2025-12-06  
**Maintainer:** Railway Zero-Secrets Bootstrapper Agent  
**Status:** Production Ready
