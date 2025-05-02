import { Button } from '@/components/ui/button';
import { FaTiktok } from 'react-icons/fa';

// Array of video IDs from the provided URLs
const videoIds = [
  "7489944259559361815",
  "7495115294579363094",
  "7485036959904058646",
  "7479000634952256790",
  "7479541534132636950",
];

const TikTokFeed = () => {
  const tiktokUrl = "https://tiktok.com/@recetaspati_";
  const profileName = "recetaspati_"; // Extracted profile name

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
            className="text-lg text-pati-brown hover:text-pati-burgundy transition-colors"
          >
            @{profileName}
          </a>
        </div>

        {/* Flex container for videos - Scrollable on mobile, single row on web */}
        {/* Added pb-4 for scrollbar space if visible */}
        <div className="flex flex-row overflow-x-auto space-x-4 md:space-x-6 pb-4 mb-10 justify-start md:justify-center scrollbar-thin scrollbar-thumb-pati-pink scrollbar-track-pati-light-pink">
          {videoIds.map((videoId) => (
            // Added flex-shrink-0 to prevent items from shrinking 
            <div key={videoId} className="flex-shrink-0 w-[300px] md:w-auto"> {/* Fixed width on mobile, auto on larger */} 
              <blockquote 
                className="tiktok-embed" 
                cite={`https://www.tiktok.com/@${profileName}/video/${videoId}`}
                data-video-id={videoId}
                // Use Tailwind/CSS for sizing, ensure min-width for embed 
                style={{ minWidth: '300px', maxWidth: '325px' }} 
              > 
                <section> 
                   <a target="_blank" rel="noopener noreferrer" title={`@${profileName}`} href={`https://www.tiktok.com/@${profileName}?refer=embed`}>@{profileName}</a> 
                   <p>...</p> 
                   <a target="_blank" rel="noopener noreferrer" title="Original video" href={`https://www.tiktok.com/@${profileName}/video/${videoId}?refer=embed`}>Ver video en TikTok</a> 
                </section> 
              </blockquote>
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