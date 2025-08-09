import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Béchar (Wilaya 8) communes - all 11 communes
const becharCommunes = [
  'Bechar',
  'Erg Ferradj',
  'Meridja',
  'Lahmar',
  'Mechraa Houari B',
  'Kenedsa',
  'Taghit',
  'Boukais',
  'Mogheul',
  'Abadla',
  'Beni Ounif'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Bechar', // Main city (regional capital)
  'Taghit', // Famous oasis & tourist destination
  'Beni Ounif', // Border town with Morocco
  'Abadla', // Regional center
  'Kenedsa', // Historic oasis
  'Erg Ferradj' // Desert area
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `BECHAR-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 8, // Béchar
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
const testKeyBecharCommunes = async () => {
  console.log('🚀 Testing Key Béchar (Wilaya 8) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${becharCommunes.length} total\n`);
  
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
    console.log('   • All key Béchar communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 8 (Béchar) key desert areas are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Béchar Communes Available: 11');
  console.log('   • Béchar is a major Saharan regional capital');
  console.log('   • Famous for Taghit oasis and cross-border trade');
};

// Optional: Test all communes 
const testAllBecharCommunes = async () => {
  console.log('🚀 Testing ALL Béchar (Wilaya 8) communes with Noest API...');
  console.log(`🏜️ This will test all ${becharCommunes.length} communes - desert oases and border towns\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < becharCommunes.length; i++) {
    const commune = becharCommunes[i];
    console.log(`\n[${i + 1}/${becharCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Delay for rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Full summary
  console.log('\n📋 COMPLETE BÉCHAR COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${becharCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${becharCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / becharCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏜️ Béchar - Saharan Regional Capital Complete! 🌵');
};

// Run key communes test by default
console.log('🏜️ Béchar - Saharan Regional Capital & Border Gateway');
console.log('Starting with key communes test...');
console.log('To test ALL 11 communes, uncomment testAllBecharCommunes() below\n');
testKeyBecharCommunes().catch(console.error);

// Uncomment to test all 11 communes (small size, quick testing)
// testAllBecharCommunes().catch(console.error);
