import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Product, RawProduct } from '@/types/product';

// Clean array field helper function
const cleanArrayField = (field: unknown): string[] => {
  if (Array.isArray(field)) {
    return field.filter(img => typeof img === 'string' && img.trim() !== '');
  }
  if (typeof field === 'string' && field) {
    return field.replace(/[[\]"'\\]/g, "").split(',').map(img => img.trim()).filter(Boolean);
  }
  return [];
};

// Fetch products function
const fetchProducts = async (): Promise<Product[]> => {
  console.log('fetchProducts called');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Supabase response:', { data, error });

  if (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to fetch products');
  }

  // Clean and process the products data
  const productsWithImages = (data || []).map(product => ({
    ...product,
    images: cleanArrayField(product.images),
    colors: cleanArrayField(product.colors),
    sizes: cleanArrayField(product.sizes),
  }));

  console.log('Processed products:', productsWithImages);
  return productsWithImages;
};

// Custom hook to fetch products with React Query
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes (renamed from cacheTime)
    retry: 2,
  });
};
