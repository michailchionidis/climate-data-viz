#!/bin/bash
# =============================================================================
# Climate Data Explorer - EC2 User Data Script
# Installs Docker, clones repo, and starts the application
# =============================================================================

set -euo pipefail

# Log everything to both file and console
exec > >(tee -a /var/log/user-data.log) 2>&1
echo "=========================================="
echo "Starting user data script at $$(date)"
echo "=========================================="

# Configuration
APP_NAME="${app_name}"
APP_DIR="/opt/$${APP_NAME}"
REPO_URL="https://github.com/michailchionidis/climate-data-viz.git"
PROJECT_DIR="$${APP_DIR}/Tesla Assignment"
GROK_API_KEY="${grok_api_key}"

# Function to log with timestamp
log() {
    echo "[$$(date +'%Y-%m-%d %H:%M:%S')] $$*"
}

# Function to handle errors
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Update system
log "Updating system packages..."
dnf update -y || error_exit "Failed to update system packages"

# Install Docker and Git
log "Installing Docker and Git..."
dnf install -y docker git curl || error_exit "Failed to install required packages"

# Start and enable Docker
log "Starting Docker service..."
systemctl start docker || error_exit "Failed to start Docker"
systemctl enable docker || error_exit "Failed to enable Docker"

# Install Docker Compose
log "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION=$$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)
curl -L "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-$$(uname -s)-$$(uname -m)" -o /usr/local/bin/docker-compose || error_exit "Failed to download Docker Compose"
chmod +x /usr/local/bin/docker-compose || error_exit "Failed to make Docker Compose executable"

# Verify Docker Compose installation
docker-compose --version || error_exit "Docker Compose installation verification failed"

# Add ec2-user to docker group (requires logout/login to take effect, but we'll use sudo for now)
usermod -aG docker ec2-user || log "WARNING: Failed to add ec2-user to docker group"

# Create app directory
log "Creating application directory: $${APP_DIR}"
mkdir -p "$${APP_DIR}" || error_exit "Failed to create app directory"
cd "$${APP_DIR}" || error_exit "Failed to change to app directory"

# Clone the repository (idempotent: remove if exists and re-clone)
log "Cloning repository from $${REPO_URL}..."
if [ -d ".git" ]; then
    log "Repository already exists, removing for clean clone..."
    rm -rf .git * .[!.]* 2>/dev/null || true
fi

# Retry logic for git clone
MAX_RETRIES=3
RETRY_COUNT=0
while [ $$RETRY_COUNT -lt $$MAX_RETRIES ]; do
    if git clone "$${REPO_URL}" .; then
        log "Repository cloned successfully"
        break
    else
        RETRY_COUNT=$$((RETRY_COUNT + 1))
        if [ $$RETRY_COUNT -lt $$MAX_RETRIES ]; then
            log "Git clone failed, retrying ($${RETRY_COUNT}/$${MAX_RETRIES})..."
            sleep 5
        else
            error_exit "Failed to clone repository after $${MAX_RETRIES} attempts"
        fi
    fi
done

# Navigate to project directory
log "Navigating to project directory: $${PROJECT_DIR}"
cd "$${PROJECT_DIR}" || error_exit "Failed to navigate to project directory"

# Verify docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    error_exit "docker-compose.yml not found in $${PROJECT_DIR}"
fi

# Create backend .env file
log "Creating backend .env file..."
mkdir -p backend || error_exit "Failed to create backend directory"
cat > backend/.env << EOF
ENVIRONMENT=production
GROK_API_KEY=$${GROK_API_KEY}
EOF

# Verify .env file was created
if [ ! -f "backend/.env" ]; then
    error_exit "Failed to create backend/.env file"
fi

# Build Docker images
log "Building Docker images..."
docker-compose build --no-cache || error_exit "Failed to build Docker images"

# Start containers
log "Starting Docker containers..."
docker-compose up -d || error_exit "Failed to start Docker containers"

# Wait for services to be ready
log "Waiting for services to start..."
sleep 15

# Health check with retries
log "Performing health checks..."
MAX_HEALTH_RETRIES=30
HEALTH_RETRY_COUNT=0
BACKEND_HEALTHY=false
FRONTEND_HEALTHY=false

while [ $HEALTH_RETRY_COUNT -lt $MAX_HEALTH_RETRIES ]; do
    # Check backend health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log "✅ Backend health check passed"
        BACKEND_HEALTHY=true
    fi

    # Check frontend
    if curl -f http://localhost:80/ > /dev/null 2>&1; then
        log "✅ Frontend health check passed"
        FRONTEND_HEALTHY=true
    fi

    if [ "$BACKEND_HEALTHY" = true ] && [ "$FRONTEND_HEALTHY" = true ]; then
        break
    fi

    HEALTH_RETRY_COUNT=$$((HEALTH_RETRY_COUNT + 1))
    if [ $$HEALTH_RETRY_COUNT -lt $$MAX_HEALTH_RETRIES ]; then
        log "Health checks not ready, waiting... ($${HEALTH_RETRY_COUNT}/$${MAX_HEALTH_RETRIES})"
        sleep 2
    fi
done

if [ "$$BACKEND_HEALTHY" != true ] || [ "$$FRONTEND_HEALTHY" != true ]; then
    log "WARNING: Health checks failed, but continuing..."
    log "Backend containers status:"
    docker-compose ps || true
    log "Backend logs:"
    docker-compose logs --tail=50 backend || true
fi

# Create health check script
log "Creating health check script..."
cat > "$${APP_DIR}/health_check.sh" << 'HEALTH'
#!/bin/bash
set -e
BACKEND_STATUS=$$(curl -s -o /dev/null -w "%%{http_code}" http://localhost:8000/health || echo "000")
FRONTEND_STATUS=$$(curl -s -o /dev/null -w "%%{http_code}" http://localhost:80/ || echo "000")

if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ All services healthy"
    exit 0
else
    echo "❌ Health check failed - Backend: $BACKEND_STATUS, Frontend: $FRONTEND_STATUS"
    exit 1
fi
HEALTH
chmod +x "$${APP_DIR}/health_check.sh"

# Setup auto-restart on reboot
log "Setting up auto-restart on reboot..."
(crontab -l 2>/dev/null | grep -v "$${PROJECT_DIR}" || true; echo "@reboot cd '$${PROJECT_DIR}' && docker-compose up -d") | crontab - || log "WARNING: Failed to setup crontab"

# Get public IP
PUBLIC_IP=$$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "unknown")

log "=========================================="
log "User data script completed at $$(date)"
log "Application should be available at http://$${PUBLIC_IP}"
log "=========================================="

# Show container status
log "Docker containers status:"
docker-compose ps || true
