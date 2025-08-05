# Noest Express Integration Steps

## 🗺️ Step 1: Create Wilaya ID Mapping Table

Create this table in Supabase SQL editor:

```sql
CREATE TABLE wilaya_mapping (
  id SERIAL PRIMARY KEY,
  wilaya_name TEXT NOT NULL,
  wilaya_id INTEGER NOT NULL UNIQUE CHECK (wilaya_id BETWEEN 1 AND 48),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO wilaya_mapping (wilaya_name, wilaya_id) VALUES
('Adrar', 1), ('Chlef', 2), ('Laghouat', 3), ('Oum El Bouaghi', 4),
('Batna', 5), ('Béjaïa', 6), ('Biskra', 7), ('Béchar', 8),
('Blida', 9), ('Bouira', 10), ('Tamanrasset', 11), ('Tébessa', 12),
('Tlemcen', 13), ('Tiaret', 14), ('Tizi Ouzou', 15), ('Alger', 16),
('Djelfa', 17), ('Jijel', 18), ('Sétif', 19), ('Saïda', 20),
('Skikda', 21), ('Sidi Bel Abbès', 22), ('Annaba', 23), ('Guelma', 24),
('Constantine', 25), ('Médéa', 26), ('Mostaganem', 27), ('M''Sila', 28),
('Mascara', 29), ('Ouargla', 30), ('Oran', 31), ('El Bayadh', 32),
('Illizi', 33), ('Bordj Bou Arréridj', 34), ('Boumerdès', 35), ('El Tarf', 36),
('Tindouf', 37), ('Tissemsilt', 38), ('El Oued', 39), ('Khenchela', 40),
('Souk Ahras', 41), ('Tipaza', 42), ('Mila', 43), ('Aïn Defla', 44),
('Naâma', 45), ('Aïn Témouchent', 46), ('Ghardaïa', 47), ('Relizane', 48);
```

## 🔧 Step 2: Update Order Form Submission

In your OrderForm component, change the order submission to save to new fields:

```javascript
const orderData = {
  // Map to new API fields
  client: name,
  phone: phone,
  adresse: address,
  wilaya_id: getWilayaId(wilaya), // You'll need this function
  commune: commune,
  produit: productTitle,
  montant: productPrice,
  stop_desk: deliveryType === 'home' ? 0 : 1,
  station_code: deliveryType === 'station' ? station : null,
  poids: 500, // Default weight in grams
  type_id: 1, // 1 = delivery
  can_open: 1, // Allow opening
  stock: 0, // Not from Noest stock
  
  // Keep existing fields
  product_id: productId,
  product_title: productTitle,
  product_price: productPrice,
  quantity: 1,
  delivery_fee: deliveryFee,
  total_price: totalPrice
};
```

## 📡 Step 3: Create Wilaya ID Lookup Function

Add this function to get wilaya_id from name:

```javascript
const getWilayaId = async (wilayaName) => {
  const { data, error } = await supabase
    .from('wilaya_mapping')
    .select('wilaya_id')
    .eq('wilaya_name', wilayaName)
    .single();
  
  if (error) {
    console.error('Error finding wilaya ID:', error);
    return 16; // Default to Alger
  }
  
  return data.wilaya_id;
};
```

## 🚀 Step 4: Create Noest API Integration Functions

Create a new file `lib/noestApi.js`:

