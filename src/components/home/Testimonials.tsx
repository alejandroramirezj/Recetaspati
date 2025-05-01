import React from 'react'; // Import React for useRef
import { Star } from 'lucide-react';
// Import Carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// Import Autoplay plugin
import Autoplay from "embla-carousel-autoplay";

// Replaced testimonial data with review image paths
const reviewImagePaths = [
  "/Recetaspati/images/Reseña1.png",
  "/Recetaspati/images/Reseña2.png",
  "/Recetaspati/images/Reseña3.png",
  "/Recetaspati/images/Reseña4.png",
  "/Recetaspati/images/Reseña5.png",
  "/Recetaspati/images/Reseña6.png",
  "/Recetaspati/images/Reseña7.png",
];

const Testimonials = () => {
  // Create a ref for the Autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }) // 4 seconds delay, stops on interaction
  );

  return (
    <section id="testimonios" className="py-16 bg-pati-light-pink overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-pati-brown max-w-2xl mx-auto">
            ¡Algunas de las reseñas que nos dejáis y que nos hacen super felices! 😊
          </p>
        </div>
        
        {/* Interactive Carousel with Autoplay */}
        <Carousel 
          plugins={[plugin.current]} // Pass the plugin here
          opts={{ 
            align: "start", 
            loop: true, // Optional: make it loop
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto mb-10" // Adjust max-width as needed
          onMouseEnter={plugin.current.stop} // Optional: Pause on hover
          onMouseLeave={plugin.current.reset} // Optional: Resume on leave
        >
          <CarouselContent className="-ml-4"> {/* Negative margin to offset padding */}
            {reviewImagePaths.map((imgPath, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3"> {/* Adjust basis for number of items visible */}
                <div className="p-1"> {/* Added small padding around the card */}
                   <div className="overflow-hidden rounded-lg shadow-md border border-pati-pink/30 bg-white h-full flex"> {/* Added h-full and flex */}
                     <img 
                       src={imgPath} 
                       alt={`Reseña cliente ${index + 1}`} 
                       className="w-full h-auto object-contain self-center" // Center image vertically
                       loading="lazy"
                     />
                   </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" /> {/* Hide arrows on very small screens */}
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
        
        {/* Video testimonials section remains the same */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-pati-burgundy mb-8 text-center">
            Ve las reacciones a nuestros productos
          </h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 md:gap-8 justify-center items-center">
            {/* Video 1 */}
            <div className="w-full sm:w-auto max-w-xs aspect-[9/16] bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pati-pink/50">
              <video 
                autoPlay
                loop
                muted
                playsInline
                preload="metadata" 
                className="w-full h-full object-cover"
                poster="/Recetaspati/placeholder.svg"
              >
                <source src="/Recetaspati/videos/Reacciones-1.mp4#t=0.5" type="video/mp4" />
                Tu navegador no soporta vídeos.
              </video>
            </div>
            {/* Video 2 */}
            <div className="w-full sm:w-auto max-w-xs aspect-[9/16] bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pati-pink/50">
              <video 
                autoPlay
                loop
                muted
                playsInline
                preload="metadata" 
                className="w-full h-full object-cover"
                poster="/Recetaspati/placeholder.svg"
              >
                <source src="/Recetaspati/videos/Reacciones-2.mp4#t=0.5" type="video/mp4" />
                Tu navegador no soporta vídeos.
              </video>
            </div>
            {/* Video 3 */}
             <div className="w-full sm:w-auto max-w-xs aspect-[9/16] bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pati-pink/50">
              <video 
                autoPlay
                loop
                muted
                playsInline
                preload="metadata" 
                className="w-full h-full object-cover"
                poster="/Recetaspati/placeholder.svg"
              >
                <source src="/Recetaspati/videos/Reacciones-3.mp4#t=0.5" type="video/mp4" />
                Tu navegador no soporta vídeos.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
