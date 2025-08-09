// Test script for Relizane communes with Noest API
const axios = require('axios');

const NOEST_API_URL = 'https://api.noestexpress.com';
const TOKEN = 'your-actual-token-here'; // Replace with your actual Noest API token

// Test data for Relizane order
const testOrder = {
  name: "Test Customer Relizane",
  phone: "0551234567",
  wilaya: "Relizane",
  commune: "Relizane", // Using the main commune
  address: "Test Address Relizane",
  product: "Test Product",
  price: 2500,
  quantity: 1,
  weight: 500,
  fragile: false,
  exchange: false,
  stopdesk: false
};

// List of Relizane communes to test
const communesToTest = [
  'Relizane',
  'Oued Rhiou',
  'Belaassel Bouzegza',
  'Sidi Saada',
  'Ouled Aiche',
  'Sidi Lazreg',
  'El Hamadna',
  'Sidi Mhamed Ben Ali',
  'Mediouna',
  'Sidi Khettab',
  'Ammi Moussa',
  'Zemmoura',
  'Beni Dergoun',
  'Djidiouia',
  'El Guettar',
  'Hamri',
  'El Matmar',
  'Sidi Mhamed Ben Aouda',
  'Ain Tarek',
  'Oued Essalem',
  'Ouarizane',
  'Mazouna',
  'Kalaa',
  'Ain Rahma',
  'Yellel',
  'Oued El Djemaa',
  'Ramka',
  'Mendes',
  'Lahlef',
  'Beni Zentis',
  'Souk El Haad',
  'Dar Ben Abdellah',
  'El Hassi',
  'Had Echkalla',
  'Bendaoud',
  'El Ouldja',
  'Merdja Sidi Abed',
  'Ouled Sidi Mihoub'
];

async function testRelizaneCommunes() {
  console.log('🧪 Testing Relizane communes with Noest API...');
  console.log('===============================================');
  
  for (const commune of communesToTest) {
    try {
      const orderData = {
        ...testOrder,
        commune: commune
      };
      
      console.log(`\n📍 Testing: ${commune}`);
      
      const response = await axios.post(`${NOEST_API_URL}/create-order`, orderData, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        console.log(`✅ ${commune}: Valid (Order ID: ${response.data.order_id})`);
      } else {
        console.log(`❌ ${commune}: Failed -`, response.data?.message || 'Unknown error');
      }
      
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || error.response.statusText;
        console.log(`❌ ${commune}: API Error - ${message}`);
      } else {
        console.log(`❌ ${commune}: Network Error -`, error.message);
      }
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Relizane commune testing completed!');
}

// Run the test if executed directly
if (require.main === module) {
  testRelizaneCommunes().catch(console.error);
}

module.exports = { testRelizaneCommunes, communesToTest };
