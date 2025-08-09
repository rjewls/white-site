import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Tizi Ouzou (Wilaya 15) communes - all 67 communes (LARGEST WILAYA!)
const tiziOuzouCommunes = [
  'Tizi Ouzou',
  'Ain El Hammam',
  'Akbil',
  'Freha',
  'Souamaa',
  'Mechtrass',
  'Irdjen',
  'Timizart',
  'Makouda',
  'Draa El Mizan',
  'Tizi Ghenif',
  'Bounouh',
  'Ait Chaffaa',
  'Frikat',
  'Beni Aissi',
  'Beni Zmenzer',
  'Iferhounene',
  'Azazga',
  'Iloula Oumalou',
  'Yakouren',
  'Larba Nait Irathen',
  'Tizi Rached',
  'Zekri',
  'Ouaguenoun',
  'Ain Zaouia',
  'Mkira',
  'Ait Yahia',
  'Ait Mahmoud',
  'Maatka',
  'Ait Boumehdi',
  'Abi Youcef',
  'Beni Douala',
  'Illilten',
  'Bouzguen',
  'Ait Aggouacha',
  'Ouadhia',
  'Azzefoun',
  'Tigzirt',
  'Ait Aissa Mimoun',
  'Boghni',
  'Ifigha',
  'Ait Oumalou',
  'Tirmitine',
  'Akerrou',
  'Yatafen',
  'Beni Ziki',
  'Draa Ben Khedda',
  'Ouacif',
  'Idjeur',
  'Mekla',
  'Tizi Nthlata',
  'Beni Yenni',
  'Aghrib',
  'Iflissen',
  'Boudjima',
  'Ait Yahia Moussa',
  'Souk El Thenine',
  'Ait Khelil',
  'Sidi Naamane',
  'Iboudraren',
  'Aghni Goughran',
  'Mizrana',
  'Imsouhal',
  'Tadmait',
  'Ait Bouadou',
  'Assi Youcef',
  'Ait Toudert'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Tizi Ouzou',          // Capital city
  'Azazga',              // Important regional center
  'Draa El Mizan',       // Major town
  'Tigzirt',             // Coastal town
  'Azzefoun',            // Coastal area
  'Boghni',              // Mountain town
  'Ain El Hammam',       // Tourist area
  'Larba Nait Irathen',  // Cultural center
  'Makouda',             // Agricultural center
  'Freha',               // Regional town
  'Draa Ben Khedda',     // Historic town
  'Timizart'             // Mountain area
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `TIZI-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 15, // Tizi Ouzou
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
const testKeyTiziOuzouCommunes = async () => {
  console.log('🚀 Testing Key Tizi Ouzou (Wilaya 15) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${tiziOuzouCommunes.length} total\n`);
  
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
    console.log('   • All key Tizi Ouzou communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 15 (Tizi Ouzou) key Kabyle regions are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Tizi Ouzou Communes Available: 67 (LARGEST!)');
  console.log('   • Tizi Ouzou is the heart of Kabylia');
  console.log('   • Rich Berber/Amazigh culture and mountain landscapes');
};

// Test communes in small batches (REQUIRED for large wilaya)
const testTiziOuzouInBatches = async () => {
  console.log('🚀 Testing Tizi Ouzou (Wilaya 15) communes in small batches...');
  console.log(`🏔️  Testing ${tiziOuzouCommunes.length} communes in batches of 6`);
  console.log('⚠️  LARGEST WILAYA - This will take considerable time!\n');

  const batchSize = 6;
  const batches = [];
  
  // Split communes into batches
  for (let i = 0; i < tiziOuzouCommunes.length; i += batchSize) {
    batches.push(tiziOuzouCommunes.slice(i, i + batchSize));
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
      console.log(`[${globalIndex}/${tiziOuzouCommunes.length}] Testing: ${commune}`);
      
      const result = await testCommune(commune);
      allResults.push(result);
      
      if (result.success) {
        totalSuccess++;
      } else {
        totalFail++;
      }
      
      // Delay between tests
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // Longer pause between batches for large wilaya
    if (batchIndex < batches.length - 1) {
      console.log(`\n⏸️  Batch ${batchIndex + 1}/${batches.length} complete. Pausing before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
  }

  // Final summary
  console.log('\n📋 COMPLETE TIZI OUZOU BATCHED TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${totalSuccess}/${tiziOuzouCommunes.length} communes`);
  console.log(`❌ Failed: ${totalFail}/${tiziOuzouCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((totalSuccess / tiziOuzouCommunes.length) * 100).toFixed(1)}%`);

  if (totalFail > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }

  console.log('\n🏔️  Tizi Ouzou - Heart of Kabylia Complete! 🏛️');
  console.log('🎭 Largest wilaya with rich Amazigh heritage');
};

// Run key communes test by default
console.log('🏔️  Tizi Ouzou - Heart of Kabylia (Largest Wilaya - 67 communes!)');
console.log('Starting with key communes test...');
console.log('⚠️  This is our LARGEST wilaya - full testing will take significant time\n');
console.log('📝 Options:');
console.log('   • testKeyTiziOuzouCommunes() - Quick test (12 key communes) [RUNNING]');
console.log('   • testTiziOuzouInBatches() - Systematic batched testing (RECOMMENDED)');
console.log('   • Full test NOT recommended - use batched approach instead\n');

testKeyTiziOuzouCommunes().catch(console.error);

// Uncomment for full testing (ONLY use batched approach for this large wilaya):
// testTiziOuzouInBatches().catch(console.error);        // RECOMMENDED for full test
