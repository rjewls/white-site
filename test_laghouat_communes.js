// Test script for Wilaya 3 (Laghouat) communes with Noest API
const axios = require('axios');

const NOEST_API_URL = 'https://api.noest.vip/api/orders';
const NOEST_TOKEN = '4ed1b5e7-16c5-4b17-87a7-9aed7b15ddb7';

// Laghouat communes from our mapping
const laghouatCommunes = [
  'Laghouat',
  'Ksar El Hirane',
  'Benacer Ben Chohra',
  'Sidi Makhlouf',
  'Hassi Delaa',
  'Hassi R Mel',
  'Ain Mahdi',
  'Tadjmout',
  'Kheneg',
  'Gueltat Sidi Saad',
  'Ain Sidi Ali',
  'Beidha',
  'Brida',
  'El Ghicha',
  'Hadj Mechri',
  'Sebgag',
  'Taouiala',
  'Tadjrouna',
  'Aflou',
  'El Assafia',
  'Oued Morra',
  'Oued M Zi',
  'El Haouaita',
  'Sidi Bouzid'
];

// Create test order payload
const createTestOrder = (commune) => ({
  name: "Test Customer",
  phone: "0550123456",
  wilaya: "Laghouat", // Wilaya 3
  commune: commune,
  address: "Test address 123",
  product: "Test Product",
  product_price: 2500,
  quantity: 1,
  delivery_fee: 500,
  weight: 250,
  notes: `Testing commune: ${commune}`,
  order_id: `TEST-LAGHOUAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
});

// Test individual commune
const testCommune = async (commune) => {
  try {
    const orderData = createTestOrder(commune);
    console.log(`\n🧪 Testing commune: "${commune}"`);
    
    const response = await axios.post(NOEST_API_URL, orderData, {
      headers: {
        'Authorization': `Bearer ${NOEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`✅ PASS: "${commune}" - Order created successfully`);
      console.log(`   Order ID: ${response.data.order_id || 'N/A'}`);
      return { commune, success: true };
    } else {
      console.log(`⚠️  WARNING: "${commune}" - Unexpected response:`, response.status);
      return { commune, success: false, error: `Status: ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ FAIL: "${commune}"`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || error.response.data || 'Unknown error'}`);
      return { commune, success: false, error: error.response.data?.message || error.response.statusText };
    } else {
      console.log(`   Network/Other Error: ${error.message}`);
      return { commune, success: false, error: error.message };
    }
  }
};

// Main test function
const testAllLaghouatCommunes = async () => {
  console.log('🚀 Testing all Laghouat (Wilaya 3) communes with Noest API...');
  console.log(`📊 Total communes to test: ${laghouatCommunes.length}\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with a small delay
  for (const commune of laghouatCommunes) {
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n📋 SUMMARY REPORT');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount}/${laghouatCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${laghouatCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / laghouatCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  if (successCount > 0) {
    console.log('\n✅ VERIFIED COMMUNES:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   • "${r.commune}"`);
    });
  }

  console.log('\n🎯 Next Steps:');
  if (successCount === laghouatCommunes.length) {
    console.log('   • All Laghouat communes are verified! ✅');
    console.log('   • Ready to update default commune in communeMapping.ts');
  } else {
    console.log('   • Fix failed commune names if any');
    console.log('   • Re-test failed communes');
  }
};

// Run the test
testAllLaghouatCommunes().catch(console.error);
