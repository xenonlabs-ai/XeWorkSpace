# XeTask Deployment Guide

## AWS Lightsail Container Service Deployment

This guide walks you through deploying XeTask to AWS Lightsail Container Service with automated CI/CD via GitHub Actions.

### Prerequisites

1. **AWS Account** with Lightsail access
2. **GitHub Repository** with the code
3. **AWS CLI** installed locally ([Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))

### Pricing

AWS Lightsail Container Service pricing (as of 2024):
- **Micro** ($7/month): 0.25 vCPU, 512MB RAM - Good for testing
- **Small** ($25/month): 0.5 vCPU, 1GB RAM - Light production
- **Medium** ($50/month): 1 vCPU, 2GB RAM - Recommended for production
- **Large** ($100/month): 2 vCPU, 4GB RAM - High traffic

---

## Step 1: Create IAM User for Deployment

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user: `xetask-deployer`
3. Attach the policy `AmazonLightsailFullAccess`
4. Create access keys and save them securely

---

## Step 2: Configure AWS CLI

```bash
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Region: ap-south-1 (or your preferred region)
# Output format: json
```

---

## Step 3: Create Lightsail Container Service

### Option A: Using PowerShell (Windows)

```powershell
.\scripts\aws\setup-lightsail.ps1
```

### Option B: Using Bash (Mac/Linux)

```bash
chmod +x scripts/aws/setup-lightsail.sh
./scripts/aws/setup-lightsail.sh
```

### Option C: Manual Setup via AWS Console

1. Go to [Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click **Containers** > **Create container service**
3. Choose:
   - Region: Your preferred region
   - Capacity: Micro (for testing) or Medium (production)
   - Scale: 1
   - Service name: `xetask`
4. Click **Create container service**

---

## Step 4: Add GitHub Secrets

Go to your GitHub repository:
**Settings** > **Secrets and variables** > **Actions** > **New repository secret**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user secret key |
| `NEXTAUTH_URL` | `https://xetask.xxxxx.ap-south-1.cs.amazonlightsail.com` (your service URL) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |

---

## Step 5: Deploy

Push to the `main` branch to trigger deployment:

```bash
git add .
git commit -m "Deploy to Lightsail"
git push origin main
```

Monitor the deployment in the **Actions** tab of your GitHub repository.

---

## Local Development with Docker

### Build and run locally:

```bash
# Build the image
docker-compose build

# Run the container
docker-compose up
```

Access the app at `http://localhost:3000`

### Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

---

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs for errors
2. Verify AWS credentials are correct
3. Ensure Lightsail service is in READY state

### Container Won't Start

1. Check container logs in Lightsail console
2. Verify environment variables are set correctly
3. Check health endpoint: `/api/health`

### Database Issues

The app uses SQLite stored in `/app/data/xetask.db`. For production with multiple instances, consider migrating to PostgreSQL or MySQL.

---

## Custom Domain Setup

1. In Lightsail console, go to your container service
2. Click **Custom domains**
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` in GitHub secrets

---

## Scaling

To scale the container service:

```bash
aws lightsail update-container-service \
  --service-name xetask \
  --scale 2 \
  --region ap-south-1
```

---

## Desktop Agent Distribution

The desktop agent is a separate Electron app. To build installers:

```bash
cd xe-desktop-agent
npm install
npm run package:win   # Windows installer
npm run package:mac   # macOS installer
npm run package:linux # Linux installer
```

Distribute the installers to employees separately.

---

## Support

For issues, please open a GitHub issue or contact the development team.
