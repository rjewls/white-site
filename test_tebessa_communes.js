import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Tébessa (Wilaya 12) communes - all 26 communes
const tebessaCommunes = [
  'Tebessa',
  'Bir El Ater',
  'Cheria',
  'Stah Guentis',
  'El Aouinet',
  'Lahouidjbet',
  'Safsaf El Ouesra',
  'Hammamet',
  'Bir El Mokadem',
  'El Kouif',
  'Morsott',
  'El Ogla',
  'Bir Dheheb',
  'El Ogla El Malha',
  'Gorriguer',
  'Bekkaria',
  'Boukhadra',
  'Ouenza',
  'El Ma El Biodh',
  'Oum Ali',
  'Thlidjene',
  'Ain Zerga',
  'El Meridj',
  'Boulhaf Dyr',
  'Bedjene',
  'El Mazeraa'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Tebessa',        // Main city and wilaya capital
  'Cheria',         // Important border town
  'Bir El Ater',    // Major industrial center (phosphate)
  'Ouenza',         // Iron mining center
  'El Aouinet',     // Regional center
  'Morsott',        // Historic town
  'El Kouif',       // Border town
  'Hammamet'        // Agricultural center
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `TEBESSA-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 12, // Tébessa
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
      console.log(`✅ PASS: "${commune}"`);
      if (response.data.tracking) {
        console.log(`   📦 Tracking: ${response.data.tracking}`);
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

// Test key communes first
const testKeyTebessaCommunes = async () => {
  console.log('🚀 Testing Key Tébessa (Wilaya 12) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${tebessaCommunes.length} total\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each key commune
  for (const commune of keyCommunes) {
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
  console.log('\n📋 KEY COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${keyCommunes.length} key communes`);
  console.log(`❌ Failed: ${failCount}/${keyCommunes.length} key communes`);
  console.log(`📊 Success Rate: ${((successCount / keyCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED KEY COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  if (successCount > 0) {
    console.log('\n✅ VERIFIED KEY COMMUNES:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   • "${r.commune}"`);
    });
  }

  console.log('\n🎯 Status:');
  if (successCount === keyCommunes.length) {
    console.log('   • All key Tébessa communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 12 (Tébessa) key mining/border towns are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Tébessa Communes Available: 26');
  console.log('   • Tébessa is known for phosphate and iron mining');
  console.log('   • Important border region with Tunisia');
};

// Optional: Test all communes 
const testAllTebessaCommunes = async () => {
  console.log('🚀 Testing ALL Tébessa (Wilaya 12) communes with Noest API...');
  console.log(`⛏️  This will test all ${tebessaCommunes.length} communes - mining towns and border areas\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < tebessaCommunes.length; i++) {
    const commune = tebessaCommunes[i];
    console.log(`\n[${i + 1}/${tebessaCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Delay for rate limiting
    await new Promise(resolve => setTimeout(resolve, 600));
  }

  // Full summary
  console.log('\n📋 COMPLETE TÉBESSA COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${tebessaCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${tebessaCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / tebessaCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n⛏️  Tébessa - Mining and Border Region Complete! 🏔️');
};

// Run key communes test by default
console.log('⛏️  Tébessa - Mining Capital (Eastern Border Wilaya)');
console.log('Starting with key communes test...');
console.log('To test ALL 26 communes, uncomment testAllTebessaCommunes() below\n');
testKeyTebessaCommunes().catch(console.error);

// Uncomment to test all 26 communes (moderate size, manageable testing time)
// testAllTebessaCommunes().catch(console.error);
