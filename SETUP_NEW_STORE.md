# Setting Up New Store from Template

## Step 1: Copy Repository to GitHub

### Option A: Using GitHub Template (Recommended)
1. Go to your current repository on GitHub
2. Click "Use this template" → "Create a new repository"
3. Name it (e.g., `electronics-store-builder`)
4. Create the repository

### Option B: Clone and Push Method
```bash
# Clone current repo
git clone https://github.com/yourusername/rosebud-boutique-builder.git electronics-store-builder
cd electronics-store-builder

# Remove old remote and add new one
git remote remove origin
git remote add origin https://github.com/yourusername/electronics-store-builder.git
git push -u origin main
```

## Step 2: Create New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project (e.g., "electronics-store-db")
3. Set strong database password
4. Wait for project creation

## Step 3: Set Up Database Schema

In Supabase SQL Editor, run these queries:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create delivery_fees table
CREATE TABLE IF NOT EXISTS delivery_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wilaya_code INTEGER NOT NULL UNIQUE,
  wilaya_name TEXT NOT NULL,
  home_delivery DECIMAL(10,2) NOT NULL DEFAULT 0,
  stopdesk_delivery DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  delivery_option TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read delivery fees" ON delivery_fees FOR SELECT USING (true);

-- Admin policies (you'll need to set up authentication)
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true);
CREATE POLICY "Admin can manage delivery fees" ON delivery_fees FOR ALL USING (true);
CREATE POLICY "Admin can manage orders" ON orders FOR ALL USING (true);

-- Insert default delivery fees
INSERT INTO delivery_fees (wilaya_code, wilaya_name, home_delivery, stopdesk_delivery) VALUES
(1, 'Adrar', 1300, 600),
(2, 'Chlef', 700, 300),
(3, 'Laghouat', 850, 450),
(4, 'Oum El Bouaghi', 700, 300),
(5, 'Batna', 700, 300),
(6, 'Béjaïa', 700, 250),
(7, 'Biskra', 800, 400),
(8, 'Béchar', 1000, 500),
(9, 'Blida', 450, 250),
(10, 'Bouira', 600, 250),
(11, 'Tamanrasset', 1700, 800),
(12, 'Tébessa', 750, 300),
(13, 'Tlemcen', 700, 350),
(14, 'Tiaret', 700, 350),
(15, 'Tizi Ouzou', 600, 250),
(16, 'Algiers', 400, 200),
(17, 'Djelfa', 850, 400),
(18, 'Jijel', 700, 300),
(19, 'Sétif', 700, 300),
(20, 'Saïda', 700, 300),
(21, 'Skikda', 700, 300),
(22, 'Sidi Bel Abbès', 700, 300),
(23, 'Annaba', 700, 300),
(24, 'Guelma', 750, 300),
(25, 'Constantine', 700, 300),
(26, 'Médéa', 650, 250),
(27, 'Mostaganem', 700, 300),
(28, 'M''Sila', 700, 300),
(29, 'Mascara', 700, 300),
(30, 'Ouargla', 900, 450),
(31, 'Oran', 700, 300),
(32, 'El Bayadh', 1000, 400),
(33, 'Illizi', 1900, 1000),
(34, 'Bordj Bou Arréridj', 700, 300),
(35, 'Boumerdès', 450, 250),
(36, 'El Tarf', 750, 300),
(37, 'Tindouf', 1400, 700),
(38, 'Tissemsilt', 700, 300),
(39, 'El Oued', 1000, 450),
(40, 'Khenchela', 750, 300),
(41, 'Souk Ahras', 750, 300),
(42, 'Tipaza', 500, 250),
(43, 'Mila', 700, 300),
(44, 'Aïn Defla', 700, 250),
(45, 'Naâma', 1000, 500),
(46, 'Aïn Témouchent', 700, 300),
(47, 'Ghardaïa', 850, 450),
(48, 'Relizane', 700, 300),
(49, 'Timimoun', 1400, 600),
(51, 'Ouled Djellal', 800, 400),
(52, 'Beni Abbes', 1100, 400),
(53, 'In Salah', 1700, 1000),
(55, 'Touggourt', 900, 450),
(57, 'El M''Ghair', 1000, 500),
(58, 'El Meniaa', 900, 450)
ON CONFLICT (wilaya_code) DO NOTHING;
```

## Step 4: Update Environment Variables

In your new repository, update the Supabase configuration:

1. Go to your new Supabase project → Settings → API
2. Copy the Project URL and anon public key
3. Create/update `.env.local` file:

```env
VITE_SUPABASE_URL=your_new_supabase_url
VITE_SUPABASE_ANON_KEY=your_new_supabase_anon_key
```

## Step 5: Customize for Electronics Store

### Update Branding
- Change site title in `index.html`
- Update colors in `tailwind.config.ts`
- Replace hero image in `src/assets/`
- Update translation strings in `src/contexts/LanguageContext.tsx`

### Update Categories and Content
- Modify product categories for electronics
- Update homepage hero section
- Change feature descriptions
- Update any boutique-specific text to electronics store text

### Example Electronics Categories
```typescript
const categories = [
  "Smartphones",
  "Laptops", 
  "Tablets",
  "Headphones",
  "Smartwatches",
  "Gaming",
  "Accessories"
];
```

## Step 6: Deploy New Site

### Using Netlify
1. Connect your new GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Using Vercel
1. Import your new GitHub repository to Vercel
2. Add environment variables
3. Deploy!

## Step 7: Test Everything

1. Verify database connection works
2. Test product creation in admin panel
3. Test order placement
4. Test delivery fee management
5. Test language switching
6. Test mobile responsiveness

## Notes

- The original site remains unchanged
- New site has completely separate data
- Both sites can run independently
- You can customize the new site without affecting the original
- All bilingual features are preserved
- Admin functionality is fully copied
