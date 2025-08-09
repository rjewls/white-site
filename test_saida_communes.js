// Test Saïda (Wilaya 20) communes with Noest API
import axios from 'axios';

// Using working credentials
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

const saidaCommunes = [
  'Saida',
  'Doui Thabet',
  'Ain El Hadjar',
  'Ouled Khaled',
  'Moulay Larbi',
  'Youb',
  'Hounet',
  'Sidi Amar',
  'Sidi Boubekeur',
  'El Hassasna',
  'Maamora',
  'Ain Sekhouna',
  'Ouled Brahim',
  'Tircine',
  'Ain Soltane'
];

async function testSaidaCommunes() {
  console.log('🏜️ Testing Saïda (Wilaya 20) communes with Noest API');
  console.log('====================================================');
  console.log(`Total communes to test: ${saidaCommunes.length}\n`);
  
  let successCount = 0;
  let failureCount = 0;
  const results = [];
  
  for (let i = 0; i < saidaCommunes.length; i++) {
    const commune = saidaCommunes[i];
    console.log(`[${i + 1}/${saidaCommunes.length}] Testing: ${commune}`);
    
    const orderData = {
      api_token: API_TOKEN,
      user_guid: GUID,
      reference: `SAIDA-TEST-${Date.now()}-${i}`,
      client: `Test Customer ${commune}`,
      phone: '0555123456',
      phone_2: '',
      adresse: `123 Mountain Road, ${commune}`,
      wilaya_id: 20,
      commune: commune,
      montant: 2100,
      produit: `Test Product for ${commune}`,
      remarque: `Test order for ${commune}, Saïda`,
      type_id: 1,
      poids: 1,
      stop_desk: 0,
      station_code: '',
      stock: 0,
      quantite: '1',
      can_open: 0
    };
    
    try {
      const response = await axios.post(
        'https://app.noest-dz.com/api/public/create/order',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        console.log(`   ✅ SUCCESS - Order ID: ${response.data.order_id}`);
        successCount++;
        results.push({ commune, status: 'SUCCESS', orderId: response.data.order_id });
      } else {
        console.log(`   ❌ FAILED - ${response.data.message || 'Unknown error'}`);
        failureCount++;
        results.push({ commune, status: 'FAILED', message: response.data.message });
      }
      
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        console.log(`   ❌ API ERROR - ${errorMessage}`);
      } else {
        errorMessage = error.message;
        console.log(`   ❌ NETWORK ERROR - ${errorMessage}`);
      }
      failureCount++;
      results.push({ commune, status: 'ERROR', message: errorMessage });
    }
    
    // Small delay between requests to avoid overwhelming the API
    if (i < saidaCommunes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS FOR SAÏDA (WILAYA 20)');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${saidaCommunes.length} communes`);
  console.log(`❌ Failed: ${failureCount}/${saidaCommunes.length} communes`);
  console.log(`📈 Success Rate: ${((successCount / saidaCommunes.length) * 100).toFixed(1)}%`);
  
  if (failureCount > 0) {
    console.log('\n❌ Failed communes:');
    results
      .filter(r => r.status !== 'SUCCESS')
      .forEach(r => {
        console.log(`   - ${r.commune}: ${r.message}`);
      });
  }
  
  console.log('\n✅ All valid communes for Saïda (Wilaya 20):');
  results
    .filter(r => r.status === 'SUCCESS')
    .forEach(r => {
      console.log(`   - ${r.commune}`);
    });
}

// Run the test
testSaidaCommunes().catch(console.error);
