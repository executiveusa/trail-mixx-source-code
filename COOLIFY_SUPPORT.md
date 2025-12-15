# Coolify Deployment Support

This document provides scaffolding and guidance for deploying AzuraCast on Coolify as an alternative to Railway.

## Overview

Coolify is a self-hosted alternative to platforms like Railway, Vercel, and Heroku. This file provides the necessary configuration stubs and deployment notes for migrating AzuraCast to Coolify when:

- Railway free tier limits are reached
- You prefer self-hosted infrastructure
- You need more control over deployment configuration
- You're using Hostinger VPN for secure access

## Status

**🚧 STUB / PLACEHOLDER**

This configuration is scaffolded but not yet fully implemented. Use this as a starting point for Coolify deployment.

## Prerequisites

- Coolify instance running (self-hosted or managed)
- Docker and Docker Compose support
- Sufficient resources for AzuraCast (minimum 2GB RAM, 20GB storage)
- Optional: Hostinger VPN for secure network access

## Coolify Configuration Stub

### Application Settings

```yaml
# Coolify Application Configuration
name: azuracast
type: docker-compose
build_pack: dockerfile
port: 8080
```

### Environment Variables

Coolify will read environment variables from its UI. Reference the `.agents` file for a complete list of required secrets.

**Required Variables:**
- `APPLICATION_ENV=production`
- `MYSQL_HOST=<coolify-provided>`
- `MYSQL_USER=azuracast`
- `MYSQL_PASSWORD=<set-in-coolify-ui>`
- `MYSQL_DATABASE=azuracast`
- `REDIS_HOST=<coolify-provided>`
- `REDIS_PORT=6379`

See `master.secrets.json.template` for complete variable list.

### Docker Compose Configuration

Coolify can use the existing `docker-compose.sample.yml` as a base. Customize as needed:

```bash
# Copy sample compose file
cp docker-compose.sample.yml docker-compose.coolify.yml

# Edit for Coolify-specific configuration
# - Remove port bindings that Coolify manages
# - Update volume mounts for Coolify's file system
# - Configure network settings
```

## Deployment Steps (Placeholder)

1. **Prepare Coolify Instance**
   ```bash
   # SSH into your Coolify server
   ssh user@your-coolify-server
   
   # Ensure Coolify is up to date
   coolify update
   ```

2. **Create Application in Coolify UI**
   - Navigate to Applications → New Application
   - Select "Docker Compose" as deployment type
   - Connect your Git repository
   - Configure build settings

3. **Set Environment Variables**
   - Go to Application → Environment Variables
   - Import from `.agents` file structure
   - Set actual secret values (refer to `master.secrets.json`)

4. **Configure Volumes (if needed)**
   - Database persistent storage
   - Media file storage
   - Configuration files

5. **Deploy**
   - Click "Deploy" in Coolify UI
   - Monitor logs for any issues
   - Verify health checks pass

## Hostinger VPN Integration

### Purpose

Use Hostinger VPN to securely access your Coolify-deployed AzuraCast instance without exposing it publicly.

### Configuration Stub

```bash
# Hostinger VPN connection (placeholder)
# 1. Install VPN client on Coolify server
# 2. Configure VPN credentials
# 3. Establish tunnel

# Example VPN configuration (customize for your setup)
VPN_SERVER=vpn.hostinger.com
VPN_PORT=1194
VPN_PROTOCOL=udp

# Once connected, AzuraCast will be accessible via private network
# Access via: http://<coolify-private-ip>:8080
```

### Network Security

- Configure Coolify firewall to only allow VPN network access
- Disable public internet access to AzuraCast ports
- Use VPN for all administrative access

## Resource Requirements

### Minimum Configuration

- **CPU:** 2 cores
- **RAM:** 2GB
- **Storage:** 20GB SSD
- **Network:** 100Mbps

### Recommended Configuration

- **CPU:** 4 cores
- **RAM:** 4GB
- **Storage:** 50GB SSD
- **Network:** 1Gbps

### Coolify Resource Limits

Configure in Coolify UI under Application → Resources:

```yaml
resources:
  limits:
    cpus: '2'
    memory: 2G
  reservations:
    cpus: '1'
    memory: 1G
```

## Migration from Railway

See `COOLIFY_MIGRATION.md` for step-by-step migration guide.

## Troubleshooting

### Common Issues

1. **Database Connection Failures**
   - Verify MySQL service is running in Coolify
   - Check network connectivity between containers
   - Validate credentials

2. **Redis Connection Issues**
   - Confirm Redis service is deployed
   - Check `ENABLE_REDIS` environment variable
   - Verify port configuration

3. **Storage/Volume Issues**
   - Ensure persistent volumes are mounted
   - Check file permissions
   - Verify sufficient disk space

### Logs Access

```bash
# View application logs in Coolify
coolify logs <application-id>

# Docker logs if needed
docker logs <container-name>
```

## Cost Comparison

| Platform | Monthly Cost | Control | Scalability |
|----------|-------------|---------|-------------|
| Railway Free Tier | $0 (up to $5 credit) | Low | Limited |
| Railway Paid | $5+ | Medium | Good |
| Coolify Self-Hosted | VPS cost (~$5-20) | High | Excellent |
| Coolify + Hostinger | VPS + VPN (~$10-30) | High | Excellent |

## Support and Documentation

- **Coolify Docs:** https://coolify.io/docs
- **AzuraCast Docs:** https://www.azuracast.com/docs
- **Docker Compose Reference:** https://docs.docker.com/compose/

## Next Steps

- [ ] Complete Coolify instance setup
- [ ] Configure Hostinger VPN (if applicable)
- [ ] Test deployment with sample configuration
- [ ] Migrate secrets from Railway
- [ ] Perform full deployment
- [ ] Set up monitoring and backups

## Notes

- This is a **stub configuration** for future use
- Not activated by default - requires manual setup
- Use as a fallback when Railway is not suitable
- Consider this option when free tier limits are consistently exceeded

---

**Last Updated:** 2025-12-06  
**Status:** Placeholder/Stub - Not Production Ready  
**Maintainer:** Railway Zero-Secrets Bootstrapper Agent
