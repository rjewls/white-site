# Noest API Integration Guide

## Overview
This guide provides a comprehensive step-by-step implementation for integrating with the Noest delivery API to upload and manage orders. The Noest API allows e-commerce platforms to automatically create delivery orders with tracking capabilities.

## Table of Contents
1. [Database Setup](#1-database-setup)
2. [Station Data Configuration](#2-station-data-configuration)
3. [API Request Structure](#3-api-request-structure)
4. [Implementation Steps](#4-implementation-steps)
5. [Integration Workflow](#5-integration-workflow)
6. [UI Integration](#6-ui-integration)
7. [Configuration Requirements](#7-configuration-requirements)
8. [Error Handling](#8-error-handling)
9. [Testing](#9-testing)

## 1. Database Setup

### 1.1 Store Settings Table
Create a table to store Noest API credentials:

```sql
CREATE TABLE store_settings (
  id SERIAL PRIMARY KEY,
  noest_api_token TEXT,
  noest_user_guid TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2 Orders Table Requirements
Ensure your orders table includes these essential fields:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,              -- Customer name
  phone VARCHAR(20) NOT NULL,              -- Customer phone
  address TEXT NOT NULL,                   -- Delivery address
  wilaya VARCHAR(100) NOT NULL,            -- Province/state
  commune VARCHAR(100) NOT NULL,           -- City/municipality
  total_amount DECIMAL(10,2) NOT NULL,     -- Order total
  delivery_option VARCHAR(50) NOT NULL,    -- "المكتب" or "المنزل"
  status VARCHAR(50) DEFAULT 'pending',    -- Order status
  product_id UUID REFERENCES products(id), -- Product reference
  product_name VARCHAR(255),               -- Product name (cached)
  product_image TEXT,                      -- Product image URL (cached)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 Products Table Requirements
Products table should include weight information:

```sql
ALTER TABLE products ADD COLUMN weight DECIMAL(5,2) DEFAULT 1.0; -- Weight in kg
```

## 2. Station Data Configuration

### 2.1 Station Interface
Define the station data structure:

```typescript
interface Station {
  station_code: string;  // Format: "16A", "25B", etc.
  station_name: string;  // Full station name with wilaya
}
```

### 2.2 Complete Station List
Create a comprehensive mapping of all Noest delivery stations:

```typescript
const stations: Station[] = [
  {"station_code": "01A", "station_name": "Adrar"},
  {"station_code": "02A", "station_name": "Chlef"},
  {"station_code": "03A", "station_name": "Laghouat"},
  {"station_code": "04A", "station_name": "Oum El Bouaghi (Ain Mlila)"},
  {"station_code": "05A", "station_name": "Batna"},
  {"station_code": "06A", "station_name": "Bejaïa"},
  // ... (58 wilayas total with sub-stations)
  {"station_code": "58A", "station_name": "El Meniaa"}
];
```

### 2.3 Station Finding Logic
Implement station lookup functionality:

```typescript
function findStation(wilayaId: number, nameFilter?: string): Station | undefined {
  const prefix = wilayaId.toString().padStart(2, '0');
  const matchingStations = stations.filter(station => 
    station.station_code.startsWith(prefix) &&
    (!nameFilter || station.station_name.toLowerCase().includes(nameFilter.toLowerCase()))
  );
  return matchingStations[0];
}
```

## 3. API Request Structure

### 3.1 Request Interface
Define the complete API payload structure:

```typescript
interface OrderRequest {
  api_token: string;        // API authentication token
  user_guid: string;        // User GUID for authentication
  reference?: string;       // Optional order reference
  client: string;          // Customer name (max 255 chars)
  phone: string;           // Phone number (digits only)
  phone_2?: string;        // Optional second phone
  adresse: string;         // Delivery address (max 255 chars)
  wilaya_id: number;       // Numeric wilaya ID (1-58)
  commune: string;         // City/municipality (max 255 chars)
  montant: number;         // Order amount in DZD
  remarque?: string;       // Optional remarks
  produit: string;         // Product name/description
  type_id: number;         // Delivery type (1 = standard delivery)
  poids: number;           // Package weight in kg
  stop_desk: number;       // 1 for desk pickup, 0 for home delivery
  station_code?: string;   // Required if stop_desk = 1
  stock?: number;          // Stock status (default: 0)
  quantite?: string;       // Quantity (optional)
  can_open?: number;       // Can open package (0 = no, 1 = yes)
}
```

### 3.2 Response Interface
Define expected API response:

```typescript
interface OrderResponse {
  success: boolean;
  tracking: string;
  message?: string;
  error?: string;
}
```

## 4. Implementation Steps

### 4.1 Credential Retrieval Service
Create a service to fetch API credentials:

```typescript
// services/noest.ts
import { supabase } from '@/integrations/supabase/client';

async function getNoestCredentials() {
  const { data: settings, error } = await supabase
    .from('store_settings')
    .select('noest_api_token, noest_user_guid')
    .single();

  if (error || !settings?.noest_api_token || !settings?.noest_user_guid) {
    throw new Error('Noest API credentials not found in store settings');
  }

  return {
    apiToken: settings.noest_api_token,
    userGuid: settings.noest_user_guid
  };
}
```

### 4.2 Wilaya Processing Function
Handle wilaya name to ID mapping:

```typescript
function processWilaya(wilayaName: string) {
  // Find matching station by name
  const matchingStation = stations.find(station => 
    station.station_name.toLowerCase().includes(wilayaName.toLowerCase())
  );

  if (matchingStation) {
    // Extract wilaya number from station_code (e.g., "17A" -> 17)
    const wilayaNumber = parseInt(matchingStation.station_code.substring(0, 2));
    return { wilayaNumber, station: matchingStation };
  }
  
  // Fallback to Djelfa (17) if no match found
  console.warn(`No matching station found for wilaya: ${wilayaName}, defaulting to Djelfa`);
  return { wilayaNumber: 17, station: null };
}
```

### 4.3 Data Preparation Function
Format order data for API submission:

```typescript
function prepareOrderData(order, productName: string, weight: number, credentials) {
  const { wilayaNumber, station } = processWilaya(order.wilaya);
  
  // Validate required data
  if (order.delivery_option === "المكتب" && !station) {
    throw new Error(`No station found for wilaya: ${order.wilaya}`);
  }

  return {
    api_token: credentials.apiToken,
    user_guid: credentials.userGuid,
    client: order.name.substring(0, 255),
    phone: order.phone.replace(/[^0-9]/g, ''), // Only digits
    adresse: order.address.substring(0, 255),
    wilaya_id: wilayaNumber,
    commune: order.commune.substring(0, 255),
    montant: order.total_amount,
    produit: productName,
    type_id: 1, // Standard delivery
    poids: weight,
    stop_desk: order.delivery_option === "المكتب" ? 1 : 0,
    station_code: order.delivery_option === "المكتب" ? station?.station_code : undefined,
    can_open: 0,
    stock: 0
  };
}
```

### 4.4 Main API Call Function
Create the main function to upload orders to Noest:

```typescript
import axios from 'axios';

export async function createNoestOrder(order, productName: string, weight: number): Promise<OrderResponse> {
  try {
    // Get credentials
    const credentials = await getNoestCredentials();
    
    // Prepare order data
    const orderData = prepareOrderData(order, productName, weight, credentials);
    
    console.log('Sending order to NOEST API...');
    console.log('Order Request Payload:', JSON.stringify(orderData, null, 2));

    // Make API request
    const response = await axios.post(
      'https://app.noest-dz.com/api/public/create/order',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('Raw API Response:', response.data);

    // Validate response
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format from Noest API');
    }

    if (response.data.success !== true) {
      const errorMessage = response.data.message || response.data.error || 'Unknown error';
      throw new Error(`Noest API Error: ${errorMessage}`);
    }

    if (!response.data.tracking || typeof response.data.tracking !== 'string') {
      throw new Error('Noest API response missing or invalid tracking number');
    }

    console.log('Order created successfully! Tracking:', response.data.tracking);

    return {
      success: true,
      tracking: response.data.tracking
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message;
      throw new Error(`API request failed: ${errorMessage}`);
    }
    throw error;
  }
}
```

## 5. Integration Workflow

### 5.1 Complete Order Upload Process
The workflow in the admin interface:

```typescript
const handleUploadToNoest = async (order: Order) => {
  try {
    setUploadingToNoest(order.id);

    // Step 1: Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", order.product_id)
      .single();

    if (productError || !product) {
      throw new Error("Failed to fetch product details");
    }

    // Step 2: Create order in Noest
    const response = await createNoestOrder(
      order,
      product.title,
      product.weight || 1 // Default to 1kg if weight is not set
    );

    // Step 3: Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        status: "shipped",
        // Optionally store tracking number
        // noest_tracking_number: response.tracking 
      })
      .eq("id", order.id);

    if (updateError) {
      throw new Error("Failed to update order status");
    }

    // Step 4: Show success and refresh
    toast({
      title: "Success",
      description: "Order uploaded to Noest successfully",
    });

    fetchOrders(); // Refresh the orders list
  } catch (error) {
    console.error("Failed to upload to Noest:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to upload order to Noest",
      variant: "destructive",
    });
  } finally {
    setUploadingToNoest(null);
  }
};
```

### 5.2 Status Flow
Order status progression:
1. **pending** → Customer placed order
2. **processing** → Admin confirmed order (can upload to Noest)
3. **shipped** → Uploaded to Noest, tracking available
4. **delivered** → Package delivered to customer
5. **cancelled** → Order cancelled at any stage

## 6. UI Integration

### 6.1 Upload Button Component
Add upload functionality to the orders table:

```tsx
{order.status === "processing" && (
  <Button
    onClick={() => handleUploadToNoest(order)}
    variant="outline"
    size="sm"
    disabled={uploadingToNoest === order.id}
    className="ml-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
  >
    {uploadingToNoest === order.id ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Uploading...
      </>
    ) : (
      'Upload to Noest'
    )}
  </Button>
)}
```

### 6.2 Order Status Indicators
Visual status indicators for different order states:

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-400';
    case 'processing': return 'bg-blue-400';
    case 'shipped': return 'bg-purple-400';
    case 'delivered': return 'bg-green-400';
    case 'cancelled': return 'bg-red-400';
    default: return 'bg-gray-400';
  }
};
```

## 7. Configuration Requirements

### 7.1 Admin Settings Form
Create an interface for admins to configure Noest credentials:

```tsx
// In admin settings form
<div className="space-y-4">
  <div>
    <Label htmlFor="noest_api_token">Noest API Token</Label>
    <Input
      id="noest_api_token"
      type="password"
      placeholder="Enter Noest API Token"
      {...register("noest_api_token")}
    />
  </div>
  <div>
    <Label htmlFor="noest_user_guid">Noest User GUID</Label>
    <Input
      id="noest_user_guid"
      type="text"
      placeholder="Enter Noest User GUID"
      {...register("noest_user_guid")}
    />
  </div>
</div>
```

### 7.2 Validation Rules
Implement validation for:
- API credentials must be set before uploads
- Phone numbers contain only digits
- Delivery addresses are not empty
- Product weights are specified
- Wilaya names match station database

## 8. Error Handling

### 8.1 Common Error Scenarios
Handle these error cases:

```typescript
// Credential validation
if (!credentials.apiToken || !credentials.userGuid) {
  throw new Error('Noest API credentials not configured. Please check admin settings.');
}

// Station validation for desk delivery
if (order.delivery_option === "المكتب" && !station) {
  throw new Error(`No Noest station available for ${order.wilaya}. Please use home delivery.`);
}

// API response validation
if (!response.data.success) {
  throw new Error(`Noest API rejected order: ${response.data.message}`);
}

// Network errors
if (axios.isAxiosError(error)) {
  if (error.code === 'ECONNABORTED') {
    throw new Error('Request timeout. Please try again.');
  }
  if (error.response?.status >= 500) {
    throw new Error('Noest service temporarily unavailable. Please try again later.');
  }
}
```

### 8.2 User-Friendly Error Messages
Provide clear error messages:

```typescript
const getErrorMessage = (error: Error) => {
  if (error.message.includes('credentials not configured')) {
    return 'Please configure Noest API credentials in admin settings.';
  }
  if (error.message.includes('No Noest station')) {
    return 'This location is not supported for desk delivery. Please use home delivery.';
  }
  if (error.message.includes('timeout')) {
    return 'Upload timed out. Please check your internet connection and try again.';
  }
  return error.message;
};
```

## 9. Testing

### 9.1 Test Scenarios
Test these scenarios:

1. **Successful Upload**
   - Order with valid data
   - Home delivery option
   - Desk delivery with valid station

2. **Error Cases**
   - Missing API credentials
   - Invalid wilaya name
   - Network timeout
   - API rejection

3. **Edge Cases**
   - Very long customer names/addresses
   - Special characters in phone numbers
   - Missing product weights

### 9.2 Test Data
Use test orders with known working data:

```typescript
const testOrder = {
  name: "Test Customer",
  phone: "0555123456",
  address: "123 Test Street",
  wilaya: "Alger",
  commune: "Bab Ezzouar",
  total_amount: 2500,
  delivery_option: "المكتب", // or "المنزل"
  status: "processing"
};
```

### 9.3 Monitoring
Monitor these metrics:
- Upload success rate
- API response times
- Error frequency by type
- Order status progression

## 10. Deployment Checklist

Before deploying to production:

- [ ] Database migrations applied
- [ ] Station data imported
- [ ] API credentials configured
- [ ] Error handling tested
- [ ] UI components working
- [ ] Logging implemented
- [ ] Rate limiting considered
- [ ] Backup strategy for failed uploads

## Conclusion

This implementation provides a robust integration with the Noest delivery API, handling authentication, data validation, location mapping, and error scenarios. The modular design allows for easy maintenance and extension of functionality.

For support or questions about this implementation, refer to the Noest API documentation or contact the development team.
