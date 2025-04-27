import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

// Example images - replace with actual relevant image paths or placeholders
const feedImages = [
  "/lovable-uploads/Caja galletas 6.png",
  "/lovable-uploads/Galleta-Kinderbueno.png",
  "/lovable-uploads/Bundcake.JPG",
  "/lovable-uploads/Galleta-Nutella.png",
  "/lovable-uploads/Galleta-Pistacho.png",
  "/lovable-uploads/Galleta-Filipinos.png",
];

const InstagramFeed = () => {
  const instagramUrl = "https://instagram.com/recetaspati";

  return (
    <section id="instagram" className="py-16 bg-pati-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-2">
            Síguenos en Instagram
          </h2>
          <a 
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-pati-brown hover:text-pati-burgundy transition-colors"
          >
            @recetaspati
          </a>
        </div>

        {/* Grid for images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-10">
          {feedImages.map((imgSrc, index) => (
            <a 
              key={index} 
              href={instagramUrl} // Link each image to Instagram profile
              target="_blank" 
              rel="noopener noreferrer" 
              className="aspect-square block overflow-hidden rounded-lg group"
            >
              <img 
                src={imgSrc} 
                alt={`Instagram post ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-3 text-lg">
              <Instagram className="mr-2 h-5 w-5" /> Ver perfil
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed; 