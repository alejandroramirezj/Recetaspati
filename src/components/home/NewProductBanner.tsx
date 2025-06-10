import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface NewProductBannerProps {
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

export function NewProductBanner({
  title,
  description,
  videoUrl,
  imageUrl,
  buttonText,
  buttonLink,
}: NewProductBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pati-light-pink/30 via-white to-pati-cream/30 backdrop-blur-sm border border-pati-pink/20"
    >
      {/* NEW Badge estilo starburst animado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [1, 1.08, 1],
          rotate: [0, 2, -2, 0],
          y: [0, -4, 0, 4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="absolute -top-4 -right-4 z-20"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 5 Q45 15 55 10 Q60 20 70 15 Q68 28 78 30 Q70 38 75 45 Q65 48 70 60 Q60 58 58 70 Q50 65 45 75 Q40 65 35 75 Q30 65 22 70 Q20 58 10 60 Q15 48 5 45 Q10 38 2 30 Q12 28 10 15 Q20 20 25 10 Q35 15 40 5 Z"
            fill="#6D28D9"
            stroke="#fff"
            strokeWidth="2"
          />
          <text x="40" y="44" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff" fontFamily="'Comic Sans MS', 'Comic Sans', cursive">NEW</text>
        </svg>
      </motion.div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Contenedor de video/imagen con efecto de brillo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-video rounded-xl overflow-hidden shadow-lg group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <video
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              autoPlay
              loop
              muted
              playsInline
              poster={imageUrl}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            {/* Efecto de brillo al hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full" />
          </motion.div>

          {/* Contenido de texto con animaciones */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3 text-center md:text-left"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-pati-burgundy"
            >
              {title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm text-pati-dark-brown"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                size="sm"
                className="bg-pati-burgundy hover:bg-pati-brown text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild
              >
                <a href={buttonLink}>
                  {buttonText}
                  <Play className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 