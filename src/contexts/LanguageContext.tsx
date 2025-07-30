import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export { LanguageContext };

// Translation keys and values
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    
    // Hero Section
    'hero.subtitle': 'Premium Fashion Collection',
    'hero.title1': 'Discover Your',
    'hero.title2': 'Perfect Style',
    'hero.description': 'Curated collection of elegant women\'s fashion that celebrates your unique beauty. From timeless classics to contemporary trends, find pieces that speak to your soul.',
    'hero.shopCollection': 'Shop Collection',
    'hero.learnMore': 'Learn More',
    'hero.happyCustomers': 'Happy Customers',
    'hero.fastDelivery': 'Fast Delivery',
    'hero.codPayment': 'Cash on Delivery',
    'hero.satisfaction': 'Satisfaction',
    
    // Featured Collection
    'featured.title': 'Featured Collection',
    'featured.subtitle': 'Handpicked pieces that blend timeless elegance with contemporary style',
    'featured.viewAll': 'View All Collection',
    
    // Service Features
    'service.title': 'Why Choose Belle Elle Boutique',
    'service.subtitle': 'We\'re committed to providing you with an exceptional shopping experience that goes beyond just fashion',
    'service.fastDelivery': 'Fast Delivery',
    'service.fastDeliveryDesc': 'Lightning-fast delivery within 24 to 48 hours. Your dream pieces are just a day away from your wardrobe.',
    'service.cod': 'Cash on Delivery',
    'service.codDesc': 'Zero advance payment required. Shop with complete confidence and pay only when you receive your order.',
    'service.exchange': 'Easy Exchange',
    'service.exchangeDesc': 'Hassle-free returns and exchanges. Your satisfaction is our promise, guaranteed with every purchase.',
    'service.trusted': 'Trusted by 1000+ customers',
    'service.authentic': '100% Authentic products',
    'service.support': '24/7 Customer support',
    
    // Admin Dashboard
    'admin.dashboard': 'Admin Dashboard',
    'admin.welcome': 'Welcome back,',
    'admin.addProduct': 'Add New Product',
    'admin.logout': 'Logout',
    'admin.editProduct': 'Edit Product',
    'admin.noProducts': 'No products found. Add your first product to get started!',
    
    // Product Form
    'form.productTitle': 'Product Title',
    'form.price': 'Price (DZD)',
    'form.productImages': 'Product Images',
    'form.description': 'Description',
    'form.colors': 'Colors',
    'form.sizes': 'Sizes',
    'form.saveProduct': 'Save Product',
    'form.cancel': 'Cancel',
    'form.addColor': 'Add a preset color...',
    'form.addCustom': 'Add Custom',
    'form.addSize': 'Add size (e.g., XS, S, M, L, XL)',
    'form.noColors': 'No colors selected',
    'form.noSizes': 'No sizes selected',
    'form.required': '*',
    
    // Product Card
    'card.quickOrder': 'Quick Order',
    'card.colors': 'Colors',
    'card.sizes': 'Sizes',
    'card.reviews': 'reviews',
    
    // Footer
    'footer.brandDesc': 'Your premier destination for elegant women\'s fashion. We curate timeless pieces that celebrate your unique style and enhance your natural beauty.',
    'footer.quickLinks': 'Quick Links',
    'footer.customerCare': 'Customer Care',
    'footer.newsletter': 'Stay in Style',
    'footer.newsletterDesc': 'Subscribe to our newsletter for exclusive offers, style tips, and new arrivals.',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.copyright': '© 2025 Belle Elle Boutique. All rights reserved.',
    'footer.designedWith': 'Designed with ❤️ for women who love fashion',
    'footer.secureShoppingDescription': 'Secure Shopping',
    
    // Common
    'common.price': 'Price',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Product Detail
    'detail.selectColor': 'Select Color',
    'detail.selectSize': 'Select Size',
    'detail.quantity': 'Quantity',
    'detail.orderNow': 'Order Now',
    'detail.description': 'Description',
    'detail.reviews': 'Reviews',
    'detail.rating': 'Rating',
    
    // Language Switcher
    'lang.english': 'English',
    'lang.arabic': 'العربية',
    'lang.language': 'Language'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.admin': 'الإدارة',
    'nav.login': 'تسجيل الدخول',
    
    // Hero Section
    'hero.subtitle': 'مجموعة أزياء راقية',
    'hero.title1': 'اكتشفي',
    'hero.title2': 'أناقتك المثالية',
    'hero.description': 'مجموعة منتقاة من الأزياء النسائية الأنيقة التي تحتفي بجمالك الفريد. من الكلاسيكيات الخالدة إلى أحدث الصيحات، اعثري على القطع التي تعبر عن روحك.',
    'hero.shopCollection': 'تسوقي المجموعة',
    'hero.learnMore': 'اعرفي المزيد',
    'hero.happyCustomers': 'عميلة سعيدة',
    'hero.fastDelivery': 'توصيل سريع',
    'hero.codPayment': 'الدفع عند الاستلام',
    'hero.satisfaction': 'رضا العملاء',
    
    // Featured Collection
    'featured.title': 'المجموعة المميزة',
    'featured.subtitle': 'قطع منتقاة بعناية تجمع بين الأناقة الخالدة والطراز العصري',
    'featured.viewAll': 'عرض كامل المجموعة',
    
    // Service Features
    'service.title': 'لماذا تختارين بيل إيل بوتيك',
    'service.subtitle': 'نحن ملتزمون بتقديم تجربة تسوق استثنائية تتجاوز مجرد الأزياء',
    'service.fastDelivery': 'توصيل سريع',
    'service.fastDeliveryDesc': 'توصيل سريع خلال 24 إلى 48 ساعة. قطعك المفضلة على بعد يوم واحد من خزانة ملابسك.',
    'service.cod': 'الدفع عند الاستلام',
    'service.codDesc': 'لا يتطلب دفع مقدم. تسوقي بثقة تامة وادفعي فقط عند استلام طلبك.',
    'service.exchange': 'استبدال سهل',
    'service.exchangeDesc': 'إرجاع واستبدال بلا متاعب. رضاك هو وعدنا، مضمون مع كل عملية شراء.',
    'service.trusted': 'موثوقة من قبل أكثر من 1000 عميلة',
    'service.authentic': 'منتجات أصلية 100%',
    'service.support': 'دعم العملاء على مدار الساعة',
    
    // Admin Dashboard
    'admin.dashboard': 'لوحة الإدارة',
    'admin.welcome': 'مرحباً بعودتك،',
    'admin.addProduct': 'إضافة منتج جديد',
    'admin.logout': 'تسجيل الخروج',
    'admin.editProduct': 'تعديل المنتج',
    'admin.noProducts': 'لم يتم العثور على منتجات. أضيفي منتجك الأول للبدء!',
    
    // Product Form
    'form.productTitle': 'عنوان المنتج',
    'form.price': 'السعر (دج)',
    'form.productImages': 'صور المنتج',
    'form.description': 'الوصف',
    'form.colors': 'الألوان',
    'form.sizes': 'المقاسات',
    'form.saveProduct': 'حفظ المنتج',
    'form.cancel': 'إلغاء',
    'form.addColor': 'أضيفي لون محدد مسبقاً...',
    'form.addCustom': 'إضافة مخصص',
    'form.addSize': 'أضيفي مقاس (مثل: XS, S, M, L, XL)',
    'form.noColors': 'لم يتم اختيار ألوان',
    'form.noSizes': 'لم يتم اختيار مقاسات',
    'form.required': '*',
    
    // Product Card
    'card.quickOrder': 'طلب سريع',
    'card.colors': 'الألوان',
    'card.sizes': 'المقاسات',
    'card.reviews': 'تقييم',
    
    // Footer
    'footer.brandDesc': 'وجهتك الرائدة للأزياء النسائية الأنيقة. نحن ننتقي القطع الخالدة التي تحتفي بأسلوبك الفريد وتعزز جمالك الطبيعي.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.customerCare': 'خدمة العملاء',
    'footer.newsletter': 'ابقي أنيقة',
    'footer.newsletterDesc': 'اشتركي في نشرتنا الإخبارية للحصول على عروض حصرية ونصائح الأناقة والوافدات الجديدة.',
    'footer.subscribe': 'اشتراك',
    'footer.emailPlaceholder': 'أدخلي بريدك الإلكتروني',
    'footer.copyright': '© 2025 بيل إيل بوتيك. جميع الحقوق محفوظة.',
    'footer.designedWith': 'صُمم بـ ❤️ للنساء اللواتي يحببن الأزياء',
    'footer.secureShoppingDescription': 'تسوق آمن',
    
    // Common
    'common.price': 'السعر',
    'common.add': 'إضافة',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.save': 'حفظ',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    
    // Product Detail
    'detail.selectColor': 'اختاري اللون',
    'detail.selectSize': 'اختاري المقاس',
    'detail.quantity': 'الكمية',
    'detail.orderNow': 'اطلبي الآن',
    'detail.description': 'الوصف',
    'detail.reviews': 'التقييمات',
    'detail.rating': 'التقييم',
    
    // Language Switcher
    'lang.english': 'English',
    'lang.arabic': 'العربية',
    'lang.language': 'اللغة'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
