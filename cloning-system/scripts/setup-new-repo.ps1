#!/usr/bin/env pwsh

Write-Host "🚀 Complete Boutique Site Clone & Repository Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "This script will:" -ForegroundColor White
Write-Host "1. Clone the original repository" -ForegroundColor Gray
Write-Host "2. Set up a new remote repository" -ForegroundColor Gray
Write-Host "3. Configure your new site" -ForegroundColor Gray
Write-Host "4. Install dependencies" -ForegroundColor Gray

# Function to prompt for input with default value
function Get-InputWithDefault {
    param([string]$Prompt, [string]$Default = "")
    
    if ($Default) {
        $userInput = Read-Host "$Prompt (default: $Default)"
        if ([string]::IsNullOrWhiteSpace($userInput)) {
            return $Default
        }
        return $userInput
    } else {
        do {
            $userInput = Read-Host $Prompt
        } while ([string]::IsNullOrWhiteSpace($userInput))
        return $userInput
    }
}

# Step 1: Repository Information
Write-Host "`n📂 Repository Setup" -ForegroundColor Yellow
$originalRepo = Get-InputWithDefault "Original repository URL (HTTPS or SSH)" "https://github.com/yourusername/rosebud-boutique-builder.git"
$newRepoName = Get-InputWithDefault "New repository name" "my-boutique-store"
$newRepoUrl = Get-InputWithDefault "New repository URL (leave empty to create later)" ""

