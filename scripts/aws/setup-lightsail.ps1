# ============================================
# XeTask - AWS Lightsail Container Service Setup
# Run this script once to create the infrastructure
# PowerShell version for Windows
# ============================================

$ErrorActionPreference = "Stop"

# Configuration
$SERVICE_NAME = "xeworkspace"
$REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "ap-southeast-2" }
$POWER = "micro"  # micro, small, medium, large, xlarge
$SCALE = 1        # Number of container instances

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "XeTask Lightsail Container Service Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:"
Write-Host "  Service Name: $SERVICE_NAME"
Write-Host "  Region: $REGION"
Write-Host "  Power: $POWER"
Write-Host "  Scale: $SCALE"
Write-Host ""

# Check AWS CLI
try {
    $null = Get-Command aws -ErrorAction Stop
} catch {
    Write-Host "AWS CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
}

# Check AWS credentials
Write-Host "Checking AWS credentials..."
try {
    $identity = aws sts get-caller-identity | ConvertFrom-Json
    Write-Host "Using AWS Account: $($identity.Account)" -ForegroundColor Green
} catch {
    Write-Host "AWS credentials not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if service already exists
Write-Host "Checking if container service exists..."
$serviceExists = $false
try {
    $null = aws lightsail get-container-services --service-name $SERVICE_NAME --region $REGION 2>$null
    $serviceExists = $true
} catch {
    $serviceExists = $false
}

if ($serviceExists) {
    Write-Host "Container service '$SERVICE_NAME' already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to continue with existing service? (y/n)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        exit 0
    }
} else {
    # Create container service
    Write-Host "Creating Lightsail Container Service..."
    aws lightsail create-container-service `
        --service-name $SERVICE_NAME `
        --power $POWER `
        --scale $SCALE `
        --region $REGION

    Write-Host "Container service created!" -ForegroundColor Green
    Write-Host ""

    # Wait for service to be ready
    Write-Host "Waiting for service to be ready (this may take a few minutes)..."
    while ($true) {
        $services = aws lightsail get-container-services `
            --service-name $SERVICE_NAME `
            --region $REGION | ConvertFrom-Json

        $state = $services.containerServices[0].state
        Write-Host "  Current state: $state"

        if ($state -eq "READY" -or $state -eq "RUNNING") {
            break
        }

        Start-Sleep -Seconds 10
    }
}

# Get service URL
$services = aws lightsail get-container-services `
    --service-name $SERVICE_NAME `
    --region $REGION | ConvertFrom-Json

$serviceUrl = $services.containerServices[0].url

# Generate a random secret
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$randomSecret = [Convert]::ToBase64String($bytes)

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URL: $serviceUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Add these secrets to your GitHub repository:"
Write-Host "   (Settings > Secrets and variables > Actions > New repository secret)"
Write-Host ""
Write-Host "   AWS_ACCESS_KEY_ID     = <your-access-key>" -ForegroundColor Yellow
Write-Host "   AWS_SECRET_ACCESS_KEY = <your-secret-key>" -ForegroundColor Yellow
Write-Host "   NEXTAUTH_URL          = https://$serviceUrl" -ForegroundColor Yellow
Write-Host "   NEXTAUTH_SECRET       = $randomSecret" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Push to main branch to trigger deployment:"
Write-Host "   git add . && git commit -m 'Deploy to Lightsail' && git push origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Monitor deployment in GitHub Actions tab"
Write-Host ""
