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
    'hero.subtitle': 'Premium Running & Athletic Footwear',
    'hero.title1': 'Step Into',
    'hero.title2': 'Performance',
    'hero.description': 'Discover our curated collection of premium running shoes and athletic footwear. From marathon training to daily comfort, find the perfect pair to elevate your every step.',
    'hero.shopCollection': 'Shop Shoes',
    'hero.learnMore': 'Learn More',
    'hero.happyCustomers': 'Happy Runners',
    'hero.fastDelivery': 'Fast Delivery',
    'hero.codPayment': 'Cash on Delivery',
    'hero.satisfaction': 'Satisfaction',
    
    // Featured Collection
    'featured.title': 'Featured Running Shoes',
    'featured.subtitle': 'Handpicked athletic footwear that combines cutting-edge technology with unmatched comfort',
    'featured.viewAll': 'View All Shoes',
    
    // Service Features
    'service.title': 'Why Choose Our Running Store',
    'service.subtitle': 'We\'re committed to providing you with the perfect footwear for every step of your journey',
    'service.fastDelivery': 'Fast Delivery',
    'service.fastDeliveryDesc': 'Get your new running shoes delivered within 24-48 hours. Start your next run with the perfect footwear.',
    'service.cod': 'Cash on Delivery',
    'service.codDesc': 'Zero advance payment required. Try your shoes and pay only when you receive your order.',
    'service.exchange': 'Perfect Fit Guarantee',
    'service.exchangeDesc': 'Easy returns and exchanges to ensure the perfect fit. Your comfort is our top priority.',
    'service.trusted': 'Trusted by 1000+ runners',
    'service.authentic': '100% Authentic athletic shoes',
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
    'footer.brandDesc': 'Your premier destination for premium running shoes and athletic footwear. We curate high-performance shoes that enhance your comfort and support your active lifestyle.',
    'footer.quickLinks': 'Quick Links',
    'footer.customerCare': 'Customer Care',
    'footer.newsletter': 'Stay Active',
    'footer.newsletterDesc': 'Subscribe to our newsletter for exclusive offers, running tips, and new shoe arrivals.',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.copyright': '© 2025 Running Store. All rights reserved.',
    'footer.designedWith': 'Designed with ❤️ for runners and athletes',
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
    'hero.subtitle': 'أحذية جري ورياضية متميزة',
    'hero.title1': 'ادخل إلى',
    'hero.title2': 'عالم الأداء',
    'hero.description': 'اكتشف مجموعتنا المنتقاة من أحذية الجري المتميزة والأحذية الرياضية. من تدريبات الماراثون إلى الراحة اليومية، اعثر على الحذاء المثالي لترتقي بكل خطوة.',
    'hero.shopCollection': 'تسوق الأحذية',
    'hero.learnMore': 'اعرف المزيد',
    'hero.happyCustomers': 'عداء سعيد',
    'hero.fastDelivery': 'توصيل سريع',
    'hero.codPayment': 'الدفع عند الاستلام',
    'hero.satisfaction': 'رضا العملاء',
    
    // Featured Collection
    'featured.title': 'أحذية الجري المميزة',
    'featured.subtitle': 'أحذية رياضية منتقاة بعناية تجمع بين أحدث التقنيات والراحة المطلقة',
    'featured.viewAll': 'عرض جميع الأحذية',
    
    // Service Features
    'service.title': 'لماذا تختار متجر الجري لدينا',
    'service.subtitle': 'نحن ملتزمون بتقديم الأحذية المثالية لكل خطوة في رحلتك',
    'service.fastDelivery': 'توصيل سريع',
    'service.fastDeliveryDesc': 'احصل على أحذية الجري الجديدة خلال 24-48 ساعة. ابدأ جريك التالي بالأحذية المثالية.',
    'service.cod': 'الدفع عند الاستلام',
    'service.codDesc': 'لا يتطلب دفع مقدم. جرب أحذيتك وادفع فقط عند استلام طلبك.',
    'service.exchange': 'ضمان المقاس المثالي',
    'service.exchangeDesc': 'إرجاع واستبدال سهل لضمان المقاس المثالي. راحتك هي أولويتنا القصوى.',
    'service.trusted': 'موثوق من قبل أكثر من 1000 عداء',
    'service.authentic': 'أحذية رياضية أصلية 100%',
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
