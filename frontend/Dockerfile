# =============================================================================
# Multi-stage Dockerfile for Climate Data Visualization Frontend
# =============================================================================
# Stages:
#   1. dependencies - Install npm packages
#   2. test         - Run tests (used by CI/CD)
#   3. builder      - Build production assets
#   4. production   - Serve with Nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies - Install all packages
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for testing)
RUN npm install --legacy-peer-deps

# -----------------------------------------------------------------------------
# Stage 2: Test - Run tests (target: test)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS test

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Default command: run tests with coverage (vitest uses --run for single run)
CMD ["npm", "run", "test", "--", "--run", "--coverage"]

# -----------------------------------------------------------------------------
# Stage 3: Builder - Build production assets
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build arguments for API URL
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Production - Serve with Nginx
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
