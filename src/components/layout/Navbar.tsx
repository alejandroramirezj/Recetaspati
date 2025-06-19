import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Phone, ShoppingCart, Heart, User } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const instagramUrl = "https://instagram.com/recetaspati"; // Define URL once
  const tiktokUrl = "https://tiktok.com/@recetaspati_"; // AÑADIDO
  const { state, getTotalItems, resetItemAddedTimestamp } = useCart();
  const totalItems = getTotalItems();
  const [isAnimating, setIsAnimating] = useState(false); // Estado para controlar animación

  // Variables fácilmente editables para seguidores y likes
  const TIKTOK_LIKES = "106.4K"; // Actualizado: 106.4K likes y más de 3 millones de visualizaciones
  const INSTAGRAM_FOLLOWERS = "1.8K"; // Cambia este valor según los seguidores reales

  // Efecto para manejar la animación
  useEffect(() => {
    if (state.itemAddedTimestamp) {
      setIsAnimating(true); // Activar animación
      const timer = setTimeout(() => {
        setIsAnimating(false); // Desactivar animación después de un tiempo
        resetItemAddedTimestamp(); // Resetear el timestamp en el contexto
      }, 600); // Duración de la animación (ej. 600ms)

      return () => clearTimeout(timer); // Limpiar timeout si el componente se desmonta o el estado cambia
    }
  }, [state.itemAddedTimestamp, resetItemAddedTimestamp]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between lg:justify-between relative">
        {/* Logo y redes sociales alineados en la misma fila */}
        <div className="flex flex-1 items-center justify-center lg:justify-between w-full">
          <Link to="/" className="flex items-center">
            <img src="/images/Isotipo.webp" alt="Isotipo Pati Sweet Creations" className="h-12 mr-2" />
            <img src="/images/recetaspati.webp" alt="Recetas Pati Logo" className="h-10" />
          </Link>
          {/* Redes sociales siempre a la derecha del logo - HIDDEN ON MOBILE */}
          <div className="hidden lg:flex items-center gap-3 ml-2">
            <a href="https://tiktok.com/@recetaspati_" target="_blank" rel="noopener noreferrer" aria-label="TikTok Recetas Pati" className="flex items-center gap-1 rounded-full bg-pati-burgundy px-3 py-1.5 shadow-lg shadow-pati-pink/10 hover:scale-105 hover:ring-2 hover:ring-pati-pink/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pati-pink/40">
              <FaTiktok size={20} className="text-white" />
              <span className="text-xs text-white font-extrabold flex items-center gap-1">{TIKTOK_LIKES} <Heart size={14} className="inline text-pati-pink stroke-2" /></span>
            </a>
            <span className="w-2 h-2 bg-pati-pink rounded-full mx-1 hidden sm:inline-block"></span>
            <a href="https://instagram.com/recetaspati" target="_blank" rel="noopener noreferrer" aria-label="Instagram Recetas Pati" className="flex items-center gap-1 rounded-full bg-gradient-to-tr from-pati-pink via-pati-light-pink to-pati-cream px-3 py-1.5 shadow-lg shadow-pati-pink/10 hover:scale-105 hover:ring-2 hover:ring-pati-burgundy/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pati-burgundy/40">
              <Instagram size={20} className="text-pati-burgundy stroke-2" />
              <span className="text-xs text-pati-burgundy font-extrabold flex items-center gap-1">{INSTAGRAM_FOLLOWERS} <User size={14} className="inline text-pati-burgundy stroke-2" /></span>
            </a>
          </div>
        </div>
        {/* Mobile Cart Icon - Shown on mobile, hidden on large screens */}
        <Link 
          to="/pedido" 
          className={`relative flex lg:hidden items-center justify-center p-2 rounded-full hover:bg-pati-cream transition-all duration-300 ease-in-out ${isAnimating ? 'animate-bounce' : ''}`}
          aria-label={totalItems > 0 ? `Ver carrito (${totalItems} artículo${totalItems !== 1 ? 's' : ''})` : "Ver carrito (vacío)"}
        >
          <ShoppingCart className="h-6 w-6 text-pati-brown" />
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className={`absolute -top-1 -right-1 h-5 w-5 min-w-[1.25rem] p-0 flex items-center justify-center text-xs rounded-full transition-transform ${isAnimating ? 'scale-110' : ''}`}
            >
              {totalItems}
            </Badge>
          )}
        </Link>
        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6 ml-8">
          <a href="/#productos" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Productos
          </a>
          <a href="/#testimonios" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Testimonios
          </a>
          <Link 
            to="/pedido" 
            className={`relative hidden lg:flex items-center justify-center p-2 rounded-full hover:bg-pati-cream transition-all duration-300 ease-in-out ml-4 ${isAnimating ? 'animate-bounce' : ''}`}
            aria-label={totalItems > 0 ? `Ver carrito (${totalItems} artículo${totalItems !== 1 ? 's' : ''})` : "Ver carrito (vacío)"}
          >
             <ShoppingCart className="h-6 w-6 text-pati-brown" />
             {totalItems > 0 && (
                 <Badge 
                    variant="destructive" 
                    className={`absolute -top-1 -right-1 h-5 w-5 min-w-[1.25rem] p-0 flex items-center justify-center text-xs rounded-full transition-transform ${isAnimating ? 'scale-110' : ''}`}
                 >
                     {totalItems}
                 </Badge>
             )}
          </Link>
        </nav>
      </div>

      {/* Mobile menu - oculto completamente */}
      {/*
      {isOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-pati-pink py-4 px-6 shadow-lg animate-fade-in"
        >
          <nav className="flex flex-col space-y-4">
            <a 
              href="/#productos" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Productos
            </a>
            <a 
              href="/#testimonios" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Testimonios
            </a>
            <div className="flex space-x-2 pt-2">
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  <FaTiktok size={18} className="mr-2" /> TikTok
                </Button>
              </a>
               <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-pati-burgundy hover:bg-pati-brown text-white">
                  <Instagram size={18} className="mr-2" /> Instagram
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
      */}
    </header>
  );
};

export default Navbar;
