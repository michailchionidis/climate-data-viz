#!/bin/bash
# =============================================================================
# Climate Data Explorer - EC2 User Data Script
# Installs Docker, clones repo, and starts the application
# =============================================================================

set -e

# Log everything
exec > >(tee /var/log/user-data.log) 2>&1
echo "Starting user data script at $(date)"

# Update system
dnf update -y

# Install Docker
dnf install -y docker git

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Add ec2-user to docker group
usermod -aG docker ec2-user

# Create app directory
mkdir -p /opt/${app_name}
cd /opt/${app_name}

# Clone the repository
git clone https://github.com/michailchionidis/climate-data-viz.git .

# Navigate to project directory
cd "Tesla Assignment"

# Create backend .env file
cat > backend/.env << EOF
ENVIRONMENT=production
GROK_API_KEY=${grok_api_key}
EOF

# Build and start with Docker Compose
docker-compose build --no-cache
docker-compose up -d

# Create a simple health check script
cat > /opt/${app_name}/health_check.sh << 'HEALTH'
#!/bin/bash
curl -f http://localhost:80/ && curl -f http://localhost:8000/health
HEALTH
chmod +x /opt/${app_name}/health_check.sh

# Add to crontab for auto-restart on reboot
echo "@reboot cd /opt/${app_name}/Tesla\ Assignment && docker-compose up -d" | crontab -

echo "User data script completed at $(date)"
echo "Application should be available at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
