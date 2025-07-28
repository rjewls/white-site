// React hooks for state and lifecycle
import { useState, useEffect } from "react";
// Supabase client for database operations
import { supabase } from "@/lib/supabaseClient";
// Top navigation bar
import { Navigation } from "@/components/Navigation";
// Product card component
import { ProductCard } from "@/components/ProductCard";
// Hero image for homepage
import heroImage from "@/assets/hero-image.jpg";


// Main component for homepage
const Home = () => {
  // State for products list
  const [products, setProducts] = useState([]);

  // Fetch products from Supabase when component mounts
  useEffect(() => {
    // Async function to get products
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) {
        // Ensure images field is always a valid array of URLs for each product
        const cleanArrayField = (field) => {
          if (Array.isArray(field)) {
            return field.filter(img => typeof img === 'string' && img.trim() !== '');
          }
          if (typeof field === 'string' && field) {
            return field.replace(/[[\]"'\\]/g, "").split(',').map(img => img.trim()).filter(Boolean);
          }
          return [];
        };
        const productsWithImages = (data || []).map(product => ({
      ...product,
      images: cleanArrayField(product.images),
      colors: typeof product.colors === 'string' ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : Array.isArray(product.colors) ? product.colors.filter(c => typeof c === 'string' && c.trim() !== '') : []
    }));
        setProducts(productsWithImages);
      }
    };
    fetchProducts();
  }, []);

  // Main render for homepage
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                <span 
                  className="bg-gradient-to-r from-rose-700 via-pink-600 to-purple-700 bg-clip-text text-transparent drop-shadow-2xl" 
                  style={{
                    textShadow: `
                      1px 1px 0px rgba(190, 24, 93, 0.4),
                      2px 2px 0px rgba(190, 24, 93, 0.3),
                      3px 3px 0px rgba(190, 24, 93, 0.2),
                      4px 4px 8px rgba(0, 0, 0, 0.4),
                      0 0 20px rgba(236, 72, 153, 0.3)
                    `
                  }}
                >
                  Discover Your
                </span>
                <span 
                  className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-700 bg-clip-text text-transparent block drop-shadow-2xl" 
                  style={{
                    textShadow: `
                      1px 1px 0px rgba(190, 24, 93, 0.4),
                      2px 2px 0px rgba(190, 24, 93, 0.3),
                      3px 3px 0px rgba(190, 24, 93, 0.2),
                      4px 4px 8px rgba(0, 0, 0, 0.4),
                      0 0 20px rgba(147, 51, 234, 0.3)
                    `
                  }}
                >
                  Perfect Style
                </span>
              </h1>
              <p className="font-inter text-lg text-gray-800 mb-8 animate-fade-in font-medium drop-shadow-sm">
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
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in h-[400px] flex flex-col"
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