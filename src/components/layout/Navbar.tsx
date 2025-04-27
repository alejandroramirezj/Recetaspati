import { useState } from 'react';
import { Menu, X, Instagram, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const instagramUrl = "https://instagram.com/recetaspati"; // Define URL once

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          {/* Replaced image with styled text */}
          <span className="font-playfair text-2xl font-bold text-pati-burgundy">
            Recetas Pati
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md text-pati-brown hover:bg-pati-cream"
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
          <a href="/Recetaspati/#dia-madre" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Día de la Madre
          </a>
          <a href="/Recetaspati/#contacto" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Contacto
          </a>
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
        <div className="lg:hidden bg-white border-t border-pati-pink py-4 px-6 shadow-lg animate-fade-in">
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
            <a 
              href="/Recetaspati/#dia-madre" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Día de la Madre
            </a>
            <a 
              href="/Recetaspati/#contacto" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Contacto
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
