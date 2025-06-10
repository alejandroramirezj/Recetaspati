import { useState } from "react";
import { motion } from "framer-motion";

interface OvenBannerProps {
  videoUrl: string;
  imageUrl: string;
}

export function OvenBanner({ videoUrl, imageUrl }: OvenBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center py-8">
      {/* Texto superior */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-4 text-center"
      >
        <span className="inline-block bg-pati-burgundy text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
          Recién salida del horno nuestra nueva galleta <span className="text-pati-pink">OMG</span>
        </span>
      </motion.div>

      {/* SVG del horno mejorado */}
      <div className="relative" style={{ width: 420, height: 340 }}>
        {/* Horno base con más detalles */}
        <svg width="420" height="340" viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 z-10">
          {/* Cuerpo del horno */}
          <rect x="30" y="40" width="360" height="240" rx="36" fill="#ececec" stroke="#bdbdbd" strokeWidth="8" />
          {/* Panel superior */}
          <rect x="60" y="20" width="300" height="40" rx="16" fill="#e9d5ff" stroke="#bdbdbd" strokeWidth="4" />
          {/* Perillas */}
          <circle cx="90" cy="40" r="10" fill="#f472b6" stroke="#bdbdbd" strokeWidth="2" />
          <circle cx="130" cy="40" r="10" fill="#a78bfa" stroke="#bdbdbd" strokeWidth="2" />
          <circle cx="170" cy="40" r="10" fill="#fbbf24" stroke="#bdbdbd" strokeWidth="2" />
          <circle cx="210" cy="40" r="10" fill="#f472b6" stroke="#bdbdbd" strokeWidth="2" />
          <circle cx="250" cy="40" r="10" fill="#a78bfa" stroke="#bdbdbd" strokeWidth="2" />
          <circle cx="290" cy="40" r="10" fill="#fbbf24" stroke="#bdbdbd" strokeWidth="2" />
          {/* Cristal del horno */}
          <rect x="80" y="100" width="260" height="150" rx="24" fill="#fff" stroke="#bdbdbd" strokeWidth="6" />
          <rect x="100" y="120" width="220" height="110" rx="18" fill="#e0e7ff" fillOpacity="0.5" stroke="#a78bfa" strokeWidth="3" />
          {/* Rejilla */}
          <rect x="120" y="170" width="180" height="6" rx="3" fill="#bdbdbd" />
          <rect x="120" y="190" width="180" height="6" rx="3" fill="#bdbdbd" />
          <rect x="120" y="210" width="180" height="6" rx="3" fill="#bdbdbd" />
        </svg>

        {/* Puerta animada, más grande y con cristal */}
        <motion.svg
          width="260"
          height="150"
          viewBox="0 0 260 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-[80px] top-[100px] z-30 origin-top"
          style={{ transformOrigin: "top center" }}
          animate={{ rotateX: open ? 75 : 0 }}
          transition={{ duration: 1, type: "spring" }}
          onClick={() => setOpen((v) => !v)}
        >
          <rect width="260" height="150" rx="24" fill="#f3e8ff" stroke="#a78bfa" strokeWidth="5" />
          <rect x="20" y="20" width="220" height="110" rx="18" fill="#e0e7ff" fillOpacity="0.7" stroke="#a78bfa" strokeWidth="2" />
          <text x="130" y="90" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#a78bfa" fontFamily="'Comic Sans MS', 'Comic Sans', cursive">Horno</text>
        </motion.svg>

        {/* Video saliendo del horno, más grande */}
        <motion.div
          className="absolute left-[110px] top-[130px] z-40 w-[200px] h-[110px] rounded-xl overflow-hidden shadow-2xl border-4 border-pati-burgundy bg-white"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: open ? -40 : 60, opacity: open ? 1 : 0 }}
          transition={{ duration: 1, delay: open ? 0.5 : 0 }}
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={imageUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </motion.div>

        {/* Clic para abrir */}
        {!open && (
          <div className="absolute left-[170px] top-[260px] z-50 cursor-pointer text-xs text-pati-burgundy bg-white/80 px-3 py-1 rounded shadow border border-pati-burgundy animate-bounce">
            Haz clic en la puerta
          </div>
        )}
      </div>
    </div>
  );
} 