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
      // If field is an array, flatten and clean each value
      if (Array.isArray(field)) {
        return field
          .map((v) => {
            // Remove all symbols, extra quotes, and backslashes
            if (typeof v === "string") {
              return v.replace(/[[\]"'\\]/g, "").trim();
            }
            return v;
          })
          .filter(Boolean)
          .join(", ");
      }
      // If field is a string, clean and split
      if (typeof field === "string") {
        // Remove all symbols, extra quotes, and backslashes
        return field.replace(/[[\]"'\\]/g, "").split(",").map(s => s.trim()).filter(Boolean).join(", ");
      }
      return "";
    };
    setFormData({
      title: product.title,
      price: product.price?.toString(),
      images: Array.isArray(product.images) ? [...product.images] : typeof product.images === "string" ? [product.images] : [],
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
      colors: formData.colors.split(",").map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s),
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
                        <span>Price: ${product.price}</span>
                        <span>Stock: {product.stock}</span>
                        <span>Colors: {
                          (Array.isArray(product.colors)
                            ? product.colors
                            : typeof product.colors === "string"
                              ? product.colors.split(",").map(c => c.trim()).filter(Boolean)
                              : []
                          ).join(", ")
                        }</span>
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
            if (img && typeof img === "object" && "name" in img && "size" in img && "type" in img) {
              src = URL.createObjectURL(img);
            } else if (typeof img === "string") {
              src = img;
            }
            return (
              <div key={idx} className="relative group">
                <img src={src} alt={`Product ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow group-hover:bg-red-500 group-hover:text-white"
                  title="Delete image"
                  onClick={() => {
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
        <Label htmlFor="colors">Colors (comma-separated)</Label>
        <Input
          id="colors"
          value={formData.colors}
          onChange={(e) => setFormData({...formData, colors: e.target.value})}
          placeholder="Red, Blue, Green"
        />
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