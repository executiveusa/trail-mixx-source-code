# Railway Deployment Guide - Trail Mixx Radio

## Quick Deploy via Railway Web Interface

Since the code is already pushed to branch `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`, you can deploy directly from the Railway dashboard:

### Option 1: Deploy via Railway Dashboard (Easiest)

1. **Go to Railway Project**
   - Visit: https://railway.app/project/de384c3a-2049-4123-9b81-7e8a92f57bba

2. **Connect GitHub Repository**
   - Click "New Service" → "GitHub Repo"
   - Select repository: `executiveusa/trail-mixx-source-code`
   - Select branch: `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`

3. **Configure Environment Variables**
   In Railway dashboard, add these variables:
   ```
   JWT_SECRET=<generate-a-strong-random-secret>
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-app-name.railway.app
   ```

4. **Railway will automatically:**
   - Detect the `railway.toml` configuration
   - Install dependencies with `npm install`
   - Build the server workspace
   - Run `npx prisma migrate deploy`
   - Start the server with `npm start`

5. **Seed the Database** (after first deployment)
   - In Railway dashboard, go to your service
   - Click "Settings" → "Run Command"
   - Execute: `cd server && npm run seed`

6. **Get Your Live URL**
   - Railway will provide a public URL like: `https://trail-mixx-radio-production.up.railway.app`
   - Or set up a custom domain in Settings → Domains

---

## Option 2: Deploy via Railway CLI (If Available)

If you have Railway CLI installed locally:

```bash
# Login to Railway
railway login

# Link to project
railway link de384c3a-2049-4123-9b81-7e8a92f57bba

# Set environment variables
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set NODE_ENV=production

# Deploy
railway up

# Seed database (after deployment)
railway run npm run seed --workspace=server

# Open in browser
railway open
```

---

## Option 3: Auto-Deploy from GitHub

Set up automatic deployments:

1. In Railway dashboard, go to your service
2. Settings → Service Settings
3. Enable "Auto Deploy on Push"
4. Select branch: `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`
5. Every push to this branch will trigger a new deployment

---

## Verify Deployment

Once deployed, test these endpoints:

```bash
# Replace YOUR_URL with your Railway URL

# Health check
curl https://YOUR_URL/health

# Now playing
curl https://YOUR_URL/api/radio/now-playing

# Recent tracks
curl https://YOUR_URL/api/radio/recent

# Get tracks
curl https://YOUR_URL/api/tracks

# Login (using demo credentials)
curl -X POST https://YOUR_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@trailmixx.radio","password":"password123"}'
```

---

## Troubleshooting

**Build Failures:**
- Check Railway logs in dashboard
- Ensure `DATABASE_URL` is set (should be automatic from Railway Postgres)
- Verify `JWT_SECRET` is set

**Database Issues:**
- Ensure Railway Postgres is attached to your service
- Check that migrations ran: `railway run npx prisma migrate status`

**Port Issues:**
- Railway automatically sets `PORT` environment variable
- Our code uses `process.env.PORT || 3001`

---

## Expected Deployment Time

- Initial deployment: 3-5 minutes
- Subsequent deployments: 2-3 minutes

---

## Post-Deployment Checklist

- [ ] Deployment successful (check Railway dashboard)
- [ ] Health check endpoint returns 200 OK
- [ ] Database migrations completed
- [ ] Database seeded with demo data
- [ ] API endpoints responding correctly
- [ ] CORS configured for your domain
- [ ] Custom domain set up (optional)

---

## Next Steps After Deployment

1. **Web Frontend**: Deploy Next.js app separately or use Vercel
2. **Mobile App**: Build with EAS and submit to app stores
3. **Icecast Server**: Deploy separately (Railway doesn't support UDP well)
4. **CDN/Media Storage**: Set up S3 or similar for track uploads
5. **Monitoring**: Add Sentry or similar for error tracking
