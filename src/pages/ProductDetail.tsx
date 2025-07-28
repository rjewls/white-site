// React hooks for state and lifecycle
import { useState, useEffect } from "react";
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
// React Hook Form for form handling
import { useForm } from "react-hook-form";
// Types
import { OrderFormValues } from "@/types/product";
// Wilaya data for location selection
import { wilayasData } from "@/lib/locations";
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
    },
  });
  const watchWilaya = form.watch("wilaya");

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

  // Update communes when wilaya changes
  useEffect(() => {
    if (watchWilaya) {
      const selectedWilaya = wilayasData?.find(
        (wilaya) => wilaya.name === watchWilaya
      );
      setCommunes(selectedWilaya?.communes || []);
    } else {
      setCommunes([]);
    }
  }, [watchWilaya]);

  // Handle order form submission
  const handleOrderSubmit = async (values: OrderFormValues) => {
    console.log("Order submitted:", values);
    
    if (!product) return;
    
    const webhookUrl = "https://discord.com/api/webhooks/1398783921738481745/Bg0f-Qp7ePQxfORlP4SZ5So5C7xxRtmTOWOmEXQmMpdvnTqy9CVxg8Sbn4LcpPYN4EBD";
    
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
          if (r > 200 && g > 150) return '�'; // Yellow-ish
          return '🟠'; // Orange-ish
        }
        if (b > g && b > 100) return '�'; // Purple-ish
        return '�'; // Red
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
    
    // Calculate delivery fee
    const selectedWilaya = wilayaDeliveryFees.find(w => w.name === values.wilaya);
    const deliveryFee = selectedWilaya ? 
      (values.deliveryOption === "home" ? selectedWilaya.homeDelivery : selectedWilaya.stopdeskDelivery) : 0;
    
    // Calculate total price
    const totalPrice = (product.price * values.quantity) + deliveryFee;
    
    const orderData = {
      productId: product.id,
      productTitle: product.title || product.name,
      productPrice: product.price,
      quantity: values.quantity,
      wilaya: values.wilaya,
      commune: values.commune,
      deliveryOption: values.deliveryOption,
      name: values.name,
      phone: values.phone,
      address: values.address,
      deliveryFee,
      totalPrice,
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `**New Order Received!**\n\n**Product:** ${orderData.productTitle}\n**Quantity:** ${orderData.quantity}${values.selectedColor ? `\n**Color:** ${getColorEmoji(values.selectedColor)} ${values.selectedColor}` : ""}\n**Customer:** ${orderData.name}\n**Phone:** ${orderData.phone}\n**Location:** ${orderData.wilaya}, ${orderData.commune}\n**Address:** ${orderData.address}\n**Delivery:** ${orderData.deliveryOption === "home" ? "Home Delivery" : "Stopdesk Delivery"}\n**Product Price:** ${orderData.productPrice * orderData.quantity} DZD\n**Delivery Fee:** ${orderData.deliveryFee} DZD\n**Total:** ${orderData.totalPrice} DZD`
        }),
      });

      if (response.ok) {
        toast.success("Order sent successfully!");
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
        });
      } else {
        toast.error("Error sending order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending order");
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
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-rose-600 mb-3">
                {product.title}
              </h1>
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
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
            
            {/* Purchase Form - Mobile */}
            <Card className="bg-gradient-card">
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
                <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-playfair text-xl font-semibold text-rose-600 mb-4">
                    Description
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
            
            {/* Product Info & Purchase Form - Desktop */}
            <div className="space-y-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-rose-600 mb-4">
                  {product.title}
                </h1>
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
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;