import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Testimonial = {
  id: number;
  name: string;
  comment: string;
  rating: number;
  image?: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María García",
    comment: "Las tartas de Pati son increíbles, especialmente la de zanahoria. Todo mi familia quedó encantada en mi cumpleaños.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    date: "15/03/2025"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    comment: "Pedí galletas de Nutella para un evento en la oficina y fueron todo un éxito. El sabor y la presentación son impecables.",
    rating: 5,
    date: "02/02/2025"
  },
  {
    id: 3,
    name: "Laura Martínez",
    comment: "Las palmeritas son adictivas, suaves y con el punto justo de dulzor. Las pido regularmente y siempre están perfectas.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    date: "28/01/2025"
  },
  {
    id: 4,
    name: "Pedro Sánchez",
    comment: "La tarta de lotus fue la estrella en el cumpleaños de mi novia. El servicio personalizado de Pati marca la diferencia.",
    rating: 5,
    date: "10/03/2025"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonios" className="py-16 bg-pati-light-pink">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-pati-brown max-w-2xl mx-auto">
            Estos son algunos comentarios de personas que ya han probado nuestros productos y han quedado encantadas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        
        {/* Video testimonials - Updated to use actual videos and horizontal layout */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-pati-burgundy mb-8 text-center">
            Ve las reacciones a nuestros productos
          </h3>
          {/* Use flexbox for horizontal layout, wrap on smaller screens */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center">
            
            {/* Video 1 */}
            <div className="w-full md:w-1/3 aspect-video bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pati-pink/50">
              <video 
                controls 
                preload="metadata" 
                className="w-full h-full object-cover"
                poster="/Recetaspati/placeholder.svg" // Optional: Add specific poster images later?
              >
                <source src="/Recetaspati/videos/Reacciones-1.mp4#t=0.5" type="video/mp4" />
                Tu navegador no soporta vídeos.
              </video>
            </div>

            {/* Video 2 */}
            <div className="w-full md:w-1/3 aspect-video bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pati-pink/50">
              <video 
                controls 
                preload="metadata" 
                className="w-full h-full object-cover"
                poster="/Recetaspati/placeholder.svg"
              >
                <source src="/Recetaspati/videos/Reacciones-2.mp4#t=0.5" type="video/mp4" />
                Tu navegador no soporta vídeos.
              </video>
            </div>

            {/* Video 3 */}
             <div className="w-full md:w-1/3 aspect-video bg-white rounded-lg shadow-lg overflow-hidden border-2 border-pati-pink/50">
              <video 
                controls 
                preload="metadata" 
                className="w-full h-full object-cover"
                poster="/Recetaspati/placeholder.svg"
              >
                <source src="/Recetaspati/videos/Reacciones-3.mp4#t=0.5" type="video/mp4" />
                Tu navegador no soporta vídeos.
              </video>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
            {testimonial.image ? (
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-pati-pink flex items-center justify-center text-pati-burgundy font-bold">
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-pati-burgundy">{testimonial.name}</h4>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                />
              ))}
            </div>
            <p className="text-xs text-pati-brown mt-1">{testimonial.date}</p>
          </div>
        </div>
        <p className="text-pati-dark-brown flex-grow">{testimonial.comment}</p>
      </CardContent>
    </Card>
  );
};

export default Testimonials;
