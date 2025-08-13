# ================================
# BOUTIQUE CLONE SETUP SCRIPT (PowerShell)
# ================================
# This script helps you set up a new boutique clone quickly
# Run this after cloning the repository
# Usage: .\setup-clone.ps1

Write-Host "🌹 Welcome to the Boutique Clone Setup!" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Copy environment template
if (!(Test-Path ".env.local")) {
    Write-Host "📋 Creating environment configuration file..." -ForegroundColor Blue
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Created .env.local from template" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local already exists, skipping..." -ForegroundColor Yellow
}

# Create .gitignore additions for clones
$gitignoreContent = Get-Content .gitignore -ErrorAction SilentlyContinue
if ($gitignoreContent -notcontains ".env.local") {
    Add-Content .gitignore ""
    Add-Content .gitignore "# Environment variables"
    Add-Content .gitignore ".env.local"
    Add-Content .gitignore ".env.production"
    Write-Host "✅ Added environment files to .gitignore" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your actual configuration values" -ForegroundColor White
Write-Host "2. Set up your Supabase database (see CLONING_GUIDE.md)" -ForegroundColor White
Write-Host "3. Configure your Noest Express API credentials" -ForegroundColor White
Write-Host "4. Customize your branding in tailwind.config.ts" -ForegroundColor White
Write-Host "5. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see CLONING_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env.local to version control!" -ForegroundColor Red
Write-Host "              This file contains sensitive information." -ForegroundColor Red
Write-Host ""

# Prompt user to edit .env.local
$response = Read-Host "Would you like to open .env.local for editing now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code .env.local
    } elseif (Get-Command notepad -ErrorAction SilentlyContinue) {
        notepad .env.local
    } else {
        Write-Host "Please open .env.local in your preferred text editor" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Happy cloning! 🛍️" -ForegroundColor Magenta
