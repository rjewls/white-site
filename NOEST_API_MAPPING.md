# Noest Express API Integration Mapping

## 📋 **Database Schema → Noest API Mapping**

### **Required API Fields Mapping:**

| **Noest API Field** | **Database Field** | **Description** | **Validation** |
|---------------------|-------------------|-----------------|----------------|
| `api_token` | From `noest_express_config` table | API token from Noest | required |
| `user_guid` | From `noest_express_config` table | User GUID from Noest | required |
| `reference` | `reference` | Order reference (optional) | max:255 |
| `client` | `client` | Customer name & surname | required \| max:255 |
| `phone` | `phone` | Customer phone number | required \| digits_between:9,10 |
| `phone_2` | `phone_2` | Optional second phone | digits_between:9,10 |
| `adresse` | `adresse` | Customer address | required \| max:255 |
| `wilaya_id` | `wilaya_id` | Wilaya ID (1-48) | required \| integer \| between:1,48 |
| `commune` | `commune` | Commune name | required \| max:255 |
| `montant` | `montant` | Order amount | required \| numeric |
| `remarque` | `remarque` | Remarks/notes | max:255 |
| `produit` | `produit` | Product name(s) | required |
| `type_id` | `type_id` | Delivery type (1=delivery, 2=exchange, 3=pickup) | required \| integer \| between:1,3 |
| `poids` | `poids` | Package weight in grams | required \| integer |
| `stop_desk` | `stop_desk` | Delivery type (0=home, 1=stopdesk) | required \| integer \| between:0,1 |
| `station_code` | `station_code` | Station code (if stopdesk) | Required_if stop_desk=1 |
| `stock` | `stock` | Prepared from Noest stock (0=no, 1=yes) | integer \| between:0,1 |
| `quantite` | `quantite` | Quantities separated by comma | Required_if stock=1 |
| `can_open` | `can_open` | Can recipient open package (0=no, 1=yes) | integer \| between:0,1 |

### **Order Form → Database Mapping:**

| **Order Form Field** | **Database Field** | **Notes** |
|----------------------|-------------------|-----------|
| `name` | `client` | Customer name |
| `phone` | `phone` | Customer phone |
| `wilaya` → lookup | `wilaya_id` | Convert wilaya name to ID (1-48) |
| `commune` | `commune` | Commune name |
| `deliveryOption` | `stop_desk` | Convert: "home"→0, "station"→1 |
| `address` | `adresse` | Customer address |
| `quantity` | `quantity` | Order quantity |
| `selectedColor` | `selected_color` | Selected color |
| `selectedSize` | `selected_size` | Selected size |
| `productTitle` | `produit` | Product name for API |
| `productPrice` | `montant` | Product price |

### **API Workflow:**

1. **Create Order**: `POST /api/public/create/order` → Returns `tracking` number
2. **Validate Order**: `POST /api/public/valid/order` → Makes order visible to logistics
3. **Track Order**: `POST /api/public/get/trackings/info` → Get order status
4. **Update Order**: `POST /api/public/update/order` → Modify order details
5. **Delete Order**: `POST /api/public/delete/order` → Remove order (before validation)

### **Order Status Flow:**

```
pending → validated → shipped → delivered
   ↓         ↓          ↓         ↓
  API     API        API       API
 Create  Validate   Track     Track
```

### **Additional Features:**

- **Wilaya ID Mapping**: Need to create a lookup table for wilaya names → IDs
- **Station Codes**: Use `/api/public/desks` to get station codes
- **Delivery Fees**: Use `/api/public/fees` to get current delivery rates
- **Order Tracking**: Regular sync with Noest API for status updates

This structure ensures your database is fully compatible with the Noest Express API while maintaining all your existing order form functionality.
