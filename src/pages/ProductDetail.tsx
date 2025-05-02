import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cookie, ArrowLeft, PlusCircle, MinusCircle, Info, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { productsData, Product as ProductType } from '@/data/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useInView } from 'react-intersection-observer';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

// Define Props for the inner component - ADD category and id
interface CookieConfiguratorProps {
    product: ProductType;
    category: string; // Add category prop
    id: string;       // Add id prop
}

// Inner Component handling configuration logic and UI - Accept props
const CookieConfigurator: React.FC<CookieConfiguratorProps> = ({ product, category, id }) => {
    // All state and logic related to configuration goes here
    const [selectedCookies, setSelectedCookies] = useState<Record<string, number>>({}); 
    const [selectedPackSize, setSelectedPackSize] = useState<number | null>(null); 
    const phoneNumber = "+34644180213"; 
  
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const { ref: summaryRef, inView } = useInView({ threshold: 0.5 });
    useEffect(() => { setIsSummaryVisible(inView); }, [inView]);

    // Pack details
    const packOptions = [
        { size: 6, price: 16, description: "Elige hasta 6 galletas" },
        { size: 12, price: 29, description: "¡Con 1 galleta GRATIS!" },
    ];
    
    // Calculate current count
    const currentCount = useMemo(() => {
        return Object.values(selectedCookies).reduce((sum, count) => sum + count, 0);
    }, [selectedCookies]);

    // Check if more cookies can be added
    const canAddMoreCookies = useMemo(() => {
         return selectedPackSize !== null && currentCount < selectedPackSize;
    }, [selectedPackSize, currentCount]);

    // Handlers for +/- 
    const decrementCookie = (cookieName: string) => {
        setSelectedCookies(prev => {
            const currentCount = prev[cookieName] || 0;
            if (currentCount <= 1) {
                const { [cookieName]: _, ...rest } = prev;
                return rest;
            } else {
                return { ...prev, [cookieName]: currentCount - 1 };
            }
        });
    };

    const incrementCookie = (cookieName: string) => {
        if (canAddMoreCookies) { // Use the memoized value directly
           setSelectedCookies(prev => ({
               ...prev,
               [cookieName]: (prev[cookieName] || 0) + 1
           }));
       }
    };
    
    const handlePackSelect = (value: string) => {
        const size = parseInt(value);
        setSelectedPackSize(size);
        // Reset cookies when changing pack size for simplicity now
        setSelectedCookies({}); 
    };

    // Calculate final price based on selected pack
    const finalPackPrice = useMemo(() => {
        if (!selectedPackSize) return 0;
        return packOptions.find(p => p.size === selectedPackSize)?.price || 0;
    }, [selectedPackSize]);

    // Check if order is complete (correct number of cookies)
    const isOrderComplete = useMemo(() => {
         return selectedPackSize !== null && currentCount === selectedPackSize;
    }, [selectedPackSize, currentCount]);

    // Generate WhatsApp message
    const generateWhatsAppMessage = () => {
        if (!selectedPackSize || !isOrderComplete) return "Error: Selección incompleta";
        const selectedItems = Object.entries(selectedCookies).filter(([, count]) => count > 0).map(([name, count]) => `- ${name} (x${count})`).join('\n');
        return `¡Hola Pati! 👋 Quiero mi Pack de ${selectedPackSize} galletas (${finalPackPrice}€):

${selectedItems}

¿Confirmamos el pedido? 😊`;
    };
    
    const finalWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
    
    const whatsappMessagePreview = useMemo(() => {
        if (!selectedPackSize) return "Selecciona un tamaño de pack para empezar.";
        if (currentCount < selectedPackSize) return `Selecciona ${selectedPackSize - currentCount} galleta(s) más.`;
        if (currentCount > selectedPackSize) return "Error: Has superado el límite de galletas.";
        return generateWhatsAppMessage();
    }, [selectedCookies, selectedPackSize, currentCount, finalPackPrice, isOrderComplete]); // Added isOrderComplete dependency
    
    // Function to scroll to summary
    const scrollToSummary = () => {
        document.getElementById('summary-card')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });
    };

    // --- RETURN JSX for CookieConfigurator --- 
  return (
      <> 
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Pack Selection -> Cookies */} 
          <div className="space-y-6">
            {/* ... Title, Description (passed from product prop) ... */} 
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
            <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
            
            {/* Step 1: Select Pack Size - ENHANCED */} 
            <Card className="border-pati-pink/30 shadow-md">
              <CardHeader>
                 <CardTitle className="text-xl text-pati-burgundy">1. Elige tu Pack</CardTitle>
                 <CardDescription>Selecciona el tamaño de tu caja.</CardDescription>
              </CardHeader>
              <CardContent>
                 <RadioGroup 
                     onValueChange={handlePackSelect} 
                     value={selectedPackSize?.toString()} 
                     className="grid grid-cols-2 gap-3 md:gap-4" 
                 >
                    {packOptions.map((pack) => {
                        const isSelected = selectedPackSize === pack.size;
                        return (
                             <Label 
                                 key={pack.size} 
                                 htmlFor={`pack-${pack.size}`} 
                                 // Enhanced hover and added relative positioning for check icon
                                 className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-3 md:p-4 transition-all duration-200 hover:bg-pati-pink/20 hover:scale-[1.02] ${isSelected ? 'border-pati-burgundy bg-pati-pink/20' : 'border-transparent hover:border-pati-pink/30'} cursor-pointer ${selectedPackSize && !isSelected ? 'opacity-70' : ''}`}
                             >
                                 <RadioGroupItem value={pack.size.toString()} id={`pack-${pack.size}`} className="sr-only" />
                                 {/* Added Check icon when selected */}
                                 {isSelected && (
                                     <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-pati-burgundy" />
                                 )}
                                 <span className="mb-1 font-semibold text-base md:text-lg text-pati-burgundy">Pack {pack.size}</span>
                                 {/* UPDATED Description for Pack 12 with Emoji */} 
                                 <span className={`text-xs md:text-sm text-pati-brown mb-1 md:mb-2 text-center ${pack.size === 12 ? 'font-semibold text-green-700' : ''}`}>
                                     {pack.description} {pack.size === 12 && '🎁'}
                                 </span>
                                 <span className="font-bold text-xl md:text-2xl text-pati-burgundy">{pack.price}€</span>
                             </Label>
                        );
                    })}
                  </RadioGroup>
              </CardContent>
            </Card>

            {/* Step 2: Select Cookies - Enhanced Counter Animation */} 
            {selectedPackSize && (
              <Card className={`border-pati-pink/30 shadow-md transition-opacity duration-300 ${selectedPackSize ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}> 
                 <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-pati-burgundy">2. Elige tus Sabores</CardTitle>
                    <CardDescription>Selecciona {selectedPackSize} galleta{selectedPackSize !== 1 ? 's' : ''}. Total: {currentCount} / {selectedPackSize}</CardDescription>
                    {!canAddMoreCookies && currentCount === selectedPackSize && (
                         <div className="text-sm pt-2 text-green-600 font-semibold flex items-center gap-1">
                             <CheckCircle2 className="h-4 w-4"/> ¡Caja Completa!
                         </div>
                    )}
                 </CardHeader>
                 <CardContent>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${!canAddMoreCookies ? 'opacity-75' : ''}`}> 
                      {product.individualCookies?.map((cookie, index) => { // Use product prop here
                        const count = selectedCookies[cookie.name] || 0;
                        const isSelected = count > 0;
                        const isAtLimit = !canAddMoreCookies;
                        
                        return (
                          <div key={index} className="p-1 h-full">
                            <Card className={`h-full flex flex-col text-center p-3 transition-all duration-200 ease-in-out border-2 ${isSelected ? 'border-pati-burgundy bg-pati-pink/10' : 'border-transparent bg-white/50'} ${isAtLimit && !isSelected ? 'opacity-50' : ''}`}>
                              {/* Clickable Area */} 
                              <div className={`flex flex-col items-center flex-grow mb-2 ${!canAddMoreCookies ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => canAddMoreCookies && incrementCookie(cookie.name)} aria-label={!canAddMoreCookies ? `Límite de ${selectedPackSize} galletas alcanzado` : `Añadir una galleta ${cookie.name}`} role="button" tabIndex={!canAddMoreCookies ? -1 : 0}>
                                 {/* Image */} 
                                 <div className="aspect-square rounded-lg overflow-hidden mb-2 w-full">
                                     <img src={cookie.image} alt={cookie.name} className="w-full h-full object-contain pointer-events-none" />
                                 </div>
                                 {/* Name */} 
                                 <h4 className="text-sm font-medium text-pati-burgundy px-1">{cookie.name}</h4>
                              </div>
                              {/* +/- Controls Area - Enhanced Badge Animation */}
                              <div className="flex items-center justify-center gap-2 mt-auto w-full flex-shrink-0">
                                  <Button variant="ghost" size="icon" className={`... ${count === 0 ? '...' : ''}`} onClick={() => decrementCookie(cookie.name)} disabled={count === 0}> <MinusCircle className="h-5 w-5" /> </Button>
                                  <Badge 
                                    variant={isSelected ? "default" : "outline"} 
                                    className={`text-lg font-bold px-3 py-1 tabular-nums min-w-[45px] flex justify-center border-2 rounded-md transition-all duration-150 ease-in-out ${isSelected ? 'bg-pati-burgundy text-white border-pati-burgundy scale-125' : 'text-gray-400 border-gray-300 scale-100'}`}
                                   >
                                     {count}
                                  </Badge>
                                  <Button variant="ghost" size="icon" className={`... ${!canAddMoreCookies ? '...' : ''}`} onClick={() => canAddMoreCookies && incrementCookie(cookie.name)} disabled={!canAddMoreCookies}> <PlusCircle className="h-5 w-5" /> </Button>
                              </div>
                            </Card>
                      </div>
                        );
                      })}
                    </div>
                 </CardContent>
              </Card>
            )} 
          </div>

          {/* Right Column: Virtual Box & Pricing (Simplified) */} 
          {selectedPackSize && (
            <div ref={summaryRef} id="summary-card" className={`space-y-6 sticky top-24 transition-opacity duration-300 ${selectedPackSize ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> 
              <Card className="border-pati-pink/30 shadow-lg">
                <CardHeader className="pb-2">
                   <CardTitle className="text-xl text-pati-burgundy">Resumen del Pack {selectedPackSize}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                   {/* Progress Badge (currentCount / selectedPackSize) */} 
                   <div className="flex justify-between items-center font-medium border-b pb-3 border-pati-pink/20">
                     <span>Galletas Seleccionadas:</span>
                     <Badge variant={isOrderComplete ? "default" : "secondary"} className={`${isOrderComplete ? 'bg-green-600' : ''}`}>{currentCount} / {selectedPackSize}</Badge>
                </div>

                   {/* Price (finalPackPrice) */} 
                   <div className="flex justify-between items-center text-2xl font-bold text-pati-burgundy">
                      <span>Precio Total Pack:</span>
                      <span>{finalPackPrice.toFixed(2).replace('.', ',' )}€</span>
                        </div>
                   
                   {/* WhatsApp Preview (whatsappMessagePreview) */} 
                   <div className="space-y-2">
                      <p className="text-sm font-medium text-pati-brown">Vista previa del mensaje:</p>
                      <div className={`text-sm p-3 border rounded-lg rounded-tl-none shadow-sm whitespace-pre-wrap break-words font-sans ${isOrderComplete ? 'bg-green-100 border-green-200 text-gray-800' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                         {whatsappMessagePreview}
                      </div>
                  </div>

                   {/* UPDATED CTA Button - Checks isOrderComplete */} 
                   <Button 
                     asChild 
                     size="lg" 
                     className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${!isOrderComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                     disabled={!isOrderComplete} 
                     aria-disabled={!isOrderComplete}
                   > 
                     <a 
                        href={isOrderComplete ? finalWhatsappUrl : undefined}
                        onClick={(e) => !isOrderComplete && e.preventDefault()}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                     >
                       <FaWhatsapp className="mr-2 h-5 w-5" /> 
                       {isOrderComplete ? `Mandar pedido Pack ${selectedPackSize}` : `Completa tu Pack ${selectedPackSize}`}
                     </a>
                   </Button>
                   
                </CardContent>
              </Card>
                </div>
          )}
        </div>

        {/* Sticky Footer Bar - REMOVED Progress Bar & Reverted Layout */} 
        {selectedPackSize && !isSummaryVisible && (
            // Reverted to flex-row, adjusted padding/gap if needed
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 py-3 border-t border-gray-200 shadow-lg lg:hidden flex items-center justify-between gap-3 min-h-[70px]">
                {/* Info section */} 
                <div className="flex flex-col text-sm flex-shrink">
                    <span className="font-semibold text-pati-dark-brown whitespace-nowrap">Pack {selectedPackSize} ({currentCount}/{selectedPackSize})</span>
                    <span className="font-bold text-lg text-pati-burgundy">{finalPackPrice.toFixed(2).replace('.', ',' )}€</span>
                </div>
                {/* Button section */} 
                <Button 
                    onClick={scrollToSummary}
                    className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-500 flex-shrink-0"
                    size="sm"
                >
                    {isOrderComplete ? <CheckCircle2 className="mr-2 h-4 w-4"/> : <FaWhatsapp className="mr-2 h-4 w-4" />} 
                    {isOrderComplete ? "Revisar Pedido" : "Completar Caja"}
                </Button>
              </div>
            )}
      </> 
    );
};

// Main Component - Handles fetching product and rendering Configurator or Not Found
const ProductDetail = () => {
  const { category, id } = useParams();

  // Only useMemo for product fetching is here
  const product = useMemo(() => {
    const productId = parseInt(id || '0');
    // Ensure product has individualCookies if category is 'galletas'
    const foundProduct = productsData.find(p => p.id === productId && p.category === category);
    if (foundProduct && category === 'galletas' && !foundProduct.individualCookies) {
        console.error("Product data for galletas is missing individualCookies array.");
        return null; // Treat as not found if data is incomplete
    }
    return foundProduct || null;
  }, [category, id]);

  // Early return if product not found or not a cookie product (for this specific UI)
  if (!product || product.category !== 'galletas' || !id || !category) {
    // TODO: Maybe show a different view for non-cookie products later?
    // For now, treat as not found or redirect?
    // Let's show the 'Not Found' for simplicity.
    return (
       <div className="min-h-screen flex flex-col">
          <Navbar />
           <main className="flex-grow container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-pati-burgundy mb-4">Oops! Producto no encontrado</h1>
                <p className="text-pati-brown mb-6">No pudimos encontrar la configuración de galletas.</p>
                <Button asChild>
                   <Link to="/">Volver al inicio</Link>
            </Button>
           </main>
          <Footer />
          </div>
    );
  }

  // Render the configurator only when we have a valid cookie product
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pati-cream">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 relative pb-28 lg:pb-16">
        <Link 
           to={'/#productos'} 
           className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy mb-6 group"
         >
           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           Volver al catálogo
         </Link>
        <CookieConfigurator product={product} category={category} id={id} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
