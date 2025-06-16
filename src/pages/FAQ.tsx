import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-pati-burgundy mb-6 text-center font-playfair">
        Preguntas Frecuentes
      </h1>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-4">
        <AccordionItem value="item-1" className="border rounded-lg shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-pati-burgundy hover:no-underline">¿Se puede congelar la tarta?</AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-pati-dark-brown text-lg leading-relaxed">
            Sí, muchas tartas se pueden congelar. Envuélvela bien para mantener su frescura. Consulta la descripción del producto para detalles.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-lg shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-pati-burgundy hover:no-underline">¿Cómo conservar los productos?</AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-pati-dark-brown text-lg leading-relaxed">
            La mayoría se conservan en un lugar fresco/seco o en frigorífico. Tartas cremosas requieren refrigeración. Galletas y palmeritas, en recipiente hermético a temp. ambiente.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-lg shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-pati-burgundy hover:no-underline">¿Cuánto dura el pedido tras hacerlo?</AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-pati-dark-brown text-lg leading-relaxed">
            Varía por producto. Frescos: 3-5 días refrigerados. Galletas y similares: más tiempo si se conservan bien.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border rounded-lg shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-pati-burgundy hover:no-underline">¿Puedo elegir relleno y topping?</AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-pati-dark-brown text-lg leading-relaxed">
            ¡Sí! Ofrecemos personalización para tartas y packs de galletas. Selecciona tus favoritos en la página de cada producto.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border rounded-lg shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-pati-burgundy hover:no-underline">¿Cómo recibiré mi pedido (caja, fechas de envío)?</AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-pati-dark-brown text-lg leading-relaxed">
            Los productos se entregan en cajas seguras. Las fechas de envío y entrega se coordinan al momento del pedido.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default FAQ;