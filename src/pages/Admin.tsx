import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

// Products will be fetched from Supabase

const Admin = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        toast({ title: "Error fetching products", description: error.message, variant: "destructive" });
      } else {
        // Clean up colors, sizes, images for every product
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
        setProducts((data || []).map(product => ({
          ...product,
          colors: cleanArrayField(product.colors),
          sizes: cleanArrayField(product.sizes),
          images: cleanArrayField(product.images)
        })));
      }
    };
    fetchProducts();
  }, []);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    images: [""],
    description: "",
    colors: "",
    sizes: "",
    stock: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      images: [""],
      description: "",
      colors: "",
      sizes: "",
      stock: ""
    });
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
      sizes: cleanArrayField(product.sizes),
      stock: product.stock?.toString()
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
    let imageUrls = [];
    for (const img of formData.images) {
      if (img && typeof img === "object" && "name" in img && "size" in img && "type" in img) {
        // Validate file type and size
        if (!img.type.startsWith("image/")) {
          toast({ title: "Invalid file type", description: "Only image files are allowed.", variant: "destructive" });
          continue;
        }
        if (img.size > 5 * 1024 * 1024) { // 5MB limit
          toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
          continue;
        }
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
        : Array.isArray(formData.sizes)
          ? formData.sizes.filter(s => s)
          : [],
      stock: parseInt(formData.stock) || 0
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
            // Refetch products
            supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false })
              .then(({ data }) => setProducts(data || []));
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
            // Refetch products
            supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false })
              .then(({ data }) => setProducts(data || []));
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
          // Refetch products
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => setProducts(data || []));
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="elegant"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="mb-8 bg-gradient-card">
            <CardHeader>
              <CardTitle className="font-playfair">Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm 
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-gradient-card">
              <CardContent className="p-6">
                {editingProduct === product.id ? (
                  <ProductForm 
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                      {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                      {(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length > 3 && (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                          +{(Array.isArray(product.images) ? product.images : typeof product.images === 'string' && product.images ? (product.images as string).split(',').map(img => img.trim()).filter(Boolean) : []).length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair font-semibold text-xl mb-2">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Price: {product.price} DZD</span>
                        <span>Stock: {product.stock}</span>
                        <span className="flex items-center gap-1">Colors:
                          {(Array.isArray(product.colors)
                            ? product.colors
                            : typeof product.colors === "string"
                              ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                              : []
                          ).map((color, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1">
                              <span style={{ background: color, border: '1px solid #ccc', width: 16, height: 16, borderRadius: '50%', display: 'inline-block' }} />
                              <span className="sr-only">{color}</span>
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
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ formData, setFormData, onSave, onCancel }) => {
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
        if (window && window.toast) window.toast({ title: "Image Delete Error", description: error.message, variant: "destructive" });
        else alert("Image Delete Error: " + error.message);
        return false;
      }
      return true;
    } catch (err) {
      if (window && window.toast) window.toast({ title: "Image Delete Error", description: err.message, variant: "destructive" });
      else alert("Image Delete Error: " + err.message);
      return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="title">Product Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter product title"
        />
      </div>
      
      <div>
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          placeholder="0.00"
        />
      </div>

      <div className="md:col-span-2">
        <Label>Product Images</Label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;
            setFormData({ ...formData, images: [...formData.images, ...files] });
          }}
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {formData.images && formData.images.length > 0 && formData.images.map((img, idx) => {
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
                <img src={src} alt={`Product ${idx + 1}`} className="w-20 h-20 object-cover rounded" onError={e => {e.currentTarget.src = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop';}} />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow group-hover:bg-red-500 group-hover:text-white"
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
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter product description"
        />
      </div>

      <div>
        <Label htmlFor="colors">Colors</Label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap min-h-[28px]">
            {/* Show blank thumbnails if no colors selected */}
            {(!formData.colors || formData.colors.length === 0) && (
              <span className="w-7 h-7 rounded-full border border-dashed border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">?</span>
            )}
            {/* Show selected color circles with remove button */}
            {(Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' && formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : []).map((color, idx) => (
              <span key={idx} className="relative inline-flex items-center">
                <span style={{ background: color, border: '1px solid #ccc', width: 28, height: 28, borderRadius: '50%', display: 'inline-block' }} />
                <button
                  type="button"
                  className="absolute -top-1 -right-1 bg-white border border-border rounded-full p-0.5 text-xs text-muted-foreground hover:bg-red-500 hover:text-white"
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
            ))}
          </div>
          {/* Dropdown to add a new color */}
          <select
            id="colors"
            value=""
            onChange={e => {
              const selected = e.target.value;
              if (!selected) return;
              const colorsArr = Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' && formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
              if (!colorsArr.includes(selected)) {
                setFormData({ ...formData, colors: [...colorsArr, selected] });
              }
            }}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring mt-2"
          >
            <option value="">Add color...</option>
            {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Cyan', 'Teal', 'Lime', 'Indigo'].map(color => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          {/* Color picker to add a custom color */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              id="color-picker"
              value={colorPickerValue || "#ffffff"}
              onChange={e => {
                setColorPickerValue(e.target.value);
              }}
              className="w-8 h-8 border rounded cursor-pointer"
              title="Pick a custom color"
            />
            <Button
              type="button"
              variant="soft"
              size="sm"
              className="ml-2"
              onClick={() => {
                const selected = colorPickerValue;
                let colorsArr = Array.isArray(formData.colors) ? formData.colors : typeof formData.colors === 'string' && formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
                if (!colorsArr.includes(selected)) {
                  setFormData({ ...formData, colors: [...colorsArr, selected] });
                }
              }}
            >
              Add Color
            </Button>
            <span className="text-xs text-muted-foreground">Pick a custom color and click Add</span>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="sizes">Sizes (comma-separated)</Label>
        <Input
          id="sizes"
          value={formData.sizes}
          onChange={(e) => setFormData({...formData, sizes: e.target.value})}
          placeholder="XS, S, M, L, XL"
        />
      </div>

      <div>
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
          placeholder="0"
        />
      </div>

      <div className="md:col-span-2 flex gap-4 pt-4">
        <Button onClick={onSave} variant="elegant" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Product
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Admin;