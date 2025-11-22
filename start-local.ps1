# NexHunt Local Development Startup Script
Write-Host "🚀 Starting NexHunt locally..." -ForegroundColor Green

# Check if Docker is available
$dockerAvailable = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerAvailable) {
    Write-Host "📦 Starting Docker services (PostgreSQL, Redis, ClamAV)..." -ForegroundColor Yellow
    docker-compose up -d postgres redis clamav
    
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check if services are running
    $postgresRunning = docker ps --filter "name=nexhunt-postgres" --format "{{.Names}}" | Select-String "nexhunt-postgres"
    if ($postgresRunning) {
        Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Docker not found. Please install Docker or start PostgreSQL and Redis manually." -ForegroundColor Yellow
    Write-Host "   PostgreSQL should be on: postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt" -ForegroundColor Yellow
    Write-Host "   Redis should be on: localhost:6379" -ForegroundColor Yellow
}

# Backend Setup
Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Cyan
Set-Location backend

if (!(Test-Path node_modules)) {
    Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🗄️  Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt?schema=public"
npx prisma migrate dev --name init

Write-Host "`n🚀 Starting Backend Server (Port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev"
Start-Sleep -Seconds 3

# Frontend Setup
Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Cyan
Set-Location ..\frontend

if (!(Test-Path node_modules)) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n🚀 Starting Frontend Server (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "`n✅ NexHunt is starting!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:3001/api/v1" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:3001/api/docs" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow

