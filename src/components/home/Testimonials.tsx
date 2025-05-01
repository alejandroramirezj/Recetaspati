import React from 'react';
import { Star } from 'lucide-react';
// Removed Carousel and Autoplay imports

// Removed reviewImagePaths array

const Testimonials = () => {
  // Removed Autoplay plugin ref

  return (
    <section id="testimonios" className="py-16 bg-pati-light-pink overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-pati-brown max-w-2xl mx-auto">
            ¡Vuestras reseñas y reacciones nos hacen super felices! 😊
          </p>
        </div>
        
        {/* Main Testimonial Video - Replaced Carousel */}
        <div className="mb-16 flex justify-center"> {/* Centering container */}
          {/* Apply similar styling as reaction videos but potentially larger max-width */}
          <div className="w-full max-w-md md:max-w-lg aspect-[9/16] bg-white rounded-lg shadow-xl overflow-hidden border-2 border-pati-pink/50">
            <video 
              autoPlay
              loop
              muted
              playsInline
              preload="metadata" 
              className="w-full h-full object-cover"
              poster="/Recetaspati/placeholder.svg" // Consider a specific poster
            >
              <source src="/Recetaspati/videos/Reseñas.mp4#t=0.5" type="video/mp4" />
              Tu navegador no soporta vídeos.
            </video>
          </div>
        </div>
        
        {/* Reaction Videos Section Header (Adjusted margin) */}
        <div className="mt-12"> {/* Adjusted top margin */}
          <h3 className="text-2xl font-bold text-pati-burgundy mb-8 text-center">
            Algunas reacciones al probar nuestros dulces
          </h3>
          {/* Reaction Videos Grid */}
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
