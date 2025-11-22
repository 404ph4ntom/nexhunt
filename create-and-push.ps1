# Create Repository and Push to GitHub
$token = "" # Add your GitHub Personal Access Token here
$username = "404ph4ntom"
$repoName = "nexhunt"

Write-Host ""
Write-Host "=== Creating Repository and Pushing to GitHub ===" -ForegroundColor Green
Write-Host ""

# Step 1: Configure Git
Write-Host "[1/5] Configuring Git..." -ForegroundColor Cyan
git config user.name $username
git config user.email "$username@users.noreply.github.com"
Write-Host "✓ Done" -ForegroundColor Green
Write-Host ""

# Step 2: Create Repository on GitHub
Write-Host "[2/5] Creating repository on GitHub..." -ForegroundColor Cyan
$headers = @{
    Authorization = "Bearer $token"
    Accept = "application/vnd.github.v3+json"
}
$body = @{
    name = $repoName
    description = "NexHunt - Hybrid Bug Bounty Platform (Web2 + Web3)"
    private = $false
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "✓ Repository created successfully!" -ForegroundColor Green
    Write-Host "  URL: $($response.html_url)" -ForegroundColor Cyan
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -match "already exists") {
        Write-Host "✓ Repository already exists" -ForegroundColor Green
    } else {
        Write-Host "⚠ Error: $errorMsg" -ForegroundColor Yellow
        Write-Host "  Creating manually..." -ForegroundColor Yellow
        Start-Process "https://github.com/new"
        $wait = Read-Host "Press Enter after creating repository"
    }
}
Write-Host ""

# Step 3: Setup Remote
Write-Host "[3/5] Setting up remote..." -ForegroundColor Cyan
$existingRemote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    git remote remove origin
}
$remoteUrl = "https://${username}:${token}@github.com/${username}/${repoName}.git"
git remote add origin $remoteUrl
git branch -M main
Write-Host "✓ Remote configured" -ForegroundColor Green
Write-Host ""

# Step 4: Wait a bit for GitHub
Write-Host "[4/5] Waiting for GitHub..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Write-Host "✓ Ready" -ForegroundColor Green
Write-Host ""

# Step 5: Push
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Cyan
$pushOutput = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! Pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Deploy Frontend to Vercel: https://vercel.com" -ForegroundColor White
    Write-Host "  2. Deploy Backend to Railway: https://railway.app" -ForegroundColor White
    Write-Host "  3. See SETUP_GITHUB.md for instructions" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Push output:" -ForegroundColor Yellow
    Write-Host $pushOutput -ForegroundColor White
    Write-Host ""
    Write-Host "⚠ If repository doesn't exist, please create it manually:" -ForegroundColor Yellow
    Write-Host "  https://github.com/new" -ForegroundColor Cyan
    Write-Host ""
}


