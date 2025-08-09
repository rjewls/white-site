import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Oum El Bouaghi (Wilaya 4) communes from our mapping
const oumElBouaghiCommunes = [
  'Oum El Bouaghi',
  'Ain Beida',
  'Ainmlila',
  'Behir Chergui',
  'El Amiria',
  'Sigus',
  'El Belala',
  'Ain Babouche',
  'Berriche',
  'Ouled Hamla',
  'Dhala',
  'Ain Kercha',
  'Hanchir Toumghani',
  'Ain Diss',
  'Fkirina',
  'Souk Naamane',
  'Zorg',
  'El Fedjoudj Boughrar',
  'Ouled Zouai',
  'Bir Chouhada',
  'Ksar Sbahi',
  'Oued Nini',
  'Meskiana',
  'Ain Fekroune',
  'Ain Zitoun',
  'Ouled Gacem',
  'El Harmilia'
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `OEB-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 4, // Oum El Bouaghi
  commune: commune,
  montant: 2500,
  produit: 'Test Product',
  remarque: `Testing commune: ${commune}`,
  type_id: 1,
  poids: 1,
  stop_desk: 0,
  station_code: '',
  stock: 0,
  quantite: '1',
  can_open: 0
});

// Test individual commune
const testCommune = async (commune) => {
  try {
    const orderData = createTestOrder(commune);
    console.log(`\n🧪 Testing commune: "${commune}"`);
    
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

    if (response.status === 200 || response.status === 201) {
      console.log(`✅ PASS: "${commune}" - Order created successfully`);
      if (response.data.tracking) {
        console.log(`   Tracking: ${response.data.tracking}`);
      }
      return { commune, success: true };
    } else {
      console.log(`⚠️  WARNING: "${commune}" - Status: ${response.status}`);
      return { commune, success: false, error: `Status: ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ FAIL: "${commune}"`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || error.response.statusText}`);
      return { commune, success: false, error: error.response.data?.message || error.response.statusText };
    } else {
      console.log(`   Network Error: ${error.message}`);
      return { commune, success: false, error: error.message };
    }
  }
};

// Main test function
const testAllOumElBouaghiCommunes = async () => {
  console.log('🚀 Testing all Oum El Bouaghi (Wilaya 4) communes with Noest API...');
  console.log(`📊 Total communes to test: ${oumElBouaghiCommunes.length}\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with a small delay
  for (const commune of oumElBouaghiCommunes) {
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
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${oumElBouaghiCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${oumElBouaghiCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / oumElBouaghiCommunes.length) * 100).toFixed(1)}%`);

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

  console.log('\n🎯 Status:');
  if (successCount === oumElBouaghiCommunes.length) {
    console.log('   • All Oum El Bouaghi communes are verified! ✅');
    console.log('   • Wilaya 4 is ready for production use');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} communes verified, ${failCount} need attention`);
  } else {
    console.log('   • All communes failed - check API credentials or format');
  }
};

// Run the test
testAllOumElBouaghiCommunes().catch(console.error);
