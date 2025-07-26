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
// Custom hook for showing toast notifications
import { useToast } from "@/hooks/use-toast";
// Icon components
import { Heart, ShoppingCart, Star } from "lucide-react";
// Carousel for product images
import ImageCarousel from "@/components/ImageCarousel";

// Mock product data - will be replaced with Supabase
// Removed mockProducts. Now using Supabase.

// Main component for product detail page
const ProductDetail = () => {
  // Get product id from URL
  const { id } = useParams();
  // Toast notification function
  const { toast } = useToast();
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

  // Handle purchase form submission
  const handlePurchase = async (e) => {
    // Prevent default form submit
    e.preventDefault();
    
    // Check if color and size are selected
    if (!selectedColor || !selectedSize) {
      // Show error toast if missing selection
      toast({
        title: "Missing Selection",
        description: "Please select color and size",
        variant: "destructive"
      });
      return;
    }

    // Check if required customer info is filled
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      // Show error toast if missing info
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would send the order to Supabase (not implemented)
    // Show success toast
    toast({
      title: "Order Submitted!",
      description: "We'll contact you soon to confirm your purchase",
    });
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
  // ...existing code...
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
                    ${product.price}
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
                  <form onSubmit={handlePurchase} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Select onValueChange={setSelectedColor} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose color" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Array.isArray(product.colors)
                              ? product.colors
                              : typeof product.colors === "string"
                                ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                                : []
                            ).map((color) => (
                              <SelectItem key={color} value={color}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: color,
                                    border: '1px solid #ccc',
                                    marginRight: '6px'
                                  }} />
                                  {color}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="size">Size</Label>
                        <Select onValueChange={setSelectedSize} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose size" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Array.isArray(product.sizes)
                              ? product.sizes
                              : typeof product.sizes === "string"
                                ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
                                : []
                            ).map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Customer Information</h3>
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Textarea
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          placeholder="Enter your full address"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Special Notes</Label>
                        <Textarea
                          id="notes"
                          value={customerInfo.notes}
                          onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                          placeholder="Any special requests or notes"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        variant="elegant" 
                        size="lg" 
                        className="flex-1 flex items-center gap-2"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Purchase Now
                      </Button>
                      <Button variant="soft" size="lg" type="button">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </form>
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