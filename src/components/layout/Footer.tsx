import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SquatMiniGame from './SquatMiniGame';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  // WhatsApp details for general contact
  const phoneNumber = "34671266981";
  const message = "¡Hola Pati! 👋 Tengo una pregunta / Me gustaría hacer un pedido personalizado.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const tiktokUrl = "https://tiktok.com/@recetaspati_";

  return (
    <footer className="bg-pati-cream py-6">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center mb-2">
          <img src="/images/Isotipo.webp" alt="Isotipo Recetas Pati" className="h-8 mr-2" />
          <img src="/images/recetaspati.webp" alt="Recetas Pati Logo" className="h-8" />
        </div>

        {/* Mensaje divertido del footer */}
        <p className="text-center text-pati-brown text-sm md:text-base italic max-w-md mt-4 mb-4">
          ¡Deja de deslizar hacia abajo! Esto no es TikTok, aquí se viene a ver y, sobre todo, a ¡pedir postres ricos! 🍪 Si no, me los acabo comiendo yo todos y no tengo horas para quemar esas calorías. 😅
        </p>

        {/* Mini-game Integration */}
        <SquatMiniGame />

        <div className="flex space-x-4">
          <a 
            href="https://instagram.com/recetaspati" 
            className="w-9 h-9 rounded-full bg-pati-burgundy text-white flex items-center justify-center hover:bg-pati-pink hover:text-pati-burgundy transition-colors"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={18} />
          </a>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-pati-burgundy text-white flex items-center justify-center hover:bg-pati-pink hover:text-pati-burgundy transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
          <a 
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-pati-burgundy text-white flex items-center justify-center hover:bg-pati-pink hover:text-pati-burgundy transition-colors"
            aria-label="TikTok"
          >
            <FaTiktok size={18} />
          </a>
        </div>
        <div className="mt-3 flex flex-col items-center gap-1 text-xs text-pati-brown">
          <span>© {new Date().getFullYear()} Recetas Pati</span>
          <div className="flex gap-2">
            <a href="/privacidad" className="underline hover:text-pati-burgundy transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
