# Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Default image source to "local" so the build never requires Google Drive
# credentials (sync-images.ts becomes a no-op). Override for a Drive-synced
# build with: docker build --build-arg IMAGE_SOURCE_TYPE=google-drive ...
ARG IMAGE_SOURCE_TYPE=local
ENV IMAGE_SOURCE_TYPE=$IMAGE_SOURCE_TYPE

# Set environment variable for production
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application (runs prebuild: sync-images [no-op for local] + optimize-images)
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/config ./config

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
