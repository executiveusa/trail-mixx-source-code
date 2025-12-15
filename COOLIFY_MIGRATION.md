# AzuraCast Migration Guide: Railway → Coolify

This document provides a step-by-step checklist for migrating your AzuraCast installation from Railway to Coolify when free tier limits are exceeded or self-hosted infrastructure is preferred.

## Migration Overview

**Trigger Conditions:**
- Railway free tier ($5/month) consistently exceeded
- Need for more control over infrastructure
- Cost optimization requirements
- Preference for self-hosted solutions
- Hostinger VPN integration requirements

**Estimated Time:** 2-4 hours  
**Difficulty:** Intermediate  
**Downtime:** 30-60 minutes expected

---

## Pre-Migration Checklist

### Assessment Phase

- [ ] **Verify Railway Usage**
  - Check current monthly usage in Railway dashboard
  - Document peak resource consumption
  - Identify usage patterns causing overages
  - Export billing reports for reference

- [ ] **Inventory Current Configuration**
  - [ ] List all environment variables from Railway
  - [ ] Document current database size
  - [ ] Note media storage requirements
  - [ ] Record active station configurations
  - [ ] Export custom settings and configurations

- [ ] **Prepare Coolify Environment**
  - [ ] Coolify instance is installed and accessible
  - [ ] Sufficient resources allocated (2GB+ RAM, 20GB+ storage)
  - [ ] Docker and Docker Compose functional
  - [ ] Network connectivity verified
  - [ ] SSL certificates ready (if needed)

- [ ] **Backup Everything**
  - [ ] Database backup created
  - [ ] Media files backed up
  - [ ] Configuration files exported
  - [ ] Environment variables documented
  - [ ] Backup verification completed

### Required Information Gathering

- [ ] Railway MySQL connection details
- [ ] Railway Redis connection details (if used)
- [ ] All environment variables from Railway
- [ ] Custom domain configurations
- [ ] Station streaming settings
- [ ] User accounts and permissions list

---

## Migration Steps

### Phase 1: Coolify Preparation (30-45 minutes)

- [ ] **1.1 Create New Application in Coolify**
  - [ ] Navigate to Coolify dashboard
  - [ ] Click "New Application"
  - [ ] Select "Docker Compose" deployment type
  - [ ] Name the application (e.g., "azuracast-production")
  - [ ] Connect Git repository or use existing docker-compose file

- [ ] **1.2 Configure Docker Compose**
  ```bash
  # Copy the sample compose file
  cp docker-compose.sample.yml docker-compose.coolify.yml
  ```
  - [ ] Review and customize `docker-compose.coolify.yml`
  - [ ] Remove port bindings managed by Coolify
  - [ ] Configure volume mounts for Coolify file system
  - [ ] Set up network configurations
  - [ ] Upload to Coolify or commit to repository

- [ ] **1.3 Set Up Database Service**
  - [ ] Create MySQL service in Coolify
  - [ ] Choose MySQL version (8.0+ recommended)
  - [ ] Allocate storage (start with 10GB, adjust as needed)
  - [ ] Set root password securely
  - [ ] Create `azuracast` database
  - [ ] Create `azuracast` user with appropriate permissions
  - [ ] Note connection details for environment variables

- [ ] **1.4 Set Up Redis Service (Optional)**
  - [ ] Create Redis service in Coolify
  - [ ] Choose Redis version (7.x recommended)
  - [ ] Configure persistence settings
  - [ ] Note connection details
  - [ ] Or set `ENABLE_REDIS=false` to skip

- [ ] **1.5 Configure Environment Variables**
  
  Use `.agents` file as reference for all required variables:
  
  **Database Variables:**
  - [ ] `MYSQL_HOST` = <coolify-mysql-hostname>
  - [ ] `MYSQL_PORT` = 3306
  - [ ] `MYSQL_USER` = azuracast
  - [ ] `MYSQL_PASSWORD` = <secure-password>
  - [ ] `MYSQL_DATABASE` = azuracast
  
  **Application Variables:**
  - [ ] `APPLICATION_ENV` = production
  - [ ] `SHOW_DETAILED_ERRORS` = false
  - [ ] `LOG_LEVEL` = notice
  
  **Cache Variables:**
  - [ ] `ENABLE_REDIS` = true/false
  - [ ] `REDIS_HOST` = <coolify-redis-hostname>
  - [ ] `REDIS_PORT` = 6379
  - [ ] `REDIS_DB` = 1
  
  **Performance Variables:**
  - [ ] `PHP_MEMORY_LIMIT` = 256M (increase from Railway limits)
  - [ ] `PHP_MAX_EXECUTION_TIME` = 60
  - [ ] `PHP_FPM_MAX_CHILDREN` = 10 (can increase with more resources)
  - [ ] `MYSQL_MAX_CONNECTIONS` = 100
  
  **Station Configuration:**
  - [ ] `AUTO_ASSIGN_PORT_MIN` = 8000
  - [ ] `AUTO_ASSIGN_PORT_MAX` = 8499
  
  - [ ] All other variables from `master.secrets.json`

