# CI/CD Pipeline Documentation: Public and Private EC2 Architecture

## Overview

This document explains the CI/CD pipeline that deploys applications to AWS using a combination of public and private EC2 instances. The pipeline is designed for security and scalability, with public EC2 instances handling orchestration and private EC2 instances running the actual applications.

## Architecture Diagram

```
GitHub Repository
       ↓
   GitHub Actions
       ↓
┌─────────────────┐    ┌─────────────────┐
│   Public EC2    │    │  Private EC2s   │
│   (Orchestrator)│    │  (Application)  │
│                 │    │                 │
│ • Docker Cache  │    │ • App Instance 1│
│ • Deploy Key    │    │ • App Instance 2│
│ • SSH Gateway   │    │ • App Instance N│
└─────────────────┘    └─────────────────┘
       ↓                        ↑
   NLB Webhook              SSH Deploy
   (Optional)               (Primary)
```

## Infrastructure Components

### 1. Public EC2 Instance
- **Purpose**: Orchestration and deployment management
- **Functions**:
  - Docker image caching
  - SSH key management
  - Deployment coordination
  - NLB webhook handling (optional)

### 2. Private EC2 Instances
- **Purpose**: Application hosting
- **Functions**:
  - Run containerized applications
  - Handle production traffic
  - Isolated from public internet
  - Accessible only via public EC2

### 3. Network Load Balancer (NLB) - Optional
- **Purpose**: Health checks and webhook triggers
- **Functions**:
  - Health monitoring
  - Deploy webhook endpoint
  - Load balancing (if configured)

## Pipeline Steps

### Step 1: Code Checkout and Setup
```yaml
- name: Checkout code
  uses: actions/checkout@v4

- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18

- name: Install dependencies
  run: npm ci
```

**What happens:**
- Code is checked out from GitHub repository
- Node.js environment is set up
- Dependencies are installed using `npm ci`

### Step 2: Environment Validation
```yaml
- name: Copy validation files to EC2
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ubuntu
    key: ${{ secrets.PRIVATE_SSH_KEY }}
    source: ".env.example"
    target: "~/test/"

- name: Validate Environment Variables on EC2
  uses: appleboy/ssh-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ubuntu
    key: ${{ secrets.PRIVATE_SSH_KEY }}
    script: |
      # Validation logic
```

**What happens:**
- `.env.example` file is copied to public EC2
- Environment variables are validated against requirements
- Missing or empty variables are detected and reported

### Step 3: Docker Image Build and Push
```yaml
- name: Log in to Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
```

**What happens:**
- Login to GitHub Container Registry (GHCR)
- Extract metadata for image tagging
- Build Docker image from Dockerfile
- Push image to GHCR with proper tags

### Step 4: Deploy Key Setup
```yaml
- name: Upload deploy key to public EC2
  uses: appleboy/ssh-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ubuntu
    key: ${{ secrets.PRIVATE_SSH_KEY }}
    script: |
      echo "Writing deploy key to file on EC2"
      printf '%s' "${{ secrets.PRIVATE_SSH_KEY }}" > ~/.ssh/hardik-test.pem
      chmod 600 ~/.ssh/hardik-test.pem
      ls -la ~/.ssh/hardik-test.pem
      echo "  key uploaded and permissions set"
```

**What happens:**
- SSH key is uploaded to public EC2
- Key permissions are set correctly (600)
- Key is ready for accessing private EC2 instances

### Step 5: Public EC2 Docker Setup
```yaml
- name: Deploy to AWS EC2
  uses: appleboy/ssh-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ubuntu
    key: ${{ secrets.PRIVATE_SSH_KEY }}
    script: |
      # Install Docker if not present
      if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com | sudo sh
      fi
      # Login to GHCR
      sudo docker login ghcr.io -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }}
      # Pull and cache image
      sudo docker pull ${{ steps.meta.outputs.tags }} || true
      # Cleanup old images
      sudo docker images --format '{{.Repository}} {{.Tag}} {{.ID}}' | grep 'ghcr.io/hardikbhanderi-exelanceit/test' | grep -v "${{ steps.meta.outputs.tags }}" | awk '{print $3}' | xargs -r sudo docker rmi || true
```

