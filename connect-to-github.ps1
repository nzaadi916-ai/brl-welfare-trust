# Git and GitHub Connection Helper Script for BRL Welfare Trust
# Run this script by right-clicking it and selecting "Run with PowerShell"

$ErrorActionPreference = "Stop"
Clear-Host

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  BRL Welfare Trust - GitHub Connector Tool" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Locate Git executable
$gitPath = ""
$commonPaths = @(
    "git.exe",
    "$PSScriptRoot\mingit\cmd\git.exe",
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
)

foreach ($path in $commonPaths) {
    $testResult = Get-Command $path -ErrorAction SilentlyContinue
    if ($testResult) {
        $gitPath = $testResult.Source
        break
    }
}

if ($gitPath -eq "") {
    # Check if mingit.zip exists in script directory and extract it
    $localZip = "$PSScriptRoot\mingit.zip"
    $localDest = "$PSScriptRoot\mingit"
    if (Test-Path $localZip) {
        Write-Host "[-] Found downloaded portable Git (mingit.zip)." -ForegroundColor Yellow
        Write-Host "[-] Extracting files, please wait..." -ForegroundColor Gray
        try {
            if (!(Test-Path $localDest)) {
                New-Item -ItemType Directory -Path $localDest | Out-Null
            }
            Expand-Archive -Path $localZip -DestinationPath $localDest -Force
            Remove-Item -Path $localZip -Force
            $gitPath = "$localDest\cmd\git.exe"
            Write-Host "[+] Git extracted successfully!" -ForegroundColor Green
        } catch {
            Write-Host "[x] Failed to extract mingit.zip: $_" -ForegroundColor Red
        }
    }
}

if ($gitPath -eq "") {
    Write-Host "[!] Git is not yet fully installed or not found in system paths." -ForegroundColor Yellow
    Write-Host "[-] Let's attempt to trigger the Git installer..." -ForegroundColor Gray
    
    try {
        Write-Host "[-] Launching Git installation. Please accept the Windows administrator prompt (UAC) if it appears..." -ForegroundColor Yellow
        winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
        Write-Host "[+] Git installed successfully! Please restart this script to connect to GitHub." -ForegroundColor Green
    } catch {
        Write-Host "[x] Failed to install Git automatically. Please download and install Git manually from: https://git-scm.com/download/win" -ForegroundColor Red
        Write-Host "    After installing Git, run this script again." -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Press Enter to exit..."
    exit
}

Write-Host "[+] Git found at: $gitPath" -ForegroundColor Green
Write-Host ""

# 2. Check if Git is initialized
if (!(Test-Path ".git")) {
    Write-Host "[-] Initializing a new Git repository..." -ForegroundColor Gray
    & $gitPath init
    & $gitPath branch -M main
    Write-Host "[+] Git repository initialized on branch 'main'." -ForegroundColor Green
} else {
    Write-Host "[+] Existing Git repository found." -ForegroundColor Green
}

# 3. Add and Commit files
Write-Host "[-] Adding project files to staging..." -ForegroundColor Gray
& $gitPath add .

# Set placeholder config if not set
$gitConfigName = & $gitPath config user.name
$gitConfigEmail = & $gitPath config user.email

if ([string]::IsNullOrEmpty($gitConfigName)) {
    & $gitPath config user.name "BRL Trust Admin"
}
if ([string]::IsNullOrEmpty($gitConfigEmail)) {
    & $gitPath config user.email "admin@bilqeesraziatrust.org"
}

Write-Host "[-] Committing changes..." -ForegroundColor Gray
try {
    & $gitPath commit -m "Initial commit - Complete BRL Welfare Trust Website" -q
    Write-Host "[+] Files successfully committed!" -ForegroundColor Green
} catch {
    Write-Host "[i] No new changes to commit." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "----------------------------------------------" -ForegroundColor Gray
Write-Host "  Step 2: Connect to GitHub Repository" -ForegroundColor Cyan
Write-Host "----------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "Please create a new repository on your GitHub account:"
Write-Host "1. Go to https://github.com/new"
Write-Host "2. Name it: brl-welfare-trust (or anything you like)"
Write-Host "3. Keep it Public, do NOT add a README, gitignore, or license."
Write-Host "4. Click 'Create repository' and copy the URL (ends in .git)."
Write-Host ""

# 4. Get Remote URL
$existingRemote = & $gitPath remote get-url origin -ErrorAction SilentlyContinue
if ($existingRemote) {
    Write-Host "[i] Existing remote origin found: $existingRemote" -ForegroundColor Yellow
    $changeRemote = Read-Host "Do you want to change it? (y/n)"
    if ($changeRemote.ToLower() -eq 'y') {
        & $gitPath remote remove origin
        $existingRemote = ""
    }
}

if ([string]::IsNullOrEmpty($existingRemote)) {
    $repoUrl = ""
    while ($repoUrl -eq "") {
        $inputUrl = Read-Host "Paste your GitHub Repository URL (e.g., https://github.com/username/repo-name.git)"
        if ($inputUrl -match "^https://github\.com/.+\.git$") {
            $repoUrl = $inputUrl
        } else {
            Write-Host "[x] Invalid URL format. It must start with https://github.com/ and end with .git" -ForegroundColor Red
        }
    }
    
    & $gitPath remote add origin $repoUrl
    Write-Host "[+] Remote origin added successfully: $repoUrl" -ForegroundColor Green
} else {
    $repoUrl = $existingRemote
}

# 5. Push to GitHub
Write-Host ""
Write-Host "[-] Pushing files to GitHub main branch..." -ForegroundColor Gray
Write-Host "[!] Note: A secure Windows window may popup asking you to log in via browser." -ForegroundColor Yellow
Write-Host "    Click 'Sign in with your browser' and authorize it." -ForegroundColor Yellow
Write-Host ""

try {
    & $gitPath push -u origin main --force
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Website is connected to GitHub!" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "To make it live on GitHub Pages:"
    Write-Host "1. Go to your repository settings page: $($repoUrl.Replace('.git', ''))/settings/pages"
    Write-Host "2. Under 'Branch', select 'main' and '/(root)'"
    Write-Host "3. Click 'Save'."
    Write-Host "4. Your live link will appear at the top in 1-2 minutes!" -ForegroundColor Green
} catch {
    Write-Host "[x] Pushing failed. Check your internet connection and GitHub permissions." -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit..."
