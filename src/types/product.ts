// Shared Product type definition used across the application
export interface Product {
  id: string;
  title: string;
  price: number;
  oldprice?: number;
  images?: string[];
  description: string;
  colors?: string[];
  sizes?: string[];
  created_at?: string;
  [key: string]: unknown; // Allow other fields from Supabase
}

// Type for the raw product data from Supabase before processing
export interface RawProduct {
  id: string;
  title: string;
  price: number;
  oldprice?: number;
  images?: unknown;
  description: string;
  colors?: unknown;
  sizes?: unknown;
  created_at?: string;
  [key: string]: unknown;
}

export interface OrderFormValues {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  deliveryOption: string;
  address: string;
  quantity: number;
  selectedColor?: string; // Keep for single selection
  selectedColors?: string[]; // Add for multiple selections
  selectedSize?: string; // Keep for single selection
  selectedSizes?: string[]; // Add for multiple selections
}
