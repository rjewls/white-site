// UI button component
import { Button } from "@/components/ui/button";
// Card UI components for layout
import { Card, CardContent } from "@/components/ui/card";
// Link component for navigation
import { Link, useNavigate } from "react-router-dom";
import { wilayasData } from "@/lib/locations";
// Language hook
import { useLanguage } from "@/hooks/useLanguage";
// Shared product type
import { Product } from "@/types/product";

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
  const imageUrl = images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop";
  
  // Get focal point for the first image (primary image)
  const getFocalPoint = () => {
    if (product.image_focal_points && Array.isArray(product.image_focal_points) && product.image_focal_points[0]) {
      const fp = product.image_focal_points[0];
      return `${fp.x}% ${fp.y}%`;
    }
    // Default to center if no focal point set
    return '50% 50%';
  };
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
        <Card className="relative h-full bg-white rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg">
          {/* Image Container with optimized aspect ratio for mobile */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              style={{ objectPosition: getFocalPoint() }}
              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop'; }}
            />
          </div>

          {/* Content Container - Reduced padding and spacing on mobile */}
          <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-2 sm:p-4 space-y-1 sm:space-y-3">
            {/* Product Title - Optimized for mobile */}
            <h3 className="font-semibold text-sm sm:text-lg text-gray-900 line-clamp-1 sm:line-clamp-2">
              {product.title}
            </h3>

            {/* Product Price - Reduced spacing on mobile */}
            <div className="space-y-0 sm:space-y-1 min-h-[32px] sm:min-h-[60px] flex flex-col justify-center">
              {product.oldprice ? (
                <div className="flex flex-col items-center">
                  {/* Old Price with red strikethrough - Smaller on mobile */}
                  <div className="relative">
                    <span className="text-sm sm:text-lg font-semibold text-gray-400">
                      {product.oldprice.toLocaleString()} DZD
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 transform -rotate-12"></div>
                    </div>
                  </div>
                  {/* New Price - Blue, Smaller on mobile */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-xl font-bold text-blue-600">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-blue-500">DZD</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-1 justify-center">
                  <span className="text-base sm:text-xl font-bold text-blue-600">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-blue-500">DZD</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button - Smaller on mobile */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="bg-blue-600 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-6 rounded-lg border-2 border-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Add to Cart</span>
            </button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};