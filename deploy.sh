#!/bin/bash
set -e

# Configuration
KEY_PATH="./terraform/keys/climate-data-explorer-key.pem"
USER="ec2-user"
REMOTE_DIR="/opt/climate-data-explorer"

# Ensure Terraform outputs are available
echo "🔍 Fetching IP from Terraform..."
cd terraform
IP=$(terraform output -raw app_public_ip)
cd ..

if [ -z "$IP" ]; then
    echo "❌ Error: Could not get IP from Terraform"
    exit 1
fi

echo "🚀 Deploying to $IP..."

# Upload production configurations
echo "📤 Uploading configuration files..."
scp -o StrictHostKeyChecking=no -i "$KEY_PATH" nginx.prod.conf docker-compose.prod.yml $USER@$IP:$REMOTE_DIR/

# SSH Commands
echo "🔄 Updating server..."
ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" $USER@$IP << EOF
    cd $REMOTE_DIR

    # Backup .env
    cp .env .env.bak

    # Pull latest code
    echo "📥 Pulling latest code..."
    git pull origin main

    # Restore .env (just in case)
    mv .env.bak .env

    # Restart containers with new config
    echo "🐳 Restarting containers..."
    sudo docker-compose -f docker-compose.prod.yml up -d --build --remove-orphans

    # Cleanup
    sudo docker system prune -f

    echo "✅ Deployment complete!"
EOF
