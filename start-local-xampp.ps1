# راه‌اندازی NexHunt با XAMPP/PostgreSQL
Write-Host "=== NexHunt Local Setup with XAMPP/PostgreSQL ===" -ForegroundColor Green
Write-Host ""

# بررسی Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# بررسی PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Cyan
$pgCheck = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $pgCheck) {
    Write-Host "WARNING: PostgreSQL not running on port 5432" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  1. Install PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  2. Start PostgreSQL service from Services" -ForegroundColor White
    Write-Host "  3. Use pgAdmin to start PostgreSQL" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
} else {
    Write-Host "PostgreSQL is running on port 5432" -ForegroundColor Green
}
Write-Host ""

# Backend Setup
Write-Host "=== Backend Setup ===" -ForegroundColor Cyan
Set-Location backend

# نصب dependencies
if (-not (Test-Path node_modules)) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}

# Generate Prisma
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Prisma generate failed - database might not be accessible" -ForegroundColor Yellow
}

# بررسی .env
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    
    # اطلاعات دیتابیس
    $dbUser = Read-Host "PostgreSQL username (default: nexhunt)"
    if (-not $dbUser) { $dbUser = "nexhunt" }
    
    $dbPass = Read-Host "PostgreSQL password (default: nexhunt_dev_password)"
    if (-not $dbPass) { $dbPass = "nexhunt_dev_password" }
    
    $dbName = Read-Host "Database name (default: nexhunt)"
    if (-not $dbName) { $dbName = "nexhunt" }
    
    $envContent = @"
# Server
NODE_ENV=development
PORT=3001
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://$dbUser`:$dbPass@localhost:5432/$dbName?schema=public

# JWT
JWT_SECRET=nexhunt-dev-secret-key-change-in-production-min-32-chars!!
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=nexhunt-dev-refresh-secret-key-change-in-production!!
JWT_REFRESH_EXPIRES_IN=30d

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Encryption
ENCRYPTION_KEY=nexhunt-32-character-encryption-key!!!

# File Upload
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,md,png,jpg,jpeg,gif,zip,json,sol,js,ts,html,css

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
SUBMISSION_RATE_LIMIT_TTL=86400
SUBMISSION_RATE_LIMIT_MAX=10
"@
    
    Set-Content -Path .env -Value $envContent
    Write-Host ".env file created!" -ForegroundColor Green
} else {
    Write-Host ".env file already exists" -ForegroundColor Green
}

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
$envContent = Get-Content .env | Where-Object { $_ -match "DATABASE_URL" }
if ($envContent) {
    $dbUrl = $envContent.Split("=")[1]
    $env:DATABASE_URL = $dbUrl
    npx prisma migrate dev --name init 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migrations completed!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Migrations failed - database might not be accessible" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Backend ready!" -ForegroundColor Green
Write-Host ""

# Frontend Setup
Write-Host "=== Frontend Setup ===" -ForegroundColor Cyan
Set-Location ..\frontend

# نصب dependencies
if (-not (Test-Path node_modules)) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}

# بررسی .env.local
if (-not (Test-Path .env.local)) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    Set-Content -Path .env.local -Value "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`nNEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="
    Write-Host ".env.local file created!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Frontend ready!" -ForegroundColor Green
Write-Host ""

Set-Location ..

# خلاصه
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend (in new terminal):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Access:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend: http://localhost:3001/api/v1" -ForegroundColor White
Write-Host "   API Docs: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Make sure PostgreSQL is running!" -ForegroundColor Yellow
Write-Host ""

