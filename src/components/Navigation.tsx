// UI button component
import { Button } from "@/components/ui/button";
// Link component for navigation
import { Link } from "react-router-dom";
// Icon components
import { ShoppingBag, Settings } from "lucide-react";

// Main Navigation component for the top bar
export const Navigation = () => {
  // Main render for navigation bar
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-rose-100/95 via-pink-50/95 to-purple-100/95 backdrop-blur-lg border-b border-rose-200/30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <ShoppingBag className="h-8 w-8 text-rose-500 group-hover:text-pink-600 transition-colors duration-300" />
              <div className="absolute inset-0 bg-pink-300/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span 
              className="font-playfair font-bold text-2xl bg-gradient-to-r from-rose-700 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg group-hover:from-pink-600 group-hover:via-rose-500 group-hover:to-purple-500 transition-all duration-300"
              style={{
                textShadow: '0 0 10px rgba(236, 72, 153, 0.3)'
              }}
            >
              Belle Elle Boutique
            </span>
          </Link>
          <Link to="/admin">
            <Button 
              variant="admin" 
              size="sm" 
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};