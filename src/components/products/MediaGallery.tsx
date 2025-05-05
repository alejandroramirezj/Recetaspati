import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product as ProductType } from '@/data/products';

interface MediaGalleryProps {
  product: ProductType;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ product }) => {
  const hasVideo = !!product.video;
  const hasImage = !!product.image;

  // Determine total items for carousel keys and conditional rendering
  const totalItems = (hasVideo ? 1 : 0) + (hasImage ? 1 : 0);

  if (totalItems === 0) {
    // Optional: Render a placeholder if no media
    return (
        <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-square flex items-center justify-center bg-gray-50">
             <CardContent className="p-4 text-center text-gray-400">
                Imagen no disponible
             </CardContent>
         </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-pati-pink/30 shadow-md">
      <CardContent className="p-0">
        <Carousel className="w-full" opts={{ loop: totalItems > 1 }}>
          <CarouselContent>
            {/* Video Item (if exists) */}
            {hasVideo && (
              <CarouselItem key="video-item">
                <div className="aspect-video bg-black flex items-center justify-center"> {/* Use aspect-video for consistency */}
                  <video
                    src={product.video}
                    controls
                    playsInline
                    muted={false} // Allow sound
                    className="w-full h-full object-contain" // Use object-contain
                    aria-label={`Vídeo de ${product.name}`}
                  >
                    Tu navegador no soporta la etiqueta de vídeo.
                  </video>
                </div>
              </CarouselItem>
            )}

            {/* Image Item (if exists) */}
            {hasImage && (
              <CarouselItem key="image-item">
                <div className="aspect-square flex items-center justify-center bg-gray-50"> {/* Keep aspect-square for image */}
                  <img
                    src={product.image}
                    alt={`Imagen de ${product.name}`}
                    className="w-full h-full object-contain" // Use object-contain
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {/* Only show controls if more than one item */}
          {totalItems > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default MediaGallery;
