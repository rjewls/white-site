# 🎯 Complete Boutique Site Cloning System

**Create unlimited independent boutique websites with identical functionality**

This folder contains everything you need to create perfect clones of your boutique site, each with separate databases, branding, and API credentials while maintaining the same powerful functionality.

---

## 📁 Folder Structure

```
cloning-system/
├── README.md                    # This file - overview and quick start
├── COMPLETE_GUIDE.md           # Comprehensive step-by-step manual guide
├── TROUBLESHOOTING.md          # Common issues and solutions
├── templates/
│   ├── .env.example            # Environment variables template
│   ├── site-config.ts          # Site configuration template
│   ├── supabase-client.ts      # Supabase client template
│   ├── discord-notifications.ts # Discord integration template
│   ├── _redirects              # Netlify redirects template
│   └── tailwind-colors.js      # Custom color schemes
└── sql/
    ├── complete-database-schema.sql # Full database setup
    ├── delivery-fees-only.sql      # Just delivery fees data
    └── sample-data.sql              # Sample products and orders
```

---

## 🚀 Manual Setup Process

**Create completely independent boutique sites by following these manual steps:**

### Step 1: Clone and Setup Repository
```bash
# Clone the original repository
git clone https://github.com/rjewls/rosebud-boutique-builder my-new-boutique
cd my-new-boutique

# Remove original remote and add your new one
git remote remove origin
git remote add origin <your-new-repository-url>

# Install dependencies
npm install
```

### Step 2: Configure Environment
```bash
# Copy the environment template
cp cloning-system/templates/.env.example .env.local

# Edit .env.local with your site details
# - Site name, description, URL
# - Business information
# - Supabase credentials
# - Social media links
# - Discord webhook (optional)
```

### Step 3: Setup Database
1. Create new Supabase project at [supabase.com](https://supabase.com)
2. Copy SQL from `cloning-system/sql/complete-database-schema.sql`
3. Run in Supabase SQL Editor
4. Update `.env.local` with your Supabase URL and keys

### Step 4: Copy Configuration Files
```bash
# Copy necessary template files
cp cloning-system/templates/_redirects public/_redirects
cp cloning-system/templates/site-config.ts src/config/site.ts
```

### Step 5: Customize and Deploy
1. Choose colors from `cloning-system/templates/tailwind-colors.js`
2. Update `tailwind.config.ts` with your theme
3. Replace logos in `public/` directory
4. Test locally: `npm run dev`
5. Deploy to Netlify or your preferred platform

**Detailed instructions available in `COMPLETE_GUIDE.md`**

---

## 🎯 What Each Clone Gets

- ✅ **Separate Supabase Database** - Complete independence
- ✅ **Custom Branding & Colors** - Unique visual identity
- ✅ **Independent API Credentials** - Noest Express integration
- ✅ **Unique Notifications** - Discord webhook integration
- ✅ **Full Admin Panel** - Product & order management
- ✅ **Same Functionality** - All original features preserved

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Git installed
- Supabase account (free tier available)
- Noest Express account (for Algeria shipping)
- Discord server (for notifications, optional)
- Netlify account (for deployment, free tier available)

---

## 🔧 File Descriptions

### Templates (Copy These)
- **`.env.example`** - Environment variables template - copy to `.env.local`
- **`site-config.ts`** - Site configuration template - copy to `src/config/site.ts`  
- **`supabase-client.ts`** - Database connection template (optional update)
- **`discord-notifications.ts`** - Order notification system (optional)
- **`_redirects`** - Netlify deployment config - copy to `public/_redirects`
- **`tailwind-colors.js`** - Custom color scheme examples for customization

### SQL Scripts (Run These)
- **`complete-database-schema.sql`** - Complete database setup (run this in Supabase)
- **`delivery-fees-only.sql`** - Just delivery fees for Algeria (alternative)
- **`sample-data.sql`** - Sample products and orders for testing (optional)

### Documentation (Read These)
- **`COMPLETE_GUIDE.md`** - Step-by-step manual instructions
- **`TROUBLESHOOTING.md`** - Solutions for common issues

---

## ⚡ Quick Commands Reference

### Initial Setup
```bash
# Clone and prepare
git clone https://github.com/rjewls/rosebud-boutique-builder my-boutique
cd my-boutique
git remote remove origin
git remote add origin <your-new-repo-url>
npm install

# Copy essential files
cp cloning-system/templates/.env.example .env.local
cp cloning-system/templates/_redirects public/_redirects
cp cloning-system/templates/site-config.ts src/config/site.ts
```

### Development & Testing
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build  
npm run preview
```

### Database Setup
1. Create Supabase project
2. Copy `cloning-system/sql/complete-database-schema.sql`
3. Run in Supabase SQL Editor
4. Update `.env.local` with your Supabase credentials

---

## 🆘 Need Help?

1. **Start with the guide**: Read `COMPLETE_GUIDE.md` for detailed instructions
2. **Check for issues**: Common problems and solutions in `TROUBLESHOOTING.md`
3. **Test your setup**: Use `npm run dev` to verify everything works
4. **Check console**: Look for errors in browser developer console

---

## 📞 Support Resources

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Documentation**: [react.dev](https://react.dev)  
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)

---

## 🎉 Success Indicators

Your clone is ready when:
- ✅ Development server runs without errors (`npm run dev`)
- ✅ Admin panel is accessible at `/admin`  
- ✅ Products can be added/edited through admin
- ✅ Orders are saved to your Supabase database
- ✅ Custom branding and colors appear
- ✅ Site builds and deploys successfully

---

**Happy Manual Cloning! 🚀**

*Each clone is completely independent and ready for your custom branding.*
