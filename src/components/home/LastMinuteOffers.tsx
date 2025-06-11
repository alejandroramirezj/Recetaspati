import { Button } from '@/components/ui/button';
import { Gift, BellRing, MessageCircle, Sparkles, Zap, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from 'react-intersection-observer';
import React, { useState, useEffect } from 'react';

// Interfaz de props para el componente
interface WhatsAppSimulationProps {
  startTyping: boolean;
}

// WhatsApp Simulation Component (Compact)
const WhatsAppSimulation: React.FC<WhatsAppSimulationProps> = ({ startTyping }) => {
  const patiMessageTime = "18:30";
  const clientMessageTime = "18:31";
  // Mensajes más cortos
  const patiMessageText = "¡Alerta Flash! Me han sobrado 4 galletazas Kinder Bueno. ¡Mitad de precio!";
  const clientMessageText = "¡UNA! Guárdamela 🙏";

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
    }
  }, [startTyping, showPatiMessage]);

  // Efecto para mostrar el segundo mensaje cuando el PRIMERO es visible
  useEffect(() => {
    if (patiMessageInView && showPatiMessage && !clientMessageTriggered) {
        // Poner un pequeño delay artificial para que no sea instantáneo al scroll?
        const timeoutId = setTimeout(() => {
            setShowClientMessage(true);
            setClientMessageTriggered(true); // Marcar como activado
        }, 300); // Pequeño delay de 300ms tras scroll
        
        return () => clearTimeout(timeoutId); // Limpieza
    }
  }, [patiMessageInView, showPatiMessage, clientMessageTriggered]);

  return (
    <div className="bg-pati-cream/60 p-2 rounded-lg shadow h-full max-w-sm mx-auto">
      <div className="bg-teal-600 text-white px-2 py-1 text-center rounded-t-lg font-semibold mb-1 text-xs">
        Pati al Rescate ⚡️
      </div>
      <div className="space-y-1 flex flex-col min-h-[80px]">
        {showPatiMessage && (
           <div ref={patiMessageRef} className="mr-auto max-w-[90%] animate-fade-in">
              <div className="bg-white rounded-lg px-2 py-1 shadow relative">
                 <p className="text-xs block" style={{ whiteSpace: 'pre-line' }}>
                    {patiMessageText}
                 </p>
                 <div className="text-[10px] text-gray-400 text-right mt-0.5 flex justify-end items-center">
                   {patiMessageTime}
                 </div>
                 <div className="absolute left-[-5px] bottom-[5px] w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-white border-b-[6px] border-b-transparent"></div>
               </div>
            </div>
        )}
        {showClientMessage && (
           <div className="ml-auto max-w-[90%] animate-fade-in">
             <div className="bg-[#DCF8C6] rounded-lg px-2 py-1 shadow relative">
                 <p className="text-xs block" style={{ whiteSpace: 'pre-line' }}>
                    {clientMessageText}
                 </p>
                 <div className="text-[10px] text-gray-400 text-right mt-0.5 flex justify-end items-center">
                   {clientMessageTime}
                 </div>
                 <div className="absolute right-[-5px] bottom-[5px] w-0 h-0 border-t-[6px] border-t-transparent border-l-[6px] border-l-[#DCF8C6] border-b-[6px] border-b-transparent"></div>
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

  const mainText = "Ofertas flash y novedades exclusivas por WhatsApp";

  return (
    <section id="ofertas-ultimo-minuto" className="py-10 md:py-14 bg-gradient-to-b from-white to-pati-cream">
      <div className="container mx-auto px-4">
        <div ref={ref} className="text-center mb-6 max-w-xl mx-auto">
          <Zap className="mx-auto h-7 w-7 text-pati-burgundy mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold text-pati-burgundy mb-2">
            Club Secreto de los Golosos <span className="align-middle">🤫</span>
          </h2>
          <p className="text-base text-pati-brown mb-2">
            {mainText}
          </p>
        </div>
        <div className="flex flex-col items-center gap-5">
            <WhatsAppSimulation startTyping={startTyping} />
            <div className="text-center space-y-2 w-full max-w-xs">
              <Button asChild size="sm" className="w-full bg-[#25D366] hover:bg-[#1DAA54] text-white px-4 py-2 text-base">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Unirme por WhatsApp
                </a>
              </Button>
               <p className="text-[11px] text-pati-brown opacity-70 mt-1">
                Promesa de no spam: Solo mensajes dulces 🍪
              </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default LastMinuteOffers; 