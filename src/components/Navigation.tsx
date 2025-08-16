// UI button component
import { Button } from "@/components/ui/button";
// Link component for navigation
import { Link } from "react-router-dom";
// Icon components
import { ShoppingBag } from "lucide-react";
// Language hook
import { useLanguage } from "@/hooks/useLanguage";

// Main Navigation component for the top bar
export const Navigation = () => {
  const { t } = useLanguage();
  
  // Main render for navigation bar
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <ShoppingBag className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
              <div className="absolute inset-0 bg-blue-300/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span 
              className="font-playfair font-bold text-2xl bg-gradient-to-r from-gray-800 via-blue-600 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-gray-700 group-hover:to-blue-500 transition-all duration-300 antialiased"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              Running Store
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};