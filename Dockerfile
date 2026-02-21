# Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app
# Install native build tools for better-sqlite3 and dependencies
RUN apk add --no-cache python3 make g++
# Copy package descriptors
COPY package*.json ./
# Install only production dependencies securely
RUN npm ci --omit=dev

# Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
# Upgrade base image packages to resolve Trivy OS vulnerabilities (e.g. busybox, zlib)
RUN apk upgrade --no-cache && \
    npm install -g npm@latest

# Copy only what we need from builder (no python3, make, or package-lock.json)
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src/
COPY public/ ./public/

# Ensure SQLite cache directory exists and holds correct permissions
RUN mkdir -p data && chown -R node:node data

# Drop privileges
USER node

# Set the configured port explicitly to match README commands
ENV PORT=8787
ENV NODE_ENV=production

EXPOSE 8787

CMD ["node", "src/server.js"]