# Step 2: Clone and Setup
Write-Host "`n📥 Cloning original repository..." -ForegroundColor Green
try {
    git clone $originalRepo $newRepoName
    if ($LASTEXITCODE -ne 0) {
        throw "Git clone failed"
    }
    
    Write-Host "✅ Repository cloned successfully!" -ForegroundColor Green
    
    # Change to new directory
    Set-Location $newRepoName
    
    Write-Host "📂 Current directory: $(Get-Location)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Failed to clone repository. Please check the URL and your internet connection." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Repository Remote Setup
Write-Host "`n🔗 Setting up new repository remote..." -ForegroundColor Green

try {
    # Remove original remote
    git remote remove origin
    Write-Host "✅ Removed original remote" -ForegroundColor Green
    
    if ($newRepoUrl) {
        # Add new remote
        git remote add origin $newRepoUrl
        Write-Host "✅ Added new remote: $newRepoUrl" -ForegroundColor Green
        
        # Ask if user wants to push immediately
        $pushNow = Read-Host "Push to new repository now? (y/N)"
        if ($pushNow -eq 'y' -or $pushNow -eq 'Y') {
            Write-Host "🚀 Pushing to new repository..." -ForegroundColor Green
            git push -u origin main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Successfully pushed to new repository!" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Push failed. You can push manually later with 'git push -u origin main'" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "⚠️ No new repository URL provided." -ForegroundColor Yellow
        Write-Host "To add remote later, use: git remote add origin <your-new-repo-url>" -ForegroundColor Gray
        Write-Host "Then push with: git push -u origin main" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "⚠️ Warning: Could not update git remote. You can do this manually later." -ForegroundColor Yellow
}

# Step 4: Site Configuration
Write-Host "`n📋 Site Configuration" -ForegroundColor Yellow
$siteName = Get-InputWithDefault "Enter site name" "My Boutique Store"
$siteDescription = Get-InputWithDefault "Enter site description" "Premium fashion and accessories"
$siteUrl = Get-InputWithDefault "Enter site URL" "https://myboutique.com"

Write-Host "`n🏢 Business Information" -ForegroundColor Yellow
$businessName = Get-InputWithDefault "Enter business name" $siteName
$businessEmail = Get-InputWithDefault "Enter business email" "contact@myboutique.com"
$businessPhone = Get-InputWithDefault "Enter business phone" "+213-XXX-XXX-XXX"
$businessAddress = Get-InputWithDefault "Enter business address" "Algiers, Algeria"

Write-Host "`n📱 Social Media (optional)" -ForegroundColor Yellow
$facebook = Read-Host "Facebook URL (optional)"
$instagram = Read-Host "Instagram URL (optional)"
$whatsapp = Read-Host "WhatsApp number (optional)"

Write-Host "`n🗄️ Supabase Configuration" -ForegroundColor Yellow
Write-Host "You'll need to create a new Supabase project for this site." -ForegroundColor Gray
$supabaseUrl = Get-InputWithDefault "Enter Supabase URL" "https://your-project.supabase.co"
$supabaseKey = Get-InputWithDefault "Enter Supabase Anon Key"
$storageKey = Get-InputWithDefault "Enter storage key" "my-boutique-session"

Write-Host "`n📢 Discord Webhook (optional)" -ForegroundColor Yellow
$discordWebhook = Read-Host "Discord webhook URL (optional)"

# Step 5: Create Configuration Files
Write-Host "`n⚙️ Creating environment configuration..." -ForegroundColor Green

$envContent = @"
# Site Configuration
VITE_SITE_NAME="$siteName"
VITE_SITE_DESCRIPTION="$siteDescription"
VITE_SITE_URL="$siteUrl"

# Business Information
VITE_BUSINESS_NAME="$businessName"
VITE_BUSINESS_EMAIL="$businessEmail"
VITE_BUSINESS_PHONE="$businessPhone"
VITE_BUSINESS_ADDRESS="$businessAddress"

# Social Media
"@

if ($facebook) { $envContent += "`nVITE_FACEBOOK_URL=`"$facebook`"" }
if ($instagram) { $envContent += "`nVITE_INSTAGRAM_URL=`"$instagram`"" }
if ($whatsapp) { $envContent += "`nVITE_WHATSAPP_NUMBER=`"$whatsapp`"" }

$envContent += @"

# Supabase Configuration (Required)
VITE_SUPABASE_URL="$supabaseUrl"
VITE_SUPABASE_ANON_KEY="$supabaseKey"
VITE_SUPABASE_STORAGE_KEY="$storageKey"

# Discord Webhook (Optional)
"@

if ($discordWebhook) { $envContent += "`nVITE_DISCORD_WEBHOOK_URL=`"$discordWebhook`"" }

$envContent += @"

# Analytics (Optional)
# VITE_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Environment configuration created" -ForegroundColor Green

# Step 6: Install Dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Green
try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies. Please run 'npm install' manually." -ForegroundColor Red
}

# Step 7: Create Site Configuration
Write-Host "`n📝 Creating site configuration..." -ForegroundColor Green

$configContent = @"
interface SiteConfig {
  name: string;
  description: string;
  url: string;
  business: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: import.meta.env.VITE_SITE_NAME || "$siteName",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "$siteDescription",
  url: import.meta.env.VITE_SITE_URL || "$siteUrl",
  business: {
    name: import.meta.env.VITE_BUSINESS_NAME || "$businessName",
    email: import.meta.env.VITE_BUSINESS_EMAIL || "$businessEmail",
    phone: import.meta.env.VITE_BUSINESS_PHONE || "$businessPhone",
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "$businessAddress"
  },
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL,
    instagram: import.meta.env.VITE_INSTAGRAM_URL,
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER
  }
};
"@

# Create src/config directory if it doesn't exist
if (!(Test-Path "src/config")) {
    New-Item -ItemType Directory -Path "src/config" -Force
}

$configContent | Out-File -FilePath "src/config/site.ts" -Encoding UTF8

# Step 8: Copy Templates
Write-Host "`n📋 Copying configuration templates..." -ForegroundColor Green

$templateFiles = @(
    @{ Source = "cloning-system/templates/_redirects"; Dest = "public/_redirects" },
    @{ Source = "cloning-system/templates/supabase-client.ts"; Dest = "src/lib/supabaseClient.ts" },
    @{ Source = "cloning-system/templates/discord-notifications.ts"; Dest = "src/lib/discordNotifications.ts" }
)

foreach ($file in $templateFiles) {
    if (Test-Path $file.Source) {
        $destDir = Split-Path $file.Dest -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force
        }
        Copy-Item $file.Source $file.Dest -Force
        Write-Host "✅ Copied $($file.Source) to $($file.Dest)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Template not found: $($file.Source)" -ForegroundColor Yellow
    }
}