**What happens:**
- Docker is installed on public EC2 if not present
- Login to GHCR for image access
- New image is pulled and cached
- Old images are cleaned up to save space

### Step 6: NLB Webhook (Optional)
```yaml
- name: Trigger deploy on private EC2s via NLB
  if: always()
  run: |
    echo "Triggering deploy on private instances via NLB"
    if [ -z "${{ secrets.NLB_DNS }}" ] || [ "${{ secrets.NLB_DNS }}" = "" ]; then
      echo "WARNING: NLB_DNS secret is not set — skipping webhook trigger"
    else
      echo "Attempting to connect to NLB at: ${{ secrets.NLB_DNS }}:8000"
      echo "Testing connectivity..."
      if curl -sS --connect-timeout 10 "http://${{ secrets.NLB_DNS }}:8000/health" 2>/dev/null; then
        echo "NLB is reachable, sending deploy webhook..."
        curl -sS -X POST "http://${{ secrets.NLB_DNS }}:8000/deploy" \
          -H "Content-Type: application/json" \
          -d "{\"image\": \"${{ steps.meta.outputs.tags }}\"}" || echo "Webhook request failed (continuing)"
      else
        echo "WARNING: NLB is not reachable at ${{ secrets.NLB_DNS }}:8000"
        echo "This might be expected if NLB is not configured or the service is down"
        echo "Continuing with SSH-based deployment..."
      fi
    fi
```

**What happens:**
- Tests connectivity to NLB
- Sends webhook to trigger deployment (if NLB is available)
- Falls back to SSH deployment if NLB is unavailable

### Step 7: Private EC2 Deployment (Primary Method)
```yaml
- name: Deploy to private EC2s via SSH from public EC2
  uses: appleboy/ssh-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ubuntu
    key: ${{ secrets.PRIVATE_SSH_KEY }}
    script: |
      set -e
      echo "Reading private hosts from secret"
      PRIVATE_HOSTS="${{ secrets.PRIVATE_HOSTS }}"  # comma-separated
      IMAGE_TAG="${{ steps.meta.outputs.tags }}"
      echo "Deploy image: $IMAGE_TAG"

      for h in $(echo "$PRIVATE_HOSTS" | tr ',' ' '); do
        echo "Deploying to $h"
        printf 'set -e\nIMAGE_TAG="%s"\necho "Installing Docker if not present"\nif ! command -v docker &> /dev/null; then\n  curl -fsSL https://get.docker.com | sudo sh\n  sudo usermod -aG docker ubuntu\nfi\necho "Pulling $IMAGE_TAG"\nsudo docker login ghcr.io -u %s -p %s || true\nsudo docker pull "$IMAGE_TAG"\nsudo docker stop test-app || true\nsudo docker rm test-app || true\nsudo docker run -d --name test-app -e PORT=8000 -p 8000:8000 "$IMAGE_TAG"\necho "Deployment on $(hostname) complete"\n' "$IMAGE_TAG" "${{ github.actor }}" "${{ secrets.GITHUB_TOKEN }}" | ssh -o StrictHostKeyChecking=no -i ~/.ssh/hardik-test.pem ubuntu@${h} bash
      done
```

**What happens:**
- Reads private EC2 host list from secrets
- For each private EC2 instance:
  - Installs Docker if not present
  - Logs into GHCR
  - Pulls the new image
  - Stops and removes old container
  - Runs new container with the latest image

## Required Secrets

