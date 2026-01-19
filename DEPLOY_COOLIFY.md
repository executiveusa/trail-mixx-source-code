# 🚀 Deploy Trail Mixx Radio to Coolify + Vercel

**BEST SETUP - Total Cost: ~$5/month**

- **Backend API** → Coolify (your VPS) - $5/month includes everything
- **Frontend** → Vercel - FREE tier
- **Database** → Postgres on Coolify - included

---

## 🎯 ARCHITECTURE

```
┌─────────────────────────────────────────┐
│  Vercel (Frontend - FREE)               │
│  https://trail-mixx.vercel.app          │
└────────────────┬────────────────────────┘
                 │ API Calls
                 ▼
┌─────────────────────────────────────────┐
│  Your VPS with Coolify ($5/month)       │
│  ├─ Backend API                         │
│  ├─ PostgreSQL Database                 │
│  └─ Icecast Streaming (optional)        │
│  https://api.trailmixx.yourdomain.com   │
└─────────────────────────────────────────┘
```

---

## STEP 1: Deploy Backend to Coolify

### Prerequisites
- Coolify installed on your VPS
- Access to Coolify dashboard

### Deployment Steps

1. **Login to Coolify Dashboard**
   - Go to your Coolify URL (e.g., https://coolify.yourdomain.com)

2. **Create New Application**
   - Click "New Resource" → "Application"
   - Select "GitHub Repository"

3. **Configure Application**
   ```
   Repository: executiveusa/trail-mixx-source-code
   Branch: claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc

   Build Pack: Nixpacks
   Root Directory: /server

   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npx prisma migrate deploy && npm start
   Port: 3001
   ```

4. **Add PostgreSQL Database**
   - In Coolify, add "New Resource" → "PostgreSQL"
   - Copy the connection string
   - Coolify will auto-inject `DATABASE_URL`

5. **Set Environment Variables**
   ```bash
   JWT_SECRET=<run: openssl rand -base64 32>
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://trail-mixx.vercel.app
   STREAM_URL=http://localhost:8000/stream
   ```

6. **Deploy!**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Coolify will build and start your app

7. **Seed Database** (One-time)
   - In Coolify terminal/console for your app
   - Run: `npm run seed`

8. **Get Your Backend URL**
   - Coolify will give you a URL like: `https://trail-mixx-api-xxxxx.your-server.com`
   - Or set up custom domain: `https://api.trailmixx.com`

---

## STEP 2: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com/new

2. **Import Repository**
   ```
   Repository: executiveusa/trail-mixx-source-code
   Branch: claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc
   ```

3. **Configure Build**
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=<YOUR_COOLIFY_BACKEND_URL>
   NEXT_PUBLIC_STREAM_URL=<YOUR_ICECAST_URL_OR_LEAVE_AS_LOCALHOST>
   ```
   **Example:**
   ```
   NEXT_PUBLIC_API_URL=https://trail-mixx-api.yourdomain.com
   NEXT_PUBLIC_STREAM_URL=http://localhost:8000/stream
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL: `https://trail-mixx-radio.vercel.app`

---

### Option B: Using Vercel CLI (What I'll do now)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel --prod

# Set environment variables during deployment
# It will prompt you for:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_STREAM_URL
```

---

## 📋 COOLIFY CONFIGURATION FILES

I've created these files for easier Coolify deployment:

### `docker-compose.coolify.yml`
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: docker/backend/Dockerfile
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 3001
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "3001:3001"
    restart: unless-stopped
```

### Coolify will handle:
- ✅ Building your Docker image
- ✅ Running migrations automatically
- ✅ Setting up PostgreSQL
- ✅ SSL certificates (Let's Encrypt)
- ✅ Auto-restart on failure
- ✅ Easy updates via Git push

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test Backend (Coolify)
```bash
# Replace YOUR_COOLIFY_URL

curl https://YOUR_COOLIFY_URL/health
curl https://YOUR_COOLIFY_URL/api/tracks
curl https://YOUR_COOLIFY_URL/api/radio/now-playing

# Login
curl -X POST https://YOUR_COOLIFY_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@trailmixx.radio","password":"password123"}'
```

### Test Frontend (Vercel)
- Visit your Vercel URL
- Check homepage loads
- Check "Discover" page fetches tracks from your Coolify API
- Check radio player UI

---

## 💰 COST BREAKDOWN

**Your Setup:**
- Coolify VPS: **$5/month** (includes backend, database, and streaming)
- Vercel Frontend: **$0/month** (free hobby tier)
- **Total: $5/month** 🎉

**vs Railway:**
- Railway: $20+/month
- **Savings: $15/month = $180/year**

---

## 🔧 COOLIFY ADVANTAGES

✅ **One-time $5/month** for everything
✅ **Full control** - it's your server
✅ **No vendor lock-in** - can move anytime
✅ **Built-in SSL** - automatic Let's Encrypt
✅ **Easy updates** - Git push to deploy
✅ **PostgreSQL included** - no extra cost
✅ **Docker-based** - same as production
✅ **Resource monitoring** - CPU, RAM, disk
✅ **Backup tools** - built-in database backups

---

## 🔄 UPDATING YOUR APP

### Update Backend (Coolify):
1. Push code to GitHub
2. In Coolify, click "Redeploy"
3. Done! Coolify pulls latest code and rebuilds

### Update Frontend (Vercel):
1. Push code to GitHub
2. Vercel auto-deploys
3. Done! Live in 2-3 minutes

---

## 🌐 CUSTOM DOMAINS (Optional)

### For Coolify Backend:
1. In Coolify, add domain: `api.trailmixx.com`
2. Point DNS A record to your VPS IP
3. Coolify auto-generates SSL certificate

### For Vercel Frontend:
1. In Vercel settings, add domain: `trailmixx.com`
2. Point DNS to Vercel (they provide nameservers)
3. Vercel auto-generates SSL certificate

---

## 📦 WHAT'S INCLUDED IN YOUR $5/MONTH VPS

With Coolify on a $5 VPS, you get:
- Backend API server
- PostgreSQL database
- Icecast streaming server (optional)
- SSL certificates
- Automatic backups
- Docker containers
- Monitoring dashboard

All for less than the cost of a coffee! ☕

---

## 🎯 READY TO DEPLOY?

1. **Backend**: Login to your Coolify dashboard and follow Step 1 above
2. **Frontend**: I'll deploy to Vercel right now using the CLI

---

## 🆘 TROUBLESHOOTING

**Coolify build fails:**
- Check logs in Coolify dashboard
- Ensure PostgreSQL is running
- Verify environment variables are set

**Vercel build fails:**
- Check `apps/web` is set as root directory
- Verify Next.js version is supported

**API calls fail from frontend:**
- Check CORS_ORIGIN on backend includes your Vercel URL
- Verify NEXT_PUBLIC_API_URL has no trailing slash

---

**Ready to deploy! Let me deploy the frontend to Vercel now...**
