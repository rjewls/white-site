// React hooks for state and lifecycle
import { useState, useEffect } from "react";
// Supabase client for database operations
import { supabase } from "@/lib/supabaseClient";
// Top navigation bar
import { Navigation } from "@/components/Navigation";
// Product card component
import { ProductCard } from "@/components/ProductCard";
// Animated section component
import { AnimatedSection } from "@/components/AnimatedSection";
// Hero image for homepage
import heroImage from "@/assets/hero-image.jpg";
// Icons for service features
import { Truck, CreditCard, RefreshCw, Quote } from "lucide-react";
// Language hook
import { useLanguage } from "@/hooks/useLanguage";
// Scroll animation hooks
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";


// Main component for homepage
const Home = () => {
  // State for products list
  const [products, setProducts] = useState([]);
  // Language context
  const { t, isRTL } = useLanguage();
  // Staggered animation for products
  const { containerRef: productsRef, visibleItems: visibleProducts } = useStaggeredScrollAnimation(
    products.length,
    150
  );

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
    <div className={`min-h-screen bg-gradient-soft ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* Announcement Bar */}
      <AnimatedSection animation="fadeInDown" delay={200}>
        <section aria-label="announcement" className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Fast shipping 24–48h</span>
              </div>
              <span className="hidden sm:inline opacity-50">|</span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Cash on delivery</span>
              </div>
              <span className="hidden sm:inline opacity-50">|</span>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Easy exchange within 7 days</span>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden">
        {/* Feminine Animated Background */}
        <div className="absolute inset-0">
          {/* Base gradient background - darker pink shades for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-400"></div>
          
          {/* Animated gradient overlays with deeper feminine colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/60 via-pink-400/50 to-purple-500/60 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/70 via-transparent to-rose-400/50"></div>
          
          {/* Floating flower-like gradients - simplified for mobile */}
          <div className="absolute inset-0 opacity-40">
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-rose-600/40 to-pink-500/30 rounded-full animate-pulse blur-xl"></div>
            <div className="hidden lg:block absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/35 to-pink-600/40 rounded-full animate-pulse blur-2xl" style={{animationDelay: '2s'}}></div>
            <div className="hidden lg:block absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-pink-600/45 to-rose-500/35 rounded-full animate-pulse blur-xl" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Gentle floating particles - hidden on mobile */}
          <div className="hidden lg:block absolute top-1/4 left-1/4 w-2 h-2 bg-rose-200/60 rounded-full animate-bounce"></div>
          <div className="hidden lg:block absolute top-2/3 right-1/3 w-3 h-3 bg-pink-200/70 rounded-full animate-ping"></div>
          <div className="hidden lg:block absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-200/65 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="hidden lg:block absolute top-1/2 right-1/4 w-2 h-2 bg-rose-300/70 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          
          {/* Large decorative soft circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-500/30 to-rose-400/25 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-100/15 to-pink-200/25 rounded-full blur-3xl"></div>
          
          {/* Subtle animated waves - simplified for mobile */}
          <div className="hidden lg:block absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-rose-300/15 to-transparent transform -rotate-12 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-200/10 to-transparent transform rotate-12 animate-pulse" style={{animationDelay: '3s'}}></div>
          </div>
        </div>

        {/* Enhanced Decorative Elements - hidden on mobile */}
        <div className="hidden lg:block absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-rose-300/30 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="hidden lg:block absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/25 to-rose-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Main Content */}
        <div className="relative flex items-center min-h-[80vh] lg:min-h-[90vh] py-8 sm:py-12 lg:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="max-w-2xl pt-4 pb-8 sm:pt-6 sm:pb-12 lg:pt-0 lg:pb-0">
                {/* Subtitle */}
                <div className="flex flex-col gap-3 mb-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"></div>
                    <span className="font-inter text-sm md:text-base font-medium text-gray-700 tracking-widest uppercase">
                      {t('hero.subtitle')}
                    </span>
                  </div>
                  
                  {/* Enhanced Belle Elle Boutique Text */}
                  <div className="relative">
                    <h2 
                      className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent antialiased"
                      style={{
                        textShadow: `
                          1px 1px 0px rgba(0, 0, 0, 0.2),
                          2px 2px 4px rgba(236, 72, 153, 0.3),
                          0 0 15px rgba(236, 72, 153, 0.2)
                        `,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                    >
                      ✨ Belle Elle Boutique ✨
                    </h2>
                    {/* Decorative underline */}
                    <div className="mt-2 w-32 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full opacity-60"></div>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight antialiased">
                  <span 
                    className="text-white block drop-shadow-lg" 
                    style={{
                      textShadow: `
                        0 0 10px rgba(255, 255, 255, 0.8),
                        0 0 20px rgba(255, 255, 255, 0.6),
                        0 0 40px rgba(255, 255, 255, 0.4),
                        2px 2px 8px rgba(0, 0, 0, 0.3)
                      `,
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      filter: 'brightness(1.1)'
                    }}                    >
                      {t('hero.title1')}
                    </span>
                  <span 
                    className="text-white block drop-shadow-lg" 
                    style={{
                      textShadow: `
                        0 0 10px rgba(255, 255, 255, 0.8),
                        0 0 20px rgba(255, 255, 255, 0.6),
                        0 0 40px rgba(255, 255, 255, 0.4),
                        2px 2px 8px rgba(0, 0, 0, 0.3)
                      `,
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      filter: 'brightness(1.1)'
                    }}
                  >
                    {t('hero.title2')}
                  </span>
                </h1>

                {/* Description */}
                <p className="font-inter text-lg md:text-xl text-gray-700 mb-8 animate-fade-in font-medium leading-relaxed max-w-lg">
                  {t('hero.description')}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
                  <button 
                    onClick={() => document.getElementById('featured-collection')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group relative px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-2xl shadow-xl lg:transition-all lg:duration-300 lg:hover:shadow-2xl lg:hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {t('hero.shopCollection')}
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => document.getElementById('service-features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group px-8 py-4 bg-white/10 lg:backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 lg:transition-all lg:duration-300 lg:hover:bg-white/20 lg:hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {t('hero.learnMore')}
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
                      <p className="text-white/90 font-semibold text-sm">1000+ {t('hero.happyCustomers')}</p>
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
                    <div className="absolute inset-0 bg-white/30 lg:bg-white/20 lg:backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl lg:transition-all lg:duration-500 lg:group-hover:bg-white/30 lg:group-hover:scale-105"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1 drop-shadow-lg">24-48h</p>
                      <p className="text-white/95 text-sm font-medium">Fast Delivery</p>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/30 lg:bg-white/20 lg:backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl lg:transition-all lg:duration-500 lg:group-hover:bg-white/30 lg:group-hover:scale-105"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1 drop-shadow-lg">COD</p>
                      <p className="text-white/95 text-sm font-medium">Cash on Delivery</p>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/30 lg:bg-white/20 lg:backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl lg:transition-all lg:duration-500 lg:group-hover:bg-white/30 lg:group-hover:scale-105"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1 drop-shadow-lg">100%</p>
                      <p className="text-white/95 text-sm font-medium">Satisfaction</p>
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-white/30 lg:bg-white/20 lg:backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl lg:transition-all lg:duration-500 lg:group-hover:bg-white/30 lg:group-hover:scale-105"></div>
                    <div className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1 drop-shadow-lg">1000+</p>
                      <p className="text-white/95 text-sm font-medium">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - simplified for mobile */}
        <div className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Brand trust strip */}
      <AnimatedSection animation="fadeInUp" delay={100}>
        <section aria-label="trusted-brands" className="bg-white/60 backdrop-blur-sm border-t border-rose-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 font-medium">Trusted by shoppers across Algeria</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 border border-rose-100">Top Quality</span>
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-100">Curated Styles</span>
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-100">Verified COD</span>
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100">5★ Support</span>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Products Grid - Enhanced with Hero-style Design */}
      <section id="featured-collection" className="relative py-20 overflow-hidden">
        {/* Background with multiple gradient overlays - Hero Style */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/90 via-purple-50/80 to-pink-50/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-transparent to-purple-100/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-pink-50/40 via-transparent to-rose-50/40"></div>
        
        {/* Decorative gradient orbs - Hero Style */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-rose-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        
        {/* Floating particles effect - hidden on mobile */}
        <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header with Hero-style Gradient Text */}
          <AnimatedSection animation="fadeInUp" delay={200} className="text-center mb-16">
            <div className="relative">
              {/* Decorative elements around title */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full"></div>
              
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {t('featured.title')}
                </span>
              </h2>
              
              <p className="font-inter text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
                {t('featured.subtitle')}
              </p>
              
              {/* Decorative line under description */}
              <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>
          
      {/* Enhanced Product Grid */}
      <div 
        ref={productsRef}
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`h-auto md:h-[380px] lg:h-[420px] flex flex-col lg:transform lg:hover:scale-[1.02] lg:transition-all lg:duration-300 ${
                  visibleProducts[index] ? 'animate-fade-in-up' : 'scroll-animate-hidden'
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Call-to-action button with Hero styling */}
          <AnimatedSection animation="scaleIn" delay={300} className="text-center mt-16">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-full shadow-xl lg:hover:shadow-2xl lg:transform lg:hover:scale-105 lg:transition-all lg:duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-rose-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {t('featured.viewAll')}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Features Section */}
      <section id="service-features" className="relative py-20 overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-purple-50/60 to-pink-50/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_40%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" delay={100} className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 antialiased">
              <span 
                className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                {t('service.title')}
              </span>
            </h2>
            <p className="font-inter text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed antialiased">
              {t('service.subtitle')}
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full"></div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Fast Delivery */}
            <AnimatedSection animation="fadeInUp" delay={200}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 lg:from-white/60 lg:to-white/30 lg:backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl lg:transform lg:transition-all lg:duration-500 lg:group-hover:scale-105 lg:group-hover:shadow-2xl"></div>
                <div className="relative p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg lg:transform lg:transition-all lg:duration-500 lg:group-hover:scale-110 lg:group-hover:rotate-3">
                    <Truck className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 lg:group-hover:text-rose-600 lg:transition-colors lg:duration-300 antialiased">
                    {t('service.fastDelivery')}
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-6 rounded-full"></div>
                  <p className="font-inter text-gray-600 leading-relaxed text-lg antialiased">
                    {t('service.fastDeliveryDesc')}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Cash on Delivery */}
            <AnimatedSection animation="fadeInUp" delay={350}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 lg:from-white/60 lg:to-white/30 lg:backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl lg:transform lg:transition-all lg:duration-500 lg:group-hover:scale-105 lg:group-hover:shadow-2xl"></div>
                <div className="relative p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg lg:transform lg:transition-all lg:duration-500 lg:group-hover:scale-110 lg:group-hover:rotate-3">
                    <CreditCard className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 lg:group-hover:text-emerald-600 lg:transition-colors lg:duration-300 antialiased">
                    {t('service.cod')}
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-6 rounded-full"></div>
                  <p className="font-inter text-gray-600 leading-relaxed text-lg">
                    {t('service.codDesc')}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Easy Exchange */}
            <AnimatedSection animation="fadeInUp" delay={500}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 lg:from-white/60 lg:to-white/30 lg:backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl lg:transform lg:transition-all lg:duration-500 lg:group-hover:scale-105 lg:group-hover:shadow-2xl"></div>
                <div className="relative p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg lg:transform lg:transition-all lg:duration-500 lg:group-hover:scale-110 lg:group-hover:rotate-3">
                    <RefreshCw className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4 lg:group-hover:text-purple-600 lg:transition-colors lg:duration-300">
                    {t('service.exchange')}
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto mb-6 rounded-full"></div>
                  <p className="font-inter text-gray-600 leading-relaxed text-lg">
                    {t('service.exchangeDesc')}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Additional trust indicators */}
          <AnimatedSection animation="fadeInUp" delay={300} className="mt-16 text-center">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section aria-label="testimonials" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white to-pink-50/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" delay={100} className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">What customers say</span>
            </h2>
            <p className="font-inter text-gray-600 mt-3">Real stories from happy shoppers</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1,2,3].map((i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/80 to-white/60 border border-rose-100/60 shadow-lg"></div>
                <div className="relative p-6 rounded-3xl">
                  <Quote className="w-8 h-8 text-rose-500 mb-4" />
                  <p className="text-gray-700 leading-relaxed">
                    “Beautiful quality and super fast delivery. I’m in love with my new outfit!”
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sara B.</p>
                      <p className="text-xs text-gray-500">Algiers</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rose-900/20 via-pink-900/10 to-purple-900/20"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-rose-500/10 to-pink-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <AnimatedSection animation="fadeInLeft" delay={100} className="lg:col-span-2">
              <div className="mb-6">
                <h3 
                  className="font-playfair text-3xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 antialiased"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  ✨ Belle Elle Boutique ✨
                </h3>
                <p className="text-gray-300 leading-relaxed max-w-md antialiased">
                  Your premier destination for elegant women's fashion. We curate timeless pieces that celebrate your unique style and enhance your natural beauty.
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex gap-4">
                <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.437-.219-1.085c0-1.016.591-1.775 1.327-1.775.625 0 .927.469.927 1.031 0 .628-.399 1.569-.606 2.441-.172.725.363 1.315 1.077 1.315 1.295 0 2.291-1.364 2.291-3.334 0-1.744-1.253-2.966-3.044-2.966-2.074 0-3.293 1.553-3.293 3.16 0 .625.24 1.295.543 1.659.059.073.068.137.05.211-.055.229-.178.718-.202.817-.031.128-.101.156-.233.094-1.084-.504-1.763-2.088-1.763-3.366 0-2.302 1.672-4.415 4.821-4.415 2.532 0 4.503 1.805 4.503 4.209 0 2.513-1.586 4.535-3.786 4.535-.739 0-1.435-.387-1.673-.848 0 0-.366 1.393-.455 1.735-.164.633-.607 1.423-.904 1.902.681.211 1.404.324 2.157.324 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </AnimatedSection>

            {/* Quick Links */}
            <AnimatedSection animation="fadeInUp" delay={250}>
              <div>
                <h4 className="font-semibold text-lg mb-6 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Collections</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">New Arrivals</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Sale</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Size Guide</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Contact</a></li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Customer Service */}
            <AnimatedSection animation="fadeInRight" delay={400}>
              <div>
                <h4 className="font-semibold text-lg mb-6 text-white">Customer Care</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Shipping Info</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Returns & Exchanges</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">FAQ</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors duration-200">Track Your Order</a></li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Newsletter Signup */}
          <AnimatedSection animation="fadeInUp" delay={200} className="mt-12 pt-8 border-t border-gray-700">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="font-playfair text-2xl font-bold text-white mb-4">Stay in Style</h4>
              <p className="text-gray-300 mb-6">Subscribe to our newsletter for exclusive offers, style tips, and new arrivals.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-700 lg:transition-all lg:duration-300 lg:transform lg:hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © 2025 Belle Elle Boutique. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Designed with ❤️ for women who love fashion
                </p>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-rose-400 transition-colors duration-200">Privacy</a>
                <a href="#" className="hover:text-rose-400 transition-colors duration-200">Terms</a>
                <a href="#" className="hover:text-rose-400 transition-colors duration-200">Cookies</a>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Secure Shopping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;