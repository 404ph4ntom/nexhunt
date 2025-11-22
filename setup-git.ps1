# Auto Setup and Push to GitHub
param(
    [string]$GitHubUsername = "",
    [string]$GitHubEmail = ""
)

Write-Host "=== NexHunt Git Setup ===" -ForegroundColor Green
Write-Host ""

if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "Enter your GitHub username"
}

if (-not $GitHubEmail) {
    $GitHubEmail = Read-Host "Enter your GitHub email"
}

# Set Git config
Write-Host "Setting Git config..." -ForegroundColor Cyan
git config user.name $GitHubUsername
git config user.email $GitHubEmail

# Initialize if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
}

# Add all files
Write-Host "Adding files..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "Committing..." -ForegroundColor Cyan
git commit -m "Initial commit: NexHunt Bug Bounty Platform - Production Ready"

Write-Host ""
Write-Host "SUCCESS: Commit completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a new repository on GitHub: https://github.com/new"
Write-Host "   Name: nexhunt"
Write-Host ""
Write-Host "2. Then run these commands:" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/$GitHubUsername/nexhunt.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""

