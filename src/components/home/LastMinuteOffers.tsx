import { Button } from '@/components/ui/button';
import { Gift, BellRing, MessageCircle, Sparkles, Zap, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// WhatsApp Simulation Component (Integrated)
const WhatsAppSimulation = () => {
  const patiMessageTime = "18:30";
  const clientMessageTime = "18:31";

  return (
    <div className="bg-pati-cream/50 p-4 rounded-lg shadow-md h-full">
      <div className="bg-teal-600 text-white p-2 text-center rounded-t-lg font-semibold mb-2 text-sm">
        Pati al Rescate ⚡️ Ofertas Flash
      </div>
      <div className="space-y-2 flex flex-col">
        <div className="mr-auto max-w-[80%] opacity-0 animate-chat-bubble-1">
          <div className="bg-white rounded-lg p-2 shadow relative">
            <p className="text-sm">
              🚨 ¡Alerta Oferta Flash! 🚨 ¡Me han sobrado 4 galletazas Kinder Bueno! 🍪🍪🍪🍪 Hoy a <span className="font-bold">MITAD DE PRECIO</span> 💸 ¡Solo para los más rápidos! Que vuelan... 💨
            </p>
            <div className="text-xs text-gray-500 text-right mt-1 flex justify-end items-center">
              {patiMessageTime}
            </div>
            <div className="absolute left-[-5px] bottom-[5px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
          </div>
        </div>
        <div className="ml-auto max-w-[80%] opacity-0 animate-chat-bubble-2">
          <div className="bg-[#DCF8C6] rounded-lg p-2 shadow relative">
            <p className="text-sm">
              ¡UNA! 🙋‍♀️ ¡Quiero UNA! Pero por favor Pati... ¡¡deja de tentarme así!! 😭 Que hoy me va a tocar sesión doble en el CrossFit por tu culpa! 🏋️‍♀️😅 ¡Guárdamela! 🙏
            </p>
            <div className="text-xs text-gray-500 text-right mt-1 flex justify-end items-center">
              {clientMessageTime}
            </div>
            <div className="absolute right-[-5px] bottom-[5px] w-0 h-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-[#DCF8C6] border-b-[8px] border-b-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component - Renamed back and using two columns
const LastMinuteOffers = () => {
  const phoneNumber = "34671266981";
  const message = "Me añado";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section id="ofertas-ultimo-minuto" className="py-16 md:py-20 bg-gradient-to-b from-white to-pati-cream">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Zap className="mx-auto h-10 w-10 text-pati-burgundy mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">
            El Club Secreto de los Golosos 🤫
          </h2>
          <p className="text-lg text-pati-brown">
             Sé el primero en enterarte de nuestras ofertas flash y novedades exclusivas por WhatsApp. 🤫
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div>
            <WhatsAppSimulation />
          </div>

          <div className="space-y-6 flex flex-col justify-center h-full">
             <h3 className="text-xl font-semibold text-pati-burgundy">¿Qué recibirás?</h3>
             <div className="space-y-3 text-pati-dark-brown">
               <div className="flex items-center gap-3">
                 <BellRing className="h-5 w-5 text-pati-burgundy flex-shrink-0" />
                 <span>Avisos de excedentes a precios 🤩.</span>
               </div>
                <div className="flex items-center gap-3">
                 <Sparkles className="h-5 w-5 text-pati-burgundy flex-shrink-0" />
                 <span>Noticias de productos nuevos y ediciones limitadas ✨.</span>
               </div>
             </div>

            <div className="bg-pati-pink/20 border border-pati-pink rounded-lg p-4 text-center flex items-center justify-center gap-3">
               <Gift className="h-7 w-7 text-pati-burgundy flex-shrink-0" />
               <p className="text-md font-semibold text-pati-burgundy">
                 ¡Y <span className="font-bold">galleta extra</span> 🍪 en tu primer pedido al unirte!
               </p>
            </div>

            <div className="text-center space-y-3 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1DAA54] text-white px-6 py-3 text-base md:text-lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" /> ¡Quiero unirme por WhatsApp! 🎉
                </a>
              </Button>
               <p className="text-xs text-pati-brown italic">
                Promesa de no spam: Solo mensajes dulces 😉
              </p>
            </div>
          </div> 

        </div>
      </div>
    </section>
  );
};

export default LastMinuteOffers; 