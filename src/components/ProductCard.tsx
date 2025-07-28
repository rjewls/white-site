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
import { Star } from "lucide-react";
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
      <Link to={`/product/${product.id}`} className="block h-full">
        <Card className="group cursor-pointer overflow-hidden border-0 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] h-[320px] sm:h-[400px] flex flex-col relative backdrop-blur-sm">
          {/* Gradient overlay for modern look */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          
          <div className="flex-shrink-0 w-full h-[180px] sm:h-[240px] overflow-hidden relative">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
              style={{ objectFit: 'cover' }}
              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop'; }}
            />
            {/* Subtle gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            
            {/* Price badge in top right */}
            <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1 shadow-lg">
              <span className="font-inter font-semibold text-sm text-primary">
                {product.price} DZD
              </span>
            </div>
          </div>
          
          <CardContent className="p-4 sm:p-5 flex flex-col flex-1 justify-between relative z-20">
            <div className="flex flex-col space-y-3">
              <h3 className="font-playfair font-semibold text-lg sm:text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {product.title}
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              
              {/* Color variants preview */}
              {colors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-border/50 shadow-sm"
                        style={{ backgroundColor: colorMap[color] || '#6b7280' }}
                        title={color}
                      />
                    ))}
                    {colors.length > 4 && (
                      <span className="text-xs text-muted-foreground ml-1">+{colors.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Review stars */}
              <div className="flex items-center gap-2 mt-auto">
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-yellow-400" style={{ fill: 'url(#half)' }} />
                  <svg width="0" height="0">
                    <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="50%" stopColor="#facc15" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">4.5 (127)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};