- [ ] **1.6 Configure Storage Volumes**
  - [ ] Create persistent volume for database data
  - [ ] Create persistent volume for media files
  - [ ] Create persistent volume for backups
  - [ ] Create persistent volume for station data
  - [ ] Set correct permissions (user/group IDs)

### Phase 2: Data Migration (30-60 minutes)

- [ ] **2.1 Export Railway Database**
  ```bash
  # Using Railway CLI
  railway run mysqldump -u azuracast -p azuracast > azuracast_backup.sql
  
  # Or use Railway web interface to create backup
  ```
  - [ ] Download backup file
  - [ ] Verify backup integrity
  - [ ] Compress backup for transfer (if large)

- [ ] **2.2 Transfer Database to Coolify**
  ```bash
  # Upload to Coolify server
  scp azuracast_backup.sql user@coolify-server:/tmp/
  
  # Import into Coolify MySQL
  mysql -h <coolify-mysql-host> -u azuracast -p azuracast < azuracast_backup.sql
  ```
  - [ ] Database import completed successfully
  - [ ] Verify table count matches original
  - [ ] Check for import errors in logs

- [ ] **2.3 Migrate Media Files**
  
  If you have media files stored in Railway:
  - [ ] Download all media files from Railway
  - [ ] Upload to Coolify persistent volume
  - [ ] Verify file counts match
  - [ ] Check file permissions

- [ ] **2.4 Migrate Configuration Files**
  - [ ] Export custom configuration files from Railway
  - [ ] Upload to appropriate Coolify volumes
  - [ ] Verify all configs are in place

### Phase 3: Coolify Deployment (15-30 minutes)

- [ ] **3.1 Initial Deployment**
  - [ ] Click "Deploy" in Coolify UI
  - [ ] Monitor build logs for errors
  - [ ] Wait for deployment to complete
  - [ ] Check deployment status

- [ ] **3.2 Health Checks**
  - [ ] Application container is running
  - [ ] Database connection successful
  - [ ] Redis connection successful (if enabled)
  - [ ] Web interface accessible
  - [ ] No critical errors in logs

- [ ] **3.3 Verify Application Functionality**
  - [ ] Can access AzuraCast web interface
  - [ ] Can log in with existing credentials
  - [ ] Stations are visible and configured correctly
  - [ ] Media library is intact
  - [ ] Streaming works properly
  - [ ] Scheduled playlists function correctly

### Phase 4: DNS and Network Configuration (10-20 minutes)

- [ ] **4.1 Update DNS Records**
  - [ ] Note current DNS records for your domain
  - [ ] Update A record to point to Coolify server IP
  - [ ] Lower TTL before migration (for faster propagation)
  - [ ] Wait for DNS propagation
  - [ ] Verify DNS resolution

- [ ] **4.2 SSL/TLS Configuration**
  - [ ] Enable SSL in Coolify for your domain
  - [ ] Let's Encrypt auto-renewal configured
  - [ ] Force HTTPS redirect enabled
  - [ ] SSL certificate valid and trusted

- [ ] **4.3 Hostinger VPN Setup (Optional)**
  
  If using Hostinger VPN for secure access:
  - [ ] VPN server configured on Coolify host
  - [ ] VPN client credentials distributed to admins
  - [ ] Firewall rules restrict access to VPN network only
  - [ ] Test VPN connectivity
  - [ ] Verify application accessible via VPN

### Phase 5: Post-Migration Validation (20-30 minutes)

- [ ] **5.1 Functional Testing**
  - [ ] All pages load correctly
  - [ ] User authentication works
  - [ ] Station creation/editing functional
  - [ ] File uploads work
  - [ ] Scheduled automation runs correctly
  - [ ] Now Playing data updates
  - [ ] Listener statistics accurate
  - [ ] API endpoints respond correctly

- [ ] **5.2 Performance Testing**
  - [ ] Page load times acceptable
  - [ ] Streaming performance stable
  - [ ] No resource bottlenecks
  - [ ] Database queries performant
  - [ ] Memory usage within limits

- [ ] **5.3 Backup Verification**
  - [ ] Automated backups configured in Coolify
  - [ ] Test backup restoration process
  - [ ] Backup retention policy set
  - [ ] Off-site backup strategy implemented

- [ ] **5.4 Monitoring Setup**
  - [ ] Resource monitoring active (CPU, RAM, disk)
  - [ ] Application logging configured
  - [ ] Error alerting set up
  - [ ] Uptime monitoring enabled
  - [ ] Performance metrics tracked

### Phase 6: Railway Cleanup (10-15 minutes)

- [ ] **6.1 Verify Coolify Stability**
  - [ ] Application runs for 24 hours without issues
  - [ ] All features verified multiple times
  - [ ] Users report no problems
  - [ ] Backups successful

- [ ] **6.2 Decommission Railway Resources**
  - [ ] Stop Railway services
  - [ ] Download final Railway backups (precaution)
  - [ ] Remove Railway deployment
  - [ ] Cancel Railway subscription (if paid)
  - [ ] Keep Railway account for 30 days as safety net

