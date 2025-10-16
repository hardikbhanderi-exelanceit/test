# Aurora Jewelry API

A Node.js jewelry store API with frontend, Docker support, and AWS deployment pipeline.

## Quick start

Install dependencies and run the server:

```bash
npm install
npm run start
```

The server will run on http://localhost:3000 by default.

## API Endpoints

- GET /api/products — returns JSON list of products
- GET /api/env — returns safe environment variables

Open http://localhost:3000 in your browser to view the one-page frontend.

## Docker Development

Run with Docker for development:

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Production Deployment

### AWS EC2 Setup

1. Tag your EC2 instances with appropriate environment tags:

   - Development: `Environment=dev`
   - Production: `Environment=production`

2. Install Docker and Docker Compose on your EC2 instances

3. Set up AWS credentials and configure Bitbucket repository variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`

### Bitbucket Pipeline

The pipeline automatically:

- **Dev branch**: Builds and deploys to EC2 instances tagged `Environment=dev`
- **Main branch**: Builds and requires manual approval for production deployment

### Manual Production Deployment

```bash
# Build production image
docker build -t aurora-jewelry:latest .

# Run production container
docker-compose -f docker-compose.prod.yml up -d

# Health check
curl http://localhost:3000/api/products
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:

- `APP_PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `AWS_REGION` - AWS region for deployment
- `EC2_ENVIRONMENT_TAG` - Tag value for EC2 instance targeting
# Trigger new workflow run
