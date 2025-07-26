import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Defensive: ensure colors is always an array
  let colors: string[] = [];
  if (Array.isArray(product.colors)) {
    colors = product.colors;
  } else if (typeof product.colors === 'string' && product.colors) {
    colors = (product.colors as string).split(',').map(c => c.trim()).filter(Boolean);
  }

  // Defensive: ensure images is always an array of valid URLs
  let images: string[] = [];
  if (Array.isArray(product.images)) {
    images = product.images.filter(img => typeof img === 'string' && img.trim() !== '');
  } else if (typeof product.images === 'string' && product.images) {
    images = (product.images as string).split(',').map(img => img.trim()).filter(Boolean);
  }

  // Use a fallback image if none exists
  const imageUrl = images[0] || product.image || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop";

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <Card className="group cursor-pointer overflow-hidden bg-gradient-card shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 h-[400px] flex flex-col">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"; }}
          />
        </div>
        <CardContent className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-playfair font-semibold text-lg text-foreground mb-2 line-clamp-2">
              {product.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="font-inter font-semibold text-xl text-primary">
                ${product.price}
              </span>
              {colors.length > 0 && (
                <div className="flex gap-1">
                  {colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};