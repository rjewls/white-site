# Complete Site Cloning Guide
*Create unlimited independent boutique websites with identical functionality*

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [What You'll Get](#what-youll-get)
3. [Prerequisites](#prerequisites)
4. [Step 1: Environment Setup](#step-1-environment-setup)
5. [Step 2: Database Setup](#step-2-database-setup)
6. [Step 3: Configuration](#step-3-configuration)
7. [Step 4: Customization](#step-4-customization)
8. [Step 5: Deployment](#step-5-deployment)
9. [Complete File Templates](#complete-file-templates)
10. [Setup Scripts](#setup-scripts)
11. [Troubleshooting](#troubleshooting)
12. [Post-Launch Checklist](#post-launch-checklist)

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# 1. Clone the repository
git clone <your-original-repo-url> my-new-boutique
cd my-new-boutique

# 2. Run the setup script
# For Windows PowerShell:
.\setup-clone.ps1

# For Linux/Mac:
chmod +x setup-clone.sh
./setup-clone.sh

# 3. Follow the prompts to configure your new site
```

### Option 2: Manual Setup
Follow the detailed steps below if you prefer manual configuration or need custom setup.

---

## 🎯 What You'll Get

Each clone will be a completely independent website with:
- ✅ Separate Supabase database
- ✅ Independent Noest Express shipping credentials
- ✅ Custom branding and colors
- ✅ Unique Discord notifications
- ✅ Independent user authentication
- ✅ Full product & order management
- ✅ Same functionality as original

---

## 📋 Prerequisites

### Required Accounts
- **Supabase Account** (free tier available)
- **Noest Express Account** (for shipping in Algeria)
- **Discord Server** (for order notifications)
- **Netlify Account** (for deployment, free tier available)

### Technical Requirements
- Node.js 18+ installed
- Git installed
- Text editor (VS Code recommended)
- Basic command line knowledge

---

## 🔧 Step 1: Environment Setup

### 1.1 Clone and Prepare Repository
```bash
# Clone your original repository
git clone <your-repo-url> my-boutique-clone
cd my-boutique-clone

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 1.2 Environment Variables Template
Create `.env.local` with these variables:

```env
# Site Configuration
VITE_SITE_NAME="My Boutique Store"
VITE_SITE_DESCRIPTION="Premium fashion and accessories"
VITE_SITE_URL="https://myboutique.com"

# Business Information
VITE_BUSINESS_NAME="My Boutique LLC"
VITE_BUSINESS_EMAIL="contact@myboutique.com"
VITE_BUSINESS_PHONE="+213-XXX-XXX-XXX"
VITE_BUSINESS_ADDRESS="123 Fashion Street, Algiers"

# Social Media
VITE_FACEBOOK_URL="https://facebook.com/myboutique"
VITE_INSTAGRAM_URL="https://instagram.com/myboutique"
VITE_WHATSAPP_NUMBER="+213XXXXXXXXX"

# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_SUPABASE_STORAGE_KEY="your-storage-key"

# Discord Webhook (Optional)
VITE_DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your-webhook"

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Create New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and name your project
4. Set a strong database password
5. Wait for project creation (2-3 minutes)

### 2.2 Run Database Setup SQL

Copy and run this complete SQL script in your Supabase SQL Editor:

```sql
-- Enable Row Level Security and create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    oldprice DECIMAL(10,2),
    weight DECIMAL(5,2) DEFAULT 1.0,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_2 TEXT DEFAULT '',
    adresse TEXT NOT NULL,
    wilaya_id INTEGER NOT NULL CHECK (wilaya_id >= 1 AND wilaya_id <= 48),
    commune TEXT NOT NULL,
    produit TEXT NOT NULL,
    montant DECIMAL(10,2) NOT NULL CHECK (montant > 0),
    poids DECIMAL(5,2) DEFAULT 1.0 CHECK (poids > 0),
    stop_desk INTEGER DEFAULT 0 CHECK (stop_desk IN (0, 1)),
    delivery_option TEXT DEFAULT 'home',
    tracking TEXT,
    is_validated BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    station_code TEXT DEFAULT '',
    product_id UUID,
    product_title TEXT,
    product_price DECIMAL(10,2),
    selected_color TEXT,
    selected_size TEXT,
    quantity INTEGER DEFAULT 1,
    customer_name TEXT,
    customer_phone TEXT,
    delivery_address TEXT,
    total_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery fees table
CREATE TABLE IF NOT EXISTS public.delivery_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wilaya_code INTEGER UNIQUE NOT NULL CHECK (wilaya_code >= 1 AND wilaya_code <= 48),
    wilaya_name TEXT NOT NULL,
    home_delivery INTEGER NOT NULL DEFAULT 600,
    stopdesk_delivery INTEGER NOT NULL DEFAULT 400,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create noest_express_config table
CREATE TABLE IF NOT EXISTS public.noest_express_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_token TEXT NOT NULL,
    guid TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noest_express_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are editable by authenticated users" ON public.products FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for orders
CREATE POLICY "Orders are viewable by authenticated users" ON public.orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Orders are editable by authenticated users" ON public.orders FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for delivery_fees
CREATE POLICY "Delivery fees are viewable by everyone" ON public.delivery_fees FOR SELECT USING (true);
CREATE POLICY "Delivery fees are editable by authenticated users" ON public.delivery_fees FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for noest_express_config
CREATE POLICY "Noest config is viewable by authenticated users" ON public.noest_express_config FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Noest config is editable by authenticated users" ON public.noest_express_config FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders(tracking);
CREATE INDEX IF NOT EXISTS idx_delivery_fees_wilaya_code ON public.delivery_fees(wilaya_code);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_delivery_fees_updated_at BEFORE UPDATE ON public.delivery_fees FOR EACH ROW EXECUTE FUNCTION update_delivery_fees_updated_at_column();
CREATE OR REPLACE TRIGGER update_noest_config_updated_at BEFORE UPDATE ON public.noest_express_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default delivery fees for all 48 Algerian wilayas
INSERT INTO public.delivery_fees (wilaya_code, wilaya_name, home_delivery, stopdesk_delivery) VALUES
(1, 'Adrar', 800, 600),
(2, 'Chlef', 600, 400),
(3, 'Laghouat', 700, 500),
(4, 'Oum El Bouaghi', 600, 400),
(5, 'Batna', 600, 400),
(6, 'Béjaïa', 600, 400),
(7, 'Biskra', 700, 500),
(8, 'Béchar', 900, 700),
(9, 'Blida', 500, 350),
(10, 'Bouira', 600, 400),
(11, 'Tamanrasset', 1200, 1000),
(12, 'Tébessa', 700, 500),
(13, 'Tlemcen', 700, 500),
(14, 'Tiaret', 650, 450),
(15, 'Tizi Ouzou', 550, 400),
(16, 'Alger', 400, 300),
(17, 'Djelfa', 700, 500),
(18, 'Jijel', 600, 400),
(19, 'Sétif', 600, 400),
(20, 'Saïda', 700, 500),
(21, 'Skikda', 600, 400),
(22, 'Sidi Bel Abbès', 700, 500),
(23, 'Annaba', 650, 450),
(24, 'Guelma', 650, 450),
(25, 'Constantine', 600, 400),
(26, 'Médéa', 550, 400),
(27, 'Mostaganem', 650, 450),
(28, 'M\'Sila', 650, 450),
(29, 'Mascara', 650, 450),
(30, 'Ouargla', 800, 600),
(31, 'Oran', 600, 400),
(32, 'El Bayadh', 750, 550),
(33, 'Illizi', 1000, 800),
(34, 'Bordj Bou Arréridj', 600, 400),
(35, 'Boumerdès', 500, 350),
(36, 'El Tarf', 700, 500),
(37, 'Tindouf', 1100, 900),
(38, 'Tissemsilt', 650, 450),
(39, 'El Oued', 750, 550),
(40, 'Khenchela', 650, 450),
(41, 'Souk Ahras', 650, 450),
(42, 'Tipaza', 500, 350),
(43, 'Mila', 600, 400),
(44, 'Aïn Defla', 600, 400),
(45, 'Naâma', 800, 600),
(46, 'Aïn Témouchent', 700, 500),
(47, 'Ghardaïa', 750, 550),
(48, 'Relizane', 650, 450)
ON CONFLICT (wilaya_code) DO NOTHING;

-- Create view for order analytics
CREATE OR REPLACE VIEW order_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as order_date,
    status,
    COUNT(*) as order_count,
    SUM(montant) as total_revenue,
    AVG(montant) as avg_order_value
FROM orders 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), status
ORDER BY order_date DESC;

-- Grant permissions for the view
GRANT SELECT ON order_analytics TO authenticated;
```

### 2.3 Configure Storage Policies

In Supabase Dashboard → Storage → Policies, add these policies for `product-images` bucket:

```sql
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND bucket_id = 'product-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (auth.uid() IS NOT NULL AND bucket_id = 'product-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (auth.uid() IS NOT NULL AND bucket_id = 'product-images');
```

---

## ⚙️ Step 3: Configuration

### 3.1 Update Configuration Files

Create `src/config/site.ts`:

```typescript
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
  analytics?: {
    googleAnalyticsId?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: import.meta.env.VITE_SITE_NAME || "Belle Elle Boutique",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "Premium fashion and accessories",
  url: import.meta.env.VITE_SITE_URL || "https://belle-elle-boutique.netlify.app",
  business: {
    name: import.meta.env.VITE_BUSINESS_NAME || "Belle Elle",
    email: import.meta.env.VITE_BUSINESS_EMAIL || "contact@belle-elle.com",
    phone: import.meta.env.VITE_BUSINESS_PHONE || "+213-XXX-XXX-XXX",
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "Algiers, Algeria"
  },
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL,
    instagram: import.meta.env.VITE_INSTAGRAM_URL,
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER
  },
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID
  }
};
```

### 3.2 Update Supabase Client

Ensure `src/lib/supabaseClient.ts` uses environment variables:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-default-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-default-anon-key';
const storageKey = import.meta.env.VITE_SUPABASE_STORAGE_KEY || 'belle-elle-session';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.localStorage,
    storageKey: storageKey,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export { supabaseUrl, supabaseKey, storageKey };
```

### 3.3 Update Discord Notifications

Create `src/lib/discordNotifications.ts`:

```typescript
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

export const sendDiscordNotification = async (orderData: any) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping notification');
    return;
  }

  try {
    const embed = {
      title: "🛍️ New Order Received!",
      color: 0xE91E63,
      fields: [
        { name: "Customer", value: orderData.client || "N/A", inline: true },
        { name: "Phone", value: orderData.phone || "N/A", inline: true },
        { name: "Product", value: orderData.produit || "N/A", inline: false },
        { name: "Amount", value: `${orderData.montant || 0} DA`, inline: true },
        { name: "Wilaya", value: orderData.wilaya_id?.toString() || "N/A", inline: true },
        { name: "Commune", value: orderData.commune || "N/A", inline: true }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Belle Elle Boutique" }
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (error) {
    console.error('Discord notification failed:', error);
  }
};
```

---

## 🎨 Step 4: Customization

### 4.1 Customize Colors and Branding

Edit `tailwind.config.ts` to match your brand:

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Customize these colors for your brand
        primary: {
          50: '#fdf2f8',   // Very light pink
          100: '#fce7f3',  // Light pink
          500: '#ec4899',  // Main brand color
          600: '#db2777',  // Darker pink
          900: '#831843'   // Very dark pink
        },
        // Add your custom colors here
        brand: {
          primary: '#your-primary-color',
          secondary: '#your-secondary-color',
          accent: '#your-accent-color'
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        // Add your custom fonts here
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
        // Add your custom gradients here
      }
    }
  },
  plugins: []
};
```

### 4.2 Update Site Metadata

Edit `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Update these for your site -->
  <title>Your Boutique Name</title>
  <meta name="description" content="Your boutique description" />
  <meta name="keywords" content="fashion, boutique, algeria, your-keywords" />
  
  <!-- Social Media Meta Tags -->
  <meta property="og:title" content="Your Boutique Name" />
  <meta property="og:description" content="Your boutique description" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content="https://yourdomain.com" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 4.3 Add Custom Logo

1. Replace logo files in `public/` directory:
   - `logo.png` - Main logo
   - `logo-white.png` - White version for dark backgrounds
   - `favicon.svg` - Site favicon
   - `og-image.png` - Social media preview image

---

## 🚀 Step 5: Deployment

### 5.1 Netlify Deployment

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   Go to Site Settings → Environment Variables and add all your environment variables from `.env.local`

4. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   /api/noest/*  https://app.noest-dz.com/api/public/:splat  200
   ```

### 5.2 Custom Domain (Optional)

1. In Netlify Dashboard → Domain Management
2. Add custom domain
3. Configure DNS records with your domain provider
4. Update `VITE_SITE_URL` environment variable

---

## 📁 Complete File Templates

### Setup Script for PowerShell (setup-clone.ps1)

```powershell
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

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up your Supabase database (run the SQL script)" -ForegroundColor White
Write-Host "2. Configure Noest Express credentials in admin panel" -ForegroundColor White
Write-Host "3. Customize colors in tailwind.config.ts" -ForegroundColor White
Write-Host "4. Replace logo files in public/ directory" -ForegroundColor White
Write-Host "5. Test locally: npm run dev" -ForegroundColor White
Write-Host "6. Deploy to Netlify" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n🚀 Ready to start development!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server." -ForegroundColor White
```

### Setup Script for Bash (setup-clone.sh)

```bash
#!/bin/bash

echo "🚀 Boutique Site Clone Setup Script"
echo "===================================="

# Function to prompt for input with default value
prompt_with_default() {
    local prompt=$1
    local default=$2
    
    if [ -n "$default" ]; then
        read -p "$prompt (default: $default): " input
        echo "${input:-$default}"
    else
        while [ -z "$input" ]; do
            read -p "$prompt: " input
        done
        echo "$input"
    fi
}

echo ""
echo "📋 Site Information"
site_name=$(prompt_with_default "Enter site name" "My Boutique Store")
site_description=$(prompt_with_default "Enter site description" "Premium fashion and accessories")
site_url=$(prompt_with_default "Enter site URL" "https://myboutique.com")

echo ""
echo "🏢 Business Information"
business_name=$(prompt_with_default "Enter business name" "$site_name")
business_email=$(prompt_with_default "Enter business email" "contact@myboutique.com")
business_phone=$(prompt_with_default "Enter business phone" "+213-XXX-XXX-XXX")
business_address=$(prompt_with_default "Enter business address" "Algiers, Algeria")

echo ""
echo "📱 Social Media (optional)"
read -p "Facebook URL (optional): " facebook
read -p "Instagram URL (optional): " instagram
read -p "WhatsApp number (optional): " whatsapp

echo ""
echo "🗄️ Supabase Configuration"
supabase_url=$(prompt_with_default "Enter Supabase URL" "https://your-project.supabase.co")
supabase_key=$(prompt_with_default "Enter Supabase Anon Key")
storage_key=$(prompt_with_default "Enter storage key" "my-boutique-session")

echo ""
echo "📢 Discord Webhook (optional)"
read -p "Discord webhook URL (optional): " discord_webhook

# Create .env.local file
echo ""
echo "⚙️ Creating environment configuration..."

cat > .env.local << EOL
# Site Configuration
VITE_SITE_NAME="$site_name"
VITE_SITE_DESCRIPTION="$site_description"
VITE_SITE_URL="$site_url"

# Business Information
VITE_BUSINESS_NAME="$business_name"
VITE_BUSINESS_EMAIL="$business_email"
VITE_BUSINESS_PHONE="$business_phone"
VITE_BUSINESS_ADDRESS="$business_address"

# Social Media
EOL

[ -n "$facebook" ] && echo "VITE_FACEBOOK_URL=\"$facebook\"" >> .env.local
[ -n "$instagram" ] && echo "VITE_INSTAGRAM_URL=\"$instagram\"" >> .env.local
[ -n "$whatsapp" ] && echo "VITE_WHATSAPP_NUMBER=\"$whatsapp\"" >> .env.local

cat >> .env.local << EOL

# Supabase Configuration
VITE_SUPABASE_URL="$supabase_url"
VITE_SUPABASE_ANON_KEY="$supabase_key"
VITE_SUPABASE_STORAGE_KEY="$storage_key"
EOL

[ -n "$discord_webhook" ] && echo "VITE_DISCORD_WEBHOOK_URL=\"$discord_webhook\"" >> .env.local

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please run 'npm install' manually."
fi

# Create config file
echo ""
echo "📝 Creating site configuration..."

mkdir -p src/config

cat > src/config/site.ts << EOL
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
  name: import.meta.env.VITE_SITE_NAME || "$site_name",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "$site_description",
  url: import.meta.env.VITE_SITE_URL || "$site_url",
  business: {
    name: import.meta.env.VITE_BUSINESS_NAME || "$business_name",
    email: import.meta.env.VITE_BUSINESS_EMAIL || "$business_email",
    phone: import.meta.env.VITE_BUSINESS_PHONE || "$business_phone",
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "$business_address"
  },
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL,
    instagram: import.meta.env.VITE_INSTAGRAM_URL,
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER
  }
};
EOL

echo ""
echo "✅ Setup Complete!"
echo "================================================"
echo "📋 Next Steps:"
echo "1. Set up your Supabase database (run the SQL script)"
echo "2. Configure Noest Express credentials in admin panel"
echo "3. Customize colors in tailwind.config.ts"
echo "4. Replace logo files in public/ directory"
echo "5. Test locally: npm run dev"
echo "6. Deploy to Netlify"
echo "================================================"

echo ""
echo "🚀 Ready to start development!"
echo "Run 'npm run dev' to start the development server."
```

### Netlify Configuration (_redirects)

Create `public/_redirects`:

```
/*    /index.html   200
/api/noest/*  https://app.noest-dz.com/api/public/:splat  200
```

### Environment Variables Template (.env.example)

```env
# Site Configuration
VITE_SITE_NAME="My Boutique Store"
VITE_SITE_DESCRIPTION="Premium fashion and accessories"
VITE_SITE_URL="https://myboutique.com"

# Business Information
VITE_BUSINESS_NAME="My Boutique LLC"
VITE_BUSINESS_EMAIL="contact@myboutique.com"
VITE_BUSINESS_PHONE="+213-XXX-XXX-XXX"
VITE_BUSINESS_ADDRESS="123 Fashion Street, Algiers"

# Social Media (Optional)
VITE_FACEBOOK_URL="https://facebook.com/myboutique"
VITE_INSTAGRAM_URL="https://instagram.com/myboutique"
VITE_WHATSAPP_NUMBER="+213XXXXXXXXX"

# Supabase Configuration (Required)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_SUPABASE_STORAGE_KEY="your-storage-key"

# Discord Webhook (Optional)
VITE_DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your-webhook"

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Environment Variables Not Loading
**Problem**: Site shows default values instead of custom configuration
**Solution**: 
- Ensure `.env.local` file is in project root
- Restart development server: `npm run dev`
- Check variable names start with `VITE_`

#### 2. Supabase Connection Issues
**Problem**: Database operations fail
**Solutions**:
- Verify Supabase URL and key in `.env.local`
- Check RLS policies are enabled
- Ensure user is authenticated for protected operations

#### 3. Noest Express API Errors
**Problem**: Shipping operations fail
**Solutions**:
- Verify API token and GUID in admin panel
- Check if credentials are active in Noest dashboard
- Use Netlify deployment for production API calls

#### 4. Image Upload Failures
**Problem**: Product images fail to upload
**Solutions**:
- Check Supabase storage policies
- Verify `product-images` bucket exists
- Ensure bucket is set to public

#### 5. Build Failures
**Problem**: `npm run build` fails
**Solutions**:
- Check all environment variables are set
- Verify TypeScript types are correct
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

#### 6. Deployment Issues
**Problem**: Site doesn't work after deployment
**Solutions**:
- Check all environment variables are set in Netlify
- Verify `_redirects` file is in `public/` directory
- Check build logs for errors

---

## ✅ Post-Launch Checklist

### Testing Phase
- [ ] **Basic Functionality**
  - [ ] Homepage loads correctly
  - [ ] Product catalog displays
  - [ ] Product detail pages work
  - [ ] Order form functions
  - [ ] Admin panel accessible

- [ ] **Authentication**
  - [ ] Admin login works
  - [ ] User sessions persist
  - [ ] Logout functions properly

- [ ] **Database Operations**
  - [ ] Products can be added/edited/deleted
  - [ ] Orders are saved correctly
  - [ ] Delivery fees load properly

- [ ] **Integrations**
  - [ ] Noest Express credentials saved
  - [ ] Test order upload works
  - [ ] Discord notifications sent (if configured)

### Performance & SEO
- [ ] **Site Speed**
  - [ ] Images optimized and loading quickly
  - [ ] Initial page load under 3 seconds
  - [ ] Mobile performance acceptable

- [ ] **SEO Setup**
  - [ ] Meta tags updated
  - [ ] Social media previews work
  - [ ] Sitemap generated (if applicable)

### Security
- [ ] **Data Protection**
  - [ ] RLS policies working
  - [ ] Admin panel protected
  - [ ] API credentials secured

### Monitoring
- [ ] **Analytics**
  - [ ] Google Analytics working (if configured)
  - [ ] Order tracking functional
  - [ ] Error monitoring in place

- [ ] **Backups**
  - [ ] Database backup strategy
  - [ ] Code repository secured
  - [ ] Environment variables documented

---

## 🚀 Advanced Customization

### Multi-language Support
To add additional languages, extend the `LanguageContext.tsx`:

```typescript
const translations = {
  en: { /* existing translations */ },
  ar: { /* existing translations */ },
  fr: { 
    // Add French translations
    'common.welcome': 'Bienvenue',
    'common.products': 'Produits',
    // ... more translations
  }
};
```

### Custom Payment Methods
To integrate additional payment methods, extend the order form and add new payment processing logic.

### Advanced Analytics
Integrate with Google Analytics 4, Facebook Pixel, or other tracking services by adding the tracking codes to `index.html`.

---

## 📞 Support and Resources

### Getting Help
- **Documentation**: This guide covers most scenarios
- **Community**: Create issues on GitHub for bugs
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Noest Express**: Contact their support for API issues

### Useful Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📝 License and Usage

This cloning guide is part of the boutique site template. You may:
- ✅ Create unlimited clones for personal/commercial use
- ✅ Modify and customize as needed
- ✅ Use for client projects

Please maintain attribution in code comments where possible.

---

**Happy Cloning! 🎉**

*Create unlimited beautiful boutique websites with this comprehensive cloning system.*
