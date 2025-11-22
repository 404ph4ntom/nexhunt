# اسکریپت راه‌اندازی Backend
Write-Host "🚀 راه‌اندازی NexHunt Backend..." -ForegroundColor Green

Set-Location $PSScriptRoot\backend

# بررسی node_modules
if (-not (Test-Path node_modules)) {
    Write-Host "📦 نصب dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma
Write-Host "🗄️  Generate Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# تنظیم DATABASE_URL
$env:DATABASE_URL = "postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt?schema=public"

# بررسی اتصال به دیتابیس
Write-Host "🔍 بررسی اتصال به دیتابیس..." -ForegroundColor Cyan
try {
    npx prisma db pull --force 2>&1 | Out-Null
    Write-Host "✅ دیتابیس در دسترس است" -ForegroundColor Green
} catch {
    Write-Host "⚠️  هشدار: دیتابیس در دسترس نیست" -ForegroundColor Yellow
    Write-Host "   PostgreSQL باید روی localhost:5432 در حال اجرا باشد" -ForegroundColor Yellow
    Write-Host "   یا Docker Desktop را باز کنید و دستور زیر را اجرا کنید:" -ForegroundColor Yellow
    Write-Host "   docker-compose up -d postgres redis" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔸 آیا می‌خواهید بدون دیتابیس ادامه دهید؟ (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "y") {
        exit
    }
}

# راه‌اندازی سرور
Write-Host ""
Write-Host "🚀 راه‌اندازی Backend Server..." -ForegroundColor Green
Write-Host "   Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:3001/api/docs" -ForegroundColor Cyan
Write-Host ""

npm run start:dev

