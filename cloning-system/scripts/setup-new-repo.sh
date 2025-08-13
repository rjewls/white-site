#!/bin/bash

echo "🚀 Complete Boutique Site Clone & Repository Setup"
echo "================================================="
echo "This script will:"
echo "1. Clone the original repository"
echo "2. Set up a new remote repository"
echo "3. Configure your new site"
echo "4. Install dependencies"

# Function to prompt for input with default value
get_input_with_default() {
    local prompt="$1"
    local default="$2"
    
    if [ -n "$default" ]; then
        read -p "$prompt (default: $default): " input
        echo "${input:-$default}"
    else
        while true; do
            read -p "$prompt: " input
            [ -n "$input" ] && break
            echo "This field is required."
        done
        echo "$input"
    fi
}

# Step 1: Repository Information
echo
echo "📂 Repository Setup"
ORIGINAL_REPO=$(get_input_with_default "Original repository URL (HTTPS or SSH)" "https://github.com/yourusername/rosebud-boutique-builder.git")
NEW_REPO_NAME=$(get_input_with_default "New repository name" "my-boutique-store")
NEW_REPO_URL=$(get_input_with_default "New repository URL (leave empty to create later)" "")

# Step 2: Clone and Setup
echo
echo "📥 Cloning original repository..."
if git clone "$ORIGINAL_REPO" "$NEW_REPO_NAME"; then
    echo "✅ Repository cloned successfully!"
    
    # Change to new directory
    cd "$NEW_REPO_NAME" || exit 1
    echo "📂 Current directory: $(pwd)"
else
    echo "❌ Failed to clone repository. Please check the URL and your internet connection."
    exit 1
fi

# Step 3: Repository Remote Setup
echo
echo "🔗 Setting up new repository remote..."

# Remove original remote
if git remote remove origin 2>/dev/null; then
    echo "✅ Removed original remote"
else
    echo "⚠️ No existing remote to remove"
fi

if [ -n "$NEW_REPO_URL" ]; then
    # Add new remote
    if git remote add origin "$NEW_REPO_URL"; then
        echo "✅ Added new remote: $NEW_REPO_URL"
        
        # Ask if user wants to push immediately
        read -p "Push to new repository now? (y/N): " push_now
        if [[ "$push_now" =~ ^[Yy]$ ]]; then
            echo "🚀 Pushing to new repository..."
            if git push -u origin main; then
                echo "✅ Successfully pushed to new repository!"
            else
                echo "⚠️ Push failed. You can push manually later with 'git push -u origin main'"
            fi
        fi
    else
        echo "⚠️ Failed to add new remote"
    fi
else
    echo "⚠️ No new repository URL provided."
    echo "To add remote later, use: git remote add origin <your-new-repo-url>"
    echo "Then push with: git push -u origin main"
fi

# Step 4: Site Configuration
echo
echo "📋 Site Configuration"
SITE_NAME=$(get_input_with_default "Enter site name" "My Boutique Store")
SITE_DESCRIPTION=$(get_input_with_default "Enter site description" "Premium fashion and accessories")
SITE_URL=$(get_input_with_default "Enter site URL" "https://myboutique.com")

echo
echo "🏢 Business Information"
BUSINESS_NAME=$(get_input_with_default "Enter business name" "$SITE_NAME")
BUSINESS_EMAIL=$(get_input_with_default "Enter business email" "contact@myboutique.com")
BUSINESS_PHONE=$(get_input_with_default "Enter business phone" "+213-XXX-XXX-XXX")
BUSINESS_ADDRESS=$(get_input_with_default "Enter business address" "Algiers, Algeria")

echo
echo "📱 Social Media (optional)"
read -p "Facebook URL (optional): " FACEBOOK
read -p "Instagram URL (optional): " INSTAGRAM
read -p "WhatsApp number (optional): " WHATSAPP

echo
echo "🗄️ Supabase Configuration"
echo "You'll need to create a new Supabase project for this site."
SUPABASE_URL=$(get_input_with_default "Enter Supabase URL" "https://your-project.supabase.co")
SUPABASE_KEY=$(get_input_with_default "Enter Supabase Anon Key" "")
STORAGE_KEY=$(get_input_with_default "Enter storage key" "my-boutique-session")

echo
echo "📢 Discord Webhook (optional)"
read -p "Discord webhook URL (optional): " DISCORD_WEBHOOK

# Step 5: Create Configuration Files
echo
echo "⚙️ Creating environment configuration..."

cat > .env.local << EOF
# Site Configuration
VITE_SITE_NAME="$SITE_NAME"
VITE_SITE_DESCRIPTION="$SITE_DESCRIPTION"
VITE_SITE_URL="$SITE_URL"

# Business Information
VITE_BUSINESS_NAME="$BUSINESS_NAME"
VITE_BUSINESS_EMAIL="$BUSINESS_EMAIL"
VITE_BUSINESS_PHONE="$BUSINESS_PHONE"
VITE_BUSINESS_ADDRESS="$BUSINESS_ADDRESS"

# Social Media
EOF

[ -n "$FACEBOOK" ] && echo "VITE_FACEBOOK_URL=\"$FACEBOOK\"" >> .env.local
[ -n "$INSTAGRAM" ] && echo "VITE_INSTAGRAM_URL=\"$INSTAGRAM\"" >> .env.local
[ -n "$WHATSAPP" ] && echo "VITE_WHATSAPP_NUMBER=\"$WHATSAPP\"" >> .env.local

cat >> .env.local << EOF

# Supabase Configuration (Required)
VITE_SUPABASE_URL="$SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="$SUPABASE_KEY"
VITE_SUPABASE_STORAGE_KEY="$STORAGE_KEY"