```javascript
import { supabase } from './supabaseClient';

// Get API credentials
const getNoestCredentials = async () => {
  const { data, error } = await supabase
    .from('noest_express_config')
    .select('api_token, guid')
    .limit(1)
    .single();
  
  if (error) throw new Error('No Noest credentials found');
  return data;
};

// Create order in Noest
export const createNoestOrder = async (orderId) => {
  const credentials = await getNoestCredentials();
  
  const { data: order, error } = await supabase
    .from('orders_for_noest_api')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (error) throw new Error('Order not found');
  
  const response = await fetch('https://app.noest-dz.com/api/public/create/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: credentials.api_token,
      user_guid: credentials.guid,
      reference: order.reference || `ORDER-${orderId}`,
      client: order.client,
      phone: order.phone,
      phone_2: order.phone_2,
      adresse: order.adresse,
      wilaya_id: order.wilaya_id,
      commune: order.commune,
      montant: order.montant,
      remarque: order.remarque,
      produit: order.produit,
      type_id: order.type_id,
      poids: order.poids,
      stop_desk: order.stop_desk,
      station_code: order.station_code,
      stock: order.stock,
      quantite: order.quantite,
      can_open: order.can_open
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Update order with tracking number
    await supabase
      .from('orders')
      .update({ tracking: result.tracking })
      .eq('id', orderId);
    
    return result.tracking;
  }
  
  throw new Error('Failed to create Noest order');
};

// Validate order in Noest
export const validateNoestOrder = async (tracking) => {
  const credentials = await getNoestCredentials();
  
  const response = await fetch('https://app.noest-dz.com/api/public/valid/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: credentials.api_token,
      user_guid: credentials.guid,
      tracking: tracking
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Mark order as validated
    await supabase
      .from('orders')
      .update({ 
        is_validated: true, 
        status: 'validated' 
      })
      .eq('tracking', tracking);
    
    return true;
  }
  
  throw new Error('Failed to validate Noest order');
};

// Track multiple orders
export const trackOrders = async (trackingNumbers) => {
  const credentials = await getNoestCredentials();
  
  const response = await fetch('https://app.noest-dz.com/api/public/get/trackings/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: credentials.api_token,
      user_guid: credentials.guid,
      trackings: trackingNumbers
    })
  });
  
  const result = await response.json();
  return result;
};

// Update order in Noest
export const updateNoestOrder = async (tracking, updateData) => {
  const credentials = await getNoestCredentials();
  
  const response = await fetch('https://app.noest-dz.com/api/public/update/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: credentials.api_token,
      user_guid: credentials.guid,
      tracking: tracking,
      ...updateData
    })
  });
  
  const result = await response.json();
  return result;
};

// Delete order from Noest (only before validation)
export const deleteNoestOrder = async (tracking) => {
  const credentials = await getNoestCredentials();
  
  const response = await fetch('https://app.noest-dz.com/api/public/delete/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: credentials.api_token,
      user_guid: credentials.guid,
      tracking: tracking
    })
  });
  
  const result = await response.json();
  return result;
};
```

## 📊 Step 5: Add Admin Orders Management

In your Admin page, add orders management section:

