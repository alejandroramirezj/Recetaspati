import { Button } from '@/components/ui/button';

const MothersDay = () => {
  // Define WhatsApp details
  const phoneNumber = "34671266981";
  const message = 
`¡Hola Pati! 👋 Quiero reservar el *Pack Especial del Día de la Madre* 💖 para que mi madre no me desherede 😅.

Ya que estoy... ¿qué galletas me recomiendas para mí? 🍪😉

¡Gracias! ✨`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section id="dia-madre" className="py-16 bg-gradient-to-b from-white to-pati-light-pink">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-pati-pink text-pati-burgundy px-4 py-1 rounded-full text-sm font-medium mb-6">
                Edición Limitada
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">
                Pack Especial Día de la Madre
              </h2>
              
              <p className="text-pati-brown mb-6">
                Sorprende a tu madre con nuestro pack especial elaborado con todo el cariño y los mejores ingredientes.
              </p>
              
              <div className="bg-pati-cream p-6 rounded-lg mb-6">
                <h3 className="font-bold text-pati-burgundy mb-3">El pack incluye:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-5 h-5 bg-pati-burgundy rounded-full flex-shrink-0 mr-3"></span>
                    <span>Mini tarta de lotus</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 bg-pati-burgundy rounded-full flex-shrink-0 mr-3"></span>
                    <span>Trozo de bankake</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 bg-pati-burgundy rounded-full flex-shrink-0 mr-3"></span>
                    <span>Pack de 6 galletas (Nutella y pistacho)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 bg-pati-burgundy rounded-full flex-shrink-0 mr-3"></span>
                    <span>25 palmeritas artesanas</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="text-3xl font-bold text-pati-burgundy mr-4">29,95€</div>
                <div className="text-lg text-gray-400 line-through">34,95€</div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-pati-burgundy hover:bg-pati-brown text-white">
                    Reservar ahora
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="border-pati-burgundy text-pati-burgundy hover:bg-pati-pink">
                  Más información
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-pati-brown">
                *Necesario reservar con al menos 48h de antelación. Disponibilidad limitada.
              </p>
            </div>
            
            <div className="relative h-72 md:h-auto bg-black">
              <video 
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
                poster="/Recetaspati/placeholder.svg"
              >
                <source src="/Recetaspati/videos/minitartas.mp4" type="video/mp4" />
                 Tu navegador no soporta vídeos.
              </video>
              <div className="absolute bottom-0 right-0 bg-pati-burgundy text-white px-6 py-3 font-bold">
                Edición Limitada
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MothersDay;
