// React hooks for state and lifecycle
import { useState, useEffect, useRef } from "react";
// Supabase client for database operations
import { supabase } from "@/lib/supabaseClient";
// Get route parameters (like product id)
import { useParams } from "react-router-dom";
// Top navigation bar
import { Navigation } from "@/components/Navigation";
// UI button component
import { Button } from "@/components/ui/button";
// Card UI components for layout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Input field UI component
import { Input } from "@/components/ui/input";
// Label UI component
import { Label } from "@/components/ui/label";
// Select dropdown UI components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Textarea UI component
import { Textarea } from "@/components/ui/textarea";
// Icon components
import { Heart, ShoppingCart, Star } from "lucide-react";
// Carousel for product images
import ImageCarousel from "@/components/ImageCarousel";
// Order form fields component
import { OrderFormFields } from "@/components/OrderFormFields";
// Rich content renderer
import { RichContentRenderer } from "@/components/RichTextEditor";
// React Hook Form for form handling
import { useForm } from "react-hook-form";
// Types
import { OrderFormValues } from "@/types/product";
// Wilaya and commune data with exact Noest spellings
import { WILAYA_LIST, getWilayaId } from "@/lib/wilayaMapping";
import { getValidCommunes } from "@/lib/communeMapping";
// Delivery fees data
import { wilayaDeliveryFees } from "@/lib/deliveryFees";
// Toast notifications
import { toast } from "@/components/ui/sonner";

// Mock product data - will be replaced with Supabase
// Removed mockProducts. Now using Supabase.

