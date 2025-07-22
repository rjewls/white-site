import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Settings } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="font-playfair font-semibold text-2xl text-foreground">
              Rosebud Boutique
            </span>
          </Link>
          <Link to="/admin">
            <Button variant="admin" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};