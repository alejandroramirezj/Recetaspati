import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from './utils/ScrollToTop';
import { CartProvider } from './context/CartContext';
import MobileCartBar from './components/layout/MobileCartBar';

const queryClient = new QueryClient();

// Define the base path
const baseName = "/Recetaspati";

// Componente interno para manejar la redirección de sessionStorage
const SpaRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath && redirectPath !== location.pathname + location.search + location.hash) {
      sessionStorage.removeItem('redirect');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, location]);

  return null; // Este componente no renderiza nada
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter basename={baseName}>
          <ScrollToTop />
          <SpaRedirectHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="product/:category/:id" element={<ProductDetail />} />
            <Route path="category/:categoryName" element={<CategoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileCartBar />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