// Main component for product detail page
const ProductDetail = () => {
  // Get product id from URL
  const { id } = useParams();
  // Product state: null means loading, object means loaded, false means not found
  const [product, setProduct] = useState(null);
  
  // State for selected color
  const [selectedColor, setSelectedColor] = useState("");
  // State for selected size
  const [selectedSize, setSelectedSize] = useState("");
  // State for quantity
  const [quantity, setQuantity] = useState(1);
  // State for customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });
  // State for communes based on selected wilaya
  const [communes, setCommunes] = useState<string[]>([]);
  // State for floating order button visibility
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const orderFormRef = useRef<HTMLDivElement>(null);

  // Form handling with react-hook-form
  const form = useForm<OrderFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      wilaya: "",
      commune: "",
      deliveryOption: "",
      address: "",
      quantity: 1,
      selectedColor: "",
      selectedColors: [],
      selectedSize: "",
      selectedSizes: [],
    },
  });
  const watchWilaya = form.watch("wilaya");
  const watchQuantity = form.watch("quantity");

  // Reset color selections when quantity changes
  useEffect(() => {
    if (watchQuantity === 1) {
      form.setValue("selectedColors", []);
      form.setValue("selectedSizes", []);
    } else {
      form.setValue("selectedColor", "");
      form.setValue("selectedSize", "");
      // Initialize selectedColors and selectedSizes arrays with empty strings
      const emptyColors = Array(watchQuantity).fill("");
      const emptySizes = Array(watchQuantity).fill("");
      form.setValue("selectedColors", emptyColors);
      form.setValue("selectedSizes", emptySizes);
    }
  }, [watchQuantity, form]);

  // Fetch product data from Supabase when component mounts or id changes
  useEffect(() => {
    // Async function to get product details
    const fetchProduct = async () => {
      if (!id) return;
      setProduct(null); // Set loading state
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        setProduct(false); // Explicitly mark as not found
      } else {
        // Clean up colors, sizes, images for product detail
        const cleanArrayField = (field) => {
          if (Array.isArray(field)) {
            return field
              .map((v) => typeof v === "string" ? v.replace(/[[\]"'\\]/g, "").trim() : v)
              .filter(Boolean)
              .join(", ");
          }
          if (typeof field === "string") {
            return field.replace(/[[\]"'\\]/g, "").split(",").map(s => s.trim()).filter(Boolean).join(", ");
          }
          return "";
        };
        
        // Clean images as array for carousel
        const cleanImagesArray = (field) => {
          if (Array.isArray(field)) {
            return field
              .map((v) => typeof v === "string" ? v.replace(/[[\]"'\\]/g, "").trim() : v)
              .filter(Boolean);
          }
          if (typeof field === "string") {
            return field.replace(/[[\]"'\\]/g, "").split(",").map(s => s.trim()).filter(Boolean);
          }
          return [];
        };
        
        setProduct({
          ...data,
          colors: cleanArrayField(data.colors),
          sizes: cleanArrayField(data.sizes),
          images: cleanImagesArray(data.images) // Keep as array for carousel
        });
      }
    };
    fetchProduct();
  }, [id]);

  // Intersection Observer to detect if order form is in view (mobile only)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Show floating button when order form is NOT in view and we're on mobile
        setShowFloatingButton(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = orderFormRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [product]); // Re-run when product loads

  // Update communes when wilaya changes
  useEffect(() => {
    if (watchWilaya) {
      // Get the wilaya ID from our mapping
      const wilayaId = getWilayaId(watchWilaya);
      if (wilayaId) {
        // Get communes from our commune mapping
        const validCommunes = getValidCommunes(wilayaId);
        setCommunes(validCommunes);
      } else {
        setCommunes([]);
      }
    } else {
      setCommunes([]);
    }
  }, [watchWilaya]);

  // Handle order form submission
  const handleOrderSubmit = async (values: OrderFormValues) => {
    console.log("Order submitted:", values);
    
    if (!product) return;
    
    // Validate all required fields are filled
    const requiredFields = ['name', 'phone', 'wilaya', 'commune', 'deliveryOption', 'address'];
    const isValid = requiredFields.every(field => {
      const value = values[field as keyof OrderFormValues];
      return value && String(value).trim() !== '';
    });
    
    if (!isValid) {
      console.log("Form validation failed - not sending to Discord");
      return;
    }
    
    // Function to get color emoji based on hex color value
    const getColorEmoji = (color: string) => {
      // If it's not a hex color, return default
      if (!color.startsWith('#')) {
        return '⭕';
      }
      
      // Convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };
      
      // Get RGB values
      const rgb = hexToRgb(color);
      if (!rgb) return '⭕';
      
      const { r, g, b } = rgb;
      
      // Calculate luminance to determine if it's light or dark
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Determine dominant color based on RGB values
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      
      // Very low saturation (grayscale)
      if (diff < 30) {
        if (luminance < 0.2) return '⚫'; // Very dark
        if (luminance > 0.8) return '⚪'; // Very light
        return '⚫'; // Gray
      }
      
      // Determine the dominant color
      if (r === max) {
        // Red dominant
        if (g > b && g > 100) {
          if (r > 200 && g > 150) return '🟡'; // Yellow-ish
          return '🟠'; // Orange-ish
        }
        if (b > g && b > 100) return '🟣'; // Purple-ish
        return '🔴'; // Red
      } else if (g === max) {
        // Green dominant
        if (r > b && r > 100) {
          if (r > 200) return '🟡'; // Yellow-ish
          return '🟠'; // Orange-ish
        }
        if (b > r && b > 100) {
          if (g > 150 && b > 150) return '🔵'; // Cyan-ish
          return '🟢'; // Green
        }
        return '🟢'; // Green
      } else {
        // Blue dominant
        if (r > g && r > 100) return '🟣'; // Purple-ish
        if (g > r && g > 100) return '🔵'; // Cyan-ish
        return '🔵'; // Blue
      }
    };
    
    // Helper function to format items for Discord message
    const formatItemsForDiscord = () => {
      if (values.quantity === 1) {
        const colorInfo = values.selectedColor ? getColorEmoji(values.selectedColor) + " " + values.selectedColor : "";
        const sizeInfo = values.selectedSize ? "📏 " + values.selectedSize : "";
        const details = [colorInfo, sizeInfo].filter(Boolean).join(" | ");
        return details ? " | " + details : "";
      } else {
        // Multiple items - show each item individually
        const colors = values.selectedColors || [];
        const sizes = values.selectedSizes || [];
        const itemDetails = [];
        
        for (let i = 0; i < values.quantity; i++) {
          const color = colors[i];
          const size = sizes[i];
          const colorInfo = color ? getColorEmoji(color) + " " + color : "";
          const sizeInfo = size ? "📏 " + size : "";
          const details = [colorInfo, sizeInfo].filter(Boolean).join(" | ");
          
          if (details) {
            itemDetails.push(`Item ${i + 1}: ${details}`);
          }
        }
        
        return itemDetails.length > 0 ? "\n\n🎨 **Item Details:**\n" + itemDetails.join("\n") : "";
      }
    };
    
    // Calculate delivery fee
    const selectedWilaya = wilayaDeliveryFees.find(w => w.name === values.wilaya);
    const deliveryFee = selectedWilaya ? 
      (values.deliveryOption === "home" ? selectedWilaya.homeDelivery : selectedWilaya.stopdeskDelivery) : 0;
    
    // Calculate total price
    const totalPrice = (product.price * values.quantity) + deliveryFee;
    
    // Discord webhook URL (keep existing functionality)
    const webhookUrl = "https://discord.com/api/webhooks/1398783921738481745/Bg0f-Qp7ePQxfORlP4SZ5So5C7xxRtmTOWOmEXQmMpdvnTqy9CVxg8Sbn4LcpPYN4EBD";
    
    try {
      // Get wilaya_id for Noest API compatibility using our mapping
      const wilayaId = getWilayaId(values.wilaya);
      if (!wilayaId) {
        throw new Error(`Invalid wilaya: ${values.wilaya}`);
      }
      
      const orderData = {
        // Noest API compatible fields
        client: values.name,
        phone: values.phone,
        adresse: values.address,
        wilaya_id: wilayaId,
        commune: values.commune,
        produit: product.title,
        montant: totalPrice,
        remarque: '',
        type_id: 1, // 1 = delivery
        poids: product?.weight ? parseInt(product.weight) || 1 : 1, // Use product weight or default 1kg
        stop_desk: values.deliveryOption === 'home' ? 0 : 1,
        can_open: 1, // Allow opening
        stock: 0, // Not from Noest stock
        quantite: values.quantity.toString(),
        
        // Keep existing fields for compatibility
        product_id: product.id,
        product_title: product.title,
        product_price: product.price,
        quantity: values.quantity,
        delivery_fee: deliveryFee,
        total_price: totalPrice,
        customer_name: values.name,
        customer_phone: values.phone,
        delivery_address: values.address,
        wilaya: values.wilaya,
        delivery_option: values.deliveryOption,
        status: 'pending', // Default status for new orders
        
        // Item details for multi-quantity orders
        selected_color: values.quantity === 1 ? values.selectedColor : JSON.stringify(values.selectedColors),
        selected_size: values.quantity === 1 ? values.selectedSize : JSON.stringify(values.selectedSizes),
      };

      // 1. Save order to Supabase first
      const { error: supabaseError } = await supabase
        .from('orders')
        .insert(orderData);

      if (supabaseError) {
        throw new Error('Failed to save order: ' + supabaseError.message);
      }

      // 2. Send to Discord webhook (keep existing functionality)
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [{
            color: 0xec4899, // Pink color
            description: "🛍️ **NEW ORDER** 🛍️\n\n" +
                        "📦 **" + product.title + "** | Qty: " + values.quantity + 
                        formatItemsForDiscord() + "\n\n" +
                        "👤 " + values.name + " | 📱 " + values.phone + "\n" +
                        "📍 " + values.wilaya + ", " + values.commune + "\n" +
                        "🏠 " + values.address + "\n\n" +
                        "🚚 " + (values.deliveryOption === "home" ? "🏠 Home Delivery" : "🏪 Stopdesk Delivery") + "\n\n" +
                        "💰 **TOTAL: " + totalPrice + " DZD**\n" +
                        (product.price * values.quantity) + " DZD + " + deliveryFee + " DZD delivery\n\n" +
                        "✅ Pending | ⏰ " + new Date().toLocaleString('en-GB', { 
                          timeZone: 'Africa/Algiers',
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) + " 🌹"
          }]
        }),
      });

      if (response.ok) {
        toast.success("Order placed successfully! We will contact you soon.");
      } else {
        // Order saved to Supabase but Discord failed - still show success
        toast.success("Order placed successfully! We will contact you soon.");
      }
      
      // Reset form
      form.reset({
        name: "",
        phone: "",
        wilaya: "",
        commune: "",
        deliveryOption: "",
        address: "",
        quantity: 1,
        selectedColor: "",
        selectedColors: [],
        selectedSize: "",
        selectedSizes: [],
      });
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    }
  };

  // Function to scroll to order form
  const scrollToOrderForm = () => {
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Show loading spinner/message while fetching
  if (product === null) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg text-muted-foreground animate-pulse">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show not found only if Supabase query returned nothing
  if (product === false) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  // Main render for product detail page
  return (
    <>
      <div className="min-h-screen bg-gradient-soft">
        <Navigation />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-4">
            {/* Product Images Carousel - Mobile */}
            <div className="mb-4">
              <ImageCarousel 
                images={product.images} 
                title={product.title}
                autoPlay={true}
                showThumbnails={true}
              />
            </div>
            
            {/* Product Info - Mobile */}
            <div className="bg-white/90 lg:bg-white/50 lg:backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-rose-600 flex-1">
                  {product.title}
                </h1>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full border border-yellow-200/50 shadow-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-500 fill-yellow-400" 
                        style={i === 4 ? { fill: 'url(#half-star)' } : {}}
                      />
                    ))}
                    <span className="text-sm font-semibold text-gray-800 ml-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">4.5</span>
                  </div>
                  <div className="bg-white/90 lg:bg-white/80 lg:backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200/50 shadow-sm">
                    <span className="text-xs font-medium text-gray-600">124 reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-inter text-2xl sm:text-3xl font-bold text-primary">
                  {product.price} DZD
                </span>
              </div>
              
              {/* Color circles - Mobile */}
              {(Array.isArray(product.colors)
                ? product.colors
                : typeof product.colors === "string"
                  ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                  : []
              ).length > 0 && (
                <div className="flex gap-2 mb-3">
                  {(Array.isArray(product.colors)
                    ? product.colors
                    : typeof product.colors === "string"
                      ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                      : []
                  ).map((color, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-border inline-block"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
              
              {/* Description - Mobile */}
              {product.description && (
                <div className="mt-3">
                  <h3 className="font-playfair text-lg font-semibold text-rose-600 mb-2">
                    Description
                  </h3>
                  <RichContentRenderer 
                    content={product.description}
                    className="text-sm leading-relaxed"
                  />
                </div>
              )}
            </div>
            
            {/* Purchase Form - Mobile */}
            <Card ref={orderFormRef} className="bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-playfair text-xl sm:text-2xl">
                  Purchase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <OrderFormFields
                  form={form}
                  onSubmit={handleOrderSubmit}
                  isSubmitting={false}
                  communes={communes}
                  watchWilaya={watchWilaya}
                  productPrice={product?.price || 0}
                  availableColors={
                    Array.isArray(product.colors)
                      ? product.colors
                      : typeof product.colors === "string"
                        ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                        : []
                  }
                  availableSizes={
                    Array.isArray(product.sizes)
                      ? product.sizes
                      : typeof product.sizes === "string"
                        ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
                        : []
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-12">
            {/* Product Images Carousel - Desktop */}
            <div className="space-y-6">
              <ImageCarousel 
                images={product.images} 
                title={product.title}
                autoPlay={true}
                showThumbnails={true}
              />
              {/* Product Description - Desktop */}
              {product.description && (
                <div className="bg-white/90 lg:bg-white/50 lg:backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-playfair text-xl font-semibold text-rose-600 mb-4">
                    Description
                  </h3>
                  <RichContentRenderer 
                    content={product.description}
                    className="text-base leading-relaxed"
                  />
                </div>
              )}
            </div>
            
            {/* Product Info & Purchase Form - Desktop */}
            <div className="space-y-8">            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-playfair text-3xl font-bold text-rose-600 flex-1">
                  {product.title}
                </h1>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200/50 shadow-lg lg:backdrop-blur-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 text-yellow-500 fill-yellow-400 lg:transition-transform lg:hover:scale-110" 
                        style={i === 4 ? { fill: 'url(#half-star)' } : {}}
                      />
                    ))}
                    <span className="text-base font-bold text-gray-800 ml-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">4.5</span>
                  </div>
                  <div className="bg-white/95 lg:bg-white/90 lg:backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 shadow-md">
                    <span className="text-sm font-medium text-gray-600">124 reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-inter text-3xl font-bold text-primary">
                  {product.price} DZD
                </span>
              </div>
                {/* Color circles - Desktop */}
                {(Array.isArray(product.colors)
                  ? product.colors
                  : typeof product.colors === "string"
                    ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                    : []
                ).length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {(Array.isArray(product.colors)
                      ? product.colors
                      : typeof product.colors === "string"
                        ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                        : []
                    ).map((color, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-full border border-border inline-block"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Purchase Form - Desktop */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">
                    Purchase Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <OrderFormFields
                    form={form}
                    onSubmit={handleOrderSubmit}
                    isSubmitting={false}
                    communes={communes}
                    watchWilaya={watchWilaya}
                    productPrice={product?.price || 0}
                    availableColors={
                      Array.isArray(product.colors)
                        ? product.colors
                        : typeof product.colors === "string"
                          ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                          : []
                    }
                    availableSizes={
                      Array.isArray(product.sizes)
                        ? product.sizes
                        : typeof product.sizes === "string"
                          ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
                          : []
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Order Now Button - Mobile Only */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <button
            onClick={scrollToOrderForm}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 animate-shake flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Order Now</span>
          </button>
        </div>
      )}
      
      {/* Hidden SVG for half-filled star gradient */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="90%" stopColor="#f59e0b" />
            <stop offset="90%" stopColor="rgba(249, 250, 251, 0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default ProductDetail;