# Quick Push with GitHub Token
$token = "" # Add your GitHub Personal Access Token here
$repoName = "nexhunt"

Write-Host ""
Write-Host "=== Pushing NexHunt to GitHub ===" -ForegroundColor Green
Write-Host ""

# Get username
$username = Read-Host "Enter your GitHub username"
if (-not $username) {
    Write-Host "ERROR: Username required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setting up..." -ForegroundColor Cyan

# Git config
git config user.name $username
git config user.email "$username@users.noreply.github.com"

# Remove old remote if exists
$oldRemote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    git remote remove origin
}

# Add remote with token
$remoteUrl = "https://${username}:${token}@github.com/${username}/${repoName}.git"
git remote add origin $remoteUrl
git branch -M main

Write-Host "Remote configured!" -ForegroundColor Green
Write-Host ""

# Check if repo exists
Write-Host "Checking repository..." -ForegroundColor Cyan
$repoCheck = git ls-remote origin main 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Repository doesn't exist yet!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create it first:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Name: nexhunt" -ForegroundColor White  
    Write-Host "3. Choose Public or Private" -ForegroundColor White
    Write-Host "4. DO NOT add README/.gitignore" -ForegroundColor Yellow
    Write-Host "5. Click Create repository" -ForegroundColor White
    Write-Host ""
    
    $wait = Read-Host "Press Enter after creating repository"
}

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
$result = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error:" -ForegroundColor Yellow
    Write-Host $result -ForegroundColor White
    Write-Host ""
}


