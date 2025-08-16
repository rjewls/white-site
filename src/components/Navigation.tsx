// UI button component
import { Button } from "@/components/ui/button";
// Link component for navigation
import { Link } from "react-router-dom";
// Language hook
import { useLanguage } from "@/hooks/useLanguage";

// Custom Running Footprint Icon Component
const RunningFootprintIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main footprint shape */}
    <ellipse cx="8" cy="12" rx="3" ry="6" fill="currentColor" opacity="0.9" />
    
    {/* Toe prints */}
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="8" cy="5.5" r="0.8" fill="currentColor" />
    <circle cx="10" cy="6" r="0.7" fill="currentColor" />
    <circle cx="11.5" cy="6.5" r="0.6" fill="currentColor" />
    
    {/* Second footprint (offset for running motion) */}
    <ellipse cx="16" cy="16" rx="2.5" ry="5" fill="currentColor" opacity="0.6" />
    <circle cx="14.5" cy="11" r="0.8" fill="currentColor" opacity="0.6" />
    <circle cx="16" cy="10.5" r="0.7" fill="currentColor" opacity="0.6" />
    <circle cx="17.5" cy="11" r="0.6" fill="currentColor" opacity="0.6" />
    
    {/* Motion lines for running effect */}
    <path d="M4 20 L7 19 M19 8 L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

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
              <RunningFootprintIcon className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
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