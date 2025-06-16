import { Button } from '@/components/ui/button';
import { Instagram, BookText, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Array of local video paths for Instagram
const localVideoPaths = [
  "/videos/recetaspati1.mp4",
  "/videos/recetaspati2.mp4",
  "/videos/recetaspati3.mp4",
];

// Ya no se necesita useEffect para el embed de Instagram
// Ya no se necesita la declaración global de window.instgrm

const InstagramFeed = () => {
  const instagramUrl = "https://instagram.com/recetaspati";
  const profileName = "@recetaspati";
  const recipeCount = "140";
  const followerCount = "1.860";

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
            className="text-lg text-pati-brown hover:text-pati-burgundy transition-colors flex items-center justify-center gap-2 mb-4"
          >
            {profileName}
          </a>

          <div className="flex flex-wrap justify-center gap-4 text-pati-burgundy font-semibold text-lg">
            <div className="flex items-center gap-1.5">
              <BookText className="h-5 w-5" /> {recipeCount} recetas
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-5 w-5" /> {followerCount} seguidores
            </div>
          </div>
        </div>

        {/* Flex container for videos - Scrollable on mobile, single row on web */}
        <div className="flex flex-row overflow-x-auto space-x-4 md:space-x-6 pb-4 mb-10 justify-start md:justify-center scrollbar-thin scrollbar-thumb-pati-pink scrollbar-track-pati-light-pink">
          {localVideoPaths.map((videoPath, index) => (
            <div key={index} className="flex-shrink-0 w-[280px] md:w-[320px]"> {/* Adjusted fixed width for consistency */}
              <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-[9/16] bg-black">
                <CardContent className="p-0 h-full">
                  <video
                    src={videoPath}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover"
                    aria-label={`Video de Instagram ${index + 1}`}
                  >
                    Tu navegador no soporta la etiqueta de vídeo.
                  </video>
                </CardContent>
              </Card>
            </div>
          ))}
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