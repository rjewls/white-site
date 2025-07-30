import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 min-w-[100px]"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'en' ? t('lang.arabic') : t('lang.english')}
      </span>
    </Button>
  );
};
