const axios = require('axios');

// Test configuration - replace with your actual API credentials
const TEST_CONFIG = {
  api_token: 'YOUR_API_TOKEN_HERE', // Replace with actual token
  guid: 'YOUR_GUID_HERE' // Replace with actual GUID
};

// Mock order data for testing
const mockOrderData = {
  api_token: TEST_CONFIG.api_token,
  user_guid: TEST_CONFIG.guid,
  reference: `TEST-ORDER-${Date.now()}`,
  client: 'Test Client Delete',
  phone: '0555123456',
  phone_2: '',
  adresse: 'Test Address 123',
  wilaya_id: 16, // Alger
  commune: 'Alger Centre',
  montant: 2500,
  remarque: 'Test order for delete functionality',
  produit: 'Test Product',
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
  
  // Step 1: Create an order
  console.log('\n1. Creating test order...');
  try {
    const createResponse = await axios.post(
      'https://app.noest-dz.com/api/public/create/order',
      mockOrderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000
      }
    );

    console.log('Create response status:', createResponse.status);
    console.log('Create response data:', createResponse.data);

    if (!createResponse.data.success) {
      console.error('❌ Failed to create order:', createResponse.data);
      return;
    }

    const trackingNumber = createResponse.data.tracking;
    console.log('✅ Order created successfully with tracking:', trackingNumber);

    // Step 2: Wait a moment then try to delete
    console.log('\n2. Waiting 2 seconds before attempting delete...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n3. Attempting to delete order...');
    const deleteResponse = await axios.post(
      'https://app.noest-dz.com/api/public/delete/order',
      {
        api_token: TEST_CONFIG.api_token,
        user_guid: TEST_CONFIG.guid,
        tracking: trackingNumber
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000
      }
    );

    console.log('Delete response status:', deleteResponse.status);
    console.log('Delete response data:', deleteResponse.data);

    if (deleteResponse.data.success) {
      console.log('✅ Order deleted successfully from Noest');
    } else {
      console.log('❌ Failed to delete order:', deleteResponse.data);
    }

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
  }
}

// Check if API credentials are set
if (TEST_CONFIG.api_token === 'YOUR_API_TOKEN_HERE' || TEST_CONFIG.guid === 'YOUR_GUID_HERE') {
  console.log('❌ Please update the TEST_CONFIG with your actual API credentials before running this test.');
  console.log('You can find your credentials in the Supabase admin panel under noest_express_config table.');
  process.exit(1);
}

testNoestDeleteFlow();
