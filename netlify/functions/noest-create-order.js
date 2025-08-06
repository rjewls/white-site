exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const orderData = JSON.parse(event.body);
    
    console.log('Creating Noest order:', orderData);

    const response = await fetch('https://app.noest-dz.com/api/public/create/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    console.log('Noest API response status:', response.status);
    console.log('Noest API response:', result);

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error creating Noest order:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
