import { supabase } from './supabaseClient';
import axios, { AxiosResponse } from 'axios';

interface NoestExpressConfig {
  api_token: string;
  guid: string;
}

interface NoestOrderData {
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
      api_token: config.api_token,
      user_guid: config.guid,
      reference: `ORDER-${Date.now()}`,
      client: orderData.client,
      phone: orderData.phone,
      phone_2: orderData.phone_2 || '',        adresse: orderData.adresse,
        wilaya_id: orderData.wilaya_id,
        commune: orderData.commune, // Must be exactly spelled as per Noest database
        montant: orderData.montant,
      remarque: orderData.remarque || '',
      produit: orderData.produit,
      type_id: orderData.type_id,
      poids: orderData.poids,
      stop_desk: orderData.stop_desk,
      station_code: orderData.station_code || '',
      stock: orderData.stock || 0,
      quantite: orderData.quantite || '1',
      can_open: orderData.can_open || 0
    };

    console.log('Request payload structure:', {
      hasApiToken: !!requestData.api_token,
      apiTokenLength: requestData.api_token?.length,
      apiTokenIsValid: requestData.api_token && requestData.api_token.trim().length > 0,
      hasUserGuid: !!requestData.user_guid,
      reference: requestData.reference,
      client: requestData.client,
      phone: requestData.phone,
      wilaya_id: requestData.wilaya_id,
      commune: requestData.commune,
      montant: requestData.montant,
      type_id: requestData.type_id,
      requestKeys: Object.keys(requestData)
    });
    
    console.log('Full request data (api_token masked):', {
      ...requestData,
      api_token: requestData.api_token ? `${requestData.api_token.substring(0, 10)}...` : 'MISSING'
    });

    try {
      console.log('Making API request to:', 'https://app.noest-dz.com/api/public/create/order');
      
      const response = await axios.post(
        'https://app.noest-dz.com/api/public/create/order',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );

      console.log('Noest API response status:', response.status);
      console.log('Noest API response headers:', response.headers);
      console.log('Noest API response body:', response.data);

      // Check if response matches expected format
      if (!response.data || typeof response.data !== 'object') {
        console.error('Invalid response format:', response.data);
        return { success: false, error: 'Invalid response format from Noest API' };
      }

      // Check for success flag
      if (response.data.success !== true) {
        console.error('Noest API Error Details:', {
          success: response.data.success,
          message: response.data.message,
          error: response.data.error,
          fullResponse: response.data
        });
        return { success: false, error: response.data.message || response.data.error || 'Unknown API error' };
      }

      // Check for tracking number
      if (!response.data.tracking || typeof response.data.tracking !== 'string') {
        console.error('Noest API response missing or invalid tracking number:', response.data);
        return { success: false, error: 'Noest API response missing or invalid tracking number' };
      }

      console.log('Order created successfully! Tracking number:', response.data.tracking);

      return { 
        success: true, 
        data: response.data,
        tracking: response.data.tracking 
      };
    } catch (error) {
      console.error('Noest API error:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });

        // Provide specific error messages based on common issues
        if (error.response?.status === 401) {
          return { 
            success: false, 
            error: 'Authentication failed. Please check your API Token and GUID in the admin panel.' 
          };
        } else if (error.response?.status === 403) {
          return { 
            success: false, 
            error: 'Access forbidden. Your API credentials may not have permission to create orders.' 
          };
        } else if (error.response?.status === 422) {
          return { 
            success: false, 
            error: `Validation error: ${error.response.data?.message || 'Invalid data provided'}. Please check all required fields.` 
          };
        }
        
        // Try to get a more detailed error message
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message;
        return { success: false, error: `API request failed: ${errorMessage}` };
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
      const response = await axios.post(
        'https://app.noest-dz.com/api/public/valid/order',
        {
          api_token: config.api_token,
          user_guid: config.guid,
          tracking: tracking
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Noest validation error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        return { success: false, error: errorMessage };
      }
      
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
      const response = await axios.post(
        'https://app.noest-dz.com/api/public/get/trackings/info',
        {
          api_token: config.api_token,
          user_guid: config.guid,
          trackings: trackingNumbers
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Noest tracking error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        return { success: false, error: errorMessage };
      }
      
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
