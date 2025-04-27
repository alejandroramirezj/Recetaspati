import { Button } from '@/components/ui/button';

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
               <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.19-.01-4.8 0-2.16-1.2-4.06-2.94-4.86h-3.02v16.61c0 2.3-.94 4.3-2.48 5.76-1.53 1.45-3.61 2.14-5.83 2.02-2.18-.12-4.13-.96-5.53-2.48-1.4-1.53-2.05-3.53-1.9-5.71.14-2.1.97-3.96 2.4-5.37 1.47-1.45 3.5-2.1 5.65-1.95.02 1.59.02 3.18.01 4.78-.01 1.9.9 3.59 2.32 4.74 1.44 1.13 3.35 1.52 5.08 1.27v-4.1a4.96 4.96 0 0 1-2.25-.46v-4.87c.01-.16.01-.32.02-.48.01-.09.01-.18.02-.27z"/></svg>
              Ver perfil en TikTok
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TikTokFeed; 