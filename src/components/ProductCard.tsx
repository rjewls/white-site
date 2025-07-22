import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  colors?: string[];
  sizes?: string[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group cursor-pointer overflow-hidden bg-gradient-card shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6">
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
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <Link to={`/product/${product.id}`}>
          <Button variant="elegant" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};