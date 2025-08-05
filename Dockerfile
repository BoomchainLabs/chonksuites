# Multi-stage Dockerfile for Chonk9k Suite
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy any necessary assets
COPY --from=builder --chown=nextjs:nodejs /app/attached_assets ./attached_assets

USER nextjs

EXPOSE 5000

CMD ["npm", "start"]