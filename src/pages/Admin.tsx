import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

// Mock product data - will be replaced with Supabase
const initialProducts = [
  {
    id: "1",
    title: "Elegant Summer Dress",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
    description: "Beautiful flowing dress perfect for summer occasions",
    colors: ["Pink", "Light Pink", "Rose"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 15
  },
  {
    id: "2",
    title: "Chic Blouse Collection", 
    price: 59.99,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop",
    description: "Versatile blouse for work and casual wear",
    colors: ["White", "Light Pink", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 20
  }
];

const Admin = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    colors: "",
    sizes: "",
    stock: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      image: "",
      description: "",
      colors: "",
      sizes: "",
      stock: ""
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
      stock: product.stock.toString()
    });
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.price || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      title: formData.title,
      price: parseFloat(formData.price),
      image: formData.image || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop",
      description: formData.description,
      colors: formData.colors.split(",").map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s),
      stock: parseInt(formData.stock) || 0
    };

    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct 
          ? { ...p, ...productData }
          : p
      ));
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully"
      });
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct = {
        id: Date.now().toString(),
        ...productData
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Product Added",
        description: "New product has been added successfully"
      });
      setShowAddForm(false);
    }
    
    resetForm();
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully"
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
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
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
                        <span>Colors: {product.colors.join(", ")}</span>
                        <span>Sizes: {product.sizes.join(", ")}</span>
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
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