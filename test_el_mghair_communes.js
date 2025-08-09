// Test script for El M'Ghair (wilaya 57) communes with Noest API
import axios from 'axios';

const NOEST_API_TOKEN = 'nnxgmPd$RQy/5d';
const NOEST_API_BASE_URL = 'https://api.noest.info';

const wilayaId = 57;
const wilayaName = 'El M\'Ghair';

const communes = [
  'El M\'Ghair',
  'Oum Touyour',
  'Sidi Khelil',
  'Still',
  'Djamaa',
  'M\'rara',
  'Sidi Amrane',
  'Tenedla'
];

const testCommunes = async () => {
  console.log(`\nTesting ${communes.length} communes for ${wilayaName} (ID: ${wilayaId})\n`);

  for (const commune of communes) {
    try {
      console.log(`Testing: "${commune}"`);
      
      const testOrderData = {
        nom: 'Test User',
        prenom: 'Test',
        telephone: '0555123456',
        adresse: 'Test address',
        commune: commune,
        wilaya: wilayaName,
        prix: 2000,
        poids: 0.5,
        remarque: `Test order for ${commune}`,
        stop_desk: false,
        produit: 'Test Product'
      };

      const response = await axios({
        method: 'POST',
        url: `${NOEST_API_BASE_URL}/order`,
        headers: {
          'Authorization': `Bearer ${NOEST_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: testOrderData,
        timeout: 30000
      });

      if (response.data && response.data.success) {
        console.log(`  ✓ "${commune}" - ACCEPTED (ID: ${response.data.order?.id || 'unknown'})`);
      } else {
        console.log(`  ✗ "${commune}" - REJECTED:`, response.data?.message || 'Unknown error');
      }

    } catch (error) {
      if (error.response) {
        console.log(`  ✗ "${commune}" - ERROR (${error.response.status}): ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.log(`  ✗ "${commune}" - NETWORK ERROR: No response received`);
      } else {
        console.log(`  ✗ "${commune}" - ERROR:`, error.message);
      }
    }
  }

  console.log(`\nCompleted testing for ${wilayaName} (ID: ${wilayaId})`);
};

testCommunes().catch(console.error);
