import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Tiaret (Wilaya 14) communes - all 42 communes
const tiaretCommunes = [
  'Tiaret',
  'Medroussa',
  'Ain Bouchekif',
  'Sidi Ali Mellal',
  'Ain Zarit',
  'Ain Deheb',
  'Sidi Bakhti',
  'Medrissa',
  'Zmalet El Emir Aek',
  'Madna',
  'Sebt',
  'Mellakou',
  'Dahmouni',
  'Rahouia',
  'Mahdia',
  'Sougueur',
  'Sidi Abdelghani',
  'Ain El Hadid',
  'Ouled Djerad',
  'Naima',
  'Meghila',
  'Guertoufa',
  'Sidi Hosni',
  'Djillali Ben Amar',
  'Sebaine',
  'Tousnina',
  'Frenda',
  'Ain Kermes',
  'Ksar Chellala',
  'Rechaiga',
  'Nadorah',
  'Tagdemt',
  'Oued Lilli',
  'Mechraa Safa',
  'Hamadia',
  'Chehaima',
  'Takhemaret',
  'Sidi Abderrahmane',
  'Serghine',
  'Bougara',
  'Faidja',
  'Tidda'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Tiaret',           // Main city and wilaya capital
  'Sougueur',         // Important agricultural center
  'Frenda',           // Historic mountain town
  'Ksar Chellala',    // Agricultural hub
  'Mahdia',           // Regional center
  'Rahouia',          // Industrial town
  'Ain Bouchekif',    // Agricultural area
  'Medroussa',        // Regional center
  'Ain Kermes',       // Mountain town
  'Takhemaret'        // Agricultural area
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `TIARET-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 14, // Tiaret
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
const testKeyTiaretCommunes = async () => {
  console.log('🚀 Testing Key Tiaret (Wilaya 14) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${tiaretCommunes.length} total\n`);
  
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
    console.log('   • All key Tiaret communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 14 (Tiaret) key agricultural centers are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Tiaret Communes Available: 42');
  console.log('   • Tiaret is known for agriculture and livestock');
  console.log('   • Located on the high plains of western Algeria');
};

// Optional: Test all communes 
const testAllTiaretCommunes = async () => {
  console.log('🚀 Testing ALL Tiaret (Wilaya 14) communes with Noest API...');
  console.log(`🌾 This will test all ${tiaretCommunes.length} communes - agricultural towns and highland areas\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < tiaretCommunes.length; i++) {
    const commune = tiaretCommunes[i];
    console.log(`\n[${i + 1}/${tiaretCommunes.length}] Testing: ${commune}`);
    
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
  console.log('\n📋 COMPLETE TIARET COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${tiaretCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${tiaretCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / tiaretCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🌾 Tiaret - Agricultural Highlands Complete! 🏔️');
};

// Test communes in batches (recommended for medium-large wilaya)
const testTiaretInBatches = async () => {
  console.log('🚀 Testing Tiaret (Wilaya 14) communes in manageable batches...');
  console.log(`🌾 Testing ${tiaretCommunes.length} communes in batches of 8\n`);

  const batchSize = 8;
  const batches = [];
  
  // Split communes into batches
  for (let i = 0; i < tiaretCommunes.length; i += batchSize) {
    batches.push(tiaretCommunes.slice(i, i + batchSize));
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
      console.log(`[${globalIndex}/${tiaretCommunes.length}] Testing: ${commune}`);
      
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

    // Pause between batches
    if (batchIndex < batches.length - 1) {
      console.log(`\n⏸️  Batch ${batchIndex + 1} complete. Pausing before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  // Final summary
  console.log('\n📋 COMPLETE TIARET BATCHED TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${totalSuccess}/${tiaretCommunes.length} communes`);
  console.log(`❌ Failed: ${totalFail}/${tiaretCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((totalSuccess / tiaretCommunes.length) * 100).toFixed(1)}%`);

  if (totalFail > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🌾 Tiaret - High Plains Agriculture Complete! 🐄');
};

// Run key communes test by default
console.log('🌾 Tiaret - Agricultural Highlands (High Plains Wilaya)');
console.log('Starting with key communes test...');
console.log('For full testing, choose one of the options below:\n');
console.log('📝 Options:');
console.log('   • testKeyTiaretCommunes() - Quick test (10 key communes)');
console.log('   • testTiaretInBatches() - Systematic batched testing (recommended)');
console.log('   • testAllTiaretCommunes() - All at once (moderate process)\n');

testKeyTiaretCommunes().catch(console.error);

// Uncomment ONE of the following for full testing:
// testTiaretInBatches().catch(console.error);        // RECOMMENDED
// testAllTiaretCommunes().catch(console.error);      // Single batch
