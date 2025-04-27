import { useParams, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cookie, ArrowLeft, MessageCircle } from 'lucide-react';
import { productsData, Product as ProductType } from '@/data/products'; // Import centralized data and type

// Define a more specific type for the details object
interface ProductDetailsDisplay {
  name: string;
  description: string;
  images: string[];
  packSizes?: { name: string; price: string; description?: string }[];
  individualCookies?: { name: string; image: string; description: string }[];
  price?: string;
  serving?: string;
  categoryName?: string; // Added categoryName for back link
}

const ProductDetail = () => {
  const { category, id } = useParams();

  // Find the product details based on category and id
  const getProductDetails = (): ProductDetailsDisplay | null => {
    const productId = parseInt(id || '0');
    const product = productsData.find(p => p.id === productId && p.category === category);

    if (!product) return null;

    // Map the found product data to the structure expected by the component
    const details: ProductDetailsDisplay = {
      name: product.name,
      description: product.description,
      images: [product.image],
      categoryName: category, // Store category name
    };

    if (category === 'galletas' && product.options && product.individualCookies) {
      details.packSizes = product.options;
      details.individualCookies = product.individualCookies;
    } else if (category === 'tartas' && product.price && product.size) {
      details.price = product.price;
      details.serving = product.size;
    } else if (category === 'palmeritas' && product.options) {
      details.packSizes = product.options;
      details.price = product.price; // Base price
    } else if (category === 'mini-tartas' && product.price && product.options) {
        details.price = product.price; 
        details.packSizes = product.options;
    }

    return details;
  };

  const product = getProductDetails();

  if (!product) {
    // Better not found message
    return (
       <div className="min-h-screen flex flex-col">
          <Navbar />
           <main className="flex-grow container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-pati-burgundy mb-4">Oops! Producto no encontrado</h1>
                <p className="text-pati-brown mb-6">No pudimos encontrar el producto que buscas.</p>
                <Button asChild>
                   <Link to="/">Volver al inicio</Link>
                </Button>
           </main>
          <Footer />
       </div>
    );
  }
  
  // WhatsApp message generation - CUSTOMIZED PER CATEGORY
  const phoneNumber = "34671266981";
  let baseMessage = "";
  const productName = product.name; // Easier to reference

  switch (category) {
    case 'tartas':
      baseMessage = 
`¡Hola Pati! 🎂 Necesito una de tus *tartas espectaculares* (${productName}) para conquistar el mundo (o al menos una fiesta 😉).

¿Hablamos de detalles? ✨`;
      break;
    case 'galletas':
      baseMessage = 
`¡Alerta, antojo de galletas! 🍪 Necesito una *caja de tus maravillas* (${productName}).

¿Qué sabores me recomiendas hoy para alegrarme el día? 🤔 ¡Gracias! 🙏`;
      break;
    case 'palmeritas':
      baseMessage = 
`¡Hola Pati! Necesito urgentemente un cargamento de tus *palmeritas mágicas* ✨ (${productName}).

¡Son para compartir... o no! 😈 ¿Cómo hago el pedido? 💸`;
      break;
    case 'mini-tartas':
      baseMessage = 
`¡Hola! 😍 Me han enamorado tus *mini tartas* (${productName}).

¡Son perfectas para [Mencionar evento posible como 'una reunión' o 'un capricho']! ¿Cómo puedo reservar un pack? 🧁`;
      break;
    default:
      // Fallback generic message
      baseMessage = 
`¡Hola Pati! 👋 Estoy interesado/a en el producto: *${productName}*.

¿Podrías darme más información o ayudarme a hacer un pedido? 😊`;
  }

  const finalMessage = `${baseMessage}

(Visto en la web: /Recetaspati/product/${category}/${id})`; // Added Recetaspati base to the URL reference
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

  // Capitalize category name for display
  const displayCategoryName = product.categoryName?.charAt(0).toUpperCase() + product.categoryName?.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pati-cream"> {/* Added gradient background */}
      <Navbar />
      {/* Increased vertical padding */}
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16"> 
        
        {/* Back Link */}
        <Link 
           to={category === 'tartas' ? '/category/tartas' : '/Recetaspati/#productos'} // Link back to category page for tartas, or main catalog otherwise
           className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy mb-6 group"
         >
           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           {category === 'tartas' ? 'Volver a Tartas' : 'Volver al catálogo'}
         </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start"> {/* Added items-start */}
          {/* Image Section */}
          {/* Sticky only on md and larger screens */}
          <div className="space-y-4 md:sticky md:top-24"> 
            <Card className="overflow-hidden border-pati-pink/30 shadow-md"> {/* Added card style */}
              <CardContent className="p-0">
                <div className="aspect-square"> {/* Maintain aspect ratio */}
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-contain" 
                  />
                </div>
              </CardContent>
            </Card>
             {/* Add space for image thumbnails if needed later */}
          </div>
          
          {/* Details Section */}
          <div className="space-y-6">
            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy">{product.name}</h1> 
            
            {/* Product Description */}
            <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p> 

            {/* Divider */}
            <hr className="border-pati-pink/50" />

            {/* Conditional Rendering for Different Categories */}

            {/* GALLETAS Details */}
            {category === 'galletas' && product.packSizes && product.individualCookies && (
              <div className="space-y-6">
                {/* Pack Sizes */}
                <Card className="bg-white/50 border-pati-pink/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-pati-burgundy">Opciones de Pack</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.packSizes.map((pack) => (
                      <div key={pack.name} className="flex justify-between items-baseline border-b border-pati-pink/20 pb-2 last:border-b-0">
                        <div>
                           <span className="font-medium text-pati-burgundy">{pack.name}</span>
                           {pack.description && <p className="text-sm text-pati-brown mt-1">{pack.description}</p>}
                        </div>
                        <span className="text-xl font-bold text-pati-burgundy whitespace-nowrap pl-4">{pack.price}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Available Flavors */}
                <Card className="bg-white/50 border-pati-pink/30">
                   <CardHeader>
                      <CardTitle className="text-xl text-pati-burgundy flex items-center gap-2">
                         <Cookie className="h-5 w-5" /> Sabores Disponibles
                      </CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                         {product.individualCookies.map((cookie) => (
                           <div key={cookie.name} className="text-center group">
                             <div className="aspect-square rounded-lg overflow-hidden mb-2 border border-pati-pink/20 bg-pati-cream">
                               <img 
                                 src={cookie.image} 
                                 alt={cookie.name}
                                 className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                               />
                             </div>
                             <h4 className="text-sm font-medium text-pati-burgundy">{cookie.name}</h4>
                             {/* <p className="text-xs text-pati-brown mt-1">{cookie.description}</p> */}
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}
            
            {/* TARTAS Details */}
            {category === 'tartas' && (
               <Card className="bg-white/50 border-pati-pink/30">
                  <CardHeader>
                      <CardTitle className="text-xl text-pati-burgundy">Detalles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex justify-between items-center border-b border-pati-pink/20 pb-2">
                       <span className="font-medium text-pati-burgundy">Precio</span>
                       <span className="text-2xl font-bold text-pati-burgundy">{product.price}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="font-medium text-pati-burgundy">Tamaño / Raciones</span>
                       <span className="text-pati-brown text-right">{product.serving}</span>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* PALMERITAS / MINI-TARTAS Details (Options/Packs) */}
            {(category === 'palmeritas' || category === 'mini-tartas') && product.packSizes && (
               <Card className="bg-white/50 border-pati-pink/30">
                  <CardHeader>
                     <CardTitle className="text-xl text-pati-burgundy">Opciones / Packs</CardTitle>
                     {product.price && category === 'palmeritas' && <CardDescription>Precio base: {product.price}</CardDescription> }
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.packSizes.map((pack) => (
                      <div key={pack.name} className="flex justify-between items-baseline border-b border-pati-pink/20 pb-2 last:border-b-0">
                        <div>
                           <span className="font-medium text-pati-burgundy">{pack.name}</span>
                           {pack.description && <p className="text-sm text-pati-brown mt-1">{pack.description}</p>}
                        </div>
                        <span className="text-xl font-bold text-pati-burgundy whitespace-nowrap pl-4">{pack.price}</span>
                      </div>
                    ))}
                  </CardContent>
               </Card>
            )}

            {/* WhatsApp CTA Button */}
            <div className="pt-4"> {/* Added padding top */}
               <Button asChild size="lg" className="w-full bg-pati-burgundy hover:bg-pati-brown text-white py-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" /> Consultar / Pedir por WhatsApp
                  </a>
               </Button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
