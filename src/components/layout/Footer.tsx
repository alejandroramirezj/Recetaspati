import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  // WhatsApp details for general contact
  const phoneNumber = "34671266981";
  const message = "¡Hola Pati! 👋 Tengo una pregunta / Me gustaría hacer un pedido personalizado.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="bg-pati-cream pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img src="/images/recetaspati.webp" alt="Recetas Pati Logo" className="h-12" />
            <p className="text-pati-dark-brown">
              Dulces artesanales elaborados con todo el amor y los mejores ingredientes. Estamos en Granada, España.
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://instagram.com" 
                className="w-10 h-10 rounded-full bg-pati-burgundy text-white flex items-center justify-center hover:bg-pati-pink hover:text-pati-burgundy transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:info@recetaspati.es" 
                className="w-10 h-10 rounded-full bg-pati-burgundy text-white flex items-center justify-center hover:bg-pati-pink hover:text-pati-burgundy transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pati-burgundy text-white flex items-center justify-center hover:bg-pati-pink hover:text-pati-burgundy transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-playfair text-lg font-medium text-pati-burgundy">Navegación</h4>
            <div className="flex flex-col space-y-2">
              <a href="/#productos" className="text-pati-dark-brown hover:text-pati-burgundy transition-colors">Productos</a>
              <a href="/#testimonios" className="text-pati-dark-brown hover:text-pati-burgundy transition-colors">Testimonios</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-playfair text-lg font-medium text-pati-burgundy">Contacto</h4>
            <p className="text-pati-dark-brown">¿Tienes alguna pregunta o quieres realizar un pedido personalizado?</p>
            <Button asChild className="bg-pati-burgundy hover:bg-pati-brown text-white w-full">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Enviar mensaje
              </a>
            </Button>
          </div>
        </div>
        
        <div className="mt-12 pt-4 border-t border-pati-pink text-center text-sm text-pati-dark-brown">
          <p>© {new Date().getFullYear()} Recetas Pati. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