Configure these secrets in your GitHub repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SERVER_HOST` | Public EC2 instance IP/DNS | `ec2-1-2-3-4.compute-1.amazonaws.com` |
| `PRIVATE_SSH_KEY` | SSH private key for EC2 access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `PRIVATE_HOSTS` | Comma-separated list of private EC2 IPs | `10.0.1.10,10.0.1.11,10.0.1.12` |
| `NLB_DNS` | NLB DNS name (optional) | `my-nlb-1234567890.elb.us-east-1.amazonaws.com` |

## Security Features

### 1. Private EC2 Isolation
- Private EC2 instances are not directly accessible from the internet
- All access goes through the public EC2 instance
- SSH keys are managed securely

### 2. Container Registry Security
- Uses GitHub Container Registry (GHCR)
- Authentication via GitHub tokens
- Images are private and secure

### 3. SSH Key Management
- Deploy keys are created temporarily
- Proper file permissions (600)
- Keys are used only for deployment

## Deployment Flow

```mermaid
graph TD
    A[Code Push] --> B[GitHub Actions Triggered]
    B --> C[Checkout Code]
    C --> D[Install Dependencies]
    D --> E[Validate Environment]
    E --> F[Build Docker Image]
    F --> G[Push to GHCR]
    G --> H[Setup Deploy Keys]
    H --> I[Cache Image on Public EC2]
    I --> J{NLB Available?}
    J -->|Yes| K[Send NLB Webhook]
    J -->|No| L[Skip NLB Webhook]
    K --> M[Deploy to Private EC2s]
    L --> M
    M --> N[Install Docker on Private EC2s]
    N --> O[Pull New Image]
    O --> P[Stop Old Container]
    P --> Q[Start New Container]
    Q --> R[Deployment Complete]
```

## Monitoring and Logging

### 1. GitHub Actions Logs
- Each step provides detailed logging
- Error messages are clearly displayed
- Build and deployment status is tracked

### 2. EC2 Instance Logs
- Docker container logs are available on each private EC2
- SSH connection logs are maintained
- Application logs are accessible via SSH

### 3. Health Checks
- NLB health checks (if configured)
- Docker container health status
- Application endpoint monitoring

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Check SSH key permissions
   - Verify EC2 security groups
   - Ensure public EC2 can reach private EC2s

2. **Docker Command Not Found**
   - Docker installation is automatic
   - Check if installation completed successfully
   - Verify user permissions

3. **Image Pull Failed**
   - Check GHCR authentication
   - Verify image exists in registry
   - Check network connectivity

4. **Container Won't Start**
   - Check port conflicts
   - Verify environment variables
   - Check container logs

### Debug Commands

```bash
# Check SSH connectivity
ssh -i ~/.ssh/hardik-test.pem ubuntu@<private-ec2-ip> "echo 'SSH working'"

# Check Docker status
ssh -i ~/.ssh/hardik-test.pem ubuntu@<private-ec2-ip> "sudo docker ps"

# Check container logs
ssh -i ~/.ssh/hardik-test.pem ubuntu@<private-ec2-ip> "sudo docker logs test-app"

# Check image availability
ssh -i ~/.ssh/hardik-test.pem ubuntu@<private-ec2-ip> "sudo docker images | grep test"
```

## Best Practices

1. **Security**
   - Use IAM roles for EC2 instances
   - Rotate SSH keys regularly
   - Monitor access logs

2. **Performance**
   - Use Docker image caching
   - Clean up old images regularly
   - Optimize Dockerfile layers

3. **Reliability**
   - Implement health checks
   - Use rolling deployments
   - Monitor application metrics

4. **Maintenance**
   - Regular security updates
   - Monitor resource usage
   - Backup important data

## Conclusion

This CI/CD pipeline provides a secure, scalable, and maintainable way to deploy applications to AWS using public and private EC2 instances. The architecture ensures that applications are isolated in private subnets while maintaining efficient deployment orchestration through public EC2 instances.

The pipeline supports both NLB webhook-based deployments and SSH-based deployments, providing flexibility and reliability. All components are designed with security in mind, using proper authentication, authorization, and network isolation.

