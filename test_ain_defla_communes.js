const axios = require('axios');

const NOEST_API_BASE = 'https://api.noest-dz.com';
const NOEST_API_KEY = 'noest_sk_YJMd9_qgP-8o3sQGDELNE24UkHgaJzRGEgFwGzGW';

/**
 * Test communes for Aïn Defla (wilaya 44)
 * Testing the main city: Ain Defla
 */
async function testAinDeflaCommunes() {
  console.log('🧪 Testing Aïn Defla communes with Noest API...\n');

  // Test main commune: Ain Defla
  await testOrderCreation('Ain Defla', 44);
}

async function testOrderCreation(communeName, wilayaId) {
  console.log(`📍 Testing: ${communeName} (Wilaya ${wilayaId})`);
  
  const orderData = {
    "full_name": "Test Client Ain Defla",
    "phone": "0555123456",
    "address": "Test address in " + communeName,
    "commune": communeName,
    "wilaya": wilayaId,
    "items": [
      {
        "name": "Test Product",
        "quantity": 1,
        "price": 1500
      }
    ],
    "notes": "Test order from " + communeName + " for API verification",
    "weight": 0.5,
    "total_amount": 1500
  };

  try {
    const response = await axios.post(`${NOEST_API_BASE}/orders`, orderData, {
      headers: {
        'Authorization': `Bearer ${NOEST_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 201 || response.status === 200) {
      console.log(`✅ SUCCESS: ${communeName} is valid!`);
      console.log(`   Order ID: ${response.data.order?.id || response.data.id}`);
      return true;
    } else {
      console.log(`❌ FAILED: ${communeName} - Status: ${response.status}`);
      console.log('   Response:', response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${communeName}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || 'No message'}`);
      console.log(`   Errors:`, error.response.data?.errors || 'No specific errors');
    } else {
      console.log(`   Network Error: ${error.message}`);
    }
    return false;
  }
}

// Run the test
testAinDeflaCommunes().then(() => {
  console.log('\n✨ Aïn Defla commune testing completed!');
}).catch(error => {
  console.error('❌ Test failed:', error.message);
});
