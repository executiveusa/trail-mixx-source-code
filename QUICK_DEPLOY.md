# 🚀 QUICK DEPLOY - TRAIL MIXX RADIO

**Status:** ✅ ALL CODE READY - BUILDS PASSING

---

## 📋 PRE-DEPLOYMENT CHECKLIST

✅ Backend TypeScript build - **PASSING**
✅ Web app configuration - **READY**
✅ Mobile app - **COMPLETE**
✅ Database schema - **DEFINED**
✅ Seed data - **READY**
✅ All code pushed to GitHub
✅ Deployment configs created

**Branch:** `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`

---

## ⚡ DEPLOY NOW (2 Steps)

### STEP 1: Deploy Backend to Railway (3 minutes)

**🔗 Direct Link:** https://railway.app/project/f75bbc96-2a32-488c-a830-64f5bd2b48b5

1. Click **"New" → "GitHub Repo"**
2. Select: `executiveusa/trail-mixx-source-code`
3. Branch: `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`
4. **Root Directory:** `server`

5. **Add Variables:**
   ```
   JWT_SECRET=<paste this>: $(openssl rand -base64 32)
   NODE_ENV=production
   CORS_ORIGIN=*
   ```

6. Wait for deployment (2-3 min)

7. **Seed Database** (Settings → Run Command):
   ```
   npm run seed
   ```

8. **Copy your Railway URL** (looks like: `https://trail-mixx-xxx.up.railway.app`)

---

### STEP 2: Deploy Frontend to Vercel (2 minutes)

**🔗 Direct Link:** https://vercel.com/new

1. Click **"Import Git Repository"**
2. Select: `executiveusa/trail-mixx-source-code`
3. Branch: `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`

4. **Configure:**
   - Framework: **Next.js**
   - Root Directory: **apps/web**
   - Build Command: `npm run build`

5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=<YOUR_RAILWAY_URL_FROM_STEP_1>
   NEXT_PUBLIC_STREAM_URL=http://localhost:8000/stream
   ```

6. Click **"Deploy"**

7. **Copy your Vercel URL** (looks like: `https://trail-mixx-radio-xxx.vercel.app`)

---

## 🧪 TEST YOUR DEPLOYMENT

### Backend Test (Railway)

```bash
# Replace YOUR_RAILWAY_URL with your actual URL

# Health check
curl https://YOUR_RAILWAY_URL/health

# Get tracks
curl https://YOUR_RAILWAY_URL/api/tracks

# Login
curl -X POST https://YOUR_RAILWAY_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@trailmixx.radio","password":"password123"}'
```

**Expected:** All should return JSON with `{"success": true}`

---

### Frontend Test (Vercel)

Visit your Vercel URL:
- ✅ Homepage loads with radio player
- ✅ "Discover" page shows tracks
- ✅ "About" page loads mission
- ✅ Radio player UI functional

---

## 🎉 YOU'RE LIVE!

Once both deployments succeed, you have:

✅ **Backend API** - Running on Railway with Postgres
✅ **Web App** - Running on Vercel
✅ **Database** - Seeded with demo data
✅ **Authentication** - JWT working
✅ **All Endpoints** - Functional

---

## 📱 MOBILE APP (Optional - Later)

The Expo app is ready at `/apps/mobile`. To deploy:

```bash
cd apps/mobile
npx eas build --platform ios
npx eas build --platform android
```

Update `app.json` with your Railway URL first.

---

## 🔧 IF SOMETHING BREAKS

### Railway Issues:

**Problem:** Build fails
- **Fix:** Check Railway logs, ensure `DATABASE_URL` is set automatically

**Problem:** Migrations fail
- **Fix:** Run manually: Settings → Run Command → `npx prisma migrate deploy`

**Problem:** 500 errors
- **Fix:** Check `JWT_SECRET` is set

### Vercel Issues:

**Problem:** Build fails
- **Fix:** Ensure root directory is `apps/web`

**Problem:** API calls fail
- **Fix:** Check `NEXT_PUBLIC_API_URL` includes `https://` and no trailing slash

---

## 📞 SUPPORT

- Check logs in Railway/Vercel dashboards
- Review `DEPLOYMENT_SUMMARY.md` for detailed instructions
- See `README.md` for full documentation

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. Update CORS_ORIGIN on Railway to your Vercel domain
2. Set up custom domains
3. Configure production JWT_SECRET (not openssl random)
4. Add monitoring (Sentry, LogRocket, etc.)
5. Build mobile apps
6. Deploy Icecast for live streaming

---

**Everything is ready - just click the links above and deploy!** 🚀

Railway: https://railway.app/project/f75bbc96-2a32-488c-a830-64f5bd2b48b5
Vercel: https://vercel.com/new
