import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    // Use a standard background, adjust padding and alignment for two columns
    <div className="bg-gradient-to-br from-pati-light-pink via-white to-pati-cream py-20 md:py-28">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5 lg:space-y-6 lg:order-1">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-pati-burgundy leading-tight">
            Recetas Pati
          </h1>
          <div className="flex justify-center lg:justify-start mt-4 mb-2">
            <img 
              src="/Recetaspati/images/Isotipo.png"
              alt="Isotipo Pati Sweet Creations" 
              className="h-16 w-auto"
            />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl text-pati-dark-brown max-w-xl mx-auto lg:mx-0 font-medium">
            Dulces para sorprender a tus amigos, invitados, madre o para darte un capricho a ti.
          </h2>
          {/* Buttons below text */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start pt-4">
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
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Hacer un pedido
            </Button>
          </div>
          {/* Added Location and Social Proof with Icons */}
          <div className="pt-8 text-center lg:text-left space-y-3"> 
            <p className="flex items-center justify-center lg:justify-start gap-2 text-base md:text-lg text-pati-brown font-semibold">
              <MapPin className="h-5 w-5 text-pati-burgundy flex-shrink-0" /> 
              <span>Solo pedidos Granada ciudad y alrededores</span>
            </p>
            <p className="flex items-center justify-center lg:justify-start gap-2 text-sm md:text-base text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              <span>¡Endulzando momentos para más de 500 clientes felices!</span>
            </p>
          </div>
        </div>

        {/* Right Column: Video */}
        <div className="w-full lg:w-1/2 lg:order-2 flex justify-center">
          <div className="aspect-[9/16] w-full max-w-sm md:max-w-md bg-white rounded-lg shadow-xl overflow-hidden border-4 border-white">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
              poster="/Recetaspati/placeholder.svg" // Add base path to poster too
            >
              <source src="/Recetaspati/videos/Galletas.mp4" type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
          </div>
        </div>

      </div>
       {/* Removed Badges section from Hero */}
    </div>
  );
};

export default Hero;
