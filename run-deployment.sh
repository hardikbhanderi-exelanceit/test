#!/bin/bash

# Simple script to run deployment multiple times
# Usage: ./run-deployment.sh [number_of_times]

set -e

# Configuration - Update these values
IMAGE_TAG="ghcr.io/hardikbhanderi-exelanceit/test:main"
GITHUB_ACTOR="hardikbhanderi-exelanceit"
GITHUB_TOKEN="your_github_token_here"
PRIVATE_HOSTS="10.0.155.48"  # Add more hosts separated by commas
SSH_KEY_PATH="~/.ssh/hardik-test.pem"

# Number of times to run deployment (default: 1)
RUNS=${1:-1}

echo "🚀 Starting deployment script"
echo "Image: $IMAGE_TAG"
echo "Private Hosts: $PRIVATE_HOSTS"
echo "Number of runs: $RUNS"
echo "=================================="

for ((i=1; i<=RUNS; i++)); do
    echo ""
    echo "🔄 Run $i/$RUNS - $(date)"
    echo "--------------------------------"
    
    # Run the deployment for each host
    for host in $(echo "$PRIVATE_HOSTS" | tr ',' ' '); do
        echo "Deploying to $host..."
        
        # Create deployment script
        deploy_script=$(cat <<EOF
set -e
echo "=== Deployment started on \$(hostname) at \$(date) ==="
echo "Image: $IMAGE_TAG"
echo "Server: \$(hostname)"
echo "Run: $i/$RUNS"

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker ubuntu
else
  echo "Docker is already installed"
fi

# Login to GHCR
sudo docker login ghcr.io -u $GITHUB_ACTOR -p $GITHUB_TOKEN || echo "Login failed, continuing..."

# Pull the new image
sudo docker pull "$IMAGE_TAG" || echo "Pull failed, continuing..."

# Stop and remove old container
sudo docker stop test-app || echo "No container to stop"
sudo docker rm test-app || echo "No container to remove"

# Run new container
sudo docker run -d --name test-app -e PORT=8000 -p 8000:8000 "$IMAGE_TAG"

# Verify container is running
sleep 5
if sudo docker ps | grep -q test-app; then
  echo "✅ Container is running successfully"
  sudo docker ps | grep test-app
else
  echo "❌ Container failed to start"
  exit 1
fi

echo "=== Deployment completed on \$(hostname) at \$(date) ==="
EOF
)

        # Execute deployment
        if echo "$deploy_script" | ssh -o StrictHostKeyChecking=no -i $SSH_KEY_PATH ubuntu@${host} bash; then
            echo "✅ Deployment to $host completed successfully"
        else
            echo "❌ Deployment to $host failed"
        fi
    done
    
    echo "Run $i/$RUNS completed"
    
    # Wait between runs (except for the last one)
    if [ $i -lt $RUNS ]; then
        echo "Waiting 30 seconds before next run..."
        sleep 30
    fi
done

echo ""
echo "🎉 All $RUNS deployment runs completed!"
echo "Final timestamp: $(date)"
