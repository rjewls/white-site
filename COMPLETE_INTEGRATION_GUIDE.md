# Complete Noest Express API Integration Guide

This guide provides step-by-step instructions for fully integrating the Noest Express API into Belle Elle Boutique.

## Table of Contents
1. [Database Setup](#database-setup)
2. [Frontend Updates](#frontend-updates)
3. [Backend Integration](#backend-integration)
4. [Admin Dashboard](#admin-dashboard)
5. [Testing & Deployment](#testing--deployment)

---

## Database Setup

### Step 1: Create Noest Express Configuration Table

Run this SQL in your Supabase SQL editor:

```sql
-- Create table for Noest Express API configuration
CREATE TABLE IF NOT EXISTS noest_express_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_token TEXT NOT NULL,
  guid TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE noest_express_config ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users only
CREATE POLICY "Only authenticated users can view noest config" ON noest_express_config
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_noest_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_noest_config_updated_at_trigger
  BEFORE UPDATE ON noest_express_config
  FOR EACH ROW
  EXECUTE FUNCTION update_noest_config_updated_at();
```

### Step 2: Update Orders Table for API Compatibility

Run the migration script (`migrate_orders_table.sql`) in your Supabase SQL editor:

```sql
-- Add new columns for Noest API compatibility
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS reference TEXT,
ADD COLUMN IF NOT EXISTS produit TEXT,
ADD COLUMN IF NOT EXISTS client TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_2 TEXT,
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS wilaya_id INTEGER,
ADD COLUMN IF NOT EXISTS montant DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS remarque TEXT,
ADD COLUMN IF NOT EXISTS type_id INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS poids INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS stop_desk INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS station_code TEXT,
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantite TEXT,
ADD COLUMN IF NOT EXISTS can_open INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS driver_phone TEXT;

-- Add constraints
ALTER TABLE orders ADD CONSTRAINT check_wilaya_id CHECK (wilaya_id IS NULL OR wilaya_id BETWEEN 1 AND 48);
ALTER TABLE orders ADD CONSTRAINT check_type_id CHECK (type_id BETWEEN 1 AND 3);
ALTER TABLE orders ADD CONSTRAINT check_stop_desk CHECK (stop_desk BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT check_stock CHECK (stock BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT check_can_open CHECK (can_open BETWEEN 0 AND 1);

-- Migrate existing data
UPDATE orders SET 
  client = COALESCE(customer_name, ''),
  phone = COALESCE(customer_phone, ''),
  adresse = COALESCE(delivery_address, ''),
  produit = COALESCE(product_title, ''),
  montant = COALESCE(product_price, 0)
WHERE client IS NULL OR phone IS NULL OR adresse IS NULL OR produit IS NULL OR montant IS NULL;

-- Add NOT NULL constraints for required fields
ALTER TABLE orders ALTER COLUMN produit SET NOT NULL;
ALTER TABLE orders ALTER COLUMN client SET NOT NULL;
ALTER TABLE orders ALTER COLUMN phone SET NOT NULL;
ALTER TABLE orders ALTER COLUMN adresse SET NOT NULL;
ALTER TABLE orders ALTER COLUMN commune SET NOT NULL;
ALTER TABLE orders ALTER COLUMN montant SET NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_wilaya_id ON orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking);
CREATE INDEX IF NOT EXISTS idx_orders_is_validated ON orders(is_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stop_desk ON orders(stop_desk);
```

---

## Frontend Updates

### Step 3: Update Order Form to Use New Fields

Update `src/components/OrderFormFields.tsx`:

```typescript
// Add wilaya mapping
const WILAYA_MAPPING = {
  'Adrar': 1, 'Chlef': 2, 'Laghouat': 3, 'Oum El Bouaghi': 4,
  'Batna': 5, 'Béjaïa': 6, 'Biskra': 7, 'Béchar': 8,
  'Blida': 9, 'Bouira': 10, 'Tamanrasset': 11, 'Tébessa': 12,
  'Tlemcen': 13, 'Tiaret': 14, 'Tizi Ouzou': 15, 'Alger': 16,
  'Djelfa': 17, 'Jijel': 18, 'Sétif': 19, 'Saïda': 20,
  'Skikda': 21, 'Sidi Bel Abbès': 22, 'Annaba': 23, 'Guelma': 24,
  'Constantine': 25, 'Médéa': 26, 'Mostaganem': 27, 'M\'Sila': 28,
  'Mascara': 29, 'Ouargla': 30, 'Oran': 31, 'El Bayadh': 32,
  'Illizi': 33, 'Bordj Bou Arréridj': 34, 'Boumerdès': 35, 'El Tarf': 36,
  'Tindouf': 37, 'Tissemsilt': 38, 'El Oued': 39, 'Khenchela': 40,
  'Souk Ahras': 41, 'Tipaza': 42, 'Mila': 43, 'Aïn Defla': 44,
  'Naâma': 45, 'Aïn Témouchent': 46, 'Ghardaïa': 47, 'Relizane': 48
};

// Update form submission to include wilaya_id
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const wilayaId = WILAYA_MAPPING[formData.wilaya as keyof typeof WILAYA_MAPPING];
  
  const orderData = {
    // Map existing fields to new API-compatible names
    client: formData.customerName,
    phone: formData.customerPhone,
    adresse: formData.deliveryAddress,
    commune: formData.commune,
    wilaya_id: wilayaId,
    produit: productTitle,
    montant: productPrice,
    quantite: formData.quantity.toString(),
    remarque: formData.notes || '',
    type_id: 1, // Regular delivery
    poids: 1, // Default weight
    stop_desk: formData.deliveryOption === 'stopdesk' ? 1 : 0,
    can_open: 1, // Allow opening
    stock: 0, // No stock reservation
    // Keep existing fields for backward compatibility
    customer_name: formData.customerName,
    customer_phone: formData.customerPhone,
    delivery_address: formData.deliveryAddress,
    product_title: productTitle,
    product_price: productPrice,
    // ... rest of the fields
  };
  
  // Submit to Supabase
  // ... existing submission logic
};
```

### Step 4: Create Wilaya Service

Create `src/services/wilayaService.ts`:

```typescript
export const WILAYA_MAPPING = {
  'Adrar': 1, 'Chlef': 2, 'Laghouat': 3, 'Oum El Bouaghi': 4,
  'Batna': 5, 'Béjaïa': 6, 'Biskra': 7, 'Béchar': 8,
  'Blida': 9, 'Bouira': 10, 'Tamanrasset': 11, 'Tébessa': 12,
  'Tlemcen': 13, 'Tiaret': 14, 'Tizi Ouzou': 15, 'Alger': 16,
  'Djelfa': 17, 'Jijel': 18, 'Sétif': 19, 'Saïda': 20,
  'Skikda': 21, 'Sidi Bel Abbès': 22, 'Annaba': 23, 'Guelma': 24,
  'Constantine': 25, 'Médéa': 26, 'Mostaganem': 27, 'M\'Sila': 28,
  'Mascara': 29, 'Ouargla': 30, 'Oran': 31, 'El Bayadh': 32,
  'Illizi': 33, 'Bordj Bou Arréridj': 34, 'Boumerdès': 35, 'El Tarf': 36,
  'Tindouf': 37, 'Tissemsilt': 38, 'El Oued': 39, 'Khenchela': 40,
  'Souk Ahras': 41, 'Tipaza': 42, 'Mila': 43, 'Aïn Defla': 44,
  'Naâma': 45, 'Aïn Témouchent': 46, 'Ghardaïa': 47, 'Relizane': 48
};

export const REVERSE_WILAYA_MAPPING = Object.fromEntries(
  Object.entries(WILAYA_MAPPING).map(([name, id]) => [id, name])
);

export const getWilayaId = (wilayaName: string): number | undefined => {
  return WILAYA_MAPPING[wilayaName as keyof typeof WILAYA_MAPPING];
};

export const getWilayaName = (wilayaId: number): string | undefined => {
  return REVERSE_WILAYA_MAPPING[wilayaId];
};

export const getAllWilayas = (): string[] => {
  return Object.keys(WILAYA_MAPPING);
};
```

---

## Backend Integration

### Step 5: Create Noest API Service

Create `src/services/noestApiService.ts`:

```typescript
import { supabase } from '../lib/supabaseClient';

interface NoestExpressConfig {
  api_token: string;
  guid: string;
}

interface NoestOrderData {
  client: string;
  phone: string;
  phone_2?: string;
  adresse: string;
  wilaya_id: number;
  commune: string;
  montant: number;
  remarque?: string;
  produit: string;
  type_id: number;
  poids: number;
  stop_desk: number;
  station_code?: string;
  stock: number;
  quantite: string;
  can_open: number;
}

interface NoestApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  tracking?: string;
}

class NoestApiService {
  private config: NoestExpressConfig | null = null;

  async getConfig(): Promise<NoestExpressConfig | null> {
    if (this.config) return this.config;

    const { data, error } = await supabase
      .from('noest_express_config')
      .select('api_token, guid')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching Noest config:', error);
      return null;
    }

    this.config = data;
    return data;
  }

  async createOrder(orderData: NoestOrderData): Promise<NoestApiResponse> {
    const config = await this.getConfig();
    if (!config) {
      return { success: false, error: 'Noest Express API not configured' };
    }

    try {
      const response = await fetch('https://api.noestexpress.com/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api_token}`,
          'X-GUID': config.guid,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'API request failed' };
      }

      return { 
        success: true, 
        data: result,
        tracking: result.tracking_number 
      };
    } catch (error) {
      console.error('Noest API error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async trackOrder(trackingNumber: string): Promise<NoestApiResponse> {
    const config = await this.getConfig();
    if (!config) {
      return { success: false, error: 'Noest Express API not configured' };
    }

    try {
      const response = await fetch(`https://api.noestexpress.com/api/track/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${config.api_token}`,
          'X-GUID': config.guid,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'Tracking failed' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Noest tracking error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getWilayas(): Promise<NoestApiResponse> {
    const config = await this.getConfig();
    if (!config) {
      return { success: false, error: 'Noest Express API not configured' };
    }

    try {
      const response = await fetch('https://api.noestexpress.com/api/wilayas', {
        headers: {
          'Authorization': `Bearer ${config.api_token}`,
          'X-GUID': config.guid,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'Failed to fetch wilayas' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Noest wilayas error:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

export const noestApiService = new NoestApiService();
```

### Step 6: Update Order Submission Logic

Update your order submission in `src/components/OrderFormFields.tsx`:

```typescript
import { noestApiService } from '../services/noestApiService';
import { getWilayaId } from '../services/wilayaService';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form first
  if (!validateForm()) return;

  setIsSubmitting(true);
  setSubmissionStatus(null);

  try {
    const wilayaId = getWilayaId(formData.wilaya);
    if (!wilayaId) {
      throw new Error('Invalid wilaya selected');
    }

    // Prepare order data for both Supabase and Noest API
    const orderData = {
      // Supabase fields (for local storage)
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      delivery_address: formData.deliveryAddress,
      commune: formData.commune,
      wilaya: formData.wilaya,
      product_id: productId,
      product_title: productTitle,
      product_price: productPrice,
      quantity: parseInt(formData.quantity),
      total_price: parseInt(formData.quantity) * productPrice,
      size: formData.size,
      color: formData.color,
      delivery_option: formData.deliveryOption,
      notes: formData.notes,
      
      // Noest API compatible fields
      client: formData.customerName,
      phone: formData.customerPhone,
      adresse: formData.deliveryAddress,
      wilaya_id: wilayaId,
      produit: productTitle,
      montant: parseInt(formData.quantity) * productPrice,
      quantite: formData.quantity.toString(),
      remarque: formData.notes || '',
      type_id: 1,
      poids: 1,
      stop_desk: formData.deliveryOption === 'stopdesk' ? 1 : 0,
      can_open: 1,
      stock: 0,
    };

    // Save to Supabase first
    const { data: supabaseOrder, error: supabaseError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    // Try to create order in Noest API
    const noestResponse = await noestApiService.createOrder({
      client: orderData.client,
      phone: orderData.phone,
      adresse: orderData.adresse,
      wilaya_id: orderData.wilaya_id,
      commune: orderData.commune,
      montant: orderData.montant,
      remarque: orderData.remarque,
      produit: orderData.produit,
      type_id: orderData.type_id,
      poids: orderData.poids,
      stop_desk: orderData.stop_desk,
      stock: orderData.stock,
      quantite: orderData.quantite,
      can_open: orderData.can_open,
    });

    // Update order with tracking info if Noest API succeeded
    if (noestResponse.success && noestResponse.tracking) {
      await supabase
        .from('orders')
        .update({ 
          tracking: noestResponse.tracking,
          is_validated: true 
        })
        .eq('id', supabaseOrder.id);
    }

    setSubmissionStatus({
      type: 'success',
      message: noestResponse.success 
        ? `Order submitted successfully! Tracking: ${noestResponse.tracking}`
        : 'Order saved locally. Will sync with delivery service later.'
    });

    // Reset form
    setFormData({
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      commune: '',
      wilaya: '',
      quantity: '1',
      size: '',
      color: '',
      deliveryOption: 'home',
      notes: ''
    });

  } catch (error) {
    console.error('Order submission error:', error);
    setSubmissionStatus({
      type: 'error',
      message: 'Failed to submit order. Please try again.'
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Admin Dashboard

### Step 7: Add Order Management to Admin

Update `src/pages/Admin.tsx` to include order management:

```typescript
// Add order management section
const [orders, setOrders] = useState([]);
const [selectedOrders, setSelectedOrders] = useState([]);

const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders_summary')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!error) setOrders(data || []);
};

const syncOrdersWithNoest = async () => {
  const ordersToSync = orders.filter(order => 
    !order.is_validated && selectedOrders.includes(order.id)
  );

  for (const order of ordersToSync) {
    const noestResponse = await noestApiService.createOrder({
      client: order.customer_name,
      phone: order.customer_phone,
      adresse: order.delivery_address,
      wilaya_id: order.wilaya_id,
      commune: order.commune,
      montant: order.order_amount,
      produit: order.product_name,
      quantite: '1',
      remarque: order.notes || '',
      type_id: 1,
      poids: 1,
      stop_desk: order.delivery_type === 'stopdesk' ? 1 : 0,
      can_open: 1,
      stock: 0,
    });

    if (noestResponse.success) {
      await supabase
        .from('orders')
        .update({ 
          tracking: noestResponse.tracking,
          is_validated: true 
        })
        .eq('id', order.id);
    }
  }

  fetchOrders(); // Refresh the list
};

// Add to JSX
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold mb-4">Order Management</h2>
  
  <div className="mb-4">
    <button
      onClick={syncOrdersWithNoest}
      disabled={selectedOrders.length === 0}
      className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
    >
      Sync Selected Orders with Noest ({selectedOrders.length})
    </button>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-2"><input type="checkbox" /></th>
          <th className="p-2 text-left">Customer</th>
          <th className="p-2 text-left">Product</th>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Tracking</th>
          <th className="p-2 text-left">Validated</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="p-2">
              <input
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedOrders([...selectedOrders, order.id]);
                  } else {
                    setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                  }
                }}
              />
            </td>
            <td className="p-2">{order.customer_name}</td>
            <td className="p-2">{order.product_name}</td>
            <td className="p-2">{order.order_amount} DA</td>
            <td className="p-2">
              <span className={`px-2 py-1 rounded text-xs ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </td>
            <td className="p-2">{order.tracking || '-'}</td>
            <td className="p-2">
              {order.is_validated ? '✅' : '❌'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

---

## Testing & Deployment

### Step 8: Environment Variables Setup

Create/update `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Noest Express API (these will be stored in Supabase)
# VITE_NOEST_API_TOKEN=your_noest_api_token
# VITE_NOEST_GUID=your_noest_guid
```

For Netlify deployment, add these environment variables in your Netlify dashboard.

### Step 9: Testing Checklist

#### Database Testing
- [ ] Verify Noest config table is created
- [ ] Verify orders table migration completed
- [ ] Test inserting/updating Noest config via admin
- [ ] Test order creation with new fields

#### Frontend Testing  
- [ ] Test order form with wilaya selection
- [ ] Verify form validation works
- [ ] Test order submission (both success/failure cases)
- [ ] Test admin login/logout
- [ ] Test Noest config management in admin

#### API Integration Testing
- [ ] Test Noest API connection with valid credentials
- [ ] Test order creation via Noest API
- [ ] Test order tracking
- [ ] Test error handling for API failures

#### End-to-End Testing
- [ ] Create order from product detail page
- [ ] Verify order appears in admin dashboard
- [ ] Sync order with Noest API from admin
- [ ] Verify tracking number is saved

### Step 10: Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

3. **Configure Supabase:**
   - Add your Netlify domain to allowed origins
   - Verify RLS policies are working
   - Test authentication from production

4. **Set up Noest API credentials:**
   - Log into admin panel
   - Add your Noest Express API token and GUID
   - Test API connection

### Step 11: Post-Deployment Monitoring

- Monitor Supabase logs for errors
- Check order submission success rates
- Monitor Noest API response times
- Set up alerts for failed API calls

---

## API Field Mapping Reference

| Frontend Field | Supabase Field | Noest API Field | Type | Required |
|----------------|----------------|-----------------|------|----------|
| customerName | customer_name | client | TEXT | Yes |
| customerPhone | customer_phone | phone | TEXT | Yes |
| deliveryAddress | delivery_address | adresse | TEXT | Yes |
| wilaya | wilaya | wilaya_id | INTEGER | Yes |
| commune | commune | commune | TEXT | Yes |
| productTitle | product_title | produit | TEXT | Yes |
| productPrice * quantity | total_price | montant | DECIMAL | Yes |
| quantity | quantity | quantite | TEXT | Yes |
| notes | notes | remarque | TEXT | No |
| deliveryOption | delivery_option | stop_desk | INTEGER | No |
| - | - | type_id | INTEGER | No (default: 1) |
| - | - | poids | INTEGER | No (default: 1) |
| - | - | can_open | INTEGER | No (default: 1) |
| - | - | stock | INTEGER | No (default: 0) |

---

## Troubleshooting

### Common Issues

1. **"Noest Express API not configured" error:**
   - Verify API credentials are saved in admin panel
   - Check Supabase RLS policies allow reading config

2. **Wilaya ID not found:**
   - Verify wilaya name matches exactly in mapping
   - Check for typos in wilaya selection

3. **Order not syncing:**
   - Check internet connection
   - Verify API credentials are valid
   - Check Noest API status

4. **Database errors:**
   - Verify migration script ran successfully
   - Check for constraint violations
   - Review Supabase logs

### Support Contacts

- Noest Express API Documentation: [API Docs URL]
- Supabase Support: support@supabase.com
- Project Repository Issues: [GitHub Issues URL]

---

## Next Steps

After completing this integration:

1. **Analytics Setup:**
   - Track order conversion rates
   - Monitor API success rates
   - Set up performance monitoring

2. **Enhanced Features:**
   - Real-time order tracking for customers
   - SMS notifications
   - Automated status updates

3. **Business Intelligence:**
   - Sales dashboards
   - Delivery performance analytics
   - Customer behavior insights

This completes the full integration of Noest Express API with Belle Elle Boutique!
