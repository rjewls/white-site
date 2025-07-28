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
// Icons for service features
import { Truck, CreditCard, RefreshCw } from "lucide-react";


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

      {/* Service Features Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-purple-50/60 to-pink-50/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_40%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Rosebud Boutique
              </span>
            </h2>
            <p className="font-inter text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're committed to providing you with an exceptional shopping experience that goes beyond just fashion
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Fast Delivery */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"></div>
              <div className="relative p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                  Fast Delivery
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-6 rounded-full"></div>
                <p className="font-inter text-gray-600 leading-relaxed text-lg">
                  Lightning-fast delivery within <span className="font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">24 to 48 hours</span>. 
                  Your dream pieces are just a day away from your wardrobe.
                </p>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"></div>
              <div className="relative p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <CreditCard className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  Cash on Delivery
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-6 rounded-full"></div>
                <p className="font-inter text-gray-600 leading-relaxed text-lg">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Zero advance payment</span> required. 
                  Shop with complete confidence and pay only when you receive your order.
                </p>
              </div>
            </div>

            {/* Easy Exchange */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"></div>
              <div className="relative p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <RefreshCw className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  Easy Exchange
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto mb-6 rounded-full"></div>
                <p className="font-inter text-gray-600 leading-relaxed text-lg">
                  <span className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">Hassle-free returns</span> and exchanges. 
                  Your satisfaction is our promise, guaranteed with every purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Additional trust indicators */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                <span>Trusted by 1000+ customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>100% Authentic products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>24/7 Customer support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;