import { useParams, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cookie, ArrowLeft, MessageCircle, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { productsData, Product as ProductType } from '@/data/products'; // Import centralized data and type
import { useState, useMemo } from 'react'; // Import useState and useMemo
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Ensure Carousel is imported
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Badge } from "@/components/ui/badge"; // For showing count

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
  // MODIFIED State: Use Record<string, number> for counts per cookie name
  const [selectedCookies, setSelectedCookies] = useState<Record<string, number>>({}); 
  const individualPrice = 3; // Price per individual cookie
  const phoneNumber = "+34644180213"; // Define phoneNumber earlier

  // Memoize product details to avoid re-calculation on state change
  const product = useMemo(() => {
    const productId = parseInt(id || '0');
    const foundProductData = productsData.find(p => p.id === productId && p.category === category);
    if (!foundProductData) return null;
    
    // We need the full product data
    return foundProductData; 
  }, [category, id]);

  // Helper function to parse price string (e.g., "16€") into number
  const parsePrice = (priceString: string | undefined): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace('€', '').replace(',', '.'));
  };

  // Memoize pack prices
  const packPrices = useMemo(() => {
    const prices: { [key: number]: number } = {};
    if (product?.category === 'galletas' && product.options) {
      const pack6 = product.options.find(opt => opt.name.includes('6'));
      const pack12 = product.options.find(opt => opt.name.includes('12'));
      if (pack6) prices[6] = parsePrice(pack6.price);
      if (pack12) prices[12] = parsePrice(pack12.price);
    }
    return prices;
  }, [product]);

  // MODIFIED Handler: Increments count for the clicked cookie
  const incrementCookie = (cookieName: string) => {
    setSelectedCookies(prev => ({
      ...prev,
      [cookieName]: (prev[cookieName] || 0) + 1
    }));
  };

  // MODIFIED Handler: Decrements count, removes if zero
  const decrementCookie = (cookieName: string) => {
    setSelectedCookies(prev => {
      const currentCount = prev[cookieName] || 0;
      if (currentCount <= 1) {
        // Remove the cookie from the state if count drops to 0 or below
        const { [cookieName]: _, ...rest } = prev; // Destructure to omit the key
        return rest;
      } else {
        // Otherwise, just decrement
        return {
          ...prev,
          [cookieName]: currentCount - 1
        };
      }
    });
  };

  // MODIFIED Calculate current total count 
  const currentCount = useMemo(() => {
      return Object.values(selectedCookies).reduce((sum, count) => sum + count, 0);
  }, [selectedCookies]);
  
  const currentIndividualTotal = currentCount * individualPrice;

  // calculateFinalPrice function remains the same, but uses the updated currentCount
  const calculateFinalPrice = (): number => {
      if (currentCount === 0) return 0;
      const pricePack12 = packPrices[12];
      const pricePack6 = packPrices[6];
      if (pricePack12 && currentCount >= 12) {
         return pricePack12 + (currentCount - 12) * individualPrice;
      }
      if (pricePack6 && currentCount >= 6) {
         return pricePack6 + (currentCount - 6) * individualPrice;
      }
      return currentCount * individualPrice;
  };

  const finalPrice = calculateFinalPrice();
  const savings = currentIndividualTotal - finalPrice;

  // Generate incentive message - Logic remains similar, uses updated currentCount
  let incentiveMessage = "";
  if (currentCount === 0) {
     incentiveMessage = "Empieza a seleccionar tus galletas favoritas haciendo clic en ellas.";
  } else if (currentCount < 6) {
     const needed = 6 - currentCount;
     const potentialSavingsPack6 = (6 * individualPrice) - (packPrices[6] || (6 * individualPrice));
     incentiveMessage = `¡Añade ${needed} más para el Pack 6${potentialSavingsPack6 > 0 ? ` y ahorra al menos ${potentialSavingsPack6.toFixed(2).replace('.', ',')}€` : ''}!`;
  } else if (currentCount >= 6 && currentCount < 12) {
     const needed = 12 - currentCount;
     const potentialSavingsPack12 = (12 * individualPrice) - (packPrices[12] || (12 * individualPrice));
     incentiveMessage = `¡Ya tienes el Pack 6! Añade ${needed} más para el Pack 12${potentialSavingsPack12 > 0 ? ` y ahorra aún más (total ${potentialSavingsPack12.toFixed(2).replace('.', ',' )}€)` : ''}!`;
  } else { // 12 or more
      incentiveMessage = `¡Pack 12 alcanzado! Puedes seguir añadiendo galletas extra a ${individualPrice}€ cada una.`;
  }

   // MODIFIED Generate WhatsApp message to show counts
   const generateWhatsAppMessage = () => {
      const selectedItems = Object.entries(selectedCookies)
                                 .filter(([, count]) => count > 0) // Filter out cookies with count 0 (if any)
                                 .map(([name, count]) => `- ${name} (x${count})`)
                                 .join('\n');
      const messageIntro = selectedItems.length > 0 ? `Quiero configurar mi caja con ${currentCount} galleta(s):` : "Quiero consultar sobre las cajas de galletas.";
      const selectedList = selectedItems.length > 0 ? `\n${selectedItems}` : "";

      let priceDetail = "";
      if (currentCount === 0) {
          priceDetail = "(No hay galletas seleccionadas)";
      } else if (currentCount < 6) {
          priceDetail = `${currentCount} galletas x ${individualPrice}€ = ${finalPrice.toFixed(2).replace('.', ',' )}€`;
      } else if (currentCount >= 6 && currentCount < 12) {
          const extras = currentCount - 6;
          priceDetail = `Pack 6 (${packPrices[6]?.toFixed(2).replace('.', ',' ) || '?'}€)${extras > 0 ? ` + ${extras} extra(s) (${(extras * individualPrice).toFixed(2).replace('.', ',' )}€)` : ''} = ${finalPrice.toFixed(2).replace('.', ',' )}€`;
      } else { // 12 or more
          const extras = currentCount - 12;
          priceDetail = `Pack 12 (${packPrices[12]?.toFixed(2).replace('.', ',' ) || '?'}€)${extras > 0 ? ` + ${extras} extra(s) (${(extras * individualPrice).toFixed(2).replace('.', ',' )}€)` : ''} = ${finalPrice.toFixed(2).replace('.', ',' )}€`;
      }
      
      return `¡Hola Pati! 👋 ${messageIntro}${selectedList}

Total Estimado: ${priceDetail}
${savings > 0.01 ? `(Ahorro: ${savings.toFixed(2).replace('.', ',' )}€)` : ''}

¿Confirmamos el pedido? 😊`;
   };
   
   const finalWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
   
   // Get the raw message text for preview
   const whatsappMessagePreview = useMemo(() => {
       if (currentCount === 0) return "";
       return generateWhatsAppMessage(); // Generate the message text
   }, [selectedCookies, currentCount, packPrices]); // Recalculate when selection changes

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

  // Capitalize category name for display using the correct property: product.category
  const displayCategoryName = product.category?.charAt(0).toUpperCase() + product.category?.slice(1).replace('-', ' ');

  // Function to scroll to summary
  const scrollToSummary = () => {
      document.getElementById('summary-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pati-cream">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 relative pb-24 lg:pb-16"> {/* Add padding-bottom for sticky bar space on mobile */}
        
        {/* Back Link */}
        <Link 
           to={'/#productos'} 
           className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy mb-6 group"
         >
           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           Volver al catálogo
         </Link>

        {/* Main Product Detail Area */} 
        {/* Only render cookie configurator if category is 'galletas' */}
        {product.category === 'galletas' && product.individualCookies ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
            {/* Left Column: Cookie Grid Selector - Minor transition enhancement */}
            <div className="space-y-4">
               <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
               <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
               <Card className="border-pati-pink/30 shadow-md">
                  <CardHeader>
                     <CardTitle className="text-xl text-pati-burgundy flex items-center gap-2">
                       <Cookie className="h-5 w-5" /> Elige tus Sabores
                     </CardTitle>
                     <CardDescription>Usa los botones +/- para ajustar la cantidad.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                       {product.individualCookies.map((cookie, index) => {
                         const count = selectedCookies[cookie.name] || 0;
                         const isSelected = count > 0;
                         return (
                           <div key={index} className="p-1 h-full">
                             <Card 
                               className={`h-full flex flex-col items-center text-center p-3 transition-all duration-200 ease-in-out border-2 ${isSelected ? 'border-pati-burgundy bg-pati-pink/10 scale-[1.02]' : 'border-transparent bg-white/50'}`}
                             >
                                <div className="aspect-square rounded-lg overflow-hidden mb-2 w-full">
                                  <img 
                                    src={cookie.image} 
                                    alt={cookie.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <h4 className="text-sm font-medium text-pati-burgundy flex-grow mb-2">{cookie.name}</h4>
                                <div className="flex items-center justify-center gap-2 mt-auto w-full">
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     className={`text-pati-brown hover:text-pati-burgundy hover:bg-pati-pink/20 focus-visible:ring-1 focus-visible:ring-pati-burgundy rounded-full h-8 w-8 ${count === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                     onClick={() => decrementCookie(cookie.name)}
                                     disabled={count === 0}
                                     aria-label={`Quitar una galleta ${cookie.name}`}
                                   >
                                       <MinusCircle className="h-5 w-5" />
                                   </Button>
                                   <Badge 
                                     variant={isSelected ? "default" : "outline"} 
                                     className={`text-lg font-bold px-3 py-1 tabular-nums min-w-[45px] flex justify-center border-2 rounded-md transition-all duration-200 ease-in-out ${isSelected ? 'bg-pati-burgundy text-white border-pati-burgundy scale-110' : 'text-gray-400 border-gray-300 scale-100'}`}
                                    >
                                       {count}
                                    </Badge>
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     className="text-pati-brown hover:text-pati-burgundy hover:bg-pati-pink/20 focus-visible:ring-1 focus-visible:ring-pati-burgundy rounded-full h-8 w-8"
                                     onClick={() => incrementCookie(cookie.name)}
                                     aria-label={`Añadir una galleta ${cookie.name}`}
                                   >
                                       <PlusCircle className="h-5 w-5" />
                                   </Button>
                                </div>
                             </Card>
                           </div>
                         );
                       })}
                    </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right Column: Virtual Box & Pricing - Assign ID */}
            <div id="summary-card" className="space-y-6 sticky top-24"> {/* Added id="summary-card" */}
               <Card className="border-pati-pink/30 shadow-lg">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-xl text-pati-burgundy">Tu Caja Personalizada</CardTitle>
                     <CardDescription>Resumen de tu selección:</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2"> 
                     
                     <div className="flex justify-between items-center font-medium">
                       <span>Total Galletas:</span>
                       <Badge variant="secondary">{currentCount}</Badge>
                     </div>

                     <div className="text-center bg-pati-cream p-3 rounded-md border border-pati-pink/20 min-h-[60px] flex items-center justify-center">
                        <p className="text-sm font-semibold text-pati-burgundy">{incentiveMessage}</p>
                     </div>

                     <div className="flex justify-between items-center text-lg font-bold text-pati-burgundy">
                        <span>Precio Total Estimado:</span>
                        <span>{finalPrice.toFixed(2).replace('.', ',' )}€</span>
                     </div>
                     
                     {savings > 0.01 && (
                         <div className="flex justify-between items-center text-sm text-green-700 font-medium">
                            <span>Ahorro Estimado:</span>
                            <span>{savings.toFixed(2).replace('.', ',' )}€</span>
                         </div>
                     )}

                     <hr className="border-pati-pink/50" />

                     {/* WhatsApp Message Preview - Styled like a chat bubble */} 
                     {currentCount > 0 && (
                       <div className="space-y-2">
                          <p className="text-sm font-medium text-pati-brown">Vista previa del mensaje:</p>
                          <div className="text-sm p-3 bg-green-100 border border-green-200 rounded-lg rounded-tl-none shadow-sm whitespace-pre-wrap break-words font-sans text-gray-800">
                             {whatsappMessagePreview}
                          </div>
                       </div>
                     )}

                     <Button asChild size="lg" className="w-full bg-pati-burgundy hover:bg-pati-brown text-white py-3" disabled={currentCount === 0}> 
                       <a href={finalWhatsappUrl} target="_blank" rel="noopener noreferrer">
                         <MessageCircle className="mr-2 h-5 w-5" /> Mandar pedido a Pati
                       </a>
                     </Button>
                     
                  </CardContent>
               </Card>
            </div>
          </div>
        ) : (
           // Fallback for non-cookie products (similar to previous version)
           <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Image Section */}
                <div className="space-y-4 md:sticky md:top-24">
                   <Card className="overflow-hidden border-pati-pink/30 shadow-md">
                     <CardContent className="p-0">
                       <div className="aspect-square">
                         <img 
                           src={product?.image || ''} 
                           alt={product?.name || 'Producto'}
                           className="w-full h-full object-contain" 
                         />
                       </div>
                     </CardContent>
                   </Card>
                </div>
                {/* Details Section */}
                 <div className="space-y-6">
                    <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy">{product?.name}</h1> 
                    <p className="text-pati-dark-brown text-lg leading-relaxed">{product?.description}</p>
                     <hr className="border-pati-pink/50" />
                     {/* Corrected Conditional Rendering: Use product.category */} 
                     {(product.category === 'tartas' || product.category === 'palmeritas' || product.category === 'mini-tartas') && (
                        <Card className="bg-white/50 border-pati-pink/30">
                           <CardHeader>
                              <CardTitle className="text-xl text-pati-burgundy">Detalles</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-3">
                             {product?.price && (
                                <div className="flex justify-between items-center border-b border-pati-pink/20 pb-2">
                                   <span className="font-medium text-pati-burgundy">Precio</span>
                                   <span className="text-2xl font-bold text-pati-burgundy">{product.price}</span>
                                 </div>
                             )}
                             {product?.size && (
                                <div className="flex justify-between items-center">
                                   <span className="font-medium text-pati-burgundy">Tamaño / Raciones</span>
                                   <span className="text-pati-brown text-right">{product.size}</span>
                                 </div>
                             )}
                             {product?.options && (
                                product.options.map((opt) => (
                                    <div key={opt.name} className="flex justify-between items-baseline border-b border-pati-pink/20 pb-2 last:border-b-0">
                                      <div>
                                         <span className="font-medium text-pati-burgundy">{opt.name}</span>
                                         {opt.description && <p className="text-sm text-pati-brown mt-1">{opt.description}</p>}
                                      </div>
                                      <span className="text-xl font-bold text-pati-burgundy whitespace-nowrap pl-4">{opt.price}</span>
                                    </div>
                                ))
                             )}
                           </CardContent>
                        </Card>
                     )}
                    {/* Generic WhatsApp Button for other products */}
                     <div className="pt-4">
                        <Button asChild size="lg" className="w-full bg-pati-burgundy hover:bg-pati-brown text-white py-3">
                           <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`¡Hola Pati! 👋 Estoy interesado/a en: *${product?.name}*. ¿Me das más info? 😊`)}`} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="mr-2 h-5 w-5" /> Consultar / Pedir por WhatsApp
                           </a>
                        </Button>
                     </div>
                </div>
           </div>
        )}
        
        {/* ADDED: Sticky Footer Bar for Mobile Summary */} 
        {product.category === 'galletas' && currentCount > 0 && (
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white p-3 border-t border-gray-200 shadow-md lg:hidden flex items-center justify-between gap-4">
                <div className="flex flex-col text-sm">
                    <span className="font-semibold text-pati-dark-brown">Total: {currentCount} galleta{currentCount !== 1 ? 's' : ''}</span>
                    <span className="font-bold text-lg text-pati-burgundy">{finalPrice.toFixed(2).replace('.', ',' )}€</span>
                </div>
                <Button 
                    onClick={scrollToSummary}
                    className="bg-pati-burgundy hover:bg-pati-brown text-white whitespace-nowrap"
                    size="sm"
                >
                    Ver Resumen y Pedir
                </Button>
            </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
