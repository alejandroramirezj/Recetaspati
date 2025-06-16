import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/data/products';

interface MobileVideoPlayerProps {
  product: Product | null;
}

const MobileVideoPlayer = ({ product }: MobileVideoPlayerProps) => {
  if (!product?.video) return null;
  return (
    <div className="md:hidden mt-6 flex justify-center">
      <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-[16/9] max-w-full bg-black max-h-80 sm:max-h-[400px]">
        <CardContent className="p-0 h-full">
          <video 
            src={product.video} 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
            aria-label={`Vídeo de ${product.name}`}
          >
            Tu navegador no soporta la etiqueta de vídeo.
          </video>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileVideoPlayer; 