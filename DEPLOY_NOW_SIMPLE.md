# 🚀 DEPLOY TRAIL MIXX RADIO NOW

**Total Cost: $5/month** (Coolify VPS only, Vercel is FREE)

---

## ⚡ QUICK DEPLOY (2 Steps)

### STEP 1: Deploy Backend to Coolify (5 minutes)

**You need:** Your Coolify dashboard URL

1. **Login to Coolify**
   - Go to your Coolify dashboard

2. **Create New App**
   - Click "New Resource" → "Application"
   - Choose "GitHub Repository"

3. **Configure**
   ```
   Repository: executiveusa/trail-mixx-source-code
   Branch: claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc

   Build Pack: Nixpacks
   Base Directory: server

   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npx prisma migrate deploy && npm start
   Port: 3001
   ```

4. **Add PostgreSQL**
   - Add "New Resource" → "PostgreSQL"
   - Coolify will auto-connect it (sets DATABASE_URL)

5. **Environment Variables**
   ```
   JWT_SECRET=your_secret_here_use_openssl_rand_base64_32
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=*
   ```

6. **Deploy & Seed**
   - Click "Deploy"
   - After successful, run in terminal: `npm run seed`

7. **Get Your URL**
   - Copy the URL Coolify gives you (e.g., https://trail-mixx-xxx.your-server.com)
   - Or set custom domain: api.trailmixx.com

---

### STEP 2: Deploy Frontend to Vercel (2 minutes)

**Option A: Vercel Dashboard** (Easiest)

1. **Go to:** https://vercel.com/new

2. **Import**
   ```
   Repository: executiveusa/trail-mixx-source-code
   Branch: claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc
   ```

3. **Configure**
   ```
   Framework: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Install Command: npm install
   ```

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=<YOUR_COOLIFY_URL_FROM_STEP_1>
   NEXT_PUBLIC_STREAM_URL=http://localhost:8000/stream
   ```

5. **Deploy**
   - Click "Deploy"
   - Get your URL: https://trail-mixx-radio.vercel.app

---

**Option B: Vercel CLI** (If you prefer terminal)

```bash
# In the repo root
cd apps/web

# Login
npx vercel login

# Deploy
npx vercel --prod

# When prompted, enter:
# Project name: trail-mixx-radio
# NEXT_PUBLIC_API_URL: <your Coolify backend URL>
# NEXT_PUBLIC_STREAM_URL: http://localhost:8000/stream
```

---

## ✅ DONE!

You now have:
- ✅ Backend API on Coolify (your VPS)
- ✅ Frontend on Vercel (FREE)
- ✅ PostgreSQL database
- ✅ All working together

**Cost: $5/month total** 🎉

---

## 🧪 TEST IT

### Backend
```bash
curl https://YOUR_COOLIFY_URL/health
curl https://YOUR_COOLIFY_URL/api/tracks
```

### Frontend
Visit your Vercel URL - you should see the radio player!

---

## 📝 DEMO LOGIN

After seeding database:
- **Email:** demo@trailmixx.radio
- **Password:** password123

---

## 🔄 UPDATES

**Backend:** Push to GitHub → Click "Redeploy" in Coolify
**Frontend:** Push to GitHub → Vercel auto-deploys

---

## 💡 TIPS

1. **Custom Domains:**
   - Backend: Set in Coolify → Point DNS A record to your VPS
   - Frontend: Set in Vercel → Point DNS to Vercel

2. **CORS:**
   - Once you have your Vercel URL, update CORS_ORIGIN on Coolify to match

3. **SSL:**
   - Both Coolify and Vercel auto-generate SSL certificates (https://)

4. **Monitoring:**
   - Coolify has built-in monitoring dashboard
   - Vercel has analytics dashboard

---

## 🆘 HELP

**Coolify issues:** Check the deployment logs in Coolify dashboard
**Vercel issues:** Check the build logs in Vercel dashboard

**Common fix:** Make sure root directory is set correctly:
- Coolify: `server`
- Vercel: `apps/web`

---

**Everything is ready - just click and deploy!** 🚀
