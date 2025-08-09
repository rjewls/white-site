// Test Sétif (Wilaya 19) communes with Noest API
import axios from 'axios';

// Using working credentials
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

const setifCommunes = [
  'Setif',
  'Ain El Kebira',
  'Beni Aziz',
  'Ouled Sidi Ahmed',
  'Boutaleb',
  'Ain Roua',
  'Draa Kebila',
  'Bir El Arch',
  'Beni Chebana',
  'Ouled Tebben',
  'Hamma',
  'Maaouia',
  'Ain Legraj',
  'Ain Abessa',
  'Dehamcha',
  'Babor',
  'Guidjel',
  'Ain Lahdjar',
  'Bousselam',
  'El Eulma',
  'Djemila',
  'Beni Ouartilane',
  'Rosfa',
  'Ouled Addouane',
  'Belaa',
  'Ain Arnat',
  'Amoucha',
  'Ain Oulmane',
  'Beidha Bordj',
  'Bouandas',
  'Bazer Sakhra',
  'Hammam Essokhna',
  'Mezloug',
  'Bir Haddada',
  'Serdj El Ghoul',
  'Harbil',
  'El Ouricia',
  'Tizi Nbechar',
  'Salah Bey',
  'Ain Azal',
  'Guenzet',
  'Talaifacene',
  'Bougaa',
  'Beni Fouda',
  'Tachouda',
  'Beni Mouhli',
  'Ouled Sabor',
  'Guellal',
  'Ain Sebt',
  'Hammam Guergour',
  'Ait Naoual Mezada',
  'Ksar El Abtal',
  'Beni Hocine',
  'Ait Tizi',
  'Maouklane',
  'Guelta Zerka',
  'Oued El Barad',
  'Taya',
  'El Ouldja',
  'Tella'
];

async function testSetifCommunes() {
  console.log('🏛️ Testing Sétif (Wilaya 19) communes with Noest API');
  console.log('====================================================');
  console.log(`Total communes to test: ${setifCommunes.length}\n`);
  
  let successCount = 0;
  let failureCount = 0;
  const results = [];
  
  for (let i = 0; i < setifCommunes.length; i++) {
    const commune = setifCommunes[i];
    console.log(`[${i + 1}/${setifCommunes.length}] Testing: ${commune}`);
    
    const orderData = {
      api_token: API_TOKEN,
      user_guid: GUID,
      reference: `SETIF-TEST-${Date.now()}-${i}`,
      client: `Test Customer ${commune}`,
      phone: '0555123456',
      phone_2: '',
      adresse: `123 Highland Street, ${commune}`,
      wilaya_id: 19,
      commune: commune,
      montant: 2300,
      produit: `Test Product for ${commune}`,
      remarque: `Test order for ${commune}, Sétif`,
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
    if (i < setifCommunes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS FOR SÉTIF (WILAYA 19)');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${setifCommunes.length} communes`);
  console.log(`❌ Failed: ${failureCount}/${setifCommunes.length} communes`);
  console.log(`📈 Success Rate: ${((successCount / setifCommunes.length) * 100).toFixed(1)}%`);
  
  if (failureCount > 0) {
    console.log('\n❌ Failed communes:');
    results
      .filter(r => r.status !== 'SUCCESS')
      .forEach(r => {
        console.log(`   - ${r.commune}: ${r.message}`);
      });
  }
  
  console.log('\n✅ All valid communes for Sétif (Wilaya 19):');
  results
    .filter(r => r.status === 'SUCCESS')
    .forEach(r => {
      console.log(`   - ${r.commune}`);
    });
}

// Run the test
testSetifCommunes().catch(console.error);
