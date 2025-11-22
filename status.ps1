# بررسی وضعیت NexHunt
Write-Host "🔍 بررسی وضعیت NexHunt..." -ForegroundColor Cyan
Write-Host ""

# بررسی Backend
Write-Host "Backend (Port 3001):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3001/api/docs -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✅ در حال اجرا" -ForegroundColor Green
    Write-Host "     📚 http://localhost:3001/api/docs" -ForegroundColor Cyan
} catch {
    Write-Host "  ❌ در حال اجرا نیست" -ForegroundColor Red
}

# بررسی Frontend
Write-Host ""
Write-Host "Frontend (Port 3000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✅ در حال اجرا" -ForegroundColor Green
    Write-Host "     🌐 http://localhost:3000" -ForegroundColor Cyan
} catch {
    Write-Host "  ❌ در حال اجرا نیست" -ForegroundColor Red
}

# بررسی PostgreSQL
Write-Host ""
Write-Host "PostgreSQL (Port 5432):" -ForegroundColor Yellow
$pgProcess = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if ($pgProcess) {
    Write-Host "  ✅ در حال اجرا" -ForegroundColor Green
} else {
    Write-Host "  ❌ در حال اجرا نیست" -ForegroundColor Red
    Write-Host "     💡 راه‌حل: docker-compose up -d postgres" -ForegroundColor Cyan
}

Write-Host ""

