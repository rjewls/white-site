import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Bouira (Wilaya 10) communes - all 45 communes
const bouiraCommunes = [
  'Bouira',
  'El Asnam',
  'Guerrouma',
  'Souk El Khemis',
  'Kadiria',
  'Hanif',
  'Dirah',
  'Ait Laaziz',
  'Taghzout',
  'Raouraoua',
  'Mezdour',
  'Haizer',
  'Lakhdaria',
  'Maala',
  'El Hachimia',
  'Aomar',
  'Chorfa',
  'Bordj Oukhriss',
  'El Adjiba',
  'El Hakimia',
  'El Khebouzia',
  'Ahl El Ksar',
  'Bouderbala',
  'Zbarbar',
  'Ain El Hadjar',
  'Djebahia',
  'Aghbalou',
  'Taguedit',
  'Ain Turk',
  'Saharidj',
  'Dechmia',
  'Ridane',
  'Bechloul',
  'Boukram',
  'Ain Bessam',
  'Bir Ghbalou',
  'Mchedallah',
  'Sour El Ghozlane',
  'Maamora',
  'Ouled Rached',
  'Ain Laloui',
  'Hadjera Zerga',
  'Ath Mansour',
  'El Mokrani',
  'Oued El Berdi'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Bouira', // Main city (wilaya capital)
  'Lakhdaria', // Important industrial town
  'Sour El Ghozlane', // Major regional center
  'Mchedallah', // Mountain town
  'El Asnam', // Agricultural center
  'Kadiria', // Historical town
  'Ain Bessam', // Regional hub
  'Bordj Oukhriss', // Strategic location
  'Souk El Khemis', // Market town
  'Aghbalou' // Mountain area
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `BOUIRA-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 10, // Bouira
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
const testKeyBouiraCommunes = async () => {
  console.log('🚀 Testing Key Bouira (Wilaya 10) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${bouiraCommunes.length} total\n`);
  
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
    console.log('   • All key Bouira communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 10 (Bouira) key areas are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Bouira Communes Available: 45');
  console.log('   • Bouira is a mountainous wilaya in the heart of Algeria');
  console.log('   • Famous for Djurdjura National Park and Berber culture');
};

// Optional: Test all communes 
const testAllBouiraCommunes = async () => {
  console.log('🚀 Testing ALL Bouira (Wilaya 10) communes with Noest API...');
  console.log(`🏔️ This will test all ${bouiraCommunes.length} communes - mountain towns and valleys\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < bouiraCommunes.length; i++) {
    const commune = bouiraCommunes[i];
    console.log(`\n[${i + 1}/${bouiraCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Delay for rate limiting (longer delay due to larger number)
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  // Full summary
  console.log('\n📋 COMPLETE BOUIRA COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${bouiraCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${bouiraCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / bouiraCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏔️ Bouira - Heart of the Mountains Complete! 🌲');
};

// Run key communes test by default
console.log('🏔️ Bouira - Heart of Algeria (Mountain & Valley Wilaya)');
console.log('Starting with key communes test...');
console.log('To test ALL 45 communes, uncomment testAllBouiraCommunes() below\n');
testKeyBouiraCommunes().catch(console.error);

// Uncomment to test all 45 communes (larger set, longer testing time)
// testAllBouiraCommunes().catch(console.error);