---

## Rollback Plan

If migration fails or issues arise:

### Quick Rollback to Railway

- [ ] **Re-enable Railway deployment**
  ```bash
  railway up
  ```

- [ ] **Update DNS back to Railway**
  - Point A record back to Railway IP
  - Wait for propagation

- [ ] **Verify Railway functionality**
  - Check all services
  - Test core features
  - Monitor for issues

- [ ] **Diagnose Coolify issues**
  - Review error logs
  - Identify migration problems
  - Plan corrective actions
  - Attempt migration again after fixes

### Data Integrity Verification

If data seems corrupted:
- [ ] Restore from pre-migration backup
- [ ] Compare record counts
- [ ] Verify user data
- [ ] Check media file integrity

---

## Hostinger VPN Integration Guide

### Why Use Hostinger VPN?

- Enhanced security (private network access only)
- No public internet exposure
- Protection against DDoS and attacks
- Compliance with security policies

### Setup Steps

1. **On Coolify Server:**
   ```bash
   # Install OpenVPN or WireGuard
   apt-get install openvpn
   
   # Configure VPN server
   # (specific steps depend on VPN choice)
   ```

2. **Configure Hostinger VPN:**
   - Contact Hostinger support for VPN setup
   - Request VPN credentials
   - Configure VPN tunnel to Coolify server

3. **Firewall Configuration:**
   ```bash
   # Only allow VPN network access
   ufw allow from 10.8.0.0/24 to any port 8080
   ufw deny 8080
   ```

4. **Client Setup:**
   - Distribute VPN client configs to authorized users
   - Test connectivity through VPN
   - Access AzuraCast via private IP

---

## Cost Analysis

### Railway Costs (Before Migration)

- Free tier: $5/month credit
- Overage charges: ~$0.02/GB-hour
- Estimated monthly cost if exceeding: $10-50+

### Coolify Costs (After Migration)

- VPS hosting: $5-20/month (DigitalOcean, Hetzner, Linode)
- Hostinger VPN: $5-10/month (optional)
- **Total: $5-30/month** with full control

### Break-Even Analysis

Migration makes sense when:
- Railway costs consistently exceed $10/month
- You need more than 2GB RAM consistently
- You want complete control over infrastructure
- Self-hosting aligns with organizational policies

---

## Troubleshooting

### Common Migration Issues

**Database Connection Errors:**
```bash
# Check MySQL service status
docker ps | grep mysql

# Test connection
mysql -h <host> -u azuracast -p

# Check network connectivity between containers
docker network ls
docker network inspect <network-name>
```

**Media Files Not Loading:**
- Verify volume mounts are correct
- Check file permissions (www-data user)
- Ensure paths in database match new structure

**Performance Degradation:**
- Increase PHP-FPM worker count
- Allocate more RAM to containers
- Optimize MySQL configuration
- Enable Redis caching

**SSL/TLS Issues:**
- Verify domain DNS resolution
- Check Coolify SSL configuration
- Review Let's Encrypt logs
- Ensure ports 80/443 are accessible

---

## Success Criteria

Migration is successful when:

- ✅ All services running in Coolify
- ✅ Application accessible via domain
- ✅ All features functional
- ✅ Performance meets or exceeds Railway
- ✅ Data integrity verified
- ✅ Backups operational
- ✅ Monitoring active
- ✅ No critical errors for 48 hours
- ✅ Users report no issues
- ✅ Cost reduced compared to Railway overages

---

## Post-Migration Maintenance

### Daily Tasks
- [ ] Check application logs for errors
- [ ] Monitor resource usage
- [ ] Verify backups completed

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Check for software updates
- [ ] Test backup restoration
- [ ] Review security logs

### Monthly Tasks
- [ ] Update AzuraCast to latest version
- [ ] Review and rotate secrets/passwords
- [ ] Optimize database (ANALYZE, OPTIMIZE)
- [ ] Review cost vs. Railway comparison

---

## Support Resources

- **AzuraCast Community:** https://discord.gg/azuracast
- **Coolify Documentation:** https://coolify.io/docs
- **Hostinger Support:** https://www.hostinger.com/contact
- **This Repository:** Check `.agents` file and `COOLIFY_SUPPORT.md`

---

## Migration Checklist Summary

```
Pre-Migration:  [ ] Assessment [ ] Inventory [ ] Backup [ ] Coolify Prep
Phase 1:        [ ] Coolify Setup (30-45 min)
Phase 2:        [ ] Data Migration (30-60 min)
Phase 3:        [ ] Deployment (15-30 min)
Phase 4:        [ ] DNS/Network (10-20 min)
Phase 5:        [ ] Validation (20-30 min)
Phase 6:        [ ] Railway Cleanup (10-15 min)

Total Time:     2-4 hours
Status:         [  ] Not Started [  ] In Progress [  ] Complete
```

---

**Last Updated:** 2025-12-06  
**Document Version:** 1.0.0  
**Maintained By:** Railway Zero-Secrets Bootstrapper Agent  
**Status:** Active Migration Guide
