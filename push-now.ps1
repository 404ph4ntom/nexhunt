# Push to GitHub with Token
param(
    [string]$GitHubUsername = "",
    [string]$GitHubToken = ""
)

Write-Host ""
Write-Host "=== NexHunt - Push to GitHub ===" -ForegroundColor Green
Write-Host ""

if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "Enter your GitHub username"
}

if (-not $GitHubUsername) {
    Write-Host "ERROR: Username is required!" -ForegroundColor Red
    exit 1
}

$repoName = "nexhunt"

# Set Git config
Write-Host "[1/4] Configuring Git..." -ForegroundColor Cyan
git config user.name $GitHubUsername
git config user.email "$GitHubUsername@users.noreply.github.com"
Write-Host "✓ Git configured" -ForegroundColor Green
Write-Host ""

# Setup remote
Write-Host "[2/4] Setting up remote..." -ForegroundColor Cyan
$remoteUrl = "https://${GitHubUsername}:${GitHubToken}@github.com/${GitHubUsername}/${repoName}.git"

$existingRemote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Removing existing remote..." -ForegroundColor Yellow
    git remote remove origin
}

git remote add origin $remoteUrl
git branch -M main
Write-Host "✓ Remote configured" -ForegroundColor Green
Write-Host ""

# Check if repo exists
Write-Host "[3/4] Checking repository..." -ForegroundColor Cyan
$repoCheck = git ls-remote --heads origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Repository doesn't exist on GitHub yet!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create it first:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "  2. Repository name: $repoName" -ForegroundColor White
    Write-Host "  3. Choose Public or Private" -ForegroundColor White
    Write-Host "  4. DO NOT initialize with README/.gitignore" -ForegroundColor Yellow
    Write-Host "  5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $created = Read-Host "Have you created the repository? (y/n)"
    if ($created -ne "y") {
        Write-Host "Waiting for you to create the repository..." -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host "✓ Repository exists" -ForegroundColor Green
}
Write-Host ""

# Push
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Cyan
$pushOutput = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! Pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/$GitHubUsername/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  - Deploy Frontend to Vercel" -ForegroundColor White
    Write-Host "  - Deploy Backend to Railway" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ Push failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error output:" -ForegroundColor Yellow
    Write-Host $pushOutput -ForegroundColor White
    Write-Host ""
}


