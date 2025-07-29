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
      <section className="relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Rosebud Boutique Hero"
            className="w-full h-full object-cover scale-105 transition-transform duration-[10s] ease-out hover:scale-100"
          />
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-transparent to-purple-900/20"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Main Content */}
        <div className="relative flex items-center min-h-[80vh] lg:min-h-[90vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="max-w-2xl">
                {/* Subtitle */}
                <div className="flex items-center gap-3 mb-6 animate-fade-in">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
                  <span className="font-inter text-sm md:text-base font-medium text-white/90 tracking-widest uppercase">
                    Premium Fashion Collection
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
                  <span 
                    className="bg-gradient-to-r from-white via-rose-100 to-pink-100 bg-clip-text text-transparent block drop-shadow-2xl" 
                    style={{
                      textShadow: `
                        1px 1px 0px rgba(0, 0, 0, 0.3),
                        2px 2px 0px rgba(0, 0, 0, 0.2),
                        3px 3px 0px rgba(0, 0, 0, 0.1),
                        4px 4px 8px rgba(0, 0, 0, 0.4),
                        0 0 20px rgba(236, 72, 153, 0.3)
                      `
                    }}
                  >
                    Discover Your
                  </span>
                  <span 
                    className="bg-gradient-to-r from-rose-300 via-pink-200 to-purple-200 bg-clip-text text-transparent block drop-shadow-2xl" 
                    style={{
                      textShadow: `
                        1px 1px 0px rgba(0, 0, 0, 0.3),
                        2px 2px 0px rgba(0, 0, 0, 0.2),
                        3px 3px 0px rgba(0, 0, 0, 0.1),
                        4px 4px 8px rgba(0, 0, 0, 0.4),
                        0 0 20px rgba(147, 51, 234, 0.3)
                      `
                    }}
                  >
                    Perfect Style
                  </span>
                </h1>

                {/* Description */}
                <p className="font-inter text-lg md:text-xl text-white/90 mb-8 animate-fade-in font-medium leading-relaxed max-w-lg">
                  Curated collection of elegant women's fashion that celebrates your unique beauty. 
                  From timeless classics to contemporary trends, find pieces that speak to your soul.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
                  <button 
                    onClick={() => document.getElementById('featured-collection')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group relative px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Shop Collection
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => document.getElementById('service-features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Learn More
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full border-2 border-white/20"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full border-2 border-white/20"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-2 border-white/20"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white/20 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-white/90 font-semibold text-sm">1000+ Happy Customers</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-white/80 text-sm ml-1">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Stats/Features */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-6 max-w-md ml-auto">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transition-all duration-500 group-hover:bg-white/20"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">24-48h</p>
                      <p className="text-white/80 text-sm">Fast Delivery</p>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transition-all duration-500 group-hover:bg-white/20"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">COD</p>
                      <p className="text-white/80 text-sm">Cash on Delivery</p>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transition-all duration-500 group-hover:bg-white/20"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">100%</p>
                      <p className="text-white/80 text-sm">Satisfaction</p>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transition-all duration-500 group-hover:bg-white/20"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">1000+</p>
                      <p className="text-white/80 text-sm">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="featured-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked pieces that blend timeless elegance with contemporary style
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in h-[350px] flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Service Features Section */}
      <section id="service-features" className="relative py-20 overflow-hidden">
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