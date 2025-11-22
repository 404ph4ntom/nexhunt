# Auto Push to GitHub Script
# This script will do everything: setup, commit, and push to GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "nexhunt",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = "",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubEmail = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  NexHunt - Auto Push to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Git Config
if (-not $GitHubEmail) {
    $GitHubEmail = Read-Host "Enter your GitHub email (for git config)"
}

Write-Host "[1/6] Configuring Git..." -ForegroundColor Cyan
git config user.name $GitHubUsername
git config user.email $GitHubEmail
Write-Host "✓ Git configured" -ForegroundColor Green
Write-Host ""

# Step 2: Initialize Git (if not already)
Write-Host "[2/6] Checking Git repository..." -ForegroundColor Cyan
if (-not (Test-Path .git)) {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}
Write-Host ""

# Step 3: Add all files
Write-Host "[3/6] Adding all files..." -ForegroundColor Cyan
git add .
$status = git status --short
$fileCount = ($status | Measure-Object -Line).Lines
Write-Host "✓ Added files to staging" -ForegroundColor Green
Write-Host ""

# Step 4: Commit (if there are changes)
Write-Host "[4/6] Checking for changes to commit..." -ForegroundColor Cyan
$changes = git diff --cached --name-only
if ($changes) {
    git commit -m "Initial commit: NexHunt Bug Bounty Platform - Production Ready

- Complete NestJS backend with all modules
- Next.js 15 frontend with TypeScript
- Solidity escrow contract for Web3 payouts
- Full Web2 and Web3 support
- Security features: encryption, rate limiting, audit logging
- Docker setup included
- CI/CD workflows ready
- Documentation complete
- Local setup guides added"
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
}
Write-Host ""

# Step 5: Setup Remote
Write-Host "[5/6] Setting up GitHub remote..." -ForegroundColor Cyan
$existingRemote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Removing existing remote..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote (with or without token)
if ($GitHubToken) {
    $remoteUrl = "https://${GitHubUsername}:${GitHubToken}@github.com/${GitHubUsername}/${RepoName}.git"
} else {
    $remoteUrl = "https://github.com/${GitHubUsername}/${RepoName}.git"
}

git remote add origin $remoteUrl
git branch -M main
Write-Host "✓ Remote configured: https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor Green
Write-Host ""

# Step 6: Create Repository on GitHub (if doesn't exist) and Push
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check if repository exists by trying to fetch
$repoExists = $false
try {
    git ls-remote --heads origin main 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $repoExists = $true
    }
} catch {
    $repoExists = $false
}

if (-not $repoExists) {
    Write-Host "⚠️  Repository doesn't exist on GitHub yet!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create it first:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "  2. Repository name: $RepoName" -ForegroundColor White
    Write-Host "  3. Choose Public or Private" -ForegroundColor White
    Write-Host "  4. DO NOT initialize with README, .gitignore, or license" -ForegroundColor Yellow
    Write-Host "  5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $created = Read-Host "Have you created the repository? (y/n)"
    if ($created -ne "y") {
        Write-Host ""
        Write-Host "⏸️  Waiting for you to create the repository..." -ForegroundColor Yellow
        Write-Host "After creating it, run this script again or:" -ForegroundColor Cyan
        Write-Host "  git push -u origin main" -ForegroundColor White
        exit
    }
}

# Try to push
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! Pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Deploy Frontend to Vercel: https://vercel.com" -ForegroundColor White
    Write-Host "  2. Deploy Backend to Railway: https://railway.app" -ForegroundColor White
    Write-Host "  3. See SETUP_GITHUB.md for detailed instructions" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ Push failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  1. Authentication required (GitHub Personal Access Token)" -ForegroundColor White
    Write-Host "  2. Repository doesn't exist yet on GitHub" -ForegroundColor White
    Write-Host "  3. Network issue" -ForegroundColor White
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 1: Use GitHub Personal Access Token" -ForegroundColor Yellow
    Write-Host "  1. Create token: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Select 'repo' scope" -ForegroundColor White
    Write-Host "  3. Run this script with -GitHubToken parameter" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use GitHub Desktop" -ForegroundColor Yellow
    Write-Host "  1. Download: https://desktop.github.com" -ForegroundColor White
    Write-Host "  2. File → Add Local Repository" -ForegroundColor White
    Write-Host "  3. Publish repository" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Manual push" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Current remote URL: $remoteUrl" -ForegroundColor Cyan
    Write-Host ""
}


