import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import heroImage from "@/assets/hero-image.jpg";

// Mock data for now - this will be replaced with Supabase data
const mockProducts = [
  {
    id: "1",
    title: "Elegant Summer Dress",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
    description: "Beautiful flowing dress perfect for summer occasions",
    colors: ["#FF69B4", "#FFB6C1", "#FFA0C9"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "2", 
    title: "Chic Blouse Collection",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=500&fit=crop",
    description: "Versatile blouse for work and casual wear",
    colors: ["#FFF", "#FFB6C1", "#F0F0F0"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "3",
    title: "Designer Handbag",
    price: 129.99, 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    description: "Luxurious handbag to complement any outfit",
    colors: ["#D2691E", "#8B4513", "#A0522D"]
  },
  {
    id: "4",
    title: "Casual Denim Jacket",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&h=500&fit=crop", 
    description: "Classic denim jacket for layering",
    colors: ["#4682B4", "#6495ED", "#87CEEB"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "5",
    title: "Floral Print Skirt",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d24?w=500&h=500&fit=crop",
    description: "Romantic floral skirt for spring and summer",
    colors: ["#FFB6C1", "#FF69B4", "#DDA0DD"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "6",
    title: "Cozy Knit Sweater",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop",
    description: "Soft and warm sweater for cooler days",
    colors: ["#F5DEB3", "#DEB887", "#D2B48C"],
    sizes: ["XS", "S", "M", "L", "XL"]
  }
];

const Home = () => {
  const [products, setProducts] = useState(mockProducts);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Rosebud Boutique Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
                Discover Your
                <span className="text-primary block">Perfect Style</span>
              </h1>
              <p className="font-inter text-lg text-muted-foreground mb-8 animate-fade-in">
                Curated collection of elegant women's fashion that celebrates your unique beauty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked pieces that blend timeless elegance with contemporary style
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;