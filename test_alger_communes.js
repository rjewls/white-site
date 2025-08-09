import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Alger (Wilaya 16) communes - all 57 communes
const algerCommunes = [
  'Alger Centre',
  'Sidi Mhamed',
  'El Madania',
  'Hamma Anassers',
  'Bab El Oued',
  'Bologhine Ibn Ziri',
  'Casbah',
  'Oued Koriche',
  'Bir Mourad Rais',
  'El Biar',
  'Bouzareah',
  'Birkhadem',
  'El Harrach',
  'Baraki',
  'Oued Smar',
  'Bourouba',
  'Hussein Dey',
  'Kouba',
  'Bachedjerah',
  'Dar El Beida',
  'Bab Azzouar',
  'Ben Aknoun',
  'Dely Ibrahim',
  'Bains Romains',
  'Rais Hamidou',
  'Djasr Kasentina',
  'El Mouradia',
  'Hydra',
  'Mohammadia',
  'Bordj El Kiffan',
  'El Magharia',
  'Beni Messous',
  'Les Eucalyptus',
  'Birtouta',
  'Tassala El Merdja',
  'Ouled Chebel',
  'Sidi Moussa',
  'Ain Taya',
  'Bordj El Bahri',
  'Marsa',
  'Haraoua',
  'Rouiba',
  'Reghaia',
  'Ain Benian',
  'Staoueli',
  'Zeralda',
  'Mahelma',
  'Rahmania',
  'Souidania',
  'Cheraga',
  'Ouled Fayet',
  'El Achour',
  'Draria',
  'Douera',
  'Baba Hassen',
  'Khracia',
  'Saoula'
];

// Key communes to test first (major districts/areas)
const keyCommunes = [
  'Alger Centre',        // Main city center ✅ ALREADY CONFIRMED
  'Bab El Oued',         // Historic district
  'El Harrach',          // Major suburb/industrial area
  'Hussein Dey',         // Important district
  'Kouba',               // Major residential area
  'Hydra',               // Upscale district
  'Cheraga',             // Major suburb
  'El Biar',             // Important residential area
  'Dar El Beida',        // Near airport
  'Zeralda',             // Western coastal area
  'Rouiba',              // Industrial suburb
  'Ben Aknoun'           // University area
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `ALGER-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 16, // Alger
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
const testKeyAlgerCommunes = async () => {
  console.log('🚀 Testing Key Alger (Wilaya 16) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${algerCommunes.length} total`);
  console.log('✅ Note: "Alger Centre" already confirmed working\n');
  
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
    console.log('   • All key Alger communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 16 (Alger) key districts are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Alger Communes Available: 57');
  console.log('   • Alger is the capital and largest metropolitan area');
  console.log('   • Includes historic districts, modern suburbs, and coastal areas');
};

// Test communes in batches (recommended for large capital)
const testAlgerInBatches = async () => {
  console.log('🚀 Testing Alger (Wilaya 16) communes in manageable batches...');
  console.log(`🏙️  Testing ${algerCommunes.length} communes in batches of 8`);
  console.log('🇩🇿 Capital city with diverse districts and suburbs\n');

  const batchSize = 8;
  const batches = [];
  
  // Split communes into batches
  for (let i = 0; i < algerCommunes.length; i += batchSize) {
    batches.push(algerCommunes.slice(i, i + batchSize));
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
      console.log(`[${globalIndex}/${algerCommunes.length}] Testing: ${commune}`);
      
      const result = await testCommune(commune);
      allResults.push(result);
      
      if (result.success) {
        totalSuccess++;
      } else {
        totalFail++;
      }
      
      // Delay between tests
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Pause between batches
    if (batchIndex < batches.length - 1) {
      console.log(`\n⏸️  Batch ${batchIndex + 1}/${batches.length} complete. Pausing before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  // Final summary
  console.log('\n📋 COMPLETE ALGER BATCHED TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${totalSuccess}/${algerCommunes.length} communes`);
  console.log(`❌ Failed: ${totalFail}/${algerCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((totalSuccess / algerCommunes.length) * 100).toFixed(1)}%`);

  if (totalFail > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏙️  Alger - Capital Metropolitan Area Complete! 🇩🇿');
  console.log('🏛️ From historic Casbah to modern Hydra district');
};

// Optional: Test all communes at once
const testAllAlgerCommunes = async () => {
  console.log('🚀 Testing ALL Alger (Wilaya 16) communes with Noest API...');
  console.log(`🏙️  This will test all ${algerCommunes.length} communes - capital districts and suburbs\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < algerCommunes.length; i++) {
    const commune = algerCommunes[i];
    console.log(`\n[${i + 1}/${algerCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Delay for rate limiting
    await new Promise(resolve => setTimeout(resolve, 650));
  }

  // Full summary
  console.log('\n📋 COMPLETE ALGER COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${algerCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${algerCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / algerCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏙️  Alger - Capital of Algeria Complete! 🇩🇿');
};

// Run key communes test by default
console.log('🏙️  Alger - Capital of Algeria (57 Metropolitan Communes)');
console.log('✅ "Alger Centre" already confirmed working');
console.log('Starting with key communes test...\n');
console.log('📝 Options:');
console.log('   • testKeyAlgerCommunes() - Quick test (12 key districts) [RUNNING]');
console.log('   • testAlgerInBatches() - Systematic batched testing (recommended)');
console.log('   • testAllAlgerCommunes() - All at once (single batch)\n');

testKeyAlgerCommunes().catch(console.error);

// Uncomment ONE of the following for full testing:
// testAlgerInBatches().catch(console.error);        // RECOMMENDED
// testAllAlgerCommunes().catch(console.error);      // Single batch
