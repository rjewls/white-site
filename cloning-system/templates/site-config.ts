interface SiteConfig {
  name: string;
  description: string;
  url: string;
  business: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
  };
  features?: {
    enableDiscordNotifications?: boolean;
    enableGoogleAnalytics?: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: import.meta.env.VITE_SITE_NAME || "Belle Elle Boutique",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "Premium fashion and accessories",
  url: import.meta.env.VITE_SITE_URL || "https://belle-elle-boutique.netlify.app",
  business: {
    name: import.meta.env.VITE_BUSINESS_NAME || "Belle Elle",
    email: import.meta.env.VITE_BUSINESS_EMAIL || "contact@belle-elle.com",
    phone: import.meta.env.VITE_BUSINESS_PHONE || "+213-XXX-XXX-XXX",
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "Algiers, Algeria"
  },
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL,
    instagram: import.meta.env.VITE_INSTAGRAM_URL,
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER
  },
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID
  },
  features: {
    enableDiscordNotifications: !!import.meta.env.VITE_DISCORD_WEBHOOK_URL,
    enableGoogleAnalytics: !!import.meta.env.VITE_GOOGLE_ANALYTICS_ID
  }
};

// Utility functions
export const getBusinessWhatsAppLink = (message?: string) => {
  if (!siteConfig.social.whatsapp) return null;
  const cleanNumber = siteConfig.social.whatsapp.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

export const getSocialLinks = () => {
  return Object.entries(siteConfig.social)
    .filter(([key, value]) => value)
    .map(([platform, url]) => ({ platform, url }));
};

export const isFeatureEnabled = (feature: keyof NonNullable<SiteConfig['features']>) => {
  return siteConfig.features?.[feature] || false;
};
