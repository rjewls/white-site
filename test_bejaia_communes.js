import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Béjaïa (Wilaya 6) communes - all 43 communes
const bejaiaCommunes = [
  'Bejaia',
  'Amizour',
  'Taourirt Ighil',
  'Chelata',
  'Timzrit',
  'Souk El Thenine',
  'Mcisna',
  'Thinabdher',
  'Tichi',
  'Semaoun',
  'Tifra',
  'Ighram',
  'Amalou',
  'Ifelain Ilmathen',
  'Toudja',
  'Darguina',
  'Sidi Ayad',
  'Aokas',
  'Adekar',
  'Akbou',
  'Seddouk',
  'Tazmalt',
  'Ait Rizine',
  'Chemini',
  'Souk Oufella',
  'Taskriout',
  'Tibane',
  'Tala Hamza',
  'Barbacha',
  'Beni Ksila',
  'Ouzallaguen',
  'Sidi Aich',
  'El Kseur',
  'Melbou',
  'Akfadou',
  'Leflaye',
  'Kherrata',
  'Ait Smail',
  'Boukhelifa',
  'Tizi Nberber',
  'Beni Maouch',
  'Oued Ghir',
  'Boudjellil'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Bejaia', // Main city (port city)
  'Akbou', // Major industrial town
  'El Kseur', // Important town
  'Amizour', // Agricultural center
  'Sidi Aich', // Regional center
  'Aokas', // Coastal town
  'Tazmalt', // Mountain town
  'Kherrata' // Strategic town
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `BEJAIA-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 6, // Béjaïa
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
const testKeyBejaiaCommunes = async () => {
  console.log('🚀 Testing Key Béjaïa (Wilaya 6) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${bejaiaCommunes.length} total\n`);
  
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
    console.log('   • All key Béjaïa communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 6 (Béjaïa) key areas are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Béjaïa Communes Available: 43');
  console.log('   • Béjaïa is a major coastal and mountain wilaya');
  console.log('   • Includes important ports and Berber communities');
};

// Optional: Test all communes 
const testAllBejaiaCommunes = async () => {
  console.log('🚀 Testing ALL Béjaïa (Wilaya 6) communes with Noest API...');
  console.log(`⚠️  This will test all ${bejaiaCommunes.length} communes - may take time due to rate limiting\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < bejaiaCommunes.length; i++) {
    const commune = bejaiaCommunes[i];
    console.log(`\n[${i + 1}/${bejaiaCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Delay for rate limiting
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  // Full summary
  console.log('\n📋 COMPLETE BÉJAÏA COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${bejaiaCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${bejaiaCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / bejaiaCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }
};

// Run key communes test by default
console.log('🏔️ Béjaïa - The Pearl of Algeria (Coastal & Mountain Wilaya)');
console.log('Starting with key communes test...');
console.log('To test ALL 43 communes, uncomment testAllBejaiaCommunes() below\n');
testKeyBejaiaCommunes().catch(console.error);

// Uncomment to test all 43 communes (warning: takes longer due to rate limiting)
// testAllBejaiaCommunes().catch(console.error);
