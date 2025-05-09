import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Phone, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const instagramUrl = "https://instagram.com/recetaspati"; // Define URL once
  const { state, getTotalItems, resetItemAddedTimestamp } = useCart();
  const totalItems = getTotalItems();
  const [isAnimating, setIsAnimating] = useState(false); // Estado para controlar animación

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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          {/* Replaced image with styled text */}
          <img src="/Recetaspati/images/recetaspati.png" alt="Recetas Pati Logo" className="h-10" />
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md text-pati-brown hover:bg-pati-cream"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <a href="/Recetaspati/#productos" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Productos
          </a>
          <a href="/Recetaspati/#testimonios" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
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
          {/* Wrap Button in an anchor tag for external link */}
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-pati-burgundy hover:bg-pati-brown text-white ml-2 flex items-center gap-2">
              <Instagram size={18} /> Seguir
            </Button>
          </a>
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-pati-pink py-4 px-6 shadow-lg animate-fade-in"
        >
          <nav className="flex flex-col space-y-4">
            {/* Use anchor tags for section links for smoother scrolling */}
            <a 
              href="/Recetaspati/#productos" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Productos
            </a>
            <a 
              href="/Recetaspati/#testimonios" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Testimonios
            </a>
            <div className="flex space-x-2 pt-2">
              {/* Phone Button (Assuming it should be a link) */}
              <a href="tel:+34600000000" className="flex-1">
                <Button className="w-full bg-pati-pink hover:bg-pati-burgundy text-pati-burgundy hover:text-white border border-pati-burgundy">
                  <Phone size={18} className="mr-2" /> Llamar
                </Button>
              </a>
              {/* Instagram Button */}
               <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-pati-burgundy hover:bg-pati-brown text-white">
                  <Instagram size={18} className="mr-2" /> Instagram
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