# Step 9: Initial Git Commit
Write-Host "`n📝 Creating initial commit for your new site..." -ForegroundColor Green
try {
    git add .
    git commit -m "Initial setup: Configure new boutique site

- Set up environment configuration
- Configure site branding and business info
- Set up Supabase integration
- Copy configuration templates
- Ready for database setup and deployment

Site: $siteName
Business: $businessName"

    Write-Host "✅ Initial commit created" -ForegroundColor Green
    
    if ($newRepoUrl -and $pushNow -ne 'y' -and $pushNow -ne 'Y') {
        $pushNow2 = Read-Host "Push initial commit now? (y/N)"
        if ($pushNow2 -eq 'y' -or $pushNow2 -eq 'Y') {
            git push -u origin main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Successfully pushed to repository!" -ForegroundColor Green
            }
        }
    }
    
} catch {
    Write-Host "⚠️ Could not create git commit. You can commit manually later." -ForegroundColor Yellow
}

# Final Instructions
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📋 Your New Boutique Site: $siteName" -ForegroundColor Yellow
Write-Host "📂 Location: $(Get-Location)" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 🗄️  Set up your Supabase database:" -ForegroundColor White
Write-Host "   - Go to https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "   - Create a new project" -ForegroundColor Gray
Write-Host "   - Copy SQL from cloning-system/sql/complete-database-schema.sql" -ForegroundColor Gray
Write-Host "   - Run in Supabase SQL Editor" -ForegroundColor Gray
Write-Host "   - Update .env.local with your actual Supabase URL and keys" -ForegroundColor Gray

Write-Host "`n2. 🎨 Customize your site:" -ForegroundColor White
Write-Host "   - Choose colors in cloning-system/templates/tailwind-colors.js" -ForegroundColor Gray
Write-Host "   - Update tailwind.config.ts with your chosen theme" -ForegroundColor Gray
Write-Host "   - Replace logo files in public/ directory" -ForegroundColor Gray

Write-Host "`n3. ⚙️  Configure integrations:" -ForegroundColor White
Write-Host "   - Run: npm run dev" -ForegroundColor Gray
Write-Host "   - Access admin panel to set up Noest Express credentials" -ForegroundColor Gray
Write-Host "   - Test order flow" -ForegroundColor Gray

Write-Host "`n4. 🚀 Deploy:" -ForegroundColor White
Write-Host "   - Push to GitHub/GitLab if you haven't already" -ForegroundColor Gray
Write-Host "   - Deploy to Netlify" -ForegroundColor Gray
Write-Host "   - Set up custom domain" -ForegroundColor Gray

if (!$newRepoUrl) {
    Write-Host "`n⚠️  Repository Remote Setup:" -ForegroundColor Yellow
    Write-Host "You didn't provide a new repository URL. To set it up:" -ForegroundColor White
    Write-Host "1. Create a new repository on GitHub/GitLab" -ForegroundColor Gray
    Write-Host "2. Run: git remote add origin <your-new-repo-url>" -ForegroundColor Gray
    Write-Host "3. Run: git push -u origin main" -ForegroundColor Gray
}

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "- Complete guide: cloning-system/COMPLETE_GUIDE.md" -ForegroundColor Gray
Write-Host "- Troubleshooting: cloning-system/TROUBLESHOOTING.md" -ForegroundColor Gray

Write-Host "`n✨ Ready to start development!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server." -ForegroundColor White

# Run verification script if it exists
if (Test-Path "cloning-system/scripts/verify-setup.js") {
    Write-Host "`n🔍 Running setup verification..." -ForegroundColor Yellow
    try {
        node "cloning-system/scripts/verify-setup.js"
    } catch {
        Write-Host "⚠️ Verification script failed to run, but setup should still work." -ForegroundColor Yellow
    }
}

Write-Host "`n🎊 Happy selling with your new boutique website!" -ForegroundColor Magenta
