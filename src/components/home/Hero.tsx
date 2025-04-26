
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pati-light-pink to-pati-cream pb-10">
      <div className="container mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24 flex flex-col md:flex-row items-center">
        {/* Hero content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pati-burgundy leading-tight">
            Dulces artesanos con amor
          </h1>
          <p className="text-lg md:text-xl text-pati-dark-brown max-w-lg">
            Tartas, galletas y dulces caseros elaborados con productos de primera calidad. El sabor auténtico que recordarás.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button className="bg-pati-burgundy hover:bg-pati-brown text-white px-6 py-6 text-lg">
              Ver productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-pati-burgundy text-pati-burgundy hover:bg-pati-pink px-6 py-6 text-lg">
              Hacer un pedido
            </Button>
          </div>
        </div>
        
        {/* Hero image */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
          <div className="relative rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto border-8 border-white shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
              alt="Deliciosos dulces artesanos de Recetas Pati" 
              className="object-cover w-full h-full"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-pati-pink opacity-60 blur-md"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-pati-burgundy opacity-30 blur-md"></div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 -mt-6 md:-mt-12">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-pati-burgundy font-bold text-2xl md:text-3xl">100%</p>
            <p className="text-pati-brown text-sm md:text-base">Artesanal</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-pati-burgundy font-bold text-2xl md:text-3xl">+500</p>
            <p className="text-pati-brown text-sm md:text-base">Clientes felices</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-pati-burgundy font-bold text-2xl md:text-3xl">24h</p>
            <p className="text-pati-brown text-sm md:text-base">Elaboración fresca</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-pati-burgundy font-bold text-2xl md:text-3xl">Granada</p>
            <p className="text-pati-brown text-sm md:text-base">Entrega local</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
