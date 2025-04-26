
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ExpansionForm = () => {
  const { toast } = useToast();
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city || !email) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, completa todos los campos.",
        variant: "destructive"
      });
      return;
    }
    
    // Mock form submission
    toast({
      title: "¡Gracias por tu interés!",
      description: "Te avisaremos cuando estemos disponibles en tu ciudad.",
    });
    
    // Reset form
    setCity("");
    setEmail("");
  };
  
  return (
    <section className="py-16 bg-pati-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">
            ¿Quieres probar nuestros productos en tu ciudad?
          </h2>
          <p className="text-pati-brown mb-8 max-w-2xl mx-auto">
            Actualmente solo realizamos envíos en Granada, pero estamos planeando nuestra expansión. Déjanos tus datos y te avisaremos cuando estemos disponibles en tu zona.
          </p>
          
          <div className="bg-white rounded-xl p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label htmlFor="city" className="block text-sm font-medium text-pati-brown">
                    Tu ciudad
                  </label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="border-pati-pink focus:border-pati-burgundy">
                      <SelectValue placeholder="Selecciona tu ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madrid">Madrid</SelectItem>
                      <SelectItem value="barcelona">Barcelona</SelectItem>
                      <SelectItem value="sevilla">Sevilla</SelectItem>
                      <SelectItem value="valencia">Valencia</SelectItem>
                      <SelectItem value="malaga">Málaga</SelectItem>
                      <SelectItem value="otro">Otra ciudad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="block text-sm font-medium text-pati-brown">
                    Tu email
                  </label>
                  <Input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="border-pati-pink focus:border-pati-burgundy"
                  />
                </div>
              </div>
              
              <Button 
                type="submit"
                className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-6 w-full md:w-auto text-lg"
              >
                Quiero que me avisen
              </Button>
              
              <div className="text-sm text-pati-brown">
                Al enviar este formulario, aceptas recibir noticias sobre nuestra expansión. No compartiremos tus datos con terceros.
              </div>
            </form>
          </div>
          
          <div className="mt-10 timeline-container py-12 px-4">
            <div className="relative md:ml-[50%] md:pl-8 pb-10 md:pb-0 animate-slide-in">
              <div className="flex items-center">
                <span className="absolute md:-left-[17px] left-[50%] -translate-x-1/2 md:translate-x-0 w-8 h-8 rounded-full bg-pati-pink border-4 border-white"></span>
                <div className="md:ml-6 bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-pati-burgundy">Granada</h3>
                  <p className="text-pati-brown">Disponible actualmente</p>
                </div>
              </div>
            </div>
            
            <div className="relative md:mr-[50%] md:pr-8 pb-10 md:pb-0 animate-slide-in" style={{animationDelay: "0.2s"}}>
              <div className="flex items-center">
                <span className="absolute md:-right-[17px] right-[auto] left-[50%] -translate-x-1/2 md:translate-x-0 w-8 h-8 rounded-full bg-pati-pink border-4 border-white"></span>
                <div className="md:mr-6 bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-pati-burgundy">Málaga</h3>
                  <p className="text-pati-brown">Próximamente</p>
                </div>
              </div>
            </div>
            
            <div className="relative md:ml-[50%] md:pl-8 animate-slide-in" style={{animationDelay: "0.4s"}}>
              <div className="flex items-center">
                <span className="absolute md:-left-[17px] left-[50%] -translate-x-1/2 md:translate-x-0 w-8 h-8 rounded-full bg-pati-pink border-4 border-white"></span>
                <div className="md:ml-6 bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-pati-burgundy">Toda España</h3>
                  <p className="text-pati-brown">Nuestro objetivo final</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpansionForm;
