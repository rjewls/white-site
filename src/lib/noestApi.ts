import { supabase } from './supabaseClient';

interface NoestExpressConfig {
  api_token: string;
  guid: string;
}

interface NoestOrderData {
  reference?: string;
  client: string;
  phone: string;
  phone_2?: string;
  adresse: string;
  wilaya_id: number;
  commune: string;
  montant: number;
  remarque?: string;
  produit: string;
  type_id: number;
  poids: number;
  stop_desk: number;
  station_code?: string;
  stock: number;
  quantite: string;
  can_open: number;
}

interface NoestApiResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  tracking?: string;
}

class NoestApiService {
  private config: NoestExpressConfig | null = null;

  // Get API configuration from Supabase
  async getConfig(): Promise<NoestExpressConfig | null> {
    if (this.config) {
      console.log('Using cached Noest config:', this.config);
      return this.config;
    }

    console.log('Fetching fresh Noest config from database...');
    
    // First try with is_active filter, then without if no results
    let { data, error } = await supabase
      .from('noest_express_config')
      .select('api_token, guid')
      .eq('is_active', true)
      .single();

    // If no active config found, try getting any config
    if (error && error.code === 'PGRST116') {
      console.log('No active config found, trying to get any config...');
      const fallbackResult = await supabase
        .from('noest_express_config')
        .select('api_token, guid')
        .limit(1)
        .single();
      
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    console.log('Noest config fetch result:', { data, error });

    if (error) {
      console.error('Error fetching Noest config:', error);
      return null;
    }

    if (!data || !data.api_token || !data.guid) {
      console.error('Noest config incomplete:', data);
      return null;
    }

    console.log('Successfully fetched Noest config');
    this.config = data;
    return data;
  }

  // Create order in Noest API
  async createOrder(orderData: NoestOrderData): Promise<NoestApiResponse> {
    console.log('=== NOEST API CREATE ORDER DEBUG ===');
    
    const config = await this.getConfig();
    if (!config) {
      return { success: false, error: 'Noest Express API not configured. Please save your API credentials in the admin panel first.' };
    }

    console.log('Config loaded:', {
      hasApiToken: !!config.api_token,
      apiTokenLength: config.api_token?.length || 0,
      apiTokenFirst10: config.api_token?.substring(0, 10) + '...',
      hasGuid: !!config.guid,
      guidLength: config.guid?.length || 0
    });

    // Validate API token format
    if (!config.api_token || config.api_token.trim().length === 0) {
      return { success: false, error: 'API Token is missing. Please check your Noest Express configuration.' };
    }

    if (!config.guid || config.guid.trim().length === 0) {
      return { success: false, error: 'GUID is missing. Please check your Noest Express configuration.' };
    }

    // Validate required fields according to API documentation
    const validationErrors = [];
    
    if (!orderData.client || orderData.client.length > 255) {
      validationErrors.push('client: required, max 255 characters');
    }
    
    if (!orderData.phone || !/^\d{9,10}$/.test(orderData.phone)) {
      validationErrors.push('phone: required, must be 9-10 digits');
    }
    
    if (!orderData.adresse || orderData.adresse.length > 255) {
      validationErrors.push('adresse: required, max 255 characters');
    }
    
    if (!orderData.wilaya_id || orderData.wilaya_id < 1 || orderData.wilaya_id > 58) {
      validationErrors.push('wilaya_id: required, must be between 1-58');
    }
    
    if (!orderData.commune || orderData.commune.length > 255) {
      validationErrors.push('commune: required, max 255 characters');
    }
    
    if (!orderData.montant || isNaN(orderData.montant)) {
      validationErrors.push('montant: required, must be numeric');
    }
    
    if (!orderData.produit) {
      validationErrors.push('produit: required');
    }
    
    if (!orderData.type_id || orderData.type_id < 1 || orderData.type_id > 3) {
      validationErrors.push('type_id: required, must be between 1-3');
    }
    
    if (!orderData.poids || isNaN(orderData.poids)) {
      validationErrors.push('poids: required, must be integer');
    }
    
    if (orderData.stop_desk !== 0 && orderData.stop_desk !== 1) {
      validationErrors.push('stop_desk: required, must be 0 or 1');
    }
    
    const requestData = {
      API_TOKEN: config.api_token.trim(),
      reference: orderData.reference || `ORDER-${Date.now()}`,
      client: orderData.client,
      phone: orderData.phone,
      phone_2: orderData.phone_2 || '',
      adresse: orderData.adresse,
      wilaya_id: orderData.wilaya_id,
      commune: orderData.commune,
      montant: orderData.montant,
      remarque: orderData.remarque || '',
      produit: orderData.produit,
      type_id: orderData.type_id,
      poids: orderData.poids,
      stop_desk: orderData.stop_desk,
      station_code: orderData.station_code || '',
      stock: orderData.stock || 0,
      quantite: orderData.quantite || '1',
      can_open: orderData.can_open || 1
    };

    console.log('Request payload structure:', {
      hasApiToken: !!requestData.API_TOKEN,
      apiTokenLength: requestData.API_TOKEN?.length,
      apiTokenIsValid: requestData.API_TOKEN && requestData.API_TOKEN.trim().length > 0,
      reference: requestData.reference,
      client: requestData.client,
      phone: requestData.phone,
      wilaya_id: requestData.wilaya_id,
      commune: requestData.commune,
      montant: requestData.montant,
      type_id: requestData.type_id,
      requestKeys: Object.keys(requestData)
    });
    
    console.log('Full request data (API_TOKEN masked):', {
      ...requestData,
      API_TOKEN: requestData.API_TOKEN ? `${requestData.API_TOKEN.substring(0, 10)}...` : 'MISSING'
    });

    try {
      const response = await fetch('https://app.noest-dz.com/api/public/create/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Noest API response status:', response.status);
      console.log('Noest API response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Noest API response body:', result);

      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        console.error('Response body:', result);
        
        // Provide specific error messages based on common issues
        if (response.status === 401) {
          return { 
            success: false, 
            error: 'Authentication failed. Please check your API Token and GUID in the admin panel. Make sure they are copied correctly from your Noest Express dashboard.' 
          };
        } else if (response.status === 403) {
          return { 
            success: false, 
            error: 'Access forbidden. Your API credentials may not have permission to create orders.' 
          };
        } else if (response.status === 422) {
          return { 
            success: false, 
            error: `Validation error: ${result.message || 'Invalid data provided'}. Please check all required fields.` 
          };
        }
        
        return { success: false, error: result.message || result.error || `API error: ${response.status} - ${JSON.stringify(result)}` };
      }

      return { 
        success: true, 
        data: result,
        tracking: result.tracking 
      };
    } catch (error) {
      console.error('Noest API network error:', error);
      
      // Check if it's a CORS error
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        return { 
          success: false, 
          error: 'CORS Error: Direct API calls are blocked by browser security. Please use a backend proxy or check your API configuration.' 
        };
      }
      
      return { success: false, error: 'Network error: ' + error.message };
    }
  }

  // Validate order in Noest API
  async validateOrder(tracking: string): Promise<NoestApiResponse> {
    const config = await this.getConfig();
    if (!config) {
      return { success: false, error: 'Noest Express API not configured' };
    }

    try {
      const response = await fetch('https://app.noest-dz.com/api/public/valid/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          API_TOKEN: config.api_token,
          tracking: tracking
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'Validation failed' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Noest validation error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Track orders
  async trackOrders(trackingNumbers: string[]): Promise<NoestApiResponse> {
    const config = await this.getConfig();
    if (!config) {
      return { success: false, error: 'Noest Express API not configured' };
    }

    try {
      const response = await fetch('https://app.noest-dz.com/api/public/get/trackings/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          API_TOKEN: config.api_token,
          trackings: trackingNumbers
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'Tracking failed' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Noest tracking error:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

export const noestApiService = new NoestApiService();

// Helper function to get wilaya ID from name
export const getWilayaId = async (wilayaName: string): Promise<number | null> => {
  const { data, error } = await supabase
    .from('wilaya_mapping')
    .select('wilaya_id')
    .eq('wilaya_name', wilayaName)
    .single();
  
  if (error) {
    console.error('Error finding wilaya ID:', error);
    return 16; // Default to Alger
  }
  
  return data.wilaya_id;
};
