# Push to GitHub Script
param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "nexhunt"
)

Write-Host "=== Pushing NexHunt to GitHub ===" -ForegroundColor Green
Write-Host ""

# Check if remote exists
$hasRemote = git remote -v 2>&1 | Select-String -Pattern "origin"
if ($hasRemote) {
    Write-Host "Remote already exists. Removing old remote..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "Adding remote: $remoteUrl" -ForegroundColor Cyan
git remote add origin $remoteUrl

# Rename branch to main
Write-Host "Renaming branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "Ready to push!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: You need to authenticate first." -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Use GitHub Personal Access Token" -ForegroundColor Cyan
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "  2. Generate new token (classic) with 'repo' scope" -ForegroundColor White
Write-Host "  3. When pushing, use your token as password" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Use GitHub Desktop" -ForegroundColor Cyan
Write-Host "  Download from: https://desktop.github.com" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Try pushing now (if already authenticated):" -ForegroundColor Cyan
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""

$pushNow = Read-Host "Do you want to try pushing now? (y/n)"
if ($pushNow -eq "y") {
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Pushed to GitHub!" -ForegroundColor Green
        Write-Host "Repository: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Push failed. Please authenticate and try again." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Remote configured. Push manually with:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

