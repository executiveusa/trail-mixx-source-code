# Deploy Trail Mixx Radio to Railway NOW

**Project ID:** `f75bbc96-2a32-488c-a830-64f5bd2b48b5`

## ⚡ Quick Deploy (Choose One Method)

### Method 1: Automated Script (Recommended)

```bash
./deploy-railway.sh
```

This script will:
- Install Railway CLI if needed
- Login and link to your project
- Set environment variables
- Deploy the application
- Run migrations
- Seed database
- Test endpoints
- Give you the live URL

---

### Method 2: Manual Steps

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

Or:

```bash
curl -fsSL https://railway.app/install.sh | sh
```

#### Step 2: Login & Link

```bash
railway login
railway link f75bbc96-2a32-488c-a830-64f5bd2b48b5
```

#### Step 3: Set Environment Variables

```bash
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN="*"
```

#### Step 4: Deploy

```bash
railway up
```

#### Step 5: Run Migrations & Seed

```bash
railway run "cd server && npx prisma migrate deploy"
railway run "cd server && npm run seed"
```

#### Step 6: Get Your URL

```bash
railway status
# or
railway open
```

---

### Method 3: Railway Dashboard (No CLI Required)

1. **Go to:** https://railway.app/project/f75bbc96-2a32-488c-a830-64f5bd2b48b5

2. **Add GitHub Service:**
   - Click "New" → "GitHub Repo"
   - Select: `executiveusa/trail-mixx-source-code`
   - Branch: `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`

3. **Set Variables** (in Railway dashboard):
   ```
   JWT_SECRET=<paste-random-string-here>
   NODE_ENV=production
   CORS_ORIGIN=*
   ```

   Generate JWT_SECRET with:
   ```bash
   openssl rand -base64 32
   ```

4. **Wait for Deploy** (2-3 minutes)

5. **Run Commands** (in Railway dashboard → Settings → Run Command):
   ```bash
   cd server && npx prisma migrate deploy
   ```

   Then:
   ```bash
   cd server && npm run seed
   ```

6. **Get URL:** Check "Deployments" tab for your public URL

---

## ✅ Verify Deployment

Once deployed, test these endpoints (replace `YOUR_URL`):

```bash
# Health check
curl https://YOUR_URL/health

# Now playing
curl https://YOUR_URL/api/radio/now-playing

# Tracks
curl https://YOUR_URL/api/tracks

# Login
curl -X POST https://YOUR_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@trailmixx.radio","password":"password123"}'
```

---

## 🎯 Expected Result

You should get a URL like:
```
https://trail-mixx-source-code-production.up.railway.app
```

All endpoints should return JSON responses with `{"success": true}` or data.

---

## 🐛 Troubleshooting

**Build Fails:**
- Check Railway logs
- Ensure DATABASE_URL is set (automatic from Railway Postgres)

**Migrations Fail:**
- Ensure Postgres database is attached
- Try: `railway run "cd server && npx prisma generate && npx prisma migrate deploy"`

**App Crashes:**
- Check logs: `railway logs`
- Verify JWT_SECRET is set
- Check PORT is not hardcoded (Railway sets it automatically)

---

## 📊 What Gets Deployed

- ✅ Node.js backend (Express + Prisma)
- ✅ PostgreSQL database (via Railway)
- ✅ API endpoints
- ✅ Health checks
- ✅ Auto-migrations
- ✅ Demo data

**Note:** Web frontend and mobile app are separate deployments (Next.js → Vercel, Expo → EAS)

---

## 🔗 Next Steps After Deployment

1. ✅ Test all API endpoints
2. Deploy web frontend to Vercel
3. Build mobile apps with EAS
4. Set up custom domain
5. Configure CORS for your domain
6. Set up monitoring/logging
