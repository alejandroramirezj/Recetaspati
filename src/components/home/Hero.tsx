import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define interface for a falling cookie
interface FallingCookie {
  id: number;
  imageUrl: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number; // For scaling
}

const Hero = () => {
  const [cookies, setCookies] = useState<FallingCookie[]>([]);
  const cookieImages = ['/Recetaspati/images/minicookie1.png', '/Recetaspati/images/minicookie2.png', '/Recetaspati/images/minicookie3.png'];
  const numCookies = 30; // Adjust number of cookies

  useEffect(() => {
    const generatedCookies: FallingCookie[] = [];
    for (let i = 0; i < numCookies; i++) {
      generatedCookies.push({
        id: i,
        imageUrl: cookieImages[Math.floor(Math.random() * cookieImages.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 8 + 7}s`, // 7s to 15s
        animationDelay: `${Math.random() * 10}s`, // 0s to 10s delay
        size: Math.random() * 0.5 + 0.7 // Scale between 0.7 and 1.2
      });
    }
    setCookies(generatedCookies);
  }, []);

  return (
    // ADDED: relative and overflow-hidden
    <div className="relative overflow-hidden bg-gradient-to-br from-pati-light-pink via-white to-pati-cream py-16 md:py-20">
      {/* ADDED: Cookie Animation Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {cookies.map((cookie) => (
          <img
            key={cookie.id}
            src={cookie.imageUrl}
            alt=""
            className="absolute top-[-10%] animate-fall opacity-70"
            style={{
              left: cookie.left,
              width: `${20 * cookie.size}px`, // Base size 20px, scaled
              height: `${20 * cookie.size}px`,
              animationDuration: cookie.animationDuration,
              animationDelay: cookie.animationDelay,
              transform: 'translateY(0%)', // Initial position above screen
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Main content with higher z-index */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Centered Text Content */} 
        <div className="w-full max-w-3xl space-y-6"> {/* Increased max-width slightly */}
          
          {/* Isotipo moved above H1 and enlarged */} 
          <div className="mb-4"> {/* Removed flex for simple centering */}
            <img 
              src="/Recetaspati/images/Isotipo.png"
              alt="Isotipo Pati Sweet Creations" 
              className="h-20 md:h-24 w-auto mx-auto" // Increased size and centered with mx-auto
            />
          </div>

          {/* REEMPLAZAR H1 CON IMAGEN DEL LOGO */}
          <div className="mb-6"> {/* Añadido margen inferior si es necesario */} 
            <img 
              src="/Recetaspati/images/recetaspati.png" 
              alt="Recetas Pati Logo" 
              className="h-16 md:h-20 w-auto mx-auto" // Ajusta la altura según sea necesario, y centra con mx-auto
            />
          </div>
          
          <h2 className="text-lg sm:text-xl md:text-2xl text-pati-dark-brown max-w-xl mx-auto font-medium">
            Dulces para sorprender a tus amigos, invitados, madre o para darte un capricho a ti.
          </h2>
          
          {/* Buttons centered */} 
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-3 text-base md:text-lg shadow-md"
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-pati-burgundy text-pati-burgundy hover:bg-pati-pink px-8 py-3 text-base md:text-lg shadow-md"
              onClick={() => document.getElementById('recomendador')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Hacer un pedido
            </Button>
          </div>
          
          {/* Social proof removed from Hero */}
        </div>

        {/* Video Column Removed */}

      </div>
    </div>
  );
};

export default Hero;
