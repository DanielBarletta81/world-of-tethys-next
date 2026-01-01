# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first for better caching
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production runtime
FROM base AS runner
WORKDIR /app
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy only what we need to run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
