import { Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define URLs
const whatsappUrl = "https://wa.me/34671266981"; // Use the number from previous steps
const instagramUrl = "https://instagram.com/recetaspati"; // From previous context
const tiktokUrl = "https://tiktok.com/@recetaspati_"; // Found in TikTokFeed.tsx

const ContactSection = () => {
  return (
    <section id="contacto" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Ponte en contacto con nosotros</h2>
          <p className="text-pati-brown mb-10">
            ¿Quieres hacer un pedido o tienes alguna pregunta? Estamos aquí para ayudarte.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#1DAA54] text-white">
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
              </Button>
            </a>

            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#E4405F] hover:bg-[#C13584] text-white">
                <Instagram className="mr-2 h-5 w-5" /> Instagram
              </Button>
            </a>

            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-black hover:bg-gray-800 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.19-.01-4.8 0-2.16-1.2-4.06-2.94-4.86h-3.02v16.61c0 2.3-.94 4.3-2.48 5.76-1.53 1.45-3.61 2.14-5.83 2.02-2.18-.12-4.13-.96-5.53-2.48-1.4-1.53-2.05-3.53-1.9-5.71.14-2.1.97-3.96 2.4-5.37 1.47-1.45 3.5-2.1 5.65-1.95.02 1.59.02 3.18.01 4.78-.01 1.9.9 3.59 2.32 4.74 1.44 1.13 3.35 1.52 5.08 1.27v-4.1a4.96 4.96 0 0 1-2.25-.46v-4.87c.01-.16.01-.32.02-.48.01-.09.01-.18.02-.27z"/></svg>
                TikTok
              </Button>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
