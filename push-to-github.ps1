# PowerShell script to push Aqua Loop project to GitHub
# Run this script: .\push-to-github.ps1

$repoUrl = "https://github.com/vishvakk2006-cmd/git-vishva.git"
$projectPath = "C:\Users\vishv\Desktop\Aqua Loop"

Write-Host "=== Pushing Aqua Loop to GitHub ===" -ForegroundColor Cyan
Write-Host "Repository: $repoUrl" -ForegroundColor Yellow
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or add Git to your PATH environment variable." -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
Set-Location $projectPath
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Initialize git if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "Git repository already initialized" -ForegroundColor Green
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin $repoUrl
} else {
    Write-Host "Updating remote URL..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: Aqua Loop - Water & Waste Management Website"
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Note: You may be prompted for GitHub credentials" -ForegroundColor Cyan
Write-Host ""

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your project has been pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "=== ERROR ===" -ForegroundColor Red
    Write-Host "Failed to push to GitHub. Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication required - use GitHub CLI or Personal Access Token" -ForegroundColor Yellow
    Write-Host "2. Repository permissions - ensure you have write access" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To authenticate, you can:" -ForegroundColor Cyan
    Write-Host "- Use GitHub CLI: gh auth login" -ForegroundColor White
    Write-Host "- Use Personal Access Token as password when prompted" -ForegroundColor White
}

