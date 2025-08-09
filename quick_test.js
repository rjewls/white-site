import axios from 'axios';

// 🔑 REPLACE WITH YOUR ACTUAL CREDENTIALS
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

// Quick test function
async function quickTest() {
    console.log('🚀 Quick Noest API Test');
    console.log('======================');
    
    if (API_TOKEN === 'YOUR_API_TOKEN_HERE' || GUID === 'YOUR_GUID_HERE') {
        console.log('❌ Please edit this file and add your real API_TOKEN and GUID');
        console.log('   Get them from: https://app.noest-dz.com');
        return;
    }
    
    const orderData = {
        api_token: API_TOKEN,
        user_guid: GUID,
        reference: `QUICK-TEST-${Date.now()}`,
        client: 'Test Customer',
        phone: '0555123456',
        phone_2: '',
        adresse: '123 Main Street, Bouira',
        wilaya_id: 10,
        commune: 'Bouira', // Try Bouira
        montant: 1500,
        produit: 'Quick Test Product',
        remarque: 'Quick test order',
        type_id: 1,
        poids: 1,
        stop_desk: 0,
        station_code: '',
        stock: 0,
        quantite: '1',
        can_open: 0
    };
    
    console.log('📦 Testing with data:', {
        reference: orderData.reference,
        client: orderData.client,
        phone: orderData.phone,
        montant: orderData.montant,
        wilaya_id: orderData.wilaya_id
    });
    
    try {
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
        
        console.log('\n✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.tracking) {
            console.log('\n📦 Tracking Number:', response.data.tracking);
        }
        
    } catch (error) {
        console.log('\n❌ ERROR:');
        
        if (axios.isAxiosError(error)) {
            console.log('Status:', error.response?.status);
            console.log('Message:', error.response?.data?.message || error.message);
            console.log('Full Response:', JSON.stringify(error.response?.data, null, 2));
            
            if (error.response?.status === 401) {
                console.log('\n💡 Authentication failed - check your API_TOKEN and GUID');
            } else if (error.response?.status === 422) {
                console.log('\n💡 Validation error - check the data fields');
            }
        } else {
            console.log('Error:', error.message);
        }
    }
}

quickTest();
