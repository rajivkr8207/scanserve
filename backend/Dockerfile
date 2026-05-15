# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from both backend and shared if needed
# (Assuming backend/package.json handles dependencies)
COPY backend/package*.json ./backend/
COPY shared ./shared/

# Install dependencies
WORKDIR /app/backend
RUN npm ci

# Copy source code
COPY backend ./
COPY shared /app/shared

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
