#!/bin/bash

# ================================
# BOUTIQUE CLONE SETUP SCRIPT
# ================================
# This script helps you set up a new boutique clone quickly
# Run this after cloning the repository

set -e

echo "🌹 Welcome to the Boutique Clone Setup!"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment template
if [ ! -f ".env.local" ]; then
    echo "📋 Creating environment configuration file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
else
    echo "⚠️  .env.local already exists, skipping..."
fi

# Create .gitignore additions for clones
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Environment variables" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.production" >> .gitignore
    echo "✅ Added environment files to .gitignore"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your actual configuration values"
echo "2. Set up your Supabase database (see CLONING_GUIDE.md)"
echo "3. Configure your Noest Express API credentials"
echo "4. Customize your branding in tailwind.config.ts"
echo "5. Run 'npm run dev' to start development server"
echo ""
echo "📖 For detailed instructions, see CLONING_GUIDE.md"
echo ""
echo "⚠️  IMPORTANT: Never commit .env.local to version control!"
echo "              This file contains sensitive information."
echo ""

# Prompt user to edit .env.local
read -p "Would you like to open .env.local for editing now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vi &> /dev/null; then
        vi .env.local
    else
        echo "Please open .env.local in your preferred text editor"
    fi
fi

echo "Happy cloning! 🛍️"
