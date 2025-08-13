# 🌹 Boutique Site Cloning Guide

This guide explains how to clone the rosebud-boutique-builder site with identical functionality but different branding, database, and API configurations.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Cloning Process](#step-by-step-cloning-process)
4. [Configuration Files to Modify](#configuration-files-to-modify)
5. [Database Setup](#database-setup)
6. [Styling Customization](#styling-customization)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The rosebud-boutique-builder is an e-commerce platform with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (auth/database/storage)
- **Shipping**: Noest Express API integration
- **Notifications**: Discord webhook integration
- **Payments**: Cash on delivery with delivery fee calculation

Each clone will have:
- ✅ Identical functionality 
- ✅ Independent database
- ✅ Custom styling/branding
- ✅ Separate API credentials

## 📚 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Git installed
- A Supabase account
- Noest Express API credentials
- Discord webhook URL (optional)
- Basic knowledge of React and Tailwind CSS

## 🚀 Step-by-Step Cloning Process

### Step 1: Clone the Repository
```bash
# Clone the original repository
git clone https://github.com/rjewls/rosebud-boutique-builder.git my-boutique-clone

# Navigate to the cloned directory
cd my-boutique-clone

# Install dependencies
npm install
```

### Step 2: Create Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord Webhook (Optional)
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Site Configuration
VITE_SITE_NAME=Your Boutique Name
VITE_SITE_DESCRIPTION=Your boutique description
```

### Step 3: Update Configuration Files

#### 3.1 Update `src/lib/supabaseClient.ts`
Replace the hardcoded values with environment variables:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'your-boutique-auth', // Change this for each clone
  }
});
```

#### 3.2 Update `src/pages/ProductDetail.tsx`
Replace the Discord webhook URL:

```typescript
// Find line ~323 and replace:
const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL || "your-fallback-webhook-url";
```

#### 3.3 Update `src/components/OrderForm.tsx`
Replace the Discord webhook URL:

```typescript
// Find line ~21 and replace:
const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL || "your-fallback-webhook-url";
```

#### 3.4 Update `package.json`
Change the project name and details:

```json
{
  "name": "your-boutique-name",
  "private": true,
  "version": "0.0.0",
  // ... rest of the configuration
}
```

## 🗄️ Database Setup

### Step 4: Create New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your Project URL and anon public key
4. Update your `.env.local` file with these credentials

### Step 5: Set Up Database Schema

Execute these SQL files in your Supabase SQL editor in this order:

#### 5.1 Basic Setup
```sql
-- Run: database_setup.sql
-- This creates the updated_at trigger function
```

#### 5.2 Products Table
```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  oldprice DECIMAL(10,2),
  weight DECIMAL(5,2) DEFAULT 1.0,
  images TEXT[],
  description TEXT,
  colors TEXT[],
  sizes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only authenticated users can update products" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only authenticated users can delete products" ON products FOR DELETE USING (auth.uid() IS NOT NULL);
```

#### 5.3 Orders Table
```sql
-- Run: supabase_orders_table.sql
-- This creates the complete orders table with Noest API integration
```

#### 5.4 Delivery Fees Table
```sql
-- Create delivery_fees table
CREATE TABLE IF NOT EXISTS delivery_fees (
  id SERIAL PRIMARY KEY,
  wilaya_code INTEGER NOT NULL UNIQUE,
  wilaya_name TEXT NOT NULL,
  home_delivery INTEGER NOT NULL DEFAULT 0,
  stopdesk_delivery INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE delivery_fees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view delivery fees" ON delivery_fees FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can modify delivery fees" ON delivery_fees FOR ALL USING (auth.uid() IS NOT NULL);
```

#### 5.5 Noest Express Configuration Table
```sql
-- Run: supabase_noest_express_table.sql
-- This creates the Noest API configuration storage
```

### Step 6: Set Up Supabase Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `product-images`
3. Set the bucket to public
4. Configure the following policies:

```sql
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);
```

### Step 7: Create Admin User

1. Go to Authentication in your Supabase dashboard
2. Create a new user with your admin email and password
3. Note down the user ID for future reference

## 🎨 Styling Customization

### Step 8: Update Tailwind Configuration

#### 8.1 Modify `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Customize your brand colors here
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add your custom color palette
        brand: {
          50: '#fef7ff',
          100: '#fdeeff', 
          200: '#fbdcff',
          300: '#f8b9ff',
          400: '#f186ff',
          500: '#e654ff', // Your main brand color
          600: '#d730ea',
          700: '#b91fc7',
          800: '#9619a3',
          900: '#7a1a82',
        },
      },
      fontFamily: {
        // Customize your fonts
        'brand': ['Your Font', 'sans-serif'],
        'heading': ['Your Heading Font', 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

#### 8.2 Update CSS Variables in `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Update these colors to match your brand */
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    /* ... other color variables ... */
  }

  .dark {
    /* Dark mode color variants */
  }
}

/* Add your custom styles here */
.brand-gradient {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Step 9: Update Component Styling

#### Key files to customize:
- `src/components/Navigation.tsx` - Header/navigation styling
- `src/pages/Home.tsx` - Homepage layout and colors
- `src/pages/ProductDetail.tsx` - Product page styling  
- `src/pages/Admin.tsx` - Admin panel styling
- `src/components/ProductCard.tsx` - Product card appearance

#### Example: Update Navigation branding
```tsx
// In src/components/Navigation.tsx
<Link to="/" className="font-brand text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
  Your Boutique Name
</Link>
```

## ⚙️ Configuration Management

### Step 10: Update Site Configuration

Create `src/config/site.ts`:
```typescript
export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME || "Your Boutique",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "Your boutique description",
  url: "https://your-domain.com",
  links: {
    instagram: "https://instagram.com/yourboutique",
    facebook: "https://facebook.com/yourboutique",
  },
  contact: {
    email: "contact@yourboutique.com",
    phone: "+213XXXXXXXXX",
  }
};
```

### Step 11: Configure Noest API

1. Login to your admin panel at `your-site.com/admin`
2. Go to "Noest Express" configuration
3. Enter your API token and GUID
4. Test the connection with the test order feature

## 🚢 Deployment

### Step 12: Deploy to Netlify

#### 12.1 Build Configuration
Update `netlify.toml`:
```toml
[build]
command = "npm run build"
publish = "dist"
node_version = "20"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[build.environment]
VITE_SUPABASE_URL = "your_supabase_url"
VITE_SUPABASE_ANON_KEY = "your_supabase_anon_key"
```

#### 12.2 Deploy Steps
1. Push your code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

### Step 13: Custom Domain (Optional)
1. Purchase your domain
2. Configure DNS settings in Netlify
3. Set up SSL certificate

## 🧪 Testing

### Step 14: Test Your Clone

#### Functionality Checklist:
- [ ] Homepage loads with your branding
- [ ] Product catalog displays correctly
- [ ] Product detail page works
- [ ] Order form submits successfully
- [ ] Admin login works
- [ ] Admin can add/edit products
- [ ] Image upload works
- [ ] Noest API integration functions
- [ ] Discord notifications work (if configured)
- [ ] Delivery fee calculation is accurate

#### Test Order Flow:
1. Browse products on homepage
2. Click a product to view details
3. Fill order form completely
4. Submit order
5. Check admin panel for order
6. Test Noest API upload
7. Verify Discord notification

## 🔧 Configuration Reference

### Environment Variables
```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook
VITE_SITE_NAME=Your Boutique Name
VITE_SITE_DESCRIPTION=Your boutique description
```

### Files Requiring Updates for Each Clone:

| File | What to Change | Purpose |
|------|---------------|---------|
| `.env.local` | All environment variables | Site configuration |
| `src/lib/supabaseClient.ts` | Database credentials | Database connection |
| `src/pages/ProductDetail.tsx` | Discord webhook URL | Order notifications |
| `src/components/OrderForm.tsx` | Discord webhook URL | Order notifications |
| `tailwind.config.ts` | Brand colors, fonts | Visual styling |
| `src/index.css` | CSS variables, custom styles | Global styling |
| `package.json` | Project name, description | Project metadata |
| `netlify.toml` | Environment variables | Deployment config |

## 🚨 Troubleshooting

### Common Issues:

#### Database Connection Issues
- Verify Supabase URL and key in `.env.local`
- Check RLS policies are correctly set
- Ensure storage bucket is public

#### Styling Problems  
- Clear browser cache after changes
- Verify Tailwind classes are not conflicting
- Check custom CSS specificity

#### API Integration Issues
- Verify Noest credentials in admin panel
- Check CORS proxy configuration in `vite.config.ts`
- Test with simple order first

#### Deployment Problems
- Ensure all environment variables are set in Netlify
- Check build logs for missing dependencies
- Verify dist folder is being published

### Getting Help
- Check browser console for errors
- Review Supabase logs for database issues
- Test API endpoints directly
- Verify all configuration files are updated

## 📝 Maintenance Notes

### Regular Tasks:
- Monitor database storage usage
- Update dependencies periodically
- Backup database regularly
- Monitor API usage limits
- Review and update delivery fees

### Security Considerations:
- Keep API keys secure and never commit to version control
- Regularly rotate API credentials
- Monitor admin access logs
- Keep dependencies updated for security patches

---

## 🎉 Conclusion

Following this guide, you now have a complete clone of the boutique site with:
- ✅ Independent database and storage
- ✅ Custom branding and styling  
- ✅ Separate API credentials
- ✅ Full functionality preserved
- ✅ Ready for deployment

Each clone operates independently while maintaining the same powerful e-commerce features as the original.

**Happy selling! 🛍️**
