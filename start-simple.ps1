# راه‌اندازی ساده NexHunt (بدون Docker)
Write-Host "🚀 شروع راه‌اندازی NexHunt..." -ForegroundColor Green
Write-Host ""

# مرحله ۱: نصب Backend Dependencies
Write-Host "📦 نصب وابستگی‌های Backend..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path node_modules)) {
    Write-Host "در حال نصب npm packages..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ خطا در نصب dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "✅ node_modules موجود است" -ForegroundColor Green
}

# مرحله ۲: تنظیم Prisma
Write-Host ""
Write-Host "🗄️  تنظیم Prisma..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  خطا در generate Prisma - احتمالاً دیتابیس در دسترس نیست" -ForegroundColor Yellow
    Write-Host "   اما می‌توانیم ادامه دهیم..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Backend آماده است!" -ForegroundColor Green
Write-Host ""

# مرحله ۳: نصب Frontend Dependencies
Write-Host "📦 نصب وابستگی‌های Frontend..." -ForegroundColor Cyan
Set-Location ..\frontend

if (-not (Test-Path node_modules)) {
    Write-Host "در حال نصب npm packages..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ خطا در نصب dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "✅ node_modules موجود است" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Frontend آماده است!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 برای راه‌اندازی:" -ForegroundColor Green
Write-Host ""
Write-Host "   1️⃣  Backend:  cd backend  &&  npm run start:dev" -ForegroundColor Cyan
Write-Host "   2️⃣  Frontend: cd frontend &&  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 نکته: برای اجرای کامل، باید PostgreSQL و Redis راه‌اندازی شوند" -ForegroundColor Yellow
Write-Host "   یا Docker Desktop را باز کنید و دستور زیر را اجرا کنید:" -ForegroundColor Yellow
Write-Host "   docker-compose up -d postgres redis" -ForegroundColor Cyan
Write-Host ""

Set-Location ..
