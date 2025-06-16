import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const AboutUs = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.5, // El video se activará cuando al menos el 50% esté visible
  });

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView]);

  return (
    <main className="flex-grow container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-pati-burgundy mb-6 text-center font-playfair">
        Sobre Mí
      </h1>
      <div ref={ref} className="w-full max-w-2xl mx-auto mb-8">
        <video
          ref={videoRef}
          controls
          loop // Para que se reproduzca en bucle
          muted // Importante para el autoplay en muchos navegadores
          playsInline // Recomendado para autoplay en iOS
          className="w-full rounded-lg shadow-lg"
          src="/videos/logo-explicado.mp4"
          title="Mi Historia"
          aria-label="Video explicando la historia de Recetas Pati"
          poster="/images/video-placeholder.jpg"
        >
          Tu navegador no soporta el tag de video.
        </video>
      </div>
      <section className="max-w-3xl mx-auto text-pati-dark-brown text-lg leading-relaxed text-center">
        <p>
          Soy Pati 👋, el alma de <strong>Recetas Pati</strong>. Mi pasión por la cocina <strong>desde pequeñita</strong> me llevó a especializarme en la <strong>reposteria</strong> 🍪. Mi logo es un reflejo de mis pasiones: <strong>Deporte</strong> 💪, mi perrita <strong>Arya</strong> 🐶 y la <strong>repostería</strong> 👩‍🍳.
        </p>
      </section>
    </main>
  );
};

export default AboutUs; 