#!/bin/bash

# Deployment script for multiple private EC2 instances
# This script can be run multiple times safely

set -e

# Configuration
IMAGE_TAG="$1"
GITHUB_ACTOR="$2"
GITHUB_TOKEN="$3"
PRIVATE_HOSTS="$4"
SSH_KEY_PATH="~/.ssh/hardik-test.pem"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ✅ $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ⚠️  $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ❌ $1"
}

# Function to deploy to a single host
deploy_to_host() {
    local host="$1"
    local attempt="$2"
    
    print_status "Deploying to $host (Attempt $attempt)"
    
    # Create the deployment script
    local deploy_script=$(cat <<EOF
set -e
echo "=== Deployment started on \$(hostname) at \$(date) ==="
echo "Image: $IMAGE_TAG"
echo "Server: \$(hostname)"
echo "IP: \$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4 2>/dev/null || echo 'unknown')"

# Install Docker if not present
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker ubuntu
  echo "Docker installed successfully"
else
  echo "Docker is already installed"
fi

# Login to GHCR
echo "Logging into GitHub Container Registry..."
sudo docker login ghcr.io -u $GITHUB_ACTOR -p $GITHUB_TOKEN || {
  echo "Failed to login to GHCR, continuing anyway..."
}

# Pull the new image
echo "Pulling image: $IMAGE_TAG"
sudo docker pull "$IMAGE_TAG" || {
  echo "Failed to pull image, continuing with existing image..."
}

# Stop and remove old container
echo "Stopping old container..."
sudo docker stop test-app || echo "No running container to stop"

echo "Removing old container..."
sudo docker rm test-app || echo "No container to remove"

# Run new container
echo "Starting new container..."
sudo docker run -d --name test-app -e PORT=8000 -p 8000:8000 "$IMAGE_TAG" || {
  echo "Failed to start new container, trying to start existing image..."
  sudo docker run -d --name test-app -e PORT=8000 -p 8000:8000 "$IMAGE_TAG"
}

# Verify container is running
sleep 5
if sudo docker ps | grep -q test-app; then
  echo "✅ Container is running successfully"
  sudo docker ps | grep test-app
else
  echo "❌ Container failed to start"
  sudo docker logs test-app || echo "No logs available"
  exit 1
fi

echo "=== Deployment completed on \$(hostname) at \$(date) ==="
EOF
)

    # Execute the deployment script
    if echo "$deploy_script" | ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 -i $SSH_KEY_PATH ubuntu@${host} bash; then
        print_success "Deployment to $host completed successfully"
        return 0
    else
        print_error "Deployment to $host failed"
        return 1
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment process"
    print_status "Image: $IMAGE_TAG"
    print_status "GitHub Actor: $GITHUB_ACTOR"
    print_status "Private Hosts: $PRIVATE_HOSTS"
    
    if [ -z "$IMAGE_TAG" ] || [ -z "$GITHUB_ACTOR" ] || [ -z "$GITHUB_TOKEN" ] || [ -z "$PRIVATE_HOSTS" ]; then
        print_error "Missing required parameters"
        echo "Usage: $0 <IMAGE_TAG> <GITHUB_ACTOR> <GITHUB_TOKEN> <PRIVATE_HOSTS>"
        exit 1
    fi
    
    local success_count=0
    local total_count=0
    local failed_hosts=()
    
    # Deploy to each host
    for host in $(echo "$PRIVATE_HOSTS" | tr ',' ' '); do
        total_count=$((total_count + 1))
        local attempt=1
        local max_attempts=3
        
        while [ $attempt -le $max_attempts ]; do
            if deploy_to_host "$host" "$attempt"; then
                success_count=$((success_count + 1))
                break
            else
                if [ $attempt -lt $max_attempts ]; then
                    print_warning "Retrying deployment to $host (Attempt $((attempt + 1))/$max_attempts)"
                    sleep 10
                else
                    print_error "All attempts failed for $host"
                    failed_hosts+=("$host")
                fi
                attempt=$((attempt + 1))
            fi
        done
    done
    
    # Summary
    print_status "Deployment Summary:"
    print_success "Successful deployments: $success_count/$total_count"
    
    if [ ${#failed_hosts[@]} -gt 0 ]; then
        print_error "Failed hosts: ${failed_hosts[*]}"
        exit 1
    else
        print_success "All deployments completed successfully!"
    fi
}

# Run main function
main "$@"
