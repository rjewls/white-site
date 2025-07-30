// Toast notification component
import { Toaster } from "@/components/ui/toaster";
// Alternative toast notification component
import { Toaster as Sonner } from "@/components/ui/sonner";
// Tooltip provider for UI tooltips
import { TooltipProvider } from "@/components/ui/tooltip";
// React Query for data fetching and caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// React Router for page navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Authentication provider
import { AuthProvider } from "@/contexts/AuthContext";
// Language provider
import { LanguageProvider } from "@/contexts/LanguageContext";
// Protected route component
import { ProtectedRoute } from "@/components/ProtectedRoute";
// Home page component
import Home from "./pages/Home";
// Product detail page component
import ProductDetail from "./pages/ProductDetail";
// Admin page component
import Admin from "./pages/Admin";
// Not found page component
import NotFound from "./pages/NotFound";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

// Main App component that sets up providers and routes
const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
