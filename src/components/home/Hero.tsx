import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Restaurar efecto de galletas cayendo
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
  const numCookies = 30;

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
    <div className="relative overflow-hidden bg-gradient-to-br from-pati-light-pink via-white to-pati-cream py-10 md:py-14">
      {/* Efecto de galletas cayendo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {cookies.map((cookie) => (
          <img
            key={cookie.id}
            src={cookie.imageUrl}
            alt=""
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
        <div className="w-full max-w-2xl space-y-4">
          {/* Logo (solo isotipo, sin texto) */}
          <div className="mb-2">
            <img 
              src="/images/Isotipo.webp"
              alt="Isotipo Pati Sweet Creations" 
              className="h-16 md:h-20 w-auto mx-auto"
            />
          </div>
          {/* Slogan ultra catchy */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-pati-burgundy max-w-2xl mx-auto font-extrabold mb-4 drop-shadow-lg">
            ¡Diooos, qué rico!
          </h2>
          {/* Video protagonista con etiqueta NEW */}
          <div className="relative w-full flex justify-center items-center">
            {/* Etiqueta NEW animada */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.12, 1], opacity: 1, rotate: [0, 4, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              className="absolute left-2 top-2 z-20"
            >
              <svg width="70" height="70" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M40 5 Q45 15 55 10 Q60 20 70 15 Q68 28 78 30 Q70 38 75 45 Q65 48 70 60 Q60 58 58 70 Q50 65 45 75 Q40 65 35 75 Q30 65 22 70 Q20 58 10 60 Q15 48 5 45 Q10 38 2 30 Q12 28 10 15 Q20 20 25 10 Q35 15 40 5 Z"
                  fill="#a78bfa"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text x="40" y="44" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff" fontFamily="'Comic Sans MS', 'Comic Sans', cursive">NEW</text>
              </svg>
            </motion.div>
            {/* Video grande */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-xl aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-pati-burgundy bg-white"
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/happy-hippo-poster.webp"
              >
                <source src="/videos/happy-hippo.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
          {/* Mensaje breve y botón */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <Button
              size="lg"
              className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-3 text-base md:text-lg shadow-md animate-bounce"
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Descubrir
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
