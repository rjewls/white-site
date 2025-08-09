// Quick test for Alger (Wilaya 16) main commune with Noest API
import axios from 'axios';

// Using working credentials
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

async function testAlgerMainCommune() {
    console.log('🏙️ Testing Alger (Wilaya 16) - Main commune');
    console.log('=============================================');
    
    const orderData = {
        api_token: API_TOKEN,
        user_guid: GUID,
        reference: `ALGER-TEST-${Date.now()}`,
        client: 'Test Customer Alger',
        phone: '0555123456',
        phone_2: '',
        adresse: '123 Rue Didouche Mourad, Alger Centre',
        wilaya_id: 16,
        commune: 'Alger Centre', // Main commune for Alger
        montant: 2500,
        produit: 'Test Product Alger',
        remarque: 'Test order for Alger wilaya',
        type_id: 1,
        poids: 1,
        stop_desk: 0,
        station_code: '',
        stock: 0,
        quantite: '1',
        can_open: 0
    };
    
    console.log('📦 Testing with commune:', orderData.commune);
    
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
        
        console.log('📋 Response Status:', response.status);
        console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success) {
            console.log('✅ SUCCESS: Order created successfully!');
            console.log('📄 Order ID:', response.data.order_id);
            console.log('✅ Commune "Alger Centre" is VALID for Wilaya 16');
        } else {
            console.log('❌ FAILED:', response.data.message);
            if (response.data.message && response.data.message.toLowerCase().includes('commune')) {
                console.log('🚫 Commune validation failed - needs correction');
            }
        }
        
    } catch (error) {
        console.log('💥 ERROR occurred:');
        if (error.response) {
            console.log('📋 Status:', error.response.status);
            console.log('📋 Data:', JSON.stringify(error.response.data, null, 2));
            
            if (error.response.data && error.response.data.message) {
                if (error.response.data.message.toLowerCase().includes('commune')) {
                    console.log('🚫 Commune "Alger Centre" may not be valid for Wilaya 16');
                }
            }
        } else {
            console.log('📋 Network Error:', error.message);
        }
    }
}

// Run the test
testAlgerMainCommune().catch(console.error);
