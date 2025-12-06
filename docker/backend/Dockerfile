FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY server/package.json ./server/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY package.json ./
COPY server ./server
COPY packages/shared ./packages/shared

# Generate Prisma client
WORKDIR /app/server
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy built application
COPY --from=builder --chown=expressjs:nodejs /app/server/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/server/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/server/prisma ./prisma
COPY --from=builder --chown=expressjs:nodejs /app/server/package.json ./package.json

USER expressjs

EXPOSE 3001

ENV PORT=3001

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
