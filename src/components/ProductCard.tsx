// UI button component
import { Button } from "@/components/ui/button";
// Card UI components for layout
import { Card, CardContent } from "@/components/ui/card";
// Link component for navigation
import { Link } from "react-router-dom";
import { wilayasData } from "@/lib/locations";

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
        <Card className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-[1.01] transform-gpu border-0 ring-1 ring-gray-100 dark:ring-gray-800 flex flex-col">
          {/* Image Container with modern effects */}
          <div className="relative w-full h-[180px] sm:h-[190px] flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop'; }}
            />
            {/* Gradient overlay for modern effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Modern floating badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-800">4.5</span>
              </div>
            </div>

            {/* Heart icon for wishlist */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-150 transform translate-y-1 group-hover:translate-y-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-100">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-100" />
              </div>
            </div>
          </div>

          {/* Content Container */}
          <CardContent className="p-4 flex flex-col">
            <div>
              {/* Title */}
              <h3 className="font-semibold text-base leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-150 mb-2">
                {product.title}
              </h3>

              {/* Dynamic color count text instead of description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 leading-relaxed mb-2">
                {colors.length === 0 
                  ? "No colors available" 
                  : colors.length === 1 
                    ? "1 color" 
                    : `${colors.length} colors`
                }
              </p>

              {/* Color circles */}
              {colors.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {colors.slice(0, 4).map((color, idx) => {
                    // Debug: log the actual color values
                    console.log('Color from database:', color, typeof color);
                    
                    // Clean up the color value - remove brackets, quotes, and extra characters
                    const cleanColor = String(color)
                      .replace(/[[\]"']/g, '') // Remove brackets and quotes
                      .trim(); // Remove whitespace
                    
                    console.log('Cleaned color:', cleanColor);
                    
                    // Check if it's a valid hex color after cleaning
                    let validColor = '#e5e7eb'; // default gray
                    
                    if (cleanColor && /^#[0-9a-fA-F]{6}$/.test(cleanColor)) {
                      validColor = cleanColor;
                      console.log('Using hex color:', validColor);
                    } else if (cleanColor) {
                      // Try color name mapping as fallback
                      const colorLower = cleanColor.toLowerCase();
                      const allColors: Record<string, string> = {
                        // English colors
                        'red': '#ef4444',
                        'blue': '#3b82f6', 
                        'green': '#22c55e',
                        'yellow': '#eab308',
                        'black': '#000000',
                        'white': '#ffffff',
                        'purple': '#a21caf',
                        'pink': '#ec4899',
                        'orange': '#f97316',
                        'brown': '#92400e',
                        'gray': '#6b7280',
                        'grey': '#6b7280',
                        // French colors
                        'rouge': '#ef4444',
                        'bleu': '#3b82f6',
                        'vert': '#22c55e',
                        'jaune': '#eab308',
                        'noir': '#000000',
                        'blanc': '#ffffff',
                        'violet': '#a21caf',
                        'rose': '#ec4899',
                        'marron': '#92400e',
                        'gris': '#6b7280',
                      };
                      
                      if (allColors[colorLower]) {
                        validColor = allColors[colorLower];
                        console.log('Using color name mapping:', validColor);
                      } else {
                        console.log('Unknown color after cleaning:', cleanColor);
                      }
                    }
                    
                    console.log('Final color used:', validColor);
                    
                    return (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: validColor }}
                        title={`Color: ${cleanColor} (${validColor})`}
                      />
                    );
                  })}
                  {colors.length > 4 && (
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 shadow-sm">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">+{colors.length - 4}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price and rating row */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {product.price} <span className="text-base font-normal text-gray-500">DZD</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      ))}
                      <Star className="w-3.5 h-3.5 text-yellow-400" style={{ fill: 'url(#half)' }} />
                    </div>
                    <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                  </div>
                </div>
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