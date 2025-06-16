import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Efecto de galletas cayendo
interface FallingCookie {
  id: number;
  imageUrl: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
}

const Hero = () => {
  const [cookies, setCookies] = useState<FallingCookie[]>([]);
  const cookieImages = [
    '/images/minicookie1.webp',
    '/images/minicookie2.webp',
    '/images/minicookie3.webp'
  ];
  const numCookies = 18;

  useEffect(() => {
    const generatedCookies: FallingCookie[] = [];
    for (let i = 0; i < numCookies; i++) {
      generatedCookies.push({
        id: i,
        imageUrl: cookieImages[Math.floor(Math.random() * cookieImages.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 8 + 7}s`,
        animationDelay: `${Math.random() * 10}s`,
        size: Math.random() * 0.5 + 0.7
      });
    }
    setCookies(generatedCookies);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-pati-light-pink via-white to-pati-cream py-6 md:py-10"
      aria-label="Galletas artesanas en Granada"
    >
      {/* Efecto de galletas cayendo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {cookies.map((cookie) => (
          <img
            key={cookie.id}
            src={cookie.imageUrl}
            alt="Galleta artesanal decorativa"
            className="absolute top-[-10%] animate-fall opacity-70"
            style={{
              left: cookie.left,
              width: `${20 * cookie.size}px`,
              height: `${20 * cookie.size}px`,
              animationDuration: cookie.animationDuration,
              animationDelay: cookie.animationDelay,
              transform: 'translateY(0%)',
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <div className="w-full max-w-2xl space-y-3 flex flex-col items-center">
          {/* Isotipo centrado */}
          <div className="flex justify-center items-center mb-2 w-full">
            <img 
              src="/images/Isotipo.webp"
              alt="Logo Pati Sweet Creations" 
              className="h-24 md:h-32 w-auto mx-auto"
            />
          </div>
          {/* Título SEO y viral */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-pati-burgundy max-w-2xl mx-auto font-extrabold drop-shadow-lg leading-tight">
            Galletas artesanas en Granada
          </h1>
          {/* Eliminar subtítulo visual con iconos y 24h */}
          {/* Video happy hippo */}
          <div className="relative w-full flex flex-col items-center justify-center mt-2">
            {/* Etiqueta NEW animada */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.12, 1], opacity: 1, rotate: [0, 4, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              className="absolute left-2 top-2 z-20"
            >
              <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M40 5 Q45 15 55 10 Q60 20 70 15 Q68 28 78 30 Q70 38 75 45 Q65 48 70 60 Q60 58 58 70 Q50 65 45 75 Q40 65 35 75 Q30 65 22 70 Q20 58 10 60 Q15 48 5 45 Q10 38 2 30 Q12 28 10 15 Q20 20 25 10 Q35 15 40 5 Z"
                  fill="#a78bfa"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="'Comic Sans MS', 'Comic Sans', cursive">NEW</text>
              </svg>
            </motion.div>
            {/* Video happy hippo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-pati-burgundy bg-white max-h-[45vh] md:max-h-[55vh] flex items-center justify-center"
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/tarta-galleta.png"
                aria-label="Vídeo viral de galletas artesanas en Granada"
              >
                <source src="/videos/tarta-galleta.mp4" type="video/mp4" />
              </video>
            </motion.div>
            {/* Botón fijo debajo del video */}
            <div className="w-full flex justify-center mt-6">
              <Button
                size="lg"
                className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-3 text-base md:text-lg shadow-lg animate-bounce focus:ring-2 focus:ring-offset-2 focus:ring-pati-burgundy"
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Ir a la tienda de galletas artesanas"
              >
                Pide tu caja viral
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
