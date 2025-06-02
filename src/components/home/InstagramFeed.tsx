import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

// Ya no se necesita useEffect para el embed de Instagram
// Ya no se necesita la declaración global de window.instgrm

const InstagramFeed = () => {
  const instagramUrl = "https://instagram.com/recetaspati";

  return (
    <section id="instagram" className="py-12 bg-white">
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

        {/* Video Local en lugar del anterior embed/grid */}
        <div className="flex justify-center mb-10">
          <div className="w-full sm:w-auto max-w-xs aspect-[9/16] bg-white rounded-lg shadow-xl overflow-hidden border-2 border-pati-pink/50">
            <video 
              autoPlay
              loop
              muted
              playsInline
              preload="metadata" 
              className="w-full h-full object-cover"
              poster="/images/placeholder.svg" // Opcional: Cambiar a un poster específico para este video
            >
              <source src="/videos/recetaspati.mp4" type="video/mp4" />
              Tu navegador no soporta vídeos.
            </video>
          </div>
        </div>

        {/* Botón de seguir en Instagram */}
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