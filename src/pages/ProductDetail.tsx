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
        setProduct({
          ...data,
          colors: cleanArrayField(data.colors),
          sizes: cleanArrayField(data.sizes),
          images: cleanArrayField(data.images)
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
    // Toast notification for order submission
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Carousel */}
            <div>
              <ImageCarousel 
                images={product.images} 
                title={product.title}
                autoPlay={true}
                showThumbnails={true}
              />
            </div>
            {/* Product Info & Purchase Form */}
            <div className="space-y-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-inter text-3xl font-bold text-primary ">
                    {product.price} DZD
                  </span>
                </div>
                {/* Color circles below price/title */}
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
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
              {/* Purchase Form */}
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