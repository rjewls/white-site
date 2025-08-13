export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME || "Belle Elle Boutique",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "Premium fashion and accessories for the modern woman",
  url: import.meta.env.VITE_SITE_URL || "https://belle-elle-boutique.netlify.app",
  
  // Contact Information
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || "contact@belleelle.com",
    phone: import.meta.env.VITE_CONTACT_PHONE || "+213XXXXXXXXX",
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "+213XXXXXXXXX",
  },

  // Social Media Links
  social: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com/belleelleboutique",
    facebook: import.meta.env.VITE_FACEBOOK_URL || "https://facebook.com/belleelleboutique",
    tiktok: import.meta.env.VITE_TIKTOK_URL || "",
    youtube: import.meta.env.VITE_YOUTUBE_URL || "",
  },

  // SEO and Meta
  seo: {
    keywords: import.meta.env.VITE_SEO_KEYWORDS || "fashion, boutique, women clothing, accessories, Algeria",
    ogImage: import.meta.env.VITE_OG_IMAGE || "/og-image.jpg",
  },

  // Business Information
  business: {
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "Algiers, Algeria",
    hours: import.meta.env.VITE_BUSINESS_HOURS || "9:00 AM - 8:00 PM",
    currency: import.meta.env.VITE_CURRENCY || "DZD",
    currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || "DZD",
  },

  // Features
  features: {
    multipleLanguages: import.meta.env.VITE_ENABLE_MULTILANG === "true",
    discordNotifications: import.meta.env.VITE_DISCORD_WEBHOOK_URL ? true : false,
    noestIntegration: true,
    cashOnDelivery: true,
  }
};