```javascript
// Add to Admin.tsx imports
import { Package } from "lucide-react";
import { createNoestOrder, validateNoestOrder, trackOrders } from "@/lib/noestApi";

// Add to Admin.tsx state
const [orders, setOrders] = useState([]);
const [showOrdersSection, setShowOrdersSection] = useState(false);

// Fetch orders function
const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders_summary')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    toast({
      title: "Error fetching orders",
      description: error.message,
      variant: "destructive"
    });
    return;
  }
  
  setOrders(data || []);
};

// Create and validate order function
const createAndValidateOrder = async (orderId) => {
  try {
    // Create order in Noest
    const tracking = await createNoestOrder(orderId);
    
    // Validate order automatically
    await validateNoestOrder(tracking);
    
    toast({
      title: "✅ Success!",
      description: `Order sent to Noest with tracking: ${tracking}`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
    
    // Refresh orders list
    fetchOrders();
  } catch (error) {
    console.error('Error processing order:', error);
    toast({
      title: "Error processing order",
      description: error.message,
      variant: "destructive"
    });
  }
};

// Load orders on component mount
useEffect(() => {
  fetchOrders();
}, []);

// Add button in admin header (in the configuration section)
<Button
  onClick={() => setShowOrdersSection(true)}
  variant="outline"
  className="flex items-center justify-center gap-2 px-3 py-3 sm:py-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
>
  <Package className="h-4 w-4" />
  <span className="hidden sm:inline">Orders</span>
</Button>

// Orders management section (add after Noest Express form)
{showOrdersSection && (
  <Card className="mb-4 sm:mb-8 bg-gradient-card border-0 shadow-lg">
    <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b">
      <div className="flex items-center justify-between">
        <CardTitle className="font-playfair text-lg sm:text-xl flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-600" />
          Orders Management
        </CardTitle>
        <Button
          onClick={() => setShowOrdersSection(false)}
          variant="ghost"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6 pt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Manage customer orders and sync with Noest Express delivery service
          </p>
          <Button onClick={fetchOrders} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No orders found
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold text-sm">{order.customer_name}</h4>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    <p className="text-xs text-muted-foreground">{order.commune}</p>
                  </div>
                  
                  {/* Product Info */}
                  <div>
                    <p className="font-medium text-sm">{order.product_name}</p>
                    <p className="text-sm text-green-600 font-semibold">{order.order_amount} DZD</p>
                    <p className="text-xs text-muted-foreground">{order.delivery_type}</p>
                  </div>
                  
                  {/* Status & Tracking */}
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'validated' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.tracking && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tracking: {order.tracking}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!order.is_validated && (
                      <Button 
                        onClick={() => createAndValidateOrder(order.id)}
                        size="sm"
                        variant="elegant"
                        className="text-xs"
                      >
                        Send to Noest
                      </Button>
                    )}
                    
                    {order.tracking && (
                      <Button 
                        onClick={() => trackOrders([order.tracking])}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Track Order
                      </Button>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

## 🎯 Step 6: Update Order Form Component

Replace the current Discord webhook with Supabase insertion. In `src/components/OrderForm.tsx`, find the `handleSubmit` function and replace the Discord webhook code with:

```javascript
// Replace the Discord webhook fetch with Supabase insertion
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);

  try {
    // Get wilaya_id from mapping
    const { data: wilayaData, error: wilayaError } = await supabase
      .from('wilaya_mapping')
      .select('wilaya_id')
      .eq('wilaya_name', wilaya)
      .single();

    if (wilayaError) {
      throw new Error('Invalid wilaya selected');
    }

    const orderData = {
      // New API fields
      client: name,
      phone: phone,
      adresse: address,
      wilaya_id: wilayaData.wilaya_id,
      commune: commune,
      produit: productTitle,
      montant: productPrice,
      stop_desk: deliveryType === 'home' ? 0 : 1,
      station_code: deliveryType === 'station' ? station : null,
      poids: 500, // Default weight in grams
      type_id: 1, // 1 = delivery
      can_open: 1, // Allow opening
      stock: 0, // Not from Noest stock
      
      // Keep existing fields for compatibility
      product_id: productId,
      product_title: productTitle,
      product_price: productPrice,
      quantity: 1,
      delivery_fee: deliveryFee,
      total_price: totalPrice,
      
      // Old field mappings (will be populated by migration)
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      delivery_option: deliveryType
    };

    const { error } = await supabase
      .from('orders')
      .insert(orderData);

    if (error) {
      throw new Error('Failed to save order: ' + error.message);
    }

    toast.success('Order placed successfully! We will contact you soon.');
    onClose();
    
  } catch (error) {
    console.error('Error submitting order:', error);
    toast.error(error.message || 'Failed to place order. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## 🔄 Step 7: Complete Workflow

1. **Customer Flow:**
   - Customer fills order form → saves to database with new API fields
   - Customer receives confirmation

2. **Admin Flow:**
   - Admin sees order in admin panel
   - Admin clicks "Send to Noest" → creates order in Noest API
   - System gets tracking number → validates order automatically
   - Order status updates to "validated" and is visible to Noest logistics

3. **Tracking Flow:**
   - Admin can track orders using tracking numbers
   - System can sync status updates from Noest API
   - Customer can be notified of delivery updates

## 📝 Step 8: Environment Variables

Make sure these are set in your environment:
- Supabase URL and anon key (already configured)
- Noest Express API credentials (stored in `noest_express_config` table)

## 🧪 Step 9: Testing

1. Test order form submission to database
2. Test Noest API credential saving in admin
3. Test order creation and validation with Noest API
4. Test order tracking functionality
5. Test complete order workflow from form to delivery

## 🚀 Step 10: Deployment Notes

- Ensure all environment variables are set in production
- Test API connectivity to Noest Express servers
- Set up error monitoring for API failures
- Consider implementing order status sync webhooks
- Add logging for order processing steps

This gives you complete Noest Express integration with order management, API communication, and admin controls!
