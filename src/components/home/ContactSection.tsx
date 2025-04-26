
import { Instagram, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  return (
    <section id="contacto" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Ponte en contacto con nosotros</h2>
            <p className="text-pati-brown max-w-2xl mx-auto">
              ¿Quieres hacer un pedido o tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-bold text-pati-burgundy mb-6">Métodos de contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-pati-pink flex items-center justify-center mr-4">
                    <Instagram className="text-pati-burgundy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pati-burgundy">Instagram</h4>
                    <p className="text-pati-brown mb-2">La forma más rápida de contactarnos</p>
                    <a 
                      href="https://instagram.com/recetas.pati" 
                      className="text-pati-burgundy underline hover:text-pati-brown"
                    >
                      @recetas.pati
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-pati-pink flex items-center justify-center mr-4">
                    <Phone className="text-pati-burgundy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pati-burgundy">Teléfono</h4>
                    <p className="text-pati-brown mb-2">Disponible de lunes a viernes de 9:00 a 18:00</p>
                    <a 
                      href="tel:+34600000000" 
                      className="text-pati-burgundy underline hover:text-pati-brown"
                    >
                      +34 600 000 000
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-pati-pink flex items-center justify-center mr-4">
                    <Mail className="text-pati-burgundy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-pati-burgundy">Email</h4>
                    <p className="text-pati-brown mb-2">Te responderemos en menos de 24 horas</p>
                    <a 
                      href="mailto:info@recetaspati.es" 
                      className="text-pati-burgundy underline hover:text-pati-brown"
                    >
                      info@recetaspati.es
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 bg-pati-cream rounded-lg p-6">
                <h4 className="font-bold text-pati-burgundy mb-2">Entrega local en Granada</h4>
                <p className="text-pati-brown mb-4">
                  Por el momento solo realizamos entregas en Granada capital y área metropolitana.
                </p>
                <p className="text-pati-burgundy font-medium">
                  ¿Estás fuera de Granada? Rellena el formulario de expansión y te avisaremos cuando estemos disponibles en tu ciudad.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-pati-burgundy mb-6">Envíanos un mensaje</h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-pati-brown mb-1">
                      Nombre
                    </label>
                    <Input 
                      id="name" 
                      placeholder="Tu nombre" 
                      className="border-pati-pink focus:border-pati-burgundy" 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-pati-brown mb-1">
                      Teléfono
                    </label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="Tu teléfono" 
                      className="border-pati-pink focus:border-pati-burgundy" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-pati-brown mb-1">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="Tu email" 
                    className="border-pati-pink focus:border-pati-burgundy" 
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-pati-brown mb-1">
                    Asunto
                  </label>
                  <Input 
                    id="subject" 
                    placeholder="Asunto de tu mensaje" 
                    className="border-pati-pink focus:border-pati-burgundy" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-pati-brown mb-1">
                    Mensaje
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Cuéntanos en qué podemos ayudarte" 
                    className="border-pati-pink focus:border-pati-burgundy min-h-[120px]" 
                  />
                </div>
                <Button className="w-full bg-pati-burgundy hover:bg-pati-brown text-white">
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
