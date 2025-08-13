#!/usr/bin/env pwsh

Write-Host "🚀 Boutique Site Clone Setup Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Function to prompt for input with default value
function Get-InputWithDefault {
    param([string]$Prompt, [string]$Default = "")
    
    if ($Default) {
        $input = Read-Host "$Prompt (default: $Default)"
        if ([string]::IsNullOrWhiteSpace($input)) {
            return $Default
        }
        return $input
    } else {
        do {
            $input = Read-Host $Prompt
        } while ([string]::IsNullOrWhiteSpace($input))
        return $input
    }
}

Write-Host "`n📋 Site Information" -ForegroundColor Yellow
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
$supabaseUrl = Get-InputWithDefault "Enter Supabase URL" "https://your-project.supabase.co"
$supabaseKey = Get-InputWithDefault "Enter Supabase Anon Key"
$storageKey = Get-InputWithDefault "Enter storage key" "my-boutique-session"

Write-Host "`n📢 Discord Webhook (optional)" -ForegroundColor Yellow
$discordWebhook = Read-Host "Discord webhook URL (optional)"

# Create .env.local file
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

# Supabase Configuration
VITE_SUPABASE_URL="$supabaseUrl"
VITE_SUPABASE_ANON_KEY="$supabaseKey"
VITE_SUPABASE_STORAGE_KEY="$storageKey"
"@

if ($discordWebhook) { $envContent += "`nVITE_DISCORD_WEBHOOK_URL=`"$discordWebhook`"" }

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Green
try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies. Please run 'npm install' manually." -ForegroundColor Red
}

# Create config file
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

# Copy templates if they exist
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
    }
}

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up your Supabase database:" -ForegroundColor White
Write-Host "   - Copy SQL from cloning-system/sql/complete-database-schema.sql" -ForegroundColor Gray
Write-Host "   - Run in Supabase SQL Editor" -ForegroundColor Gray
Write-Host "2. Configure Noest Express credentials in admin panel" -ForegroundColor White
Write-Host "3. Customize colors in tailwind.config.ts" -ForegroundColor White
Write-Host "4. Replace logo files in public/ directory" -ForegroundColor White
Write-Host "5. Test locally: npm run dev" -ForegroundColor White
Write-Host "6. Deploy to Netlify" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n🚀 Ready to start development!" -ForegroundColor Green
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
