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

# Copy templates if they exist
echo ""
echo "📋 Copying configuration templates..."

declare -a template_files=(
    "cloning-system/templates/_redirects:public/_redirects"
    "cloning-system/templates/supabase-client.ts:src/lib/supabaseClient.ts"
    "cloning-system/templates/discord-notifications.ts:src/lib/discordNotifications.ts"
)

for file_mapping in "${template_files[@]}"; do
    IFS=':' read -r source dest <<< "$file_mapping"
    if [ -f "$source" ]; then
        dest_dir=$(dirname "$dest")
        mkdir -p "$dest_dir"
        cp "$source" "$dest"
        echo "✅ Copied $source to $dest"
    fi
done

echo ""
echo "✅ Setup Complete!"
echo "================================================"
echo "📋 Next Steps:"
echo "1. Set up your Supabase database:"
echo "   - Copy SQL from cloning-system/sql/complete-database-schema.sql"
echo "   - Run in Supabase SQL Editor"
echo "2. Configure Noest Express credentials in admin panel"
echo "3. Customize colors in tailwind.config.ts"
echo "4. Replace logo files in public/ directory"
echo "5. Test locally: npm run dev"
echo "6. Deploy to Netlify"
echo "================================================"

echo ""
echo "🚀 Ready to start development!"
echo "Run 'npm run dev' to start the development server."

# Run verification script if it exists
if [ -f "cloning-system/scripts/verify-setup.js" ]; then
    echo ""
    echo "🔍 Running setup verification..."
    if node "cloning-system/scripts/verify-setup.js"; then
        echo "✅ Setup verification passed!"
    else
        echo "⚠️ Verification script failed, but setup should still work."
    fi
fi