# Discord Webhook (Optional)
EOF

[ -n "$DISCORD_WEBHOOK" ] && echo "VITE_DISCORD_WEBHOOK_URL=\"$DISCORD_WEBHOOK\"" >> .env.local

cat >> .env.local << EOF

# Analytics (Optional)
# VITE_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
EOF

echo "✅ Environment configuration created"

# Step 6: Install Dependencies
echo
echo "📦 Installing dependencies..."
if command -v npm > /dev/null 2>&1; then
    if npm install; then
        echo "✅ Dependencies installed successfully!"
    else
        echo "❌ Failed to install dependencies. Please run 'npm install' manually."
    fi
else
    echo "⚠️ npm not found. Please install Node.js and run 'npm install' manually."
fi

# Step 7: Create Site Configuration
echo
echo "📝 Creating site configuration..."

mkdir -p src/config

cat > src/config/site.ts << EOF
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
  name: import.meta.env.VITE_SITE_NAME || "$SITE_NAME",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "$SITE_DESCRIPTION",
  url: import.meta.env.VITE_SITE_URL || "$SITE_URL",
  business: {
    name: import.meta.env.VITE_BUSINESS_NAME || "$BUSINESS_NAME",
    email: import.meta.env.VITE_BUSINESS_EMAIL || "$BUSINESS_EMAIL",
    phone: import.meta.env.VITE_BUSINESS_PHONE || "$BUSINESS_PHONE",
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "$BUSINESS_ADDRESS"
  },
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL,
    instagram: import.meta.env.VITE_INSTAGRAM_URL,
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER
  }
};
EOF

# Step 8: Copy Templates
echo
echo "📋 Copying configuration templates..."

declare -A template_files=(
    ["cloning-system/templates/_redirects"]="public/_redirects"
    ["cloning-system/templates/supabase-client.ts"]="src/lib/supabaseClient.ts"
    ["cloning-system/templates/discord-notifications.ts"]="src/lib/discordNotifications.ts"
)

for source in "${!template_files[@]}"; do
    dest="${template_files[$source]}"
    if [ -f "$source" ]; then
        mkdir -p "$(dirname "$dest")"
        cp "$source" "$dest"
        echo "✅ Copied $source to $dest"
    else
        echo "⚠️ Template not found: $source"
    fi
done

# Step 9: Initial Git Commit
echo
echo "📝 Creating initial commit for your new site..."
if git add . && git commit -m "Initial setup: Configure new boutique site

- Set up environment configuration
- Configure site branding and business info  
- Set up Supabase integration
- Copy configuration templates
- Ready for database setup and deployment

Site: $SITE_NAME
Business: $BUSINESS_NAME"; then

    echo "✅ Initial commit created"
    
    if [ -n "$NEW_REPO_URL" ] && [[ ! "$push_now" =~ ^[Yy]$ ]]; then
        read -p "Push initial commit now? (y/N): " push_now2
        if [[ "$push_now2" =~ ^[Yy]$ ]]; then
            if git push -u origin main; then
                echo "✅ Successfully pushed to repository!"
            fi
        fi
    fi
else
    echo "⚠️ Could not create git commit. You can commit manually later."
fi

# Final Instructions
echo
echo "🎉 Setup Complete!"
echo "================================================"
echo "📋 Your New Boutique Site: $SITE_NAME"
echo "📂 Location: $(pwd)"
echo "================================================"

echo
echo "🚀 Next Steps:"
echo "1. 🗄️  Set up your Supabase database:"
echo "   - Go to https://supabase.com/dashboard"
echo "   - Create a new project"
echo "   - Copy SQL from cloning-system/sql/complete-database-schema.sql"
echo "   - Run in Supabase SQL Editor"
echo "   - Update .env.local with your actual Supabase URL and keys"

echo
echo "2. 🎨 Customize your site:"
echo "   - Choose colors in cloning-system/templates/tailwind-colors.js"
echo "   - Update tailwind.config.ts with your chosen theme"
echo "   - Replace logo files in public/ directory"

echo
echo "3. ⚙️  Configure integrations:"
echo "   - Run: npm run dev"
echo "   - Access admin panel to set up Noest Express credentials"
echo "   - Test order flow"

echo
echo "4. 🚀 Deploy:"
echo "   - Push to GitHub/GitLab if you haven't already"
echo "   - Deploy to Netlify"
echo "   - Set up custom domain"

if [ -z "$NEW_REPO_URL" ]; then
    echo
    echo "⚠️  Repository Remote Setup:"
    echo "You didn't provide a new repository URL. To set it up:"
    echo "1. Create a new repository on GitHub/GitLab"
    echo "2. Run: git remote add origin <your-new-repo-url>"
    echo "3. Run: git push -u origin main"
fi

echo
echo "📚 Documentation:"
echo "- Complete guide: cloning-system/COMPLETE_GUIDE.md"
echo "- Troubleshooting: cloning-system/TROUBLESHOOTING.md"

echo
echo "✨ Ready to start development!"
echo "Run 'npm run dev' to start the development server."

# Run verification script if it exists
if [ -f "cloning-system/scripts/verify-setup.js" ]; then
    echo
    echo "🔍 Running setup verification..."
    if command -v node > /dev/null 2>&1; then
        node cloning-system/scripts/verify-setup.js || echo "⚠️ Verification script failed to run, but setup should still work."
    else
        echo "⚠️ Node.js not found. Skipping verification."
    fi
fi

echo
echo "🎊 Happy selling with your new boutique website!"
