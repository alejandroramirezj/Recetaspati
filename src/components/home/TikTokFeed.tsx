import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaTiktok } from 'react-icons/fa';
import { User, Heart, Video, Eye } from 'lucide-react';

// Array of local video paths
const localVideoPaths = [
  "/videos/video-titok-1.mp4",
  "/videos/video-titok-2.mp4",
  "/videos/video-titok-3.mp4",
];

const TikTokFeed = () => {
  const tiktokUrl = "https://tiktok.com/@recetaspati_";
  const profileName = "recetaspati_";
  const TIKTOK_FOLLOWERS = "X.XK";
  const followerCount = "2.984";
  const heartCount = "88.705";
  const videoCount = "93";
  const viewCount = "2,8 millones";

  return (
    <section id="tiktok" className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-2">
            Síguenos en TikTok
          </h2>
          <a 
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-pati-brown hover:text-pati-burgundy transition-colors flex items-center justify-center gap-2 mb-4"
          >
            @{profileName}
          </a>

          {/* Statistics Display */}
          <div className="flex flex-wrap justify-center gap-4 text-pati-burgundy font-semibold text-lg">
            <div className="flex items-center gap-1.5">
              <User className="h-5 w-5" /> {followerCount} seguidores
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="h-5 w-5" /> {heartCount} me gusta
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="h-5 w-5" /> {videoCount} videos
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-5 w-5" /> {viewCount} vistas
            </div>
          </div>
        </div>

        {/* Flex container for videos - Scrollable on mobile, single row on web */}
        <div className="flex flex-row overflow-x-auto space-x-4 md:space-x-6 pb-4 mb-10 justify-start md:justify-center scrollbar-thin scrollbar-thumb-pati-pink scrollbar-track-pati-light-pink">
          {localVideoPaths.map((videoPath, index) => (
            <div key={index} className="flex-shrink-0 w-[280px] md:w-[320px]">
              <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-[9/16] bg-black">
                <CardContent className="p-0 h-full">
                  <video
                    src={videoPath}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover"
                    aria-label={`Video de reacción ${index + 1}`}
                  >
                    Tu navegador no soporta la etiqueta de vídeo.
                  </video>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center">
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg">
               <FaTiktok className="mr-2 h-5 w-5" />
               Ver perfil en TikTok
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TikTokFeed; 