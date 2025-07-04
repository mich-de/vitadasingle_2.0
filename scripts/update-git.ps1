# VitaApp Git Update Script for Windows
# Automates the process of committing and pushing changes to Git repository

Write-Host "🔄 VitaApp Git Update Tool" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$ErrorCount = 0

function Write-Error-Message {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    $script:ErrorCount++
}

function Write-Success-Message {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning-Message {
    param($Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

# Check if we're in the right directory (project root)
if (!(Test-Path ".git")) {
    Write-Error-Message "Not in a Git repository. Please run from the root of your Git repository."
    exit 1
}

# Check Git status
Write-Host "📊 Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ([string]::IsNullOrEmpty($gitStatus)) {
    Write-Warning-Message "No changes detected in the repository."
    exit 0
}

# Count modified, added, and deleted files
$modifiedFiles = ($gitStatus | Where-Object { $_ -match "^ M" }).Count
$addedFiles = ($gitStatus | Where-Object { $_ -match "^\?\?" }).Count
$deletedFiles = ($gitStatus | Where-Object { $_ -match "^ D" }).Count

Write-Host "Found $modifiedFiles modified files, $addedFiles new files, and $deletedFiles deleted files." -ForegroundColor White

Write-Host ""
Write-Host "📝 Files to be committed:" -ForegroundColor Yellow
Write-Host $gitStatus -ForegroundColor White

# Ask for commit message
Write-Host ""
Write-Host "💬 Commit Message" -ForegroundColor Yellow
Write-Host "-------------" -ForegroundColor Yellow

$commitType = Read-Host "Enter commit type (feat, fix, docs, style, refactor, test, chore)"
while ($commitType -notmatch "^(feat|fix|docs|style|refactor|test|chore)$") {
    Write-Warning-Message "Invalid commit type. Please use one of: feat, fix, docs, style, refactor, test, chore"
    $commitType = Read-Host "Enter commit type"
}

$commitScope = Read-Host "Enter commit scope (optional, press Enter to skip)"
$commitMessage = Read-Host "Enter commit message"

# Format the commit message according to conventional commits
if ([string]::IsNullOrEmpty($commitScope)) {
    $fullCommitMessage = "${commitType}: $commitMessage"
} else {
    $fullCommitMessage = "${commitType}($commitScope): $commitMessage"
}

# Stage and commit changes
Write-Host ""
Write-Host "🚀 Updating Git Repository" -ForegroundColor Yellow

# Stage all changes
Write-Host "Staging changes..." -ForegroundColor White
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Error-Message "Failed to stage changes."
    exit 1
}

# Commit changes
Write-Host "Committing with message: `"$fullCommitMessage`"" -ForegroundColor White
git commit -m "$fullCommitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Error-Message "Failed to commit changes."
    exit 1
} else {
    Write-Success-Message "Changes committed successfully."
}

# Ask if user wants to push changes
$pushChanges = Read-Host "Do you want to push changes to remote repository? (y/n)"

if ($pushChanges -eq "y") {
    # Get current branch
    $currentBranch = git rev-parse --abbrev-ref HEAD
    
    Write-Host "Pushing to branch `"$currentBranch`"..." -ForegroundColor White
    git push origin $currentBranch
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Failed to push changes to remote repository."
        exit 1
    } else {
        Write-Success-Message "Changes pushed successfully to `"$currentBranch`"."
    }
}

Write-Host ""
Write-Host "🎯 Summary" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan

if ($ErrorCount -eq 0) {
    Write-Success-Message "Git update completed successfully! 🚀"
    exit 0
} else {
    Write-Error-Message "Git update completed with $ErrorCount error(s)."
    exit 1
}