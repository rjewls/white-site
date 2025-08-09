import { noestApiService } from './src/lib/noestApi.js';
import { supabase } from './src/lib/supabaseClient.js';

// Mock order data for testing delete functionality
const mockOrderData = {
  client: 'Test Client Delete',
  phone: '0555123456',
  phone_2: '',
  adresse: 'Test Address 123, Alger Centre',
  wilaya_id: 16, // Alger
  commune: 'Alger Centre',
  montant: 2500,
  remarque: 'Test order for delete functionality - Color: Red, Size: M, Quantity: 1',
  produit: 'Test Product for Delete',
  type_id: 1,
  poids: 1,
  stop_desk: 0,
  station_code: '',
  stock: 0,
  quantite: '1',
  can_open: 0
};

async function testNoestDeleteFlow() {
  console.log('=== NOEST DELETE TEST FLOW ===');
  
  try {
    // Check if API is configured
    const config = await noestApiService.getConfig();
    if (!config) {
      console.error('❌ Noest API not configured. Please set up your credentials first.');
      return;
    }

    console.log('✅ API configuration loaded');

    // Step 1: Create an order using our service
    console.log('\n1. Creating test order...');
    const createResult = await noestApiService.createOrder(mockOrderData);

    if (!createResult.success) {
      console.error('❌ Failed to create order:', createResult.error);
      return;
    }

    const trackingNumber = createResult.tracking;
    if (!trackingNumber) {
      console.error('❌ No tracking number returned from create order');
      return;
    }
    
    console.log('✅ Order created successfully with tracking:', trackingNumber);

    // Step 2: Wait a moment then try to delete
    console.log('\n2. Waiting 3 seconds before attempting delete...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n3. Attempting to delete order using our service...');
    const deleteResult = await noestApiService.deleteOrder(trackingNumber);

    if (deleteResult.success) {
      console.log('✅ Order deleted successfully from Noest');
      console.log('Delete result:', deleteResult.data);
    } else {
      console.log('❌ Failed to delete order:', deleteResult.error);
    }

    // Step 3: Try to track the order to see if it still exists
    console.log('\n4. Checking if order still exists by tracking...');
    const trackResult = await noestApiService.trackOrders([trackingNumber]);
    
    if (trackResult.success) {
      console.log('Track result:', trackResult.data);
      if (trackResult.data && trackResult.data.length === 0) {
        console.log('✅ Order appears to be deleted - no tracking info found');
      } else {
        console.log('⚠️  Order might still exist in Noest system');
      }
    } else {
      console.log('⚠️  Could not track order (might be deleted):', trackResult.error);
    }

  } catch (error) {
    console.error('❌ Unexpected error during test:', error);
  }
}

// Run the test
console.log('Starting Noest Delete Test...');
testNoestDeleteFlow().then(() => {
  console.log('\n=== Test Complete ===');
  process.exit(0);
}).catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
