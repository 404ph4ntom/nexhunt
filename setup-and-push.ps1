# اسکریپت خودکار Setup و Push به GitHub
param(
    [string]$GitHubUsername = "",
    [string]$GitHubEmail = "",
    [string]$GitHubRepoName = "nexhunt"
)

Write-Host "🚀 راه‌اندازی NexHunt و Push به GitHub..." -ForegroundColor Green
Write-Host ""

# درخواست اطلاعات از کاربر اگر داده نشده
if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "نام کاربری GitHub خود را وارد کنید"
}

if (-not $GitHubEmail) {
    $GitHubEmail = Read-Host "ایمیل GitHub خود را وارد کنید"
}

# تنظیم Git config
Write-Host "⚙️  تنظیم Git config..." -ForegroundColor Cyan
git config user.name $GitHubUsername
git config user.email $GitHubEmail

# Initialize Git (اگر قبلاً نشده)
if (-not (Test-Path .git)) {
    Write-Host "📦 Initialize Git repository..." -ForegroundColor Cyan
    git init
}

# Add all files
Write-Host "📝 اضافه کردن فایل‌ها..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "💾 Commit کردن..." -ForegroundColor Cyan
git commit -m "Initial commit: NexHunt Bug Bounty Platform - Production Ready

✅ Complete NestJS backend with all modules
✅ Next.js 15 frontend with TypeScript
✅ Solidity escrow contract for Web3 payouts
✅ Full Web2 and Web3 support
✅ Security features: encryption, rate limiting, audit logging
✅ Docker setup included
✅ CI/CD workflows ready
✅ Documentation complete"

Write-Host "✅ Commit موفقیت‌آمیز بود!" -ForegroundColor Green
Write-Host ""

# بررسی remote
$hasRemote = git remote -v 2>&1 | Select-String -Pattern "origin"
if (-not $hasRemote) {
    Write-Host "📤 تنظیم remote repository..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  توجه: برای push کردن، یکی از این کارها را انجام دهید:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "گزینه ۱: ایجاد Repository در GitHub و سپس:" -ForegroundColor Cyan
    Write-Host "   git remote add origin https://github.com/$GitHubUsername/$GitHubRepoName.git" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "گزینه ۲: استفاده از GitHub CLI (اگر نصب دارید):" -ForegroundColor Cyan
    Write-Host "   gh repo create $GitHubRepoName --public --source=. --remote=origin --push" -ForegroundColor White
    Write-Host ""
    Write-Host "گزینه ۳: من برای شما تنظیم می‌کنم (بعد از ایجاد repo در GitHub)" -ForegroundColor Cyan
    Write-Host ""
    
    $createNow = Read-Host "آیا الان می‌خواهید remote را تنظیم کنم؟ (y/n)"
    if ($createNow -eq "y") {
        git remote add origin "https://github.com/$GitHubUsername/$GitHubRepoName.git"
        git branch -M main
        
        Write-Host ""
        Write-Host "✅ Remote تنظیم شد!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📤 در حال push کردن..." -ForegroundColor Cyan
        
        # Push (اگر authentication داشته باشد)
        $pushResult = git push -u origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ موفقیت‌آمیز push شد به GitHub!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Push ناموفق - احتمالاً نیاز به authentication دارید" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "راه‌حل:" -ForegroundColor Cyan
            Write-Host "   1. GitHub Personal Access Token بسازید: https://github.com/settings/tokens" -ForegroundColor White
            Write-Host "   2. یا از GitHub Desktop استفاده کنید" -ForegroundColor White
            Write-Host "   3. یا دستی push کنید: git push -u origin main" -ForegroundColor White
        }
    }
} else {
    Write-Host "✅ Remote repository قبلاً تنظیم شده" -ForegroundColor Green
    Write-Host "📤 برای push کردن: git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 آماده است!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 برای Deploy به Vercel و Railway، فایل GIT_SETUP.md را بخوانید" -ForegroundColor Cyan

