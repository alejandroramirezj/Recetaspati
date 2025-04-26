
import { useState } from 'react';
import { Menu, X, Instagram, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <h1 className="text-2xl font-playfair font-bold text-pati-burgundy">Recetas Pati</h1>
        </a>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md text-pati-brown hover:bg-pati-cream"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <a href="#productos" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Productos
          </a>
          <a href="#testimonios" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Testimonios
          </a>
          <a href="#dia-madre" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Día de la Madre
          </a>
          <a href="#contacto" className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors">
            Contacto
          </a>
          <Button className="bg-pati-burgundy hover:bg-pati-brown text-white ml-2 flex items-center gap-2">
            <Instagram size={18} /> Seguir
          </Button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-pati-pink py-4 px-6 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#productos" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Productos
            </a>
            <a 
              href="#testimonios" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Testimonios
            </a>
            <a 
              href="#dia-madre" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Día de la Madre
            </a>
            <a 
              href="#contacto" 
              className="text-pati-dark-brown hover:text-pati-burgundy font-medium transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </a>
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1 bg-pati-pink hover:bg-pati-burgundy text-pati-burgundy hover:text-white border border-pati-burgundy">
                <Phone size={18} className="mr-2" /> Llamar
              </Button>
              <Button className="flex-1 bg-pati-burgundy hover:bg-pati-brown text-white">
                <Instagram size={18} className="mr-2" /> Instagram
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
