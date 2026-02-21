FROM node:20-alpine

WORKDIR /app

# Install native build tools for better-sqlite3 and dependencies
RUN apk add --no-cache python3 make g++

# Copy package descriptors
COPY package*.json ./

# Install dependencies securely (ignoring dev dependencies)
RUN npm ci --omit=dev

# Copy application code
COPY src/ ./src/
COPY public/ ./public/

# Ensure SQLite cache directory exists and holds correct permissions
RUN mkdir -p .data && chown -R node:node .data

# Drop privileges
USER node

# Set the configured port explicitly to match README commands
ENV PORT=8787
ENV NODE_ENV=production

EXPOSE 8787

CMD ["npm", "start"]
