import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    // Simplified background, reduced padding, centered single column
    <div className="bg-gradient-to-br from-pati-light-pink via-white to-pati-cream py-16 md:py-20">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        
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

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-pati-burgundy leading-tight">
            Recetas Pati
          </h1>
          
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
