import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';
import { useEffect } from 'react';

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
  const reelUrl = "https://www.instagram.com/reel/DIL1LvhoQq4/";

  useEffect(() => {
    // Asegurarse de que window y window.instgrm estén definidos
    if (typeof window !== 'undefined' && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez después del montaje inicial

  return (
    <section id="instagram" className="py-12 bg-pati-cream">
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
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={reelUrl}
            data-instgrm-captioned
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: "0",
              borderRadius: "3px",
              boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: "1px",
              maxWidth: "540px",
              minWidth: "326px",
              padding: "0",
              width: "calc(100% - 2px)",
            }}
          >
            <div style={{ padding: "16px" }}>
              <a
                href={reelUrl}
                style={{
                  background: "#FFFFFF",
                  lineHeight: "0",
                  padding: "0 0",
                  textAlign: "center",
                  textDecoration: "none",
                  width: "100%",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Placeholder content can be simplified or removed if Instagram's script handles it */}
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div style={{ backgroundColor: "#F4F4F4", borderRadius: "50%", flexGrow: 0, height: "40px", marginRight: "14px", width: "40px" }}></div>
                  <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                    <div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", marginBottom: "6px", width: "100px" }}></div>
                    <div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", width: "60px" }}></div>
                  </div>
                </div>
                <div style={{ padding: "19% 0" }}></div>
                <div style={{ display: "block", height: "50px", margin: "0 auto 12px", width: "50px" }}>
                  {/* SVG Icon can be kept or removed */}
                </div>
                <div style={{ paddingTop: "8px" }}>
                  <div style={{ color: "#3897f0", fontFamily: "Arial,sans-serif", fontSize: "14px", fontStyle: "normal", fontWeight: 550, lineHeight: "18px" }}>
                    View this post on Instagram
                  </div>
                </div>
                <div style={{ padding: "12.5% 0" }}></div>
                 <div style={{ display: "flex", flexDirection: "row", marginBottom: "14px", alignItems: "center" }}>
                   {/* Complex placeholder structure can be simplified */}
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", marginBottom: "24px" }}>
                   <div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", marginBottom: "6px", width: "224px" }}></div>
                   <div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", width: "144px" }}></div>
                 </div>
              </a>
              <p style={{ color: "#c9c8cd", fontFamily: "Arial,sans-serif", fontSize: "14px", lineHeight: "17px", marginBottom: "0", marginTop: "8px", overflow: "hidden", padding: "8px 0 7px", textAlign: "center", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <a
                  href={reelUrl}
                  style={{ color: "#c9c8cd", fontFamily: "Arial,sans-serif", fontSize: "14px", fontStyle: "normal", fontWeight: "normal", lineHeight: "17px", textDecoration: "none" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Un post de Recetas Pati (@recetaspati)
                </a>
              </p>
            </div>
          </blockquote>
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