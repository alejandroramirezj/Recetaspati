import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cookie, ArrowLeft, PlusCircle, MinusCircle, Info, CheckCircle2, Box, ShoppingCart, Trash2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { productsData, Product as ProductType, Option } from '@/data/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useInView } from 'react-intersection-observer';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cart';
import { getWhatsAppUrl } from '@/utils/whatsappUtils';

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

// Define Props for the inner component - NOW GENERIC
interface ItemPackConfiguratorProps { // Renamed
    product: ProductType;
    category: string; 
    id: string;       
}

// Sub-component for Fixed Pack Selection (e.g., Palmeritas)
interface FixedPackSelectorProps {
    product: ProductType;
}
const FixedPackSelector: React.FC<FixedPackSelectorProps> = ({ product }) => {
    const { dispatch } = useCart();

    const handleAddPack = (packOption: Option) => {
        // Assuming Option has name and price
        const price = parseFloat(packOption.price.replace('€', '').replace(',', '.'));
        const cartItem: CartItem = {
            // Generate a unique ID based on product and pack name
            id: `${product.id}-${packOption.name.replace(/\s+/g, '-')}`,
            productId: product.id,
            productName: product.name,
            quantity: 1, // Add one pack at a time
            packPrice: price,
            imageUrl: product.image,
            type: 'fixedPack',
            selectedOptions: { pack: packOption.name },
        };
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Columna 1: Info y Selección */}
            <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
                <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
                <Card className="border-pati-pink/30 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-pati-burgundy">Elige tu Caja</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {product.options?.map((option) => (
                            <div key={option.name} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <Box className="h-6 w-6 text-pati-brown flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-pati-burgundy">{option.name}</p>
                                        {option.description && <p className="text-sm text-pati-brown mt-1">{option.description}</p>}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="text-xl font-bold text-pati-burgundy whitespace-nowrap">{option.price}</p>
                                    <Button size="sm" onClick={() => handleAddPack(option)}>
                                        Añadir al Pedido
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            {/* Columna 2: Imagen */}
            <Card className="overflow-hidden border-pati-pink/30 shadow-md md:sticky md:top-24">
                 <CardContent className="p-0">
                     <div className="aspect-square">
                         <img 
                            src={product.image} 
                            alt={`Imagen de ${product.name}`}
                            className="w-full h-full object-contain" 
                            loading="lazy"
                         />
                     </div>
                 </CardContent>
             </Card>
        </div>
    );
};

// Inner Component handling configuration logic and UI - NOW GENERIC
const ItemPackConfigurator: React.FC<ItemPackConfiguratorProps> = ({ product, category, id }) => { // Renamed
    // State for selected items (flavors or cookies)
    const [selectedItems, setSelectedItems] = useState<Record<string, number>>({}); // Renamed 
    const [selectedPackSize, setSelectedPackSize] = useState<number | null>(null); 
    const { dispatch, getTotalItems } = useCart(); // Added useCart hook
    const phoneNumber = "+34671266981"; 
  
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const { ref: summaryRef, inView } = useInView({ threshold: 0.5 });
    useEffect(() => { setIsSummaryVisible(inView); }, [inView]);

    // Extract pack options and available items from product
    const packOptions = useMemo(() => {
        return product.options?.map(opt => ({
            size: parseInt(opt.name.match(/\d+/)?.[0] || '0'), // Extract number from name (e.g., "Caja 25 unidades")
            price: parseFloat(opt.price.replace('€', '').replace(',', '.')),
            name: opt.name, // Keep original name for display
            description: opt.description || `Elige hasta ${parseInt(opt.name.match(/\d+/)?.[0] || '0')} unidades`
        })) || [];
    }, [product.options]);

    const availableItems = useMemo(() => {
        if (product.configType === 'cookiePack') {
            return product.individualCookies?.map(cookie => ({ name: cookie.name, image: cookie.image })) || [];
        } else if (product.configType === 'flavorPack') {
            // Use a placeholder image or generic icon for flavors since images are missing
            return product.availableFlavors?.map(flavor => ({ name: flavor, image: '/Recetaspati/placeholder.svg' /* TODO: Get real images or use icons */ })) || [];
        } 
        return []; // Return empty array if neither type matches
    }, [product.configType, product.individualCookies, product.availableFlavors]);
    
    // Calculate current count
    const currentCount = useMemo(() => {
        return Object.values(selectedItems).reduce((sum, count) => sum + count, 0); // Use selectedItems
    }, [selectedItems]);

    // Check if more items can be added
    const canAddMoreItems = useMemo(() => { // Renamed
         return selectedPackSize !== null && currentCount < selectedPackSize;
    }, [selectedPackSize, currentCount]);

    // Handlers for +/- 
    const decrementItem = (itemName: string) => { // Renamed
        setSelectedItems(prev => { // Use setSelectedItems
            const currentCount = prev[itemName] || 0;

            // If flavorPack, decrementing means removing it entirely (set to 0)
            if (product.configType === 'flavorPack') {
                const { [itemName]: _, ...rest } = prev;
                return rest; 
            }

            if (currentCount <= 1) {
                const { [itemName]: _, ...rest } = prev;
                return rest;
            } else {
                return { ...prev, [itemName]: currentCount - 1 };
            }
        });
    };

    const incrementItem = (itemName: string) => { // Renamed
        if (canAddMoreItems) { 
             // If flavorPack, only allow increment if count is 0
            if (product.configType === 'flavorPack' && (selectedItems[itemName] || 0) >= 1) {
                console.log("Flavor pack: Solo se puede añadir una unidad de cada sabor.");
                return; // Do nothing if already added
            }

           setSelectedItems(prev => ({ // Use setSelectedItems
               ...prev,
               [itemName]: (prev[itemName] || 0) + 1
           }));
       }
    };
    
    const handlePackSelect = (value: string) => {
        const size = parseInt(value);
        setSelectedPackSize(size);
        // Reset items when changing pack size
        setSelectedItems({}); 
    };

    // Calculate final price based on selected pack
    const finalPackPrice = useMemo(() => {
        if (!selectedPackSize) return 0;
        return packOptions.find(p => p.size === selectedPackSize)?.price || 0;
    }, [selectedPackSize, packOptions]);

    // Check if order is complete
    const isOrderComplete = useMemo(() => {
         return selectedPackSize !== null && currentCount === selectedPackSize;
    }, [selectedPackSize, currentCount]);

    // Ref para rastrear el estado anterior de isOrderComplete
    const prevIsOrderCompleteRef = useRef(isOrderComplete);

    // Efecto para hacer scroll cuando se completa el pedido
    useEffect(() => {
        // Comprobar si acaba de completarse (antes era false, ahora es true)
        if (!prevIsOrderCompleteRef.current && isOrderComplete) {
            const summaryButton = document.getElementById('add-pack-button');
            if (summaryButton) {
                summaryButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
        // Actualizar el valor anterior para la próxima comprobación
        prevIsOrderCompleteRef.current = isOrderComplete;
    }, [isOrderComplete]); // Ejecutar solo cuando isOrderComplete cambie

    // Generate WhatsApp message - TODO: Adapt later to use flavorDetails or cookieDetails
    const generateWhatsAppMessage = () => {
        if (!selectedPackSize || !isOrderComplete) return "Error: Selección incompleta";
        const itemsList = Object.entries(selectedItems).filter(([, count]) => count > 0).map(([name, count]) => `- ${name} (x${count})`).join('\n');
        // Determine product type label (Galletas/Palmeritas)
        const productLabel = product.category === 'galletas' ? 'Galletas' : (product.category === 'palmeritas' ? 'Palmeritas' : 'productos'); 
        return `¡Hola Pati! 👋 Quiero mi Pack de ${selectedPackSize} ${productLabel} (${finalPackPrice?.toFixed(2)}€):

${itemsList}

¿Confirmamos el pedido? 😊`;
    };
    
    const finalWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
    
    const whatsappMessagePreview = useMemo(() => {
        if (!selectedPackSize) return "Selecciona un tamaño de pack para empezar.";
        const itemLabel = product.category === 'galletas' ? 'galleta(s)' : (product.category === 'palmeritas' ? 'palmerita(s)' : 'unidad(es)');
        if (currentCount < selectedPackSize) return `Selecciona ${selectedPackSize - currentCount} ${itemLabel} más.`;
        if (currentCount > selectedPackSize) return `Error: Has superado el límite de ${itemLabel}.`;
        return generateWhatsAppMessage();
    }, [selectedItems, selectedPackSize, currentCount, finalPackPrice, isOrderComplete, product.category]);
    
    // Function to add the configured pack to the global cart
    const handleAddToCart = () => {
        if (!selectedPackSize || !isOrderComplete) return;

        const cartItemId = `${product.id}-pack${selectedPackSize}`;
        let cartItemPayload: Omit<CartItem, 'id'>;

        if (product.configType === 'cookiePack') {
            cartItemPayload = {
                productId: product.id,
                productName: product.name,
                quantity: 1, // Add one pack
                packPrice: finalPackPrice,
                imageUrl: product.image,
                type: 'cookiePack',
                cookieDetails: {
                    packSize: selectedPackSize,
                    cookies: selectedItems
                }
            };
        } else if (product.configType === 'flavorPack') {
             cartItemPayload = {
                productId: product.id,
                productName: product.name,
                quantity: 1, // Add one pack
                packPrice: finalPackPrice,
                imageUrl: product.image,
                type: 'flavorPack',
                selectedOptions: { pack: packOptions.find(p => p.size === selectedPackSize)?.name || '' }, // Save pack name
                selectedFlavors: Object.keys(selectedItems).filter(key => selectedItems[key] > 0) // Store selected flavors list from the Record 
            };
        } else {
            console.error("Tipo de producto no soportado para añadir al carrito desde ItemPackConfigurator");
            return;
        }
        
        // Use generateCartItemId or a consistent ID generation strategy if needed?
        // For now, using the simple one.
        dispatch({ type: 'ADD_ITEM', payload: { ...cartItemPayload, id: cartItemId } });
        // Maybe reset state after adding?
        // setSelectedPackSize(null);
        // setSelectedItems({});
    };

    // Function to scroll to summary
    const scrollToSummary = () => {
        document.getElementById('summary-card')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });
    };

    // --- RETURN JSX for ItemPackConfigurator --- 
  return (
      <> 
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Pack Selection -> Items */} 
          <div className="space-y-6">
            {/* Title, Description */} 
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
            <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
            
            {/* Step 1: Select Pack Size */} 
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
                                 className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-3 md:p-4 transition-all duration-200 hover:bg-pati-pink/20 hover:scale-[1.02] ${isSelected ? 'border-pati-burgundy bg-pati-pink/20' : 'border-transparent hover:border-pati-pink/30'} cursor-pointer ${selectedPackSize && !isSelected ? 'opacity-70' : ''}`}
                             >
                                 <RadioGroupItem value={pack.size.toString()} id={`pack-${pack.size}`} className="sr-only" />
                                 {isSelected && (
                                     <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-pati-burgundy" />
                                 )}
                                 <span className="mb-1 font-semibold text-base md:text-lg text-pati-burgundy">{pack.name}</span>
                                 {/* Use pack.description for potential details */}
                                 <span className={`text-xs md:text-sm text-pati-brown mb-1 md:mb-2 text-center`}>
                                     {pack.description}
                                 </span>
                                 <span className="font-bold text-xl md:text-2xl text-pati-burgundy">{pack.price.toFixed(2).replace('.', ',')}€</span>
                             </Label>
                        );
                    })}
                  </RadioGroup>
              </CardContent>
            </Card>

            {/* Step 2: Select Items (Flavors or Cookies) */} 
             <Card className={`border-pati-pink/30 shadow-md transition-opacity duration-300 ${selectedPackSize ? 'opacity-100' : 'opacity-60 pointer-events-none'}`}> 
                <CardHeader className="pb-4">
                   <CardTitle className="text-xl text-pati-burgundy">2. Elige tus Sabores/Galletas</CardTitle> 
                   {selectedPackSize ? (
                    <CardDescription>
                      Selecciona {selectedPackSize} unidad{selectedPackSize !== 1 ? 'es' : ''}. 
                      <span className="font-semibold">(Pack: {finalPackPrice.toFixed(2).replace('.', ',')}€)</span> Total: {currentCount} / {selectedPackSize}
                    </CardDescription>
                   ) : (
                      <CardDescription>Selecciona primero un tamaño de pack para poder añadir.</CardDescription>
                   )}
                    {/* Completion check message */} 
                    {!canAddMoreItems && currentCount === selectedPackSize && (
                         <div className="text-sm pt-2 text-green-600 font-semibold flex items-center gap-1">
                             <CheckCircle2 className="h-4 w-4"/> ¡Caja Completa!
                         </div>
                    )}
                 </CardHeader>
                 <CardContent>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${!canAddMoreItems ? 'opacity-75' : ''}`}> 
                        {availableItems.map((item, index) => { // Use availableItems
                         const count = selectedItems[item.name] || 0; // Use selectedItems
                         const isSelected = count > 0;
                         const isAtLimit = !canAddMoreItems;
                         
                         // Specific check for flavorPack: can only add if count is 0
                         const canIncrementFlavor = (product.configType !== 'flavorPack' || count === 0);
                         
                         return (
                           <div key={index} className="p-1 h-full">
                             <Card className={`h-full flex flex-col text-center p-3 transition-all duration-200 ease-in-out border-2 ${isSelected ? 'border-pati-burgundy bg-pati-pink/10' : 'border-transparent bg-white/50'} ${isAtLimit && !isSelected ? 'opacity-50' : ''}`}> 
                               {/* Wrapper div for click interaction, disabled if no pack selected */}
                               <div 
                                 className={`flex flex-col items-center flex-grow mb-2 ${!canAddMoreItems ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                                 onClick={() => canAddMoreItems && incrementItem(item.name)} 
                                 aria-label={!canAddMoreItems ? `Límite de ${selectedPackSize} unidades alcanzado` : `Añadir ${item.name}`}
                                 role="button" 
                                 tabIndex={!canAddMoreItems ? -1 : 0}
                                 aria-disabled={!canAddMoreItems}
                               >
                                   <div className="aspect-square rounded-lg overflow-hidden mb-2 w-full bg-gray-50"> {/* Added bg for placeholders */} 
                                       <img 
                                           src={item.image} 
                                           alt={item.name}
                                           className="w-full h-full object-contain pointer-events-none" 
                                           loading="lazy"
                                       />
                                   </div>
                                   <h4 className="text-sm font-medium text-pati-burgundy px-1">{item.name}</h4>
                                </div>
                               {/* +/- Controls */}
                                <div className="flex items-center justify-center gap-2 mt-auto w-full flex-shrink-0">
                                  {/* Decrement Button: Disabled if count is 0 */}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`h-7 w-7 rounded-full text-gray-600 hover:bg-gray-100 ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    onClick={() => decrementItem(item.name)} 
                                    disabled={count === 0} 
                                    aria-label={`Quitar ${item.name}`}
                                  >
                                    <MinusCircle className="h-5 w-5" /> 
                                  </Button>
                                  <Badge 
                                      variant={isSelected ? "default" : "outline"} 
                                      className={`text-lg font-bold px-3 py-1 tabular-nums min-w-[45px] flex justify-center border-2 rounded-md transition-all duration-150 ease-in-out ${isSelected ? 'bg-pati-burgundy text-white border-pati-burgundy scale-110' : 'text-gray-400 border-gray-300 scale-100'}`}
                                      aria-live="polite"
                                     >
                                       {count}
                                    </Badge>
                                   {/* Increment Button: Disabled if pack limit reached or flavor already added (for flavorPack) */}
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     className={`h-7 w-7 rounded-full text-gray-600 hover:bg-gray-100 ${!canAddMoreItems || !canIncrementFlavor ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                     onClick={() => canAddMoreItems && incrementItem(item.name)} 
                                     disabled={!canAddMoreItems || !canIncrementFlavor} 
                                     aria-label={`Añadir ${item.name}`}
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

          {/* Right Column: Summary Card */}
          {selectedPackSize && (
            <div ref={summaryRef} id="summary-card" className={`space-y-6 sticky top-24 transition-opacity duration-300 ${selectedPackSize ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> 
              <Card className="border-pati-pink/30 shadow-lg">
                <CardHeader className="pb-2">
                   <CardTitle className="text-xl text-pati-burgundy">Resumen del Pack {selectedPackSize}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                   <div className="flex justify-between items-center font-medium border-b pb-3 border-pati-pink/20">
                     <span>Unidades Seleccionadas:</span>
                     <Badge variant={isOrderComplete ? "default" : "secondary"} className={`${isOrderComplete ? 'bg-green-600' : ''}`}>{currentCount} / {selectedPackSize}</Badge>
                </div>

                   <div className="flex justify-between items-center text-2xl font-bold text-pati-burgundy">
                      <span>Precio Total Pack:</span>
                      <span>{finalPackPrice.toFixed(2).replace('.', ',')}€</span>
                        </div>
                   
                   {/* Option 1: Keep simple WhatsApp Preview */}
                   {/* <div className="space-y-2">
                      <p className="text-sm font-medium text-pati-brown">Vista previa del mensaje:</p>
                      <div className={`...`}>
                         {whatsappMessagePreview}
                      </div>
                  </div> */}
                  
                   {/* == Contenedor para los dos botones (Flexbox) == */}
                   <div className="flex flex-col sm:flex-row gap-3 mt-4"> {/* Stack vertically on small, row on sm+, add gap */} 
                     {/* == Botón Añadir al Carrito (Ahora ocupa todo el ancho si el otro se quita) == */} 
                     <Button
                         id="add-pack-button"
                         onClick={handleAddToCart}
                         size="lg"
                         className={`flex-1 bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3 ${!isOrderComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                         disabled={!isOrderComplete}
                         aria-disabled={!isOrderComplete}
                     >
                         <ShoppingCart className="mr-2 h-5 w-5" />
                         {isOrderComplete ? `Añadir Pack ${selectedPackSize} al Carrito` : `Completa tu Pack ${selectedPackSize}`}
                     </Button>
                     {/* ===================================== */}
                   </div>
                </CardContent>
              </Card>
                  </div>
          )}
                </div>

        {/* Sticky Footer Bar - Ahora visible siempre que haya pack seleccionado y en todas las pantallas */} 
        {selectedPackSize && (
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm px-4 py-3 border-t border-gray-200 shadow-lg flex items-center justify-between gap-3 min-h-[70px]">
                 {/* Info del Pack Actual */}
                 <div className="flex flex-col text-sm flex-shrink mr-2">
                     <span className="font-semibold text-pati-dark-brown whitespace-nowrap">Pack {selectedPackSize} ({currentCount}/{selectedPackSize})</span>
                     <span className="font-bold text-lg text-pati-burgundy">{finalPackPrice.toFixed(2).replace('.', ',')}€</span>
                 </div>
                 
                 {/* Grupo de Botones */}
                 <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Botón Ver Pedido Global (NUEVO) */}
                    <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="whitespace-nowrap border-pati-accent text-pati-accent hover:bg-pati-accent/10 focus-visible:ring-pati-accent"
                    >
                       <Link to="/pedido">
                            <ShoppingCart className="mr-1.5 h-4 w-4"/>
                            Ver Pedido ({getTotalItems()})
                       </Link>
                    </Button>

                    {/* Botón Añadir Pack al Carrito */}
                    <Button 
                        onClick={handleAddToCart} // Llama directamente a añadir al carrito
                        className={`whitespace-nowrap focus-visible:ring-offset-1 flex-shrink-0 ${isOrderComplete ? 'bg-pati-burgundy hover:bg-pati-burgundy/90 text-white focus-visible:ring-pati-burgundy' : 'bg-gray-400 text-gray-700 cursor-not-allowed focus-visible:ring-gray-500'}`} 
                        size="sm"
                        disabled={!isOrderComplete}
                    >
                        {isOrderComplete ? <CheckCircle2 className="mr-1.5 h-4 w-4"/> : <Info className="mr-1.5 h-4 w-4" />} 
                        {isOrderComplete ? "Añadir Pack" : `Completa`}
                    </Button>
                 </div>
               </div>
             )}
      </> 
    );
};

// --- NUEVO COMPONENTE para seleccionar N sabores fijos --- 
interface FlavorCheckboxSelectorProps {
    product: ProductType;
}

const FlavorCheckboxSelector: React.FC<FlavorCheckboxSelectorProps> = ({ product }) => {
    const [selectedPackOption, setSelectedPackOption] = useState<Option | null>(null);
    const [checkedFlavors, setCheckedFlavors] = useState<string[]>([]);
    const { dispatch } = useCart();

    const packOptions = product.options || [];
    const availableFlavors = product.availableFlavors || [];

    // Determinar max sabores basado en el pack
    const maxFlavors = useMemo(() => {
        if (!selectedPackOption) return 0;
        // Asumiendo que el nombre contiene el número, o ajustar lógica si es diferente
        if (selectedPackOption.name.includes('50')) return 4; 
        if (selectedPackOption.name.includes('25')) return 2;
        return 0; // O un default si no encuentra número
    }, [selectedPackOption]);

    const handlePackSelect = (value: string) => {
        const selectedOpt = packOptions.find(opt => opt.name === value) || null;
        setSelectedPackOption(selectedOpt);
        setCheckedFlavors([]); // Reset flavors when changing pack
    };

    const handleFlavorCheck = (flavor: string, checked: boolean) => {
        setCheckedFlavors(prev => {
            if (checked) {
                // Add flavor if not exceeding maxFlavors
                if (prev.length < maxFlavors) {
                    return [...prev, flavor];
                } else {
                    console.warn(`Máximo de ${maxFlavors} sabores alcanzado.`);
                    return prev; // No añadir si se alcanzó el máximo
                }
            } else {
                // Remove flavor
                return prev.filter(f => f !== flavor);
            }
        });
    };

    // -- Condición de completado MODIFICADA --
    // Ahora es completo si hay pack y al menos 1 sabor seleccionado.
    const isOrderComplete = selectedPackOption !== null && checkedFlavors.length >= 1;
    
    const finalPackPrice = selectedPackOption ? parseFloat(selectedPackOption.price.replace('€', '').replace(',', '.')) : 0;

    const handleAddToCart = () => {
        // La guarda sigue siendo válida: necesita estar completo y tener pack
        if (!isOrderComplete || !selectedPackOption) return;

        const cartItemId = `${product.id}-${selectedPackOption.name.replace(/\s+/g, '-')}`;
        const cartItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            productName: product.name,
            quantity: 1,
            packPrice: finalPackPrice,
            imageUrl: product.image,
            type: 'flavorPack',
            selectedOptions: { pack: selectedPackOption.name },
            selectedFlavors: checkedFlavors,
        };

        dispatch({ type: 'ADD_ITEM', payload: cartItem });
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
             {/* Columna Izquierda: Selección Pack y Sabores */}
            <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
                <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>

                {/* 1. Seleccionar Pack */}
                <Card className="border-pati-pink/30 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-pati-burgundy">1. Elige tu Caja</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup 
                            onValueChange={handlePackSelect} 
                            value={selectedPackOption?.name}
                            className="grid grid-cols-2 gap-3 md:gap-4"
                        >
                            {packOptions.map((pack) => {
                                const isSelected = selectedPackOption?.name === pack.name;
                                return (
                                    <Label key={pack.name} htmlFor={pack.name} className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-3 md:p-4 transition-all duration-200 hover:bg-pati-pink/20 hover:scale-[1.02] ${isSelected ? 'border-pati-burgundy bg-pati-pink/20' : 'border-transparent hover:border-pati-pink/30'} cursor-pointer ${selectedPackOption && !isSelected ? 'opacity-70' : ''}`}>
                                            <RadioGroupItem value={pack.name} id={pack.name} className="sr-only" />
                                            {isSelected && <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-pati-burgundy" />} 
                                            <span className="mb-1 font-semibold text-base md:text-lg text-pati-burgundy">{pack.name}</span>
                                            <span className="text-xs md:text-sm text-pati-brown mb-1 md:mb-2 text-center">Elige {pack.name.includes('25') ? '2' : '4'} sabores</span>
                                            <span className="font-bold text-xl md:text-2xl text-pati-burgundy">{pack.price}</span>
                                        </Label>
                                    );
                                })}
                        </RadioGroup>
                    </CardContent>
                </Card>

                 {/* 2. Seleccionar Sabores (si hay pack seleccionado) */}
                 {selectedPackOption && (
                    <Card className="border-pati-pink/30 shadow-md">
                         <CardHeader>
                             {/* Ajustar título si maxFlavors es 0? */}
                            <CardTitle className="text-xl text-pati-burgundy">2. Elige {maxFlavors > 0 ? `hasta ${maxFlavors}` : ''} Sabores</CardTitle> 
                            {maxFlavors > 0 && (
                                <CardDescription>
                                    {/* Modificar texto */} 
                                    Seleccionados: {checkedFlavors.length} (Máximo: {maxFlavors})
                                    {checkedFlavors.length > 0 && (
                                        <span className="text-green-600 font-semibold ml-2">¡Listo para añadir!</span>
                                    )}
                                </CardDescription>
                            )}
                         </CardHeader>
                         <CardContent className="grid grid-cols-2 gap-3">
                            {availableFlavors.map((flavor) => {
                                const isChecked = checkedFlavors.includes(flavor);
                                const isDisabled = !isChecked && checkedFlavors.length >= maxFlavors;
                                return (
                                    <div key={flavor} className={`flex items-center space-x-2 p-3 rounded-md border ${isChecked ? 'border-pati-burgundy bg-pati-pink/10' : 'border-gray-200'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <Checkbox 
                                            id={flavor}
                                            checked={isChecked}
                                            disabled={isDisabled}
                                            onCheckedChange={(checkedState) => handleFlavorCheck(flavor, checkedState === true)}
                                            aria-label={flavor}
                                        />
                                        <Label htmlFor={flavor} className={`text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-pati-burgundy'} ${isChecked ? 'font-semibold' : ''}`}>
                                            {flavor}
                                        </Label>
                                    </div>
                                );
                            })}
                         </CardContent>
                    </Card>
                 )}
             </div>

             {/* Columna Derecha: Resumen e Imagen */}
             <div className="sticky top-24 space-y-6">
                {selectedPackOption && (
                    <Card className="border-pati-pink/30 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-pati-burgundy">Resumen: {selectedPackOption.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="flex justify-between items-center font-medium border-b pb-3 border-pati-pink/20">
                                <span>Sabores Seleccionados:</span>
                                {/* Mostrar número seleccionado */} 
                                <Badge variant={isOrderComplete ? "default" : "secondary"} className={`${isOrderComplete ? 'bg-green-600' : ''}`}>{checkedFlavors.length}</Badge>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-bold text-pati-burgundy">
                                <span>Precio Total Pack:</span>
                                <span>{selectedPackOption.price}</span>
                            </div>
                            {/* Lista de sabores elegidos */}
                            {checkedFlavors.length > 0 && (
                                <div className="pt-2">
                                     <p className="text-sm font-medium text-pati-brown mb-1">Sabores:</p>
                                    <ul className="list-disc list-inside text-sm text-pati-dark-brown space-y-1">
                                         {checkedFlavors.map(f => <li key={f}>{f}</li>)}
                                     </ul>
                                 </div>
                            )}
                            
                            {/* Contenedor para el botón (ya no son dos) */} 
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                 {/* Botón Añadir: Habilitado si isOrderComplete (pack + >=1 sabor) */} 
                                 <Button 
                                     onClick={handleAddToCart}
                                     size="lg" 
                                     className={`flex-1 bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3 ${!isOrderComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                     disabled={!isOrderComplete} 
                                 > 
                                     <ShoppingCart className="mr-2 h-5 w-5" /> 
                                     {/* Modificar texto botón */} 
                                     {isOrderComplete ? `Añadir Caja al Carrito` : `Elige al menos 1 sabor`}
                                 </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {/* Imagen del producto */} 
                <Card className="overflow-hidden border-pati-pink/30 shadow-md">
                    <CardContent className="p-0">
                        <div className="aspect-square">
                            <img 
                                src={product.image} 
                                alt={`Imagen de ${product.name}`}
                                className="w-full h-full object-contain" 
                                loading="lazy"
                            />
                        </div>
                    </CardContent>
                </Card>
             </div>
         </div>
     );
};

// --- Componente REVISADO para elegir sabor y cantidad (estilo galletas) ---
interface FlavorQuantitySelectorProps {
    product: ProductType;
}

const FlavorQuantitySelector: React.FC<FlavorQuantitySelectorProps> = ({ product }) => {
    // Estado para guardar cantidad de CADA sabor
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const { dispatch } = useCart();

    const availableFlavors = product.availableFlavors || [];
    const unitPrice = product.unitPrice || 0;

    // Handler para cambiar cantidad de un sabor específico
    const handleQuantityChange = (flavor: string, change: number) => {
        setQuantities(prev => {
            const currentQuantity = prev[flavor] || 0;
            const newQuantity = Math.max(0, currentQuantity + change); // Min quantity is 0 now
            return { ...prev, [flavor]: newQuantity };
        });
    };

    const handleOrderThisItemOnly = () => {
        const itemsToOrder = createFlavorQuantityWhatsAppItems(product, quantities);
        if (itemsToOrder.length === 0) {
            alert("No has seleccionado ninguna Mini-Tarta para pedir.");
            return;
        }
        const whatsappUrl = getWhatsAppUrl(itemsToOrder);
        window.open(whatsappUrl, '_blank');
    };

    const totalSelectedCount = Object.values(quantities).reduce((s, q) => s + q, 0);

    // Función handleAddToCart (Restaurada y adaptada)
    const handleAddToCart = () => {
        let itemsAddedCount = 0;
        Object.entries(quantities).forEach(([flavor, quantity]) => {
            if (quantity > 0 && unitPrice > 0) {
                const cartItemId = `${product.id}-${flavor.replace(/\s+/g, '-')}`;
                const cartItem: CartItem = {
                    id: cartItemId,
                    productId: product.id,
                    productName: product.name,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    imageUrl: product.image,
                    type: 'flavorQuantity',
                    selectedOptions: { flavor: flavor },
                };
                dispatch({ type: 'ADD_ITEM', payload: cartItem });
                itemsAddedCount++;
            }
        });

        if (itemsAddedCount > 0) {
            // alert(`${itemsAddedCount} tipo(s) de ${product.name} añadidos/actualizados al carrito!`); // ELIMINAR ALERT
        } else {
            // alert(`No has seleccionado ninguna ${product.name} para añadir al carrito.`); // ELIMINAR ALERT (opcional, quizás mantener feedback si no se añade nada?)
             // --> Mejor quitarlo también para consistencia
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Columna Izquierda: Imagen */}
            <Card className="overflow-hidden border-pati-pink/30 shadow-md">
                 <CardContent className="p-0">
                     <div className="aspect-square">
                         <img 
                             src={product.image} 
                             alt={`Imagen de ${product.name}`}
                             className="w-full h-full object-contain" 
                             loading="lazy"
                         />
                     </div>
                 </CardContent>
            </Card>

            {/* Columna Derecha: Info, Selección y Botón */}
            <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
                <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
                
                {/* Precio Unitario */}
                <p className="text-lg text-pati-brown mb-4">Precio: <span className="text-2xl font-bold text-pati-accent">{unitPrice.toFixed(2).replace('.', ',')}€</span> / unidad</p>

                {/* Selección de Sabores y Cantidades */}
                <Card className="border-pati-pink/30 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-pati-burgundy">Elige Sabores y Cantidades</CardTitle>
                        {/* Opcional: Añadir descripción */} 
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {availableFlavors.map((flavor) => {
                            const count = quantities[flavor] || 0;
                            const isSelected = count > 0;
                            return (
                                <div key={flavor} className={`flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 transition-colors ${isSelected ? 'bg-pati-pink/10' : ''}`}> 
                                    {/* Nombre del Sabor */}
                                    <p className={`font-medium ${isSelected ? 'text-pati-burgundy font-semibold' : 'text-pati-dark-brown'}`}>{flavor}</p>
                                    
                                    {/* Controles +/- */}
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant="outline" size="icon" className={`h-8 w-8 rounded-full ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleQuantityChange(flavor, -1)} disabled={count === 0}> 
                                            <MinusCircle className="h-4 w-4" /> 
                                        </Button>
                                        <Badge 
                                            variant={isSelected ? "default" : "outline"} 
                                            className={`text-lg font-bold px-3 py-1 tabular-nums min-w-[40px] flex justify-center border-2 rounded-md transition-all duration-150 ease-in-out ${isSelected ? 'bg-pati-burgundy text-white border-pati-burgundy scale-110' : 'text-gray-400 border-gray-300 scale-100'}`}
                                        >
                                            {count}
                                        </Badge>
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleQuantityChange(flavor, 1)}> 
                                            <PlusCircle className="h-4 w-4" /> 
                                        </Button>
                                    </div>
                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Contenedor para los dos botones */} 
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                     {/* Botón Añadir Selección al Carrito (Ahora ocupa todo el ancho) */} 
                    <Button 
                        onClick={handleAddToCart}
                        size="lg" 
                        className={`flex-1 bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3 ${totalSelectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={totalSelectedCount === 0} 
                    > 
                        <ShoppingCart className="mr-2 h-5 w-5" /> 
                        {totalSelectedCount > 0 ? `Añadir ${totalSelectedCount} al Carrito` : 'Elige Sabores/Cantidad'}
                    </Button>
                </div>
              </div>
        </div>
    );
};

// Helper function to create CartItem array for single flavorQuantity item order
const createFlavorQuantityWhatsAppItems = (product: ProductType, quantities: Record<string, number>): CartItem[] => {
    const items: CartItem[] = [];
    const unitPrice = product.unitPrice || 0;
    Object.entries(quantities).forEach(([flavor, quantity]) => {
        if (quantity > 0 && unitPrice > 0) {
            const tempId = `${product.id}-${flavor.replace(/\s+/g, '-')}-whatsapp`;
            items.push({
                id: tempId,
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                unitPrice: unitPrice,
                imageUrl: product.image,
                type: 'flavorQuantity',
                selectedOptions: { flavor: flavor },
            });
        }
    });
    return items;
};

// --- NUEVO COMPONENTE para productos simples que se añaden directamente ---
interface SimpleProductDisplayProps {
    product: ProductType;
}

const SimpleProductDisplay: React.FC<SimpleProductDisplayProps> = ({ product }) => {
    const { dispatch } = useCart();

    const handleAddToCart = () => {
        // Extraer precio unitario
        const unitPrice = parseFloat(product.price.replace('€', '').replace(',', '.'));
        if (isNaN(unitPrice)) {
            console.error("Precio inválido para el producto:", product.name);
            alert("Error al añadir el producto, precio no válido.");
            return;
        }

        const cartItemId = `${product.id}`; // ID simple basado en el producto
        const cartItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            productName: product.name,
            quantity: 1, // Añadir una unidad
            unitPrice: unitPrice,
            imageUrl: product.image,
            type: 'flavorOnly', // O 'simple' si se prefiere
            // Guardamos el nombre como "sabor" implícito para consistencia?
            selectedOptions: { flavor: product.name } 
        };

        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        // alert(`${product.name} añadido al pedido!`); // ELIMINAR ALERT
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Columna Izquierda: Imagen */}
            <Card className="overflow-hidden border-pati-pink/30 shadow-md">
                 <CardContent className="p-0">
                     <div className="aspect-square">
                         <img 
                            src={product.image} 
                            alt={`Imagen de ${product.name}`}
                            className="w-full h-full object-contain" 
                            loading="lazy"
                         />
                     </div>
                 </CardContent>
            </Card>

            {/* Columna Derecha: Info y Botón */}
            <div className="space-y-6">
                 <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
                 <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
                 {product.size && <p className="text-md text-pati-brown"><span className="font-semibold">Tamaño:</span> {product.size}</p>}
                 <p className="text-3xl font-bold text-pati-accent mb-6">{product.price}</p>

                 <Button 
                    onClick={handleAddToCart}
                    size="lg" 
                    className={`w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3`}
                 > 
                    <ShoppingCart className="mr-2 h-5 w-5" /> 
                    Añadir al Carrito
            </Button>
          </div>
        </div>
    );
};

// Main Component - Handles fetching product and rendering Configurator or Not Found
const ProductDetail = () => {
  const { category, id } = useParams();
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

  // Select which configurator to render based on product.configType
  const renderConfigurator = () => {
      if (!product) return null;

      switch (product.configType) {
          case 'cookiePack': // Galletas usan el configurador de items
              return <ItemPackConfigurator product={product} category={category || ''} id={id || ''} />;
          case 'flavorPack': // Palmeritas usan el nuevo selector de checkboxes
              return <FlavorCheckboxSelector product={product} />;
          case 'fixedPack':
              return <FixedPackSelector product={product} />;
          case 'flavorOnly': // Tartas individuales usan este display simple
              return <SimpleProductDisplay product={product} />;
          case 'flavorQuantity': // Mini-tartas usan este selector
              return <FlavorQuantitySelector product={product} />;
          // Add cases for 'flavorQuantity' and 'flavorOnly' later
          // case 'flavorQuantity':
          //     return <IndividualFlavorSelector product={product} />;
          // case 'flavorOnly':
          //     return <FlavorOptionSelector product={product} />;
          default:
              console.warn("Configurador no implementado para tipo:", product.configType);
              return (
                <div className="text-center text-pati-brown">Configuración no disponible para este producto.</div>
              );
      }
  };

  // Loading / Not Found Logic
  if (!product) {
    // Check if ID is valid before showing not found? 
    // Maybe add a loading state later?
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

  // Render the correct configurator
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
         {/* Render the selected configurator */} 
         {renderConfigurator()} 
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
