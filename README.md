# Trail Mixx Radio

**Seattle's decentralized cover-song community radio station**

A modern full-stack radio platform built with Node.js, Next.js, Expo, and Postgres, designed to amplify underrepresented voices in Seattle's music scene.

---

## 🎵 Features

- **Live Radio Streaming** - Icecast-powered internet radio
- **Community Track Submissions** - Artists can upload and share cover songs
- **Web Player** - Modern, responsive web interface with real-time now-playing
- **Mobile Apps** - Native iOS and Android apps built with Expo
- **Track Discovery** - Browse and filter community-curated content
- **Playlist Curation** - Organize tracks into themed collections

---

## 📁 Project Structure

```
trail-mixx-source-code/
├── server/                 # Node.js + Express + Prisma backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, error handling
│   │   └── index.ts       # Server entry point
│   └── prisma/            # Database schema and migrations
├── apps/
│   ├── web/               # Next.js 15 web app
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/           # API client, utilities
│   └── mobile/            # Expo React Native app
│       ├── src/
│       │   ├── screens/   # App screens
│       │   ├── navigation/ # React Navigation
│       │   └── lib/       # API client
│       └── app.json       # Expo configuration
├── packages/
│   └── shared/            # Shared TypeScript types and schemas
├── docker/                # Docker configurations
│   ├── icecast/           # Icecast streaming server
│   ├── backend/           # Backend Dockerfile
│   └── web/               # Web Dockerfile
└── docker-compose.yml     # Full stack orchestration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm 10+
- **PostgreSQL** 14+ (or use Docker)
- **Expo CLI** (for mobile development)
- **Docker** (optional, for streaming server)

### 1. Clone and Install

```bash
git clone <your-repo-url> trail-mixx-radio
cd trail-mixx-radio
npm install
```

### 2. Set Up Environment Variables

**Backend (`server/.env`):**
```bash
cd server
cp .env.example .env
# Edit .env and set:
# DATABASE_URL=postgresql://user:password@localhost:5432/trail_mixx
# JWT_SECRET=your-secret-key
# STREAM_URL=http://localhost:8000/stream
```

**Web (`apps/web/.env.local`):**
```bash
cd apps/web
cp .env.local.example .env.local
# Edit .env.local and set:
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_STREAM_URL=http://localhost:8000/stream
```

**Mobile (`apps/mobile/.env`):**
```bash
cd apps/mobile
cp .env.example .env
# Edit .env and set:
# API_URL=http://localhost:3001
# STREAM_URL=http://localhost:8000/stream
```

### 3. Set Up Database

```bash
cd server
npx prisma migrate dev    # Run migrations
npm run seed              # Seed with sample data
```

### 4. Start Development Servers

**Option A: Run all services**
```bash
npm run dev  # Runs backend + web concurrently
```

**Option B: Run individually**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Web
npm run dev:web

# Terminal 3 - Mobile
npm run dev:mobile
```

### 5. Access the Applications

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Icecast Admin**: http://localhost:8000/admin (if running)

---

## 🐳 Docker Development

Run the entire stack with Docker Compose:

```bash
# Start all services (Postgres, Backend, Web, Icecast)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 📱 Mobile Development

### iOS (requires macOS)

```bash
cd apps/mobile
npm run ios
```

### Android

```bash
cd apps/mobile
npm run android
```

### Expo Go (Quick Testing)

```bash
cd apps/mobile
npm start
# Scan QR code with Expo Go app
```

---

## 🌐 Deployment

### Railway Deployment

**Project ID:** `de384c3a-2049-4123-9b81-7e8a92f57bba`

#### Prerequisites
- Install [Railway CLI](https://docs.railway.app/develop/cli)
- Railway account with Postgres database provisioned

#### Steps

1. **Login and Link Project**
```bash
railway login
railway link de384c3a-2049-4123-9b81-7e8a92f57bba
```

2. **Set Environment Variables**
```bash
railway variables set JWT_SECRET=your-super-secret-key
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-domain.com
```

Railway automatically provides `DATABASE_URL` from your Postgres database.

3. **Deploy**
```bash
railway up
```

The `railway.toml` configuration will:
- Run Prisma migrations automatically
- Start the backend server
- Set up health checks

4. **Access Your Deployment**
```bash
railway open  # Opens your deployed app
```

#### Post-Deployment

- **Seed Database** (first time only):
```bash
railway run npm run seed --workspace=server
```

- **View Logs**:
```bash
railway logs
```

---

### Coolify Deployment

[Coolify](https://coolify.io/) is an open-source, self-hosted alternative to Heroku/Railway.

#### Prerequisites
- Coolify instance running on your VPS
- Git repository connected to Coolify

#### Setup Steps

1. **Create New Application in Coolify**
   - Go to Coolify dashboard → Create New Resource → Application
   - Connect your Git repository
   - Select branch: `claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc`

2. **Configure Build Settings**
   - **Build Pack**: Nixpacks (auto-detected)
   - **Root Directory**: `/`
   - **Build Command**: `npm install && cd server && npx prisma generate && npm run build`
   - **Start Command**: `cd server && npx prisma migrate deploy && npm start`
   - **Port**: `3001`

3. **Add Environment Variables**
   ```
   DATABASE_URL=postgresql://user:password@your-db-host:5432/trail_mixx
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   PORT=3001
   STREAM_URL=http://your-icecast-host:8000/stream
   CORS_ORIGIN=https://your-domain.com
   ```

4. **Deploy**
   - Click "Deploy" in Coolify
   - Monitor build logs
   - Once deployed, access via assigned domain

5. **Set Up Postgres Database**
   - Add Postgres as a separate service in Coolify
   - Note the connection string and update `DATABASE_URL`

---

### Hostinger VPS Deployment

Manual deployment on a Hostinger VPS using Docker Compose.

#### Prerequisites
- Hostinger VPS with Ubuntu 20.04+
- Domain name pointed to your VPS IP
- SSH access to your VPS

#### Step-by-Step Guide

1. **Connect to VPS**
```bash
ssh root@your-vps-ip
```

2. **Install Docker and Docker Compose**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

3. **Clone Repository**
```bash
cd /opt
git clone <your-repo-url> trail-mixx-radio
cd trail-mixx-radio
git checkout claude/fullstack-refactor-railway-01F6msJactLC3wbVo63WxQFc
```

4. **Configure Environment**
```bash
# Create environment file
cat > .env << EOF
DB_PASSWORD=your-secure-db-password
JWT_SECRET=your-super-secret-jwt-key
EOF

# Set secure permissions
chmod 600 .env
```

5. **Update Icecast Passwords**
```bash
nano docker/icecast/icecast.xml
# Replace all instances of "CHANGE_ME_*_PASSWORD" with strong passwords
```

6. **Deploy with Docker Compose**
```bash
docker-compose up -d
```

7. **Initialize Database**
```bash
# Wait 30 seconds for services to start, then run migrations and seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

8. **Set Up Nginx Reverse Proxy (Optional but Recommended)**

```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
cat > /etc/nginx/sites-available/trail-mixx << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Web App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Icecast Stream
    location /stream {
        proxy_pass http://localhost:8000;
        proxy_buffering off;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/trail-mixx /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

9. **Set Up SSL with Let's Encrypt**
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com
```

10. **Set Up Auto-Start**
```bash
# Enable Docker to start on boot
systemctl enable docker

# Docker Compose services will auto-restart via restart: unless-stopped
```

#### Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f web
docker-compose logs -f icecast

# Check service status
docker-compose ps
```

#### Updates

```bash
cd /opt/trail-mixx-radio
git pull
docker-compose down
docker-compose up -d --build
```

---

## 🎛️ Icecast Streaming Setup

The Docker Compose stack includes an Icecast server for live streaming.

### Connecting a Source (DJ/AutoDJ)

**Server:** `localhost:8000` (or your domain)
**Mount Point:** `/stream`
**Username:** `source`
**Password:** Set in `docker/icecast/icecast.xml`

### Recommended Source Clients

- **Butt (Broadcast Using This Tool)** - Simple and free
- **Mixxx** - DJ software with Icecast support
- **Liquidsoap** - Automated radio automation

### Admin Access

- **URL:** `http://localhost:8000/admin`
- **Username:** `admin`
- **Password:** Set in `docker/icecast/icecast.xml`

---

## 📊 Database Management

### Prisma Studio (GUI)

```bash
npm run db:studio
# Opens at http://localhost:5555
```

### Run Migrations

```bash
cd server
npx prisma migrate dev      # Development
npx prisma migrate deploy   # Production
```

### Create New Migration

```bash
cd server
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_migration_name
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific workspace tests
npm test --workspace=server
```

---

## 📝 API Documentation

### Base URL
- **Local:** `http://localhost:3001`
- **Production:** Your deployed URL

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

#### Radio
- `GET /api/radio/now-playing` - Current track and metadata
- `GET /api/radio/recent?limit=20` - Recently played tracks
- `POST /api/radio/log-play` - Log a play (internal)

#### Tracks
- `GET /api/tracks` - List tracks (paginated, filterable)
- `GET /api/tracks/:id` - Get single track
- `POST /api/tracks` - Create track (requires auth)
- `PATCH /api/tracks/:id` - Update track (requires auth)
- `DELETE /api/tracks/:id` - Delete track (requires auth)

#### Playlists
- `GET /api/playlists` - List playlists
- `GET /api/playlists/:id` - Get playlist with tracks
- `POST /api/playlists` - Create playlist (requires auth)
- `POST /api/playlists/:id/tracks` - Add track to playlist (requires auth)

---

## 🛠️ Tech Stack

**Backend:**
- Node.js 20 + Express
- Prisma ORM + PostgreSQL
- JWT authentication
- TypeScript

**Web:**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- TypeScript

**Mobile:**
- Expo SDK 52
- React Native
- React Navigation
- expo-av (audio playback)

**Shared:**
- Zod (validation)
- Shared TypeScript types

**Infrastructure:**
- Docker + Docker Compose
- Icecast (streaming)
- Railway / Coolify / VPS deployment options

---

## 🤝 Contributing

Trail Mixx Radio is a community-driven project. We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is a refactored fork of [AzuraCast](https://github.com/AzuraCast/AzuraCast) (AGPL-3.0).

Trail Mixx Radio additions and modifications are also licensed under AGPL-3.0.

---

## 🎤 About Trail Mixx Radio

Trail Mixx Radio is a Seattle-based social-purpose platform dedicated to:

- Amplifying underrepresented voices in Seattle's music scene
- Supporting local artists through fair compensation and exposure
- Creating inclusive spaces for cross-cultural musical collaboration
- Building technology that empowers, not exploits, creators

**Focus:** Community-driven cover songs, urban music, R&B, and Seattle-based artists, with special emphasis on supporting the Somali-American community and other underrepresented groups.

---

## 📬 Contact

- **Email:** hello@trailmixx.radio
- **Website:** https://trailmixx.radio

---

## Demo Credentials

For testing the seed data:

**Email:** `demo@trailmixx.radio`
**Password:** `password123`

**⚠️ Change these immediately in production!**
