// UI button component
import { Button } from "@/components/ui/button";
// Card UI components for layout
import { Card, CardContent } from "@/components/ui/card";
// Link component for navigation
import { Link, useNavigate } from "react-router-dom";
import { wilayasData } from "@/lib/locations";
// Language hook
import { useLanguage } from "@/hooks/useLanguage";

// Product type definition
interface Product {
  id: string;
  title: string;
  price: number;
  image?: string; // Keep for backward compatibility
  images?: string[];
  description: string;
  colors?: string[];
  sizes?: string[];
}

// Props for ProductCard component
interface ProductCardProps {
  product: Product;
}

// Icon for review stars
import { Star, Heart, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { OrderForm } from "./OrderForm";
import { OrderFormFields } from "./OrderFormFields";
import { useForm } from "react-hook-form";
import { OrderFormValues } from "@/types/product";

// ProductCard component displays a single product
export const ProductCard = ({ product }: ProductCardProps) => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  // Language context
  const { t } = useLanguage();
  
  // Defensive: ensure colors is always an array of valid color strings
  // Use same color logic as ProductDetail page
  // Map color names to hex codes for display
  const colorMap: Record<string, string> = {
    Red: '#ef4444',
    Blue: '#3b82f6',
    Green: '#22c55e',
    Yellow: '#eab308',
    Black: '#000000',
    White: '#ffffff',
    Purple: '#a21caf',
    Pink: '#ec4899',
    Orange: '#f97316',
    Brown: '#92400e',
    Gray: '#6b7280',
    Cyan: '#06b6d4',
    Teal: '#14b8a6',
    Lime: '#84cc16',
    Indigo: '#6366f1',
  };
  let colors: string[] = [];
  if (Array.isArray(product.colors)) {
    colors = product.colors;
  } else if (typeof product.colors === 'string' && product.colors) {
    colors = String(product.colors).split(',').map(c => c.trim()).filter(Boolean);
  } else {
    colors = [];
  }

  // Defensive: ensure images is always an array of valid URLs
  // Defensive: ensure images is always an array of valid URLs
  let images: string[] = [];
  if (Array.isArray(product.images)) {
    images = product.images
      .map(img => typeof img === 'string' ? String(img).replace(/[[\]"'\\]/g, '').trim() : '')
      .filter(img => img && img !== '?');
  } else if (typeof product.images === 'string' && product.images) {
    images = String(product.images).replace(/[[\]"'\\]/g, '').split(',').map(img => img.trim()).filter(img => img && img !== '?');
  }

  // Use a fallback image if none exists
  // Use a fallback image if none exists
  const imageUrl = images[0] || product.image || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop";
  // Main render for product card
  const [showOrderForm, setShowOrderForm] = React.useState(false);
  const [communes, setCommunes] = useState<string[]>([]);
  const form = useForm<OrderFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      wilaya: "",
      commune: "",
      deliveryOption: "",
      address: "",
    },
  });

  const watchWilaya = form.watch("wilaya");

  // Update communes based on selected wilaya
  useEffect(() => {
    if (watchWilaya) {
      const selectedWilaya = wilayasData.find(
        (wilaya) => wilaya.name === watchWilaya
      );
      setCommunes(selectedWilaya ? selectedWilaya.communes : []);
    } else {
      setCommunes([]);
    }
  }, [watchWilaya]);

  const handleOrderSubmit = async (values: OrderFormValues) => {
    console.log("Order submitted:", values);
    setShowOrderForm(false);
  };

  return (
    <div className="h-full">
      <Link to={`/product/${product.id}`} className="block h-full group">
        <Card className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg lg:hover:shadow-2xl transition-shadow duration-200 lg:hover:scale-[1.01] lg:transform-gpu border-0 ring-1 ring-gray-100 dark:ring-gray-800 flex flex-col">
          {/* Image Container with optimized effects */}
          <div className="relative w-full h-[269px] sm:h-[216px] md:h-[228px] flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover lg:transition-transform lg:duration-300 lg:group-hover:scale-105"
              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop'; }}
            />
            {/* Simplified overlay for mobile performance */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200" />
            
            {/* Simplified floating badge */}
            <div className="absolute top-3 left-3 bg-white/95 rounded-full px-3 py-1 shadow-md">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-800">4.5</span>
              </div>
            </div>

            {/* Heart icon - hidden on mobile for performance */}
            <div className="hidden lg:block absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-150 transform translate-y-1 group-hover:translate-y-0">
              <div className="bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-100">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-100" />
              </div>
            </div>
          </div>

          {/* Content Container with optimized mobile layout */}
          <CardContent className="pt-3 px-4 pb-4 sm:pt-5 sm:px-5 sm:pb-8 flex flex-col flex-1 min-h-0">
            <div className="flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
              {/* Title with improved typography */}
              <h3 className="font-semibold text-base sm:text-xl leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-150">
                {product.title}
              </h3>

              {/* Price Section - Featured prominently */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-gray-500">DZD</span>
                </div>
                
                {/* Enhanced Rating with better visual hierarchy - Compact on mobile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    <Star className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" style={{ fill: 'url(#half)' }} />
                  </div>
                  <span className="text-xs sm:text-base text-gray-600 font-medium">(4.5)</span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="hidden sm:inline text-base text-gray-600">142 reviews</span>
                </div>
              </div>

              {/* Product Info Strip - Simplified on mobile */}
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-base">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {colors.length === 0 
                    ? "No colors" 
                    : colors.length === 1 
                      ? "1 color" 
                      : `${colors.length} colors`
                  }
                </span>
              </div>

              {/* Quick Action Buttons - Fixed positioning */}
              <div className="flex justify-center pt-1 sm:pt-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-1.5 sm:py-2.5 px-4 sm:px-8 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Hidden gradient for half star */}
            <svg width="0" height="0">
              <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </svg>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};