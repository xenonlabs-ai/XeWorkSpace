#!/bin/bash

# ============================================
# XeTask - AWS Lightsail Container Service Setup
# Run this script once to create the infrastructure
# ============================================

set -e

# Configuration
SERVICE_NAME="xeworkspace"
REGION="${AWS_REGION:-ap-southeast-2}"
POWER="micro"  # micro, small, medium, large, xlarge
SCALE=1        # Number of container instances

echo "=========================================="
echo "XeTask Lightsail Container Service Setup"
echo "=========================================="
echo ""
echo "Configuration:"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Power: $POWER"
echo "  Scale: $SCALE"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
echo "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ Using AWS Account: $ACCOUNT_ID"
echo ""

# Check if service already exists
echo "Checking if container service exists..."
if aws lightsail get-container-services --service-name $SERVICE_NAME --region $REGION &> /dev/null; then
    echo "⚠️  Container service '$SERVICE_NAME' already exists."
    read -p "Do you want to continue with existing service? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    # Create container service
    echo "Creating Lightsail Container Service..."
    aws lightsail create-container-service \
        --service-name $SERVICE_NAME \
        --power $POWER \
        --scale $SCALE \
        --region $REGION

    echo "✅ Container service created!"
    echo ""

    # Wait for service to be ready
    echo "Waiting for service to be ready (this may take a few minutes)..."
    while true; do
        STATE=$(aws lightsail get-container-services \
            --service-name $SERVICE_NAME \
            --region $REGION \
            --query "containerServices[0].state" \
            --output text)

        echo "  Current state: $STATE"

        if [ "$STATE" = "READY" ] || [ "$STATE" = "RUNNING" ]; then
            break
        fi

        sleep 10
    done
fi

# Get service URL
SERVICE_URL=$(aws lightsail get-container-services \
    --service-name $SERVICE_NAME \
    --region $REGION \
    --query "containerServices[0].url" \
    --output text)

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Service URL: $SERVICE_URL"
echo ""
echo "Next Steps:"
echo ""
echo "1. Add these secrets to your GitHub repository:"
echo "   (Settings > Secrets and variables > Actions > New repository secret)"
echo ""
echo "   AWS_ACCESS_KEY_ID     = <your-access-key>"
echo "   AWS_SECRET_ACCESS_KEY = <your-secret-key>"
echo "   NEXTAUTH_URL          = https://$SERVICE_URL"
echo "   NEXTAUTH_SECRET       = $(openssl rand -base64 32)"
echo ""
echo "2. Push to main branch to trigger deployment:"
echo "   git add . && git commit -m 'Deploy to Lightsail' && git push origin main"
echo ""
echo "3. Monitor deployment in GitHub Actions tab"
echo ""
