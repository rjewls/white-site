import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Batna (Wilaya 5) communes - all 61 communes
const batnaCommunes = [
  'Batna',
  'Ghassira',
  'Maafa',
  'Merouana',
  'Seriana',
  'Menaa',
  'El Madher',
  'Tazoult',
  'Ngaous',
  'Guigba',
  'Inoughissen',
  'Ouyoun El Assafir',
  'Djerma',
  'Bitam',
  'Metkaouak',
  'Arris',
  'Kimmel',
  'Tilatou',
  'Ain Djasser',
  'Ouled Selam',
  'Tigherghar',
  'Ain Yagout',
  'Fesdis',
  'Sefiane',
  'Rahbat',
  'Tighanimine',
  'Lemsane',
  'Ksar Belezma',
  'Seggana',
  'Ichmoul',
  'Foum Toub',
  'Beni Foudhala El Hakania',
  'Oued El Ma',
  'Talkhamt',
  'Bouzina',
  'Chemora',
  'Oued Chaaba',
  'Taxlent',
  'Gosbat',
  'Ouled Aouf',
  'Boumagueur',
  'Barika',
  'Djezzar',
  'Tkout',
  'Ain Touta',
  'Hidoussa',
  'Teniet El Abed',
  'Oued Taga',
  'Ouled Fadel',
  'Timgad',
  'Ras El Aioun',
  'Chir',
  'Ouled Si Slimane',
  'Zanat El Beida',
  'Amdoukal',
  'Ouled Ammar',
  'El Hassi',
  'Lazrou',
  'Boumia',
  'Boulhilat',
  'Larbaa'
];

// Key communes to test first (major cities/towns)
const keyCommunes = [
  'Batna', // Main city
  'Barika', // Major town
  'Arris', // Mountain town
  'Menaa', // Tourist area
  'Ain Touta', // Industrial town
  'Merouana', // Agricultural center
  'Timgad', // Historic site
  'El Madher' // Important town
];

// Create test order payload
const createTestOrder = (commune) => ({
  api_token: API_TOKEN,
  user_guid: GUID,
  reference: `BATNA-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  client: 'Test Customer',
  phone: '0550123456',
  phone_2: '',
  adresse: `Test address, ${commune}`,
  wilaya_id: 5, // Batna
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
const testKeyBatnaCommunes = async () => {
  console.log('🚀 Testing Key Batna (Wilaya 5) communes with Noest API...');
  console.log(`📊 Testing ${keyCommunes.length} key communes out of ${batnaCommunes.length} total\n`);
  
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
    console.log('   • All key Batna communes are verified! ✅');
    console.log('   • Ready to test remaining communes if needed');
    console.log('   • Wilaya 5 (Batna) key areas are production-ready');
  } else if (successCount > 0) {
    console.log(`   • ${successCount} key communes verified, ${failCount} need attention`);
    console.log('   • Review failed communes before full testing');
  } else {
    console.log('   • All key communes failed - check API credentials or format');
  }

  console.log('\n📝 Total Batna Communes Available: 61');
  console.log('   • Run full test if key communes pass');
  console.log('   • Consider rate limiting for full 61 commune test');
};

// Optional: Test all communes (use with caution due to rate limiting)
const testAllBatnaCommunes = async () => {
  console.log('🚀 Testing ALL Batna (Wilaya 5) communes with Noest API...');
  console.log(`⚠️  This will test all ${batnaCommunes.length} communes - may take time due to rate limiting\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Test each commune with delay for rate limiting
  for (let i = 0; i < batnaCommunes.length; i++) {
    const commune = batnaCommunes[i];
    console.log(`\n[${i + 1}/${batnaCommunes.length}] Testing: ${commune}`);
    
    const result = await testCommune(commune);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Longer delay for full test to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Full summary
  console.log('\n📋 COMPLETE BATNA COMMUNES TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${batnaCommunes.length} communes`);
  console.log(`❌ Failed: ${failCount}/${batnaCommunes.length} communes`);
  console.log(`📊 Success Rate: ${((successCount / batnaCommunes.length) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\n❌ FAILED COMMUNES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • "${r.commune}": ${r.error}`);
    });
  }
};

// Run key communes test by default
console.log('Starting with key communes test...');
console.log('To test ALL 61 communes, uncomment testAllBatnaCommunes() below');
testKeyBatnaCommunes().catch(console.error);

// Uncomment to test all 61 communes (warning: takes longer due to rate limiting)
// testAllBatnaCommunes().catch(console.error);
