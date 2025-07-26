// UI button component
import { Button } from "@/components/ui/button";
// Card UI components for layout
import { Card, CardContent } from "@/components/ui/card";
// Link component for navigation
import { Link } from "react-router-dom";

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

// ProductCard component displays a single product
export const ProductCard = ({ product }: ProductCardProps) => {
  // Defensive: ensure colors is always an array of valid color strings
  // Use same color logic as ProductDetail page
  let colors: string[] = [];
  if (Array.isArray(product.colors)) {
    colors = product.colors;
  } else if (typeof product.colors === 'string' && product.colors) {
    colors = product.colors.split(',').map(c => c.trim()).filter(Boolean);
  } else {
    colors = [];
  }

  // Defensive: ensure images is always an array of valid URLs
  // Defensive: ensure images is always an array of valid URLs
  let images: string[] = [];
  if (Array.isArray(product.images)) {
    images = product.images
      .map(img => typeof img === 'string' ? img.replace(/[[\]"'\\]/g, '').trim() : '')
      .filter(img => img && img !== '?');
  } else if (typeof product.images === 'string' && product.images) {
    images = product.images.replace(/[[\]"'\\]/g, '').split(',').map(img => img.trim()).filter(img => img && img !== '?');
  }

  // Use a fallback image if none exists
  // Use a fallback image if none exists
  const imageUrl = images[0] || product.image || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop";

  // Main render for product card
  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <Card className="group cursor-pointer overflow-hidden bg-gradient-card shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 h-[300px] sm:h-[380px] flex flex-col">
        <div className="flex-shrink-0 w-full h-[170px] sm:h-[220px] overflow-hidden bg-white">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{ objectFit: 'cover' }}
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop'; }}
          />
        </div>
        <CardContent className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
          <div className="flex flex-col h-full justify-between">
            <h3 className="font-playfair font-semibold text-base sm:text-lg text-foreground mb-1 line-clamp-2">
              {product.title}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-inter font-semibold text-base sm:text-xl text-primary">
                ${product.price}
              </span>
            </div>
            {/* Color circles below price/title (copied from ProductDetail) */}
            {colors.length > 0 && (
              <div className="flex gap-1 mt-2">
                {colors.map((color, idx) => {
                  // Use fallback if color is invalid or empty
                  const validColor = color && /^#([0-9a-fA-F]{3}){1,2}$|^rgb\(|^hsl\(|^[a-zA-Z]+$/.test(color) ? color : '#e5e7eb'; // Tailwind gray-200
                  return (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-border inline-block"
                      style={{ backgroundColor: validColor }}
                      title={color || 'No color'}
                    />
                  );
                })}
              </div>
            )}
            {/* Review stars always 4.5/5 */}
            <div className="flex items-center gap-1 mt-1">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
              <Star className="w-4 h-4 text-yellow-400" style={{ fill: 'url(#half)' }} />
              <span className="text-xs text-muted-foreground ml-1">4.5/5</span>
              <svg width="0" height="0">
                <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};