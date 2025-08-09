import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Tlemcen (Wilaya 13) communes - all 53 communes
const tlemcenCommunes = [
  'Tlemcen',
  'Beni Mester',
  'Ain Tallout',
  'Remchi',
  'El Fehoul',
  'Sabra',
  'Ghazaouet',
  'Souani',
  'Djebala',
  'El Gor',
  'Oued Chouly',
  'Ain Fezza',
  'Ouled Mimoun',
  'Amieur',
  'Ain Youcef',
  'Zenata',
  'Beni Snous',
  'Bab El Assa',
  'Dar Yaghmouracene',
  'Fellaoucene',
  'Azails',
  'Sebbaa Chioukh',
  'Terni Beni Hediel',
  'Bensekrane',
  'Ain Nehala',
  'Hennaya',
  'Maghnia',
  'Hammam Boughrara',
  'Souahlia',
  'Msirda Fouaga',
  'Ain Fetah',
  'El Aricha',
  'Souk Thlata',
  'Sidi Abdelli',
  'Sebdou',
  'Beni Ouarsous',
  'Sidi Medjahed',
  'Beni Boussaid',
  'Marsa Ben Mhidi',
  'Nedroma',
  'Sidi Djillali',
  'Beni Bahdel',
  'El Bouihi',
  'Honaine',
  'Tianet',
  'Ouled Riyah',
  'Bouhlou',
  'Souk El Khemis',
  'Ain Ghoraba',
  'Chetouane',
  'Mansourah',
  'Beni Semiel',
  'Ain Kebira'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Tlemcen',           // Main city and wilaya capital
  'Maghnia',           // Major border city with Morocco
  'Nedroma',           // Historic mountain city
  'Ghazaouet',         // Coastal port city
  'Remchi',            // Industrial center
  'Sebdou',            // Mountain resort town
  'Marsa Ben Mhidi',   // Coastal town
  'Beni Mester',       // Suburban area of Tlemcen
  'Hennaya',           // Agricultural center
  'Ain Fezza'          // Tourist/spring area
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `TLEMCEN-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 13, // Tlemcen
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
const testKeyTlemcenCommunes = async () => {
  console.log('🚀 Testing Key Tlemcen (Wilaya 13) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${tlemcenCommunes.length} total\n`);
  
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
    console.log('   • All key Tlemcen communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 13 (Tlemcen) key cultural/border cities are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Tlemcen Communes Available: 53');
  console.log('   • Tlemcen is known for its Andalusian architecture and culture');
  console.log('   • Important border region with Morocco');
};

// Optional: Test all communes (WARNING: This is a large test - 53 communes!)
const testAllTlemcenCommunes = async () => {
  console.log('🚀 Testing ALL Tlemcen (Wilaya 13) communes with Noest API...');
  console.log(`🏛️  This will test all ${tlemcenCommunes.length} communes - cultural sites, border towns, and mountain villages`);
  console.log('⏳ This is a LARGE test and will take considerable time (53 communes)\n');
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < tlemcenCommunes.length; i++) {
    const commune = tlemcenCommunes[i];
    console.log(`\n[${i + 1}/${tlemcenCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Longer delay for large batch to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 700));
  }

  // Full summary
  console.log('\n📋 COMPLETE TLEMCEN COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${tlemcenCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${tlemcenCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / tlemcenCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏛️  Tlemcen - Pearl of the Maghreb Complete! 🇲🇦');
  console.log('🎭 Cultural capital with rich Andalusian heritage');
};

// Test communes in smaller batches (recommended for large wilaya)
const testTlemcenInBatches = async () => {
  console.log('🚀 Testing Tlemcen (Wilaya 13) communes in manageable batches...');
  console.log(`🏛️  Testing ${tlemcenCommunes.length} communes in batches of 10\n`);

  const batchSize = 10;
  const batches = [];
  
  // Split communes into batches
  for (let i = 0; i < tlemcenCommunes.length; i += batchSize) {
    batches.push(tlemcenCommunes.slice(i, i + batchSize));
  }

  const allResults = [];
  let totalSuccess = 0;
  let totalFail = 0;

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    console.log(`\n📦 BATCH ${batchIndex + 1}/${batches.length} (${batch.length} communes)`);
    console.log('─'.repeat(50));

    for (let i = 0; i < batch.length; i++) {
      const commune = batch[i];
      const globalIndex = batchIndex * batchSize + i + 1;
      console.log(`[${globalIndex}/${tlemcenCommunes.length}] Testing: ${commune}`);
      
      const result = await testCommune(commune);
      allResults.push(result);
      
      if (result.success) {
        totalSuccess++;
      } else {
        totalFail++;
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Longer pause between batches
    if (batchIndex < batches.length - 1) {
      console.log(`\n⏸️  Batch ${batchIndex + 1} complete. Pausing before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Final summary
  console.log('\n📋 COMPLETE TLEMCEN BATCHED TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${totalSuccess}/${tlemcenCommunes.length} communes`);
  console.log(`❌ Failed: ${totalFail}/${tlemcenCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((totalSuccess / tlemcenCommunes.length) * 100).toFixed(1)}%`);

  if (totalFail > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏛️  Tlemcen - Cultural Heritage Complete! 🎭');
};

// Run key communes test by default
console.log('🏛️  Tlemcen - Pearl of the Maghreb (Cultural Heritage Wilaya)');
console.log('Starting with key communes test...');
console.log('For full testing, choose one of the options below:\n');
console.log('📝 Options:');
console.log('   • testKeyTlemcenCommunes() - Quick test (10 key communes)');
console.log('   • testTlemcenInBatches() - Systematic batched testing (recommended)');
console.log('   • testAllTlemcenCommunes() - All at once (long process)\n');

testKeyTlemcenCommunes().catch(console.error);

// Uncomment ONE of the following for full testing:
// testTlemcenInBatches().catch(console.error);        // RECOMMENDED
// testAllTlemcenCommunes().catch(console.error);      // Single batch (long)
