// Test script for Boumerdès (Wilaya 35) communes with Noest API
const axios = require('axios');

const NOEST_API_BASE = 'https://api.noest.express';

// Test configuration
const testConfig = {
  api_token: 'FwMNs3tKYw-d1j0P5uZeJ4t_yWNkP0', // Replace with actual token
  store_id: '93'  // Replace with actual store ID
};

// All communes for wilaya 35 (Boumerdès)
const boumerdesCommunes = [
  'Boumerdes',
  'Boudouaou',
  'Afir',
  'Bordj Menaiel',
  'Baghlia',
  'Sidi Daoud',
  'Naciria',
  'Djinet',
  'Isser',
  'Zemmouri',
  'Si Mustapha',
  'Tidjelabine',
  'Chabet El Ameur',
  'Thenia',
  'Timezrit',
  'Corso',
  'Ouled Moussa',
  'Larbatache',
  'Bouzegza Keddara',
  'Taourga',
  'Ouled Aissa',
  'Ben Choud',
  'Dellys',
  'Ammal',
  'Beni Amrane',
  'Souk El Had',
  'Boudouaou El Bahri',
  'Ouled Hedadj',
  'Laghata',
  'Hammedi',
  'Khemis El Khechna',
  'El Kharrouba'
];

// Test each commune by attempting to create an order
async function testCommune(commune) {
  try {
    const orderData = {
      tracking_id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      first_name: 'Test',
      last_name: 'User',
      phone: '0555123456',
      wilaya: 'Boumerdes',
      commune: commune,
      address: 'Test address',
      price: 2500,
      note: `Test order for ${commune} commune validation`
    };

    console.log(`Testing commune: ${commune}`);

    const response = await axios.post(
      `${NOEST_API_BASE}/orders`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${testConfig.api_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.status === 201 || response.status === 200) {
      console.log(`✓ SUCCESS: ${commune} - Order created successfully`);
      
      // Immediately delete the test order if successful
      if (response.data && response.data.id) {
        try {
          await axios.delete(`${NOEST_API_BASE}/orders/${response.data.id}`, {
            headers: { 'Authorization': `Bearer ${testConfig.api_token}` }
          });
          console.log(`  → Test order deleted successfully`);
        } catch (deleteErr) {
          console.log(`  → Could not delete test order: ${deleteErr.message}`);
        }
      }

      return { commune, status: 'success' };
    } else {
      console.log(`✗ FAILED: ${commune} - Status: ${response.status}`);
      return { commune, status: 'failed', reason: `HTTP ${response.status}` };
    }
  } catch (error) {
    if (error.response) {
      console.log(`✗ FAILED: ${commune} - Status: ${error.response.status}`);
      console.log(`  Error: ${error.response.data?.message || 'Unknown error'}`);
      return { 
        commune, 
        status: 'failed', 
        reason: error.response.data?.message || `HTTP ${error.response.status}`
      };
    } else {
      console.log(`✗ ERROR: ${commune} - ${error.message}`);
      return { commune, status: 'error', reason: error.message };
    }
  }
}

// Test all communes
async function testAllCommunes() {
  console.log('🧪 Testing Boumerdès (Wilaya 35) communes with Noest API...');
  console.log(`📍 Total communes to test: ${boumerdesCommunes.length}\n`);

  const results = [];
  
  for (const commune of boumerdesCommunes) {
    const result = await testCommune(commune);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');

  console.log(`\n📊 SUMMARY FOR BOUMERDÈS:`);
  console.log(`✓ Successful: ${successful.length}/${results.length}`);
  console.log(`✗ Failed: ${failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed communes:');
    failed.forEach(f => console.log(`  - ${f.commune}: ${f.reason}`));
  }

  if (successful.length === results.length) {
    console.log('\n🎉 ALL COMMUNES VALIDATED SUCCESSFULLY!');
    console.log('✅ Boumerdès wilaya is ready for production use.');
  }

  return results;
}

// Run the test
testAllCommunes().catch(console.error);
