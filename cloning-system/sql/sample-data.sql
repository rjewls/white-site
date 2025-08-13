-- Sample Data for Testing - Add some example products and orders
-- Use this to populate your database with test data

-- Sample products
INSERT INTO public.products (title, price, oldprice, weight, description, images, colors, sizes) VALUES
(
    'Premium Cotton Dress',
    4500.00,
    5500.00,
    0.8,
    'Elegant cotton dress perfect for summer occasions. Comfortable fit with premium fabric quality.',
    ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop'],
    ARRAY['White|#FFFFFF', 'Black|#000000', 'Navy|#000080'],
    ARRAY['S', 'M', 'L', 'XL']
),
(
    'Designer Handbag',
    8900.00,
    NULL,
    1.2,
    'Luxurious designer handbag made from genuine leather. Perfect accessory for any outfit.',
    ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'],
    ARRAY['Brown|#8B4513', 'Black|#000000', 'Beige|#F5F5DC'],
    ARRAY['One Size']
),
(
    'Silk Scarf Collection',
    2800.00,
    3200.00,
    0.2,
    'Beautiful silk scarf with elegant patterns. Available in multiple colors and designs.',
    ARRAY['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=500&fit=crop'],
    ARRAY['Rose|#FF69B4', 'Gold|#FFD700', 'Blue|#0000FF', 'Green|#008000'],
    ARRAY['Standard']
),
(
    'Casual Sneakers',
    6200.00,
    NULL,
    1.5,
    'Comfortable casual sneakers for everyday wear. High-quality materials and modern design.',
    ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop'],
    ARRAY['White|#FFFFFF', 'Black|#000000', 'Gray|#808080'],
    ARRAY['36', '37', '38', '39', '40', '41', '42']
),
(
    'Evening Jewelry Set',
    12500.00,
    15000.00,
    0.5,
    'Elegant jewelry set including necklace, earrings, and bracelet. Perfect for special occasions.',
    ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop'],
    ARRAY['Gold|#FFD700', 'Silver|#C0C0C0', 'Rose Gold|#E8B4B8'],
    ARRAY['One Size']
)
ON CONFLICT DO NOTHING;

-- Sample orders for testing different statuses
INSERT INTO public.orders (
    client, phone, adresse, wilaya_id, commune, produit, montant, poids, 
    status, delivery_option, product_title, selected_color, selected_size, quantity
) VALUES
(
    'Amina Benali',
    '0551234567',
    'Rue Didouche Mourad, Centre-ville',
    16,
    'Alger Centre',
    'Premium Cotton Dress',
    4500.00,
    0.8,
    'pending',
    'home',
    'Premium Cotton Dress',
    'White',
    'M',
    1
),
(
    'Karim Mammeri',
    '0661987654',
    'Cité des Asphodèles, Bt 12',
    31,
    'Oran',
    'Designer Handbag',
    8900.00,
    1.2,
    'inséré',
    'stopdesk',
    'Designer Handbag',
    'Black',
    'One Size',
    1
),
(
    'Fatima Khelil',
    '0771122334',
    'Quartier Universitaire, Rue des Frères',
    25,
    'Constantine',
    'Silk Scarf Collection',
    2800.00,
    0.2,
    'expédié',
    'home',
    'Silk Scarf Collection',
    'Rose',
    'Standard',
    2
),
(
    'Ahmed Boudiaf',
    '0551999888',
    'Nouvelle Ville, Résidence El Amel',
    9,
    'Blida',
    'Casual Sneakers',
    6200.00,
    1.5,
    'pending',
    'home',
    'Casual Sneakers',
    'White',
    '42',
    1
),
(
    'Yasmine Cherif',
    '0661555777',
    'Centre Commercial, près de la Grande Poste',
    19,
    'Sétif',
    'Evening Jewelry Set',
    12500.00,
    0.5,
    'inséré',
    'stopdesk',
    'Evening Jewelry Set',
    'Gold',
    'One Size',
    1
)
ON CONFLICT DO NOTHING;

-- Add tracking numbers to some orders for testing
UPDATE public.orders 
SET tracking = 'TRK' || LPAD((random() * 999999)::int::text, 6, '0')
WHERE status IN ('inséré', 'expédié') AND tracking IS NULL;

-- Verification queries
SELECT 'Sample products added' as status, COUNT(*) as count FROM products;
SELECT 'Sample orders added' as status, COUNT(*) as count FROM orders;

-- Show sample data
SELECT 
    'Products' as type,
    title as name,
    price::text || ' DA' as price,
    array_to_string(colors, ', ') as colors,
    array_to_string(sizes, ', ') as sizes
FROM products
UNION ALL
SELECT 
    'Orders' as type,
    client as name,
    montant::text || ' DA' as price,
    status as colors,
    commune as sizes
FROM orders
ORDER BY type, name;
