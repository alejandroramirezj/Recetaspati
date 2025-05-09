import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

// Declarar la propiedad instgrm en Window para TypeScript
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

// Example images - replace with actual relevant image paths or placeholders
// ESTA CONSTANTE SE VA A ELIMINAR
// const feedImages = [
//   "/Recetaspati/images/Caja galletas 6.png",
//   "/Recetaspati/images/Galleta-Kinderbueno.png",
//   "/Recetaspati/images/Bundcake.JPG",
//   "/Recetaspati/images/Galleta-Nutella.png",
//   "/Recetaspati/images/Galleta-Pistacho.png",
//   "/Recetaspati/images/Galleta-Filipinos.png",
// ];

const InstagramFeed = () => {
  const instagramUrl = "https://instagram.com/recetaspati";
  // const reelUrl = "https://www.instagram.com/reel/DIL1LvhoQq4/";

  return (
    <section id="instagram" className="py-12 bg-pati-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-2">
            Nuestro Video Destacado
          </h2>
          {/* <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-pati-brown hover:text-pati-burgundy transition-colors"
          >
            @recetaspati
          </a> */}
        </div>

        {/* Grid for images - ESTO SE VA A ELIMINAR */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-10">
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
        </div> */}

        {/* Instagram Reel Embed */}
        <div className="flex justify-center mb-10">
          <div className="w-full sm:w-auto max-w-xs aspect-[9/16] bg-white rounded-lg shadow-xl overflow-hidden border-2 border-pati-pink/50">
            <video 
              autoPlay
              loop
              muted
              playsInline
              preload="metadata" 
              className="w-full h-full object-cover"
              poster="/Recetaspati/placeholder.svg"
            >
              <source src="/Recetaspati/videos/recetaspati.mp4" type="video/mp4" />
              Tu navegador no soporta vídeos.
            </video>
          </div>
        </div>

        {/* Considerar si este botón sigue siendo relevante */}
        {/* <div className="text-center">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-3 text-lg">
              <Instagram className="mr-2 h-5 w-5" /> Ver perfil
            </Button>
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default InstagramFeed; 