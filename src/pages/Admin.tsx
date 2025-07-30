import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { Plus, Edit, Trash2, Save, X, LogOut, User, ImageIcon } from "lucide-react";
import { compressImages, formatFileSize, supportsWebP } from "@/lib/imageCompression";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Products will be fetched from Supabase

interface FormData {
  title: string;
  price: string;
  images: (File | string)[];
  description: string;
  colors: string | string[];
  sizes: string;
}

interface ProductFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  onCancel: () => void;
  handleImageFiles: (files: FileList | null) => Promise<void>;
  isCompressing: boolean;
  compressionProgress: number;
  compressionStatus: string;
  t: (key: string) => string;
}

const Admin = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState([]);
  
  // Helper function to clean array fields
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

  // Helper function to refetch and clean products data
  const refetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Error fetching products", description: error.message, variant: "destructive" });
      return;
    }
    
    if (data) {
      setProducts(data.map(product => ({
        ...product,
        colors: cleanArrayField(product.colors),
        sizes: cleanArrayField(product.sizes),
        images: cleanArrayField(product.images)
      })));
    }
  }, [toast]);

  // Fetch products from Supabase on mount
  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    images: [],
    description: "",
    colors: "",
    sizes: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      images: [],
      description: "",
      colors: "",
      sizes: ""
    });
    setIsCompressing(false);
    setCompressionProgress(0);
    setCompressionStatus("");
  };

  // Handle image file selection and compression
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast({ 
          title: "Invalid file type", 
          description: `${file.name} is not an image file.`, 
          variant: "destructive" 
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for original files
        toast({ 
          title: "File too large", 
          description: `${file.name} is larger than 10MB.`, 
          variant: "destructive" 
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check WebP support
    if (!supportsWebP()) {
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support WebP format. Please update your browser.",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);
    setCompressionProgress(0);
    setCompressionStatus("Starting compression...");

    try {
      // Compress images to WebP format with target size 100-200KB
      const compressedFiles = await compressImages(
        validFiles,
        {
          maxSizeKB: 200,
          minSizeKB: 100,
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
          format: 'webp'
        },
        (progress, currentFile) => {
          setCompressionProgress(progress);
          setCompressionStatus(`Compressing ${currentFile}...`);
        }
      );

      // Add compressed files to form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedFiles]
      }));

      // Show compression results
      const totalOriginalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
      const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
      const compressionRatio = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);

      toast({
        title: "Images compressed successfully",
        description: `${compressedFiles.length} images compressed. Size reduced by ${compressionRatio}% (${formatFileSize(totalOriginalSize)} → ${formatFileSize(totalCompressedSize)})`,
      });

      setCompressionStatus("Compression complete!");
      
    } catch (error) {
      console.error("Image compression failed:", error);
      toast({
        title: "Compression failed",
        description: "Failed to compress images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
      setTimeout(() => {
        setCompressionProgress(0);
        setCompressionStatus("");
      }, 3000);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    // Helper to clean up array/stringified array
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
    // Ensure images is always an array of URLs
    let imagesArr = [];
    if (Array.isArray(product.images)) {
      imagesArr = product.images.filter(img => typeof img === "string" && img.trim() !== "");
    } else if (typeof product.images === "string" && product.images.trim() !== "") {
      imagesArr = product.images.split(",").map(img => img.trim()).filter(Boolean);
    }
    setFormData({
      title: product.title,
      price: product.price?.toString(),
      images: imagesArr,
      description: product.description,
      colors: cleanArrayField(product.colors),
      sizes: cleanArrayField(product.sizes)
    });
    setShowAddForm(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Upload any File objects in formData.images to Supabase Storage
    let imageUrls: string[] = [];
    for (const img of formData.images) {
      if (!img) continue; // Skip null/undefined items
      
      // Type guard for File objects  
      const isFile = (item: unknown): item is File => {
        return item !== null && 
               typeof item === "object" && 
               "name" in item &&
               "size" in item &&
               "type" in item &&
               typeof (item as Record<string, unknown>).name === "string" && 
               typeof (item as Record<string, unknown>).size === "number" && 
               typeof (item as Record<string, unknown>).type === "string";
      };
      
      if (isFile(img)) {
        // File is already compressed, so upload directly
        const filePath = `${Date.now()}-${img.name}`;
        const { data, error } = await supabase.storage.from('product-images').upload(filePath, img);
        if (error) {
          toast({ title: "Image Upload Error", description: error.message, variant: "destructive" });
          console.error("Supabase upload error:", error, img);
        } else {
          const publicUrl = supabase.storage.from('product-images').getPublicUrl(filePath).data.publicUrl;
          imageUrls.push(publicUrl);
        }
      } else if (typeof img === "string" && img.trim() !== "") {
        imageUrls.push(img);
      }
    }
    if (imageUrls.length === 0) {
      imageUrls = ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"];
    }

    const productData = {
      title: formData.title,
      price: parseFloat(formData.price),
      images: imageUrls,
      description: formData.description,
      colors: Array.isArray(formData.colors)
        ? formData.colors.filter(c => c)
        : typeof formData.colors === 'string' && formData.colors
          ? formData.colors.split(',').map(c => c.trim()).filter(c => c)
          : [],
      sizes: typeof formData.sizes === 'string'
        ? formData.sizes.split(',').map(s => s.trim()).filter(s => s)
        : []
    };

    if (editingProduct) {
      // Update existing product in Supabase
      supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct)
        .then(({ error }) => {
          if (error) {
            toast({ title: "Error updating product", description: error.message, variant: "destructive" });
          } else {
            toast({ title: "Product Updated", description: "Product has been updated successfully" });
            // Refetch products with proper data cleaning
            refetchProducts();
            setEditingProduct(null);
          }
        });
    } else {
      // Add new product to Supabase
      supabase
        .from('products')
        .insert([productData])
        .then(({ error }) => {
          if (error) {
            toast({ title: "Error adding product", description: error.message, variant: "destructive" });
          } else {
            toast({ title: "Product Added", description: "New product has been added successfully" });
            // Refetch products with proper data cleaning
            refetchProducts();
            setShowAddForm(false);
          }
        });
    }
    resetForm();
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleDelete = (productId) => {
    // Delete product from Supabase
    supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .then(({ error }) => {
        if (error) {
          toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Product Deleted", description: "Product has been removed successfully" });
          // Refetch products with proper data cleaning
          refetchProducts();
        }
      });
  };

  return (
    <div className={`min-h-screen bg-gradient-soft ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col space-y-3 mb-4 sm:mb-8 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="flex flex-col space-y-3">
            <h1 className="font-playfair text-xl sm:text-3xl font-bold text-foreground">
              {t('admin.dashboard')}
            </h1>
            <div className="relative">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {t('admin.welcome')}
                    </span>
                    <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      Anis
                    </span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <LanguageSwitcher />
            <Button
              onClick={() => setShowAddForm(true)}
              variant="elegant"
              className="flex items-center justify-center gap-2 flex-1 sm:flex-none py-3 sm:py-2"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">{t('admin.addProduct')}</span>
            </Button>
            
            <Button
              onClick={signOut}
              variant="outline"
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </Button>
          </div>
        </div>

        {/* Add Product Form - Mobile Optimized */}
        {showAddForm && (
          <Card className="mb-4 sm:mb-8 bg-gradient-card border-0 shadow-lg">
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="font-playfair text-lg sm:text-xl">{t('admin.addProduct')}</CardTitle>
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  size="sm"
                  className="sm:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6 pt-4">
              <ProductForm 
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onCancel={handleCancel}
                handleImageFiles={handleImageFiles}
                isCompressing={isCompressing}
                compressionProgress={compressionProgress}
                compressionStatus={compressionStatus}
                t={t}
              />
            </CardContent>
          </Card>
        )}

        {/* Products List - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-6">
          {products.length === 0 ? (
            <Card className="bg-gradient-card">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">{t('admin.noProducts')}</p>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="bg-gradient-card border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  {editingProduct === product.id ? (
                    <div className="p-3 sm:p-6 bg-muted/30">
                      <div className="flex items-center justify-between mb-4 sm:hidden">
                        <h3 className="font-playfair text-lg font-semibold">Edit Product</h3>
                        <Button
                          onClick={handleCancel}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <ProductForm 
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        handleImageFiles={handleImageFiles}
                        isCompressing={isCompressing}
                        compressionProgress={compressionProgress}
                        compressionStatus={compressionStatus}
                        t={t}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="p-4 space-y-4">
                          {/* Product Header with Main Image */}
                          <div className="flex items-start gap-4">
                            {/* Main Image */}
                            <div className="flex-shrink-0">
                              {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length > 0 ? (
                                <img
                                  src={(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : [])[0]}
                                  alt={product.title}
                                  className="w-24 h-24 object-cover rounded-xl border shadow-sm"
                                />
                              ) : (
                                <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center border">
                                  <span className="text-xs text-muted-foreground text-center">No Image</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Product Basic Info */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <h3 className="font-playfair font-semibold text-lg leading-tight">
                                {product.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Price Row */}
                          <div className="flex items-center justify-start bg-muted/30 rounded-lg p-3">
                            <div>
                              <span className="text-xs text-muted-foreground">Price</span>
                              <div className="font-bold text-primary text-xl">{product.price} DZD</div>
                            </div>
                          </div>
                          
                          {/* Additional Images */}
                          {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length > 1 && (
                            <div className="space-y-2">
                              <span className="text-xs font-medium text-muted-foreground">Additional Images</span>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).slice(1, 6).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`${product.title} ${index + 2}`}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border shadow-sm"
                                  />
                                ))}
                                {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length > 6 && (
                                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground flex-shrink-0 border">
                                    +{(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length - 6}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Colors Section */}
                          {(Array.isArray(product.colors)
                            ? product.colors
                            : typeof product.colors === "string"
                              ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                              : []
                          ).length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs font-medium text-muted-foreground">Available Colors</span>
                              <div className="flex flex-wrap gap-2">
                                {(Array.isArray(product.colors)
                                  ? product.colors
                                  : typeof product.colors === "string"
                                    ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                                    : []
                                ).map((color, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-white/50 rounded-full px-3 py-1 border">
                                    <span 
                                      className="w-4 h-4 rounded-full border shadow-sm"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs font-medium capitalize">{color}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Sizes Section */}
                          {(Array.isArray(product.sizes)
                            ? product.sizes
                            : typeof product.sizes === "string"
                              ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
                              : []
                          ).length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs font-medium text-muted-foreground">Available Sizes</span>
                              <div className="flex flex-wrap gap-2">
                                {(Array.isArray(product.sizes)
                                  ? product.sizes
                                  : typeof product.sizes === "string"
                                    ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
                                    : []
                                ).map((size, idx) => (
                                  <span 
                                    key={idx} 
                                    className="bg-white/50 border rounded-lg px-3 py-1 text-xs font-medium"
                                  >
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-2">
                            <Button
                              onClick={() => handleEdit(product)}
                              variant="soft"
                              size="sm"
                              className="flex-1 h-10 font-medium"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </Button>
                            <Button
                              onClick={() => handleDelete(product.id)}
                              variant="destructive"
                              size="sm"
                              className="flex-1 h-10 font-medium"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-start gap-6 p-6">
                        <div className="flex gap-2 overflow-x-auto">
                          {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${product.title} ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          ))}
                          {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length > 3 && (
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                              +{(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length - 3}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-playfair font-semibold text-xl mb-2">
                            {product.title}
                          </h3>
                          <p className="text-muted-foreground mb-2 text-sm line-clamp-1">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-primary text-base">Price: {product.price} DZD</span>
                            <span className="flex items-center gap-1">Colors:
                              {(Array.isArray(product.colors)
                                ? product.colors
                                : typeof product.colors === "string"
                                  ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                                  : []
                              ).map((color, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1">
                                  <span style={{ background: color, border: '1px solid #ccc', width: 14, height: 14, borderRadius: '50%', display: 'inline-block' }} />
                                </span>
                              ))}
                            </span>
                            <span>Sizes: {
                              (Array.isArray(product.sizes)
                                ? product.sizes
                                : typeof product.sizes === "string"
                                  ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
                                  : []
                              ).join(", ")
                            }</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(product)}
                            variant="soft"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(product.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({ 
  formData, 
  setFormData, 
  onSave, 
  onCancel,
  handleImageFiles,
  isCompressing,
  compressionProgress,
  compressionStatus,
  t
}) => {
  // Import compression utilities for use in this component
  // (formatFileSize is already imported at the top level)
  
  // Local state for color picker value
  const [colorPickerValue, setColorPickerValue] = useState("#ffffff");

  // Helper to delete image from Supabase Storage
  const deleteImageFromSupabase = async (imgUrl) => {
    try {
      // Only handle Supabase URLs
      if (!imgUrl.includes("product-images")) return;
      // Extract file path from public URL
      const urlParts = imgUrl.split("/product-images/");
      if (urlParts.length < 2) return;
      const filePath = decodeURIComponent(urlParts[1].split("?")[0]);
      const { error } = await supabase.storage.from('product-images').remove([filePath]);
      if (error) {
        console.error("Image Delete Error:", error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Image Delete Error:", err.message);
      return false;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title and Price Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">{t('form.productTitle')} {t('form.required')}</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder={t('form.productTitle')}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="price" className="text-sm font-medium">{t('form.price')} {t('form.required')}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="0.00"
            className="mt-1"
          />
        </div>
      </div>

      {/* Images Section */}
      <div>
        <Label className="text-sm font-medium">{t('form.productImages')}</Label>
        <div className="mt-2 space-y-3">
          <div className="space-y-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageFiles(e.target.files)}
              disabled={isCompressing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50"
            />
            
            {/* Compression Progress */}
            {isCompressing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4 animate-pulse" />
                  <span>{compressionStatus}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${compressionProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  Converting to WebP format and optimizing for web (target: 100-200 KB per image)
                </div>
              </div>
            )}
          </div>
          
          {/* Image Grid */}
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {formData.images.map((img, idx) => {
                let src = "";
                let isSupabaseUrl = false;
                if (img && typeof img === "object" && "name" in img && "size" in img && "type" in img) {
                  src = URL.createObjectURL(img);
                } else if (typeof img === "string") {
                  src = img;
                  isSupabaseUrl = src.includes("product-images");
                }
                return (
                  <div key={idx} className="relative group">
                    <img 
                      src={src} 
                      alt={`Product ${idx + 1}`} 
                      className="w-full aspect-square object-cover rounded-lg border" 
                      onError={e => {e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop';}} 
                    />
                    {/* File size indicator for compressed files */}
                    {img && typeof img === "object" && "size" in img && (
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        {formatFileSize(img.size)}
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-md group-hover:bg-red-500 group-hover:text-white transition-colors sm:opacity-75 sm:hover:opacity-100 opacity-100"
                      title="Delete image"
                      onClick={async () => {
                        // If Supabase URL, delete from bucket first
                        if (isSupabaseUrl) {
                          const success = await deleteImageFromSupabase(src);
                          if (!success) return;
                        }
                        // Remove from local array
                        const newImages = formData.images.filter((_, i) => i !== idx);
                        setFormData({ ...formData, images: newImages });
                      }}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium">{t('form.description')} {t('form.required')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder={t('form.description')}
          className="mt-1 min-h-[100px]"
        />
      </div>

      {/* Colors and Sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Colors Section */}
        <div>
          <Label className="text-sm font-medium">{t('form.colors')}</Label>
          <div className="mt-2 space-y-3">
            {/* Color Display */}
            <div className="flex gap-2 flex-wrap min-h-[32px] p-2 border rounded-lg bg-muted/30">
              {(!formData.colors || formData.colors.length === 0) ? (
                <span className="text-sm text-muted-foreground">{t('form.noColors')}</span>
              ) : (
                (Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' && formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : []).map((color, idx) => (
                  <span key={idx} className="relative inline-flex items-center group">
                    <span 
                      style={{ 
                        background: color, 
                        border: '1px solid #ccc', 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        display: 'inline-block' 
                      }} 
                    />
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 bg-white border border-border rounded-full w-5 h-5 flex items-center justify-center text-xs text-muted-foreground hover:bg-red-500 hover:text-white transition-all sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                      onClick={() => {
                        const colorsArr = Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
                        const newColors = colorsArr.filter((_, i) => i !== idx);
                        setFormData({ ...formData, colors: newColors });
                      }}
                      tabIndex={-1}
                      aria-label="Remove color"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            
            {/* Color Selection */}
            <select
              value=""
              onChange={e => {
                const selected = e.target.value;
                if (!selected) return;
                const colorsArr = Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' && formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
                if (!colorsArr.includes(selected)) {
                  setFormData({ ...formData, colors: [...colorsArr, selected] });
                }
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('form.addColor')}</option>
              {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Cyan', 'Teal', 'Lime', 'Indigo'].map(color => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
            
            {/* Custom Color Picker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorPickerValue || "#ffffff"}
                  onChange={e => setColorPickerValue(e.target.value)}
                  className="w-10 h-10 border rounded-lg cursor-pointer"
                  title="Pick a custom color"
                />
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  onClick={() => {
                    const selected = colorPickerValue;
                    const colorsArr = Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' && formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
                    if (!colorsArr.includes(selected)) {
                      setFormData({ ...formData, colors: [...colorsArr, selected] });
                    }
                  }}
                >
                  {t('form.addCustom')}
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                Pick a custom color and click Add Custom
              </span>
            </div>
          </div>
        </div>

        {/* Sizes Section */}
        <div>
          <Label className="text-sm font-medium">{t('form.sizes')}</Label>
          <div className="mt-2 space-y-3">
            {/* Size Display */}
            <div className="flex gap-2 flex-wrap min-h-[32px] p-2 border rounded-lg bg-muted/30">
              {(!formData.sizes || formData.sizes.length === 0) ? (
                <span className="text-sm text-muted-foreground">{t('form.noSizes')}</span>
              ) : (
                (typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : []).map((size, idx) => (
                  <span key={idx} className="relative inline-flex items-center group bg-background border rounded-lg px-2 py-1 text-sm">
                    <span className="mr-2">{size}</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                      onClick={() => {
                        const sizesArr = typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
                        const newSizes = sizesArr.filter((_, i) => i !== idx);
                        setFormData({ ...formData, sizes: newSizes.join(', ') });
                      }}
                      aria-label="Remove size"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            
            {/* Add Size Input */}
            <div className="flex gap-2">
              <Input
                placeholder={t('form.addSize')}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newSize = e.currentTarget.value.trim();
                    if (newSize) {
                      const currentSizes = typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
                      if (!currentSizes.includes(newSize)) {
                        const updatedSizes = [...currentSizes, newSize].join(', ');
                        setFormData({ ...formData, sizes: updatedSizes });
                      }
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement.querySelector('input');
                  const newSize = input.value.trim();
                  if (newSize) {
                    const currentSizes = typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
                    if (!currentSizes.includes(newSize)) {
                      const updatedSizes = [...currentSizes, newSize].join(', ');
                      setFormData({ ...formData, sizes: updatedSizes });
                    }
                    input.value = '';
                  }
                }}
              >
                {t('common.add')}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Type a size and press Enter or click Add
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button 
          onClick={onSave} 
          variant="elegant" 
          className="flex items-center justify-center gap-2 sm:flex-1"
        >
          <Save className="h-4 w-4" />
          {t('form.saveProduct')}
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline" 
          className="flex items-center justify-center gap-2 sm:flex-1"
        >
          <X className="h-4 w-4" />
          {t('form.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default Admin;