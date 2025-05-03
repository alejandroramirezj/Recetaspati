import { Button } from '@/components/ui/button';
import { Gift, BellRing, MessageCircle, Sparkles, Zap, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from 'react-intersection-observer';
import React, { useState, useEffect } from 'react';

// Interfaz de props para el componente
interface WhatsAppSimulationProps {
  startTyping: boolean;
}

// WhatsApp Simulation Component (Integrated)
const WhatsAppSimulation: React.FC<WhatsAppSimulationProps> = ({ startTyping }) => {
  const patiMessageTime = "18:30";
  const clientMessageTime = "18:31";

  // Textos de los mensajes
  const patiMessageText = "🚨 ¡Alerta Oferta Flash! 🚨 ¡Me han sobrado 4 galletazas Kinder Bueno! 🍪🍪🍪🍪 Hoy a MITAD DE PRECIO 💸 ¡Solo para los más rápidos! Que vuelan... 💨";
  const clientMessageText = "¡UNA! 🙋‍♀️ ¡Quiero UNA! Pero por favor Pati... ¡¡deja de tentarme así!! 😭 Que hoy me va a tocar sesión doble en el CrossFit por tu culpa! 🏋️‍♀️😅 ¡Guárdamela! 🙏";

  // Estados para controlar visibilidad
  const [showPatiMessage, setShowPatiMessage] = useState(false);
  const [showClientMessage, setShowClientMessage] = useState(false);
  const [clientMessageTriggered, setClientMessageTriggered] = useState(false); // Para evitar múltiples triggers

  // Observer para el primer mensaje (el de Pati)
  const { ref: patiMessageRef, inView: patiMessageInView } = useInView({
    triggerOnce: true, // Solo se activa una vez cuando entra
    threshold: 0.8, // Que esté bastante visible (ajustar)
  });

  // Efecto para mostrar el primer mensaje cuando la sección es visible
  useEffect(() => {
    if (startTyping && !showPatiMessage) {
      setShowPatiMessage(true);
      // Simular sonido 1
      console.log("Reproduciendo sonido notificación 1 (simulado)");
      // TODO: Añadir aquí la lógica real para reproducir el sonido 1
    }
  }, [startTyping, showPatiMessage]);

  // Efecto para mostrar el segundo mensaje cuando el PRIMERO es visible
  useEffect(() => {
    if (patiMessageInView && showPatiMessage && !clientMessageTriggered) {
        // Poner un pequeño delay artificial para que no sea instantáneo al scroll?
        const timeoutId = setTimeout(() => {
            setShowClientMessage(true);
            setClientMessageTriggered(true); // Marcar como activado
            // Simular sonido 2
            console.log("Reproduciendo sonido notificación 2 (simulado)");
            // TODO: Añadir aquí la lógica real para reproducir el sonido 2
        }, 300); // Pequeño delay de 300ms tras scroll
        
        return () => clearTimeout(timeoutId); // Limpieza
    }
  }, [patiMessageInView, showPatiMessage, clientMessageTriggered]);

  return (
    <div className="bg-pati-cream/50 p-4 rounded-lg shadow-md h-full">
      <div className="bg-teal-600 text-white p-2 text-center rounded-t-lg font-semibold mb-2 text-sm">
        Pati al Rescate ⚡️ Ofertas Flash
      </div>
      <div className="space-y-2 flex flex-col min-h-[150px]">
        {/* Mensaje 1 (Pati) - Añadir ref={patiMessageRef} */} 
        {showPatiMessage && (
           <div ref={patiMessageRef} className="mr-auto max-w-[80%] animate-fade-in">
              <div className="bg-white rounded-lg p-2 shadow relative">
                 <p className="text-sm block" style={{ whiteSpace: 'pre-line' }}>
                    {patiMessageText}
                 </p>
                 <div className="text-xs text-gray-500 text-right mt-1 flex justify-end items-center">
                   {patiMessageTime}
                 </div>
                 <div className="absolute left-[-5px] bottom-[5px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
               </div>
            </div>
        )}
       
        {/* Mensaje 2 (Cliente) - Renderizar si showClientMessage es true */} 
        {showClientMessage && (
           <div className="ml-auto max-w-[80%] animate-fade-in">
             <div className="bg-[#DCF8C6] rounded-lg p-2 shadow relative">
                 <p className="text-sm block" style={{ whiteSpace: 'pre-line' }}>
                    {clientMessageText}
                 </p>
                 <div className="text-xs text-gray-500 text-right mt-1 flex justify-end items-center">
                   {clientMessageTime}
                 </div>
                 <div className="absolute right-[-5px] bottom-[5px] w-0 h-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-[#DCF8C6] border-b-[8px] border-b-transparent"></div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const LastMinuteOffers = () => {
  const phoneNumber = "34671266981";
  const joinMessage = "¡Hola Pati! Quiero unirme al Club Secreto de los Golosos 🤫";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(joinMessage)}`;

  // Estados para controlar la animación de escritura
  const [startTyping, setStartTyping] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // Animar solo la primera vez que sea visible
    threshold: 0.5, // Animar cuando el 50% sea visible
  });

  useEffect(() => {
    if (inView) {
      setStartTyping(true);
    }
  }, [inView]);

  const mainText = "Sé el primero en enterarte de nuestras ofertas flash y novedades exclusivas por WhatsApp. 🤫";

  return (
    <section id="ofertas-ultimo-minuto" className="py-16 md:py-20 bg-gradient-to-b from-white to-pati-cream">
      <div className="container mx-auto px-4">
        
        <div ref={ref} className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Zap className="mx-auto h-10 w-10 text-pati-burgundy mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">
            El Club Secreto de los Golosos 🤫
          </h2>
          {/* Texto principal ESTÁTICO ahora */}
          <p className="text-lg text-pati-brown">
            {mainText}
          </p>
        </div>

        {/* Contenedor centrado para simulación y botón */}
        <div className="flex flex-col items-center gap-10">
            {/* Simulación WhatsApp - Pasar prop startTyping */}
            <div className="w-full max-w-md">
              <WhatsAppSimulation startTyping={startTyping} />
            </div>

            {/* Botón Unirse (Centrado) */}
            <div className="text-center space-y-3">
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
    </section>
  );
};

export default LastMinuteOffers; 