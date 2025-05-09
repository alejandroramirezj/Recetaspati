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
import FlavorMultiSelector from '@/components/product/FlavorMultiSelector';
import { useReward } from 'react-rewards';

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
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
            <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
            <MobileVideoPlayer product={product} />
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
    );
};

// --- Helper Component for Mobile Video --- (NUEVO)
const MobileVideoPlayer = ({ product }: { product: ProductType | null }) => {
  if (!product?.video) return null;
  return (
    <div className="md:hidden mt-6"> {/* Visible solo en móvil, con margen superior */}
      <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-[9/16] max-w-sm mx-auto bg-black">
        <CardContent className="p-0 h-full">
          <video 
            src={product.video} 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
            aria-label={`Vídeo de ${product.name}`}
          >
            Tu navegador no soporta la etiqueta de vídeo.
          </video>
        </CardContent>
      </Card>
    </div>
  );
};

// Inner Component handling configuration logic and UI - NOW GENERIC
const ItemPackConfigurator: React.FC<ItemPackConfiguratorProps> = ({ product, category, id }) => {
    // --- STATE ---
    // State for cookiePack quantity selection
    const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
    // State for flavorPack checkbox selection
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    // General state
    const [selectedPackSize, setSelectedPackSize] = useState<number | null>(null);
    const [maxFlavors, setMaxFlavors] = useState<number>(0); // Max flavors for flavorPack
    const [maxUniqueSelectedFlavorsAllowed, setMaxUniqueSelectedFlavorsAllowed] = useState<number | null>(null);
    const [currentPackIsCustom, setCurrentPackIsCustom] = useState<boolean>(false);
    const [currentCustomPackUnitPrice, setCurrentCustomPackUnitPrice] = useState<number | null>(null);
    const { dispatch, getTotalItems } = useCart();
    const phoneNumber = "+34671266981";
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const { ref: summaryRef, inView } = useInView({ threshold: 0.5 });
    useEffect(() => { setIsSummaryVisible(inView); }, [inView]);

    // --- REWARD HOOKS ---
    const rewardIdSummary = `reward-itempack-summary-${product.id}`;
    const { reward: rewardSummary, isAnimating: isAnimatingSummary } = useReward(rewardIdSummary, 'emoji', {
         emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
         elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });
    const rewardIdSticky = `reward-itempack-sticky-${product.id}`;
    const { reward: rewardSticky, isAnimating: isAnimatingSticky } = useReward(rewardIdSticky, 'emoji', {
        emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
        elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });

    // --- DATA DERIVATION ---
    const packOptions = useMemo(() => {
        return product.options?.map(opt => ({
            size: parseInt(opt.name.match(/\d+/)?.[0] || '0'),
            price: parseFloat(opt.price.replace('€', '').replace(',', '.')),
            name: opt.name,
            description: opt.description || `Elige hasta ${parseInt(opt.name.match(/\d+/)?.[0] || '0')} unidades`,
            maxUniqueFlavors: opt.maxUniqueFlavors,
            isCustomPack: opt.isCustomPack || false,
            customPackUnitPrice: opt.customPackUnitPrice
        })) || [];
    }, [product.options]);

    const availableItems = useMemo(() => {
        if (product.configType === 'cookiePack') {
            return product.individualCookies?.map(cookie => ({ name: cookie.name, image: cookie.image })) || [];
        } else if (product.configType === 'flavorPack') {
            // For flavorPack, we only need the names
            return product.availableFlavors?.map(flavor => ({ name: flavor, image: '' })) || []; // Image not used
        }
        return [];
    }, [product.configType, product.individualCookies, product.availableFlavors]);

    // --- CALCULATIONS ---
    const currentCount = useMemo(() => {
        if (product.configType === 'flavorPack') {
            return selectedFlavors.length; // Count selected distinct flavors
        } else { // Default for cookiePack
            return Object.values(selectedItems).reduce((sum, count) => sum + count, 0); // Sum quantities
        }
    }, [selectedItems, selectedFlavors, product.configType]);

    const currentUniqueFlavorsSelected = useMemo(() => { // <-- NUEVO CALCULO
        if (product.configType === 'cookiePack') {
            return Object.keys(selectedItems).length;
        }
        return 0; // No aplica para otros tipos actualmente en este configurador
    }, [selectedItems, product.configType]);

    const canAddMoreItems = useMemo(() => {
         if (!selectedPackSize) return false;
         if (product.configType === 'flavorPack') {
             return selectedFlavors.length < maxFlavors; // Can add if below max distinct flavors
         } else { // Default for cookiePack
             return currentCount < selectedPackSize; // Can add if below total quantity limit
         }
    }, [selectedPackSize, currentCount, selectedFlavors.length, maxFlavors, product.configType]);

    const finalPackPrice = useMemo(() => {
        if (currentPackIsCustom) {
            return currentCount * (currentCustomPackUnitPrice || 0);
        }
        if (!selectedPackSize) return 0;
        return packOptions.find(p => p.size === selectedPackSize && !p.isCustomPack)?.price || 0;
    }, [selectedPackSize, packOptions, currentPackIsCustom, currentCount, currentCustomPackUnitPrice]);

    const isOrderComplete = useMemo(() => {
        if (currentPackIsCustom) {
            return currentCount > 0; // Para pack personalizado, completo si hay al menos una galleta
        }
        if (!selectedPackSize) return false; // Esta línea es para packs NO personalizados
        if (product.configType === 'flavorPack') {
            return selectedFlavors.length > 0 && selectedFlavors.length <= maxFlavors;
        } else { // Default for cookiePack (no personalizado)
            return currentCount === selectedPackSize; 
        }
    }, [selectedPackSize, currentCount, selectedFlavors.length, maxFlavors, product.configType, currentPackIsCustom]);

    // --- HANDLERS ---
    const decrementItem = (itemName: string) => { // Only for cookiePack
        setSelectedItems(prev => {
            const current = prev[itemName] || 0;
            if (current <= 1) {
                const { [itemName]: _, ...rest } = prev;
                return rest;
            } else {
                return { ...prev, [itemName]: current - 1 };
            }
        });
    };

    const incrementItem = (itemName: string) => { // Only for cookiePack
        if (currentPackIsCustom) {
            // Sin límite de cantidad total ni de sabores únicos para pack personalizado
            setSelectedItems(prev => ({
                ...prev,
                [itemName]: (prev[itemName] || 0) + 1
            }));
            return;
        }

        // Lógica existente para packs con tamaño fijo
        const tổngSốLượngHiệnTại = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
        const sốLượngHươngVịĐộcĐáoHiệnTại = Object.keys(selectedItems).length;
        const hươngVịĐãĐượcChọn = (selectedItems[itemName] || 0) > 0;

        // Condición 1: No exceder el tamaño total del pack
        if (tổngSốLượngHiệnTại >= (selectedPackSize || 0)) {
            return; 
        }

        // Condición 2: Respetar el límite de sabores únicos, si está definido
        if (maxUniqueSelectedFlavorsAllowed !== null) {
            if (sốLượngHươngVịĐộcĐáoHiệnTại >= maxUniqueSelectedFlavorsAllowed && !hươngVịĐãĐượcChọn) {
                // Ya se alcanzó el límite de sabores únicos Y este es un sabor nuevo
                console.warn(`Límite de ${maxUniqueSelectedFlavorsAllowed} sabores únicos alcanzado.`);
                return;
            }
        }

        // Si pasa todas las condiciones, incrementar
        setSelectedItems(prev => ({
            ...prev,
            [itemName]: (prev[itemName] || 0) + 1
        }));
    };

    const handleFlavorCheck = (flavor: string, checked: boolean) => { // For flavorPack
        setSelectedFlavors(prev => {
            if (checked) {
                if (prev.length < maxFlavors) {
                    return [...prev, flavor];
                } else {
                    console.warn(`Máximo de ${maxFlavors} sabores alcanzado.`);
                    return prev;
                }
            } else {
                return prev.filter(f => f !== flavor);
            }
        });
    };

    const handlePackSelect = (value: string) => {
        // value puede ser el tamaño del pack (e.g., "6", "12") o un identificador para el custom pack (e.g., "custom")
        // Necesitamos encontrar la opción de pack correspondiente de una manera más robusta.
        const selectedOpt = packOptions.find(opt => {
            if (opt.isCustomPack) {
                return value === opt.name; // Suponiendo que `value` será el nombre del pack personalizado.
            }
            return opt.size.toString() === value;
        });

        if (!selectedOpt) {
            // Resetea todo si no se encuentra la opción (o si se deselecciona, aunque RadioGroup no lo hace por defecto)
            setSelectedPackSize(null);
            setCurrentPackIsCustom(false);
            setCurrentCustomPackUnitPrice(null);
            setMaxUniqueSelectedFlavorsAllowed(null);
            setSelectedItems({});
            if(product.configType === 'flavorPack') {
                setSelectedFlavors([]);
                setMaxFlavors(0);
            }
            return;
        }

        if (selectedOpt.isCustomPack) {
            setCurrentPackIsCustom(true);
            setSelectedPackSize(null); // O un valor especial, por ahora null.
            setCurrentCustomPackUnitPrice(selectedOpt.customPackUnitPrice || null);
            setMaxUniqueSelectedFlavorsAllowed(null); // Sin límite de sabores únicos
        } else {
            setCurrentPackIsCustom(false);
            setSelectedPackSize(selectedOpt.size);
            setCurrentCustomPackUnitPrice(null);
            if (selectedOpt.maxUniqueFlavors !== undefined) {
                setMaxUniqueSelectedFlavorsAllowed(selectedOpt.maxUniqueFlavors);
            } else {
                setMaxUniqueSelectedFlavorsAllowed(null);
            }
        }

        // Resetear selecciones de items/sabores específicos del producto
        if (product.configType === 'flavorPack') {
            // Lógica existente para flavorPack (palmeritas)
            const packName = selectedOpt.name || '';
            if (packName.includes('50')) setMaxFlavors(4);
            else if (packName.includes('25')) setMaxFlavors(2);
            else setMaxFlavors(0);
            setSelectedFlavors([]);
        } else { // Para cookiePack (sea normal o personalizado)
            setSelectedItems({});
        }
    };

    const handleAddToCart = (triggerSource: 'summary' | 'sticky') => {
        if (!isOrderComplete) return; // Usar isOrderComplete que ya contempla el pack personalizado
        
        let cartItemId: string;
        let cartItemPayload: Omit<CartItem, 'id'>;

        if (currentPackIsCustom) {
            if (!currentCustomPackUnitPrice || currentCount === 0) return; // Seguridad adicional
            cartItemId = `${product.id}-customPack`; // Id para el pack personalizado en el carrito
            cartItemPayload = {
                productId: product.id, 
                productName: `${product.name} - Personalizado`, 
                quantity: 1, // Se añade un pack personalizado
                packPrice: finalPackPrice, // Ya calculado como currentCount * unitPrice
                imageUrl: product.image, 
                type: 'cookiePack', // Sigue siendo un cookiePack en términos de estructura de datos
                cookieDetails: { 
                    packSize: currentCount, // El "tamaño" es la cantidad de galletas seleccionadas
                    cookies: selectedItems 
                },
                // Podríamos añadir una bandera o detalle extra si es necesario para el carrito
                selectedOptions: { pack: 'Personalizado' } 
            };
        } else if (selectedPackSize) { // Packs de tamaño fijo (6 o 12 galletas, o palmeritas)
            cartItemId = `${product.id}-pack${selectedPackSize}`;
            if (product.configType === 'cookiePack') {
                 cartItemPayload = {
                    productId: product.id, productName: product.name, quantity: 1,
                    packPrice: finalPackPrice, imageUrl: product.image, type: 'cookiePack',
                    cookieDetails: { packSize: selectedPackSize, cookies: selectedItems }
                };
            } else if (product.configType === 'flavorPack') {
                 cartItemPayload = {
                    productId: product.id, productName: product.name, quantity: 1,
                    packPrice: finalPackPrice, imageUrl: product.image, type: 'flavorPack',
                    selectedOptions: { pack: packOptions.find(p => p.size === selectedPackSize)?.name || '' },
                    selectedFlavors: selectedFlavors
                };
            } else {
                console.error("Tipo de producto no soportado para añadir al carrito desde ItemPackConfigurator para packs fijos");
                return;
            }
        } else {
            console.error("Estado inválido en handleAddToCart: ni personalizado ni packSize seleccionado.");
            return;
        }

        dispatch({ type: 'ADD_ITEM', payload: { ...cartItemPayload, id: cartItemId } });
        if (triggerSource === 'summary') rewardSummary();
        else if (triggerSource === 'sticky') rewardSticky();
    };

    const generateWhatsAppMessage = () => { // Adjusted for flavorPack
        if (!selectedPackSize || !isOrderComplete) return "Error: Selección incompleta";
        let itemsList: string;
        if (product.configType === 'flavorPack') {
            itemsList = selectedFlavors.map(flavor => `- ${flavor}`).join('\\n');
        } else {
             itemsList = Object.entries(selectedItems).filter(([, count]) => count > 0).map(([name, count]) => `- ${name} (x${count})`).join('\\n');
        }
        const productLabel = product.category === 'galletas' ? 'Galletas' : (product.category === 'palmeritas' ? 'Palmeritas' : 'productos');
        return `¡Hola Pati! 👋 Quiero mi Pack de ${selectedPackSize} ${productLabel} (${finalPackPrice?.toFixed(2)}€):\\n\\n${itemsList}\\n\\n¿Confirmamos el pedido? 😊`;
    };

    const finalWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`;

    // --- HELPER COMPONENTS ---
    const VideoPlayer = () => ( // Reusable video player component
        product.video ? (
            <div className="mt-6">
                <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-[9/16] max-w-sm mx-auto bg-black">
                    <CardContent className="p-0 h-full">
                        <video
                            src={product.video}
                            autoPlay loop muted playsInline
                className="w-full h-full object-cover"
                            aria-label={`Vídeo de ${product.name}`}
                        >
                            Tu navegador no soporta la etiqueta de vídeo.
                        </video>
                    </CardContent>
                </Card>
            </div>
        ) : null
    );
          
  // --- RETURN JSX ---
  return (
      <>
        {/* Main content area for the configurator */}
          <div className="space-y-4">
            {/* Product Title and Description */}
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-1">{product.name}</h1>
            <p className="text-pati-dark-brown text-lg leading-relaxed mb-3">{product.description}</p>
            <MobileVideoPlayer product={product} />

            {/* Step 1: Select Pack */}
            <Card className="border-pati-pink/30 shadow-md">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-xl text-pati-burgundy">1. Elige tu Pack</CardTitle>
                   <CardDescription>Selecciona el tamaño de tu caja.</CardDescription>
                </CardHeader>
                <CardContent>
                   <RadioGroup
                       onValueChange={handlePackSelect}
                       value={currentPackIsCustom ? packOptions.find(p => p.isCustomPack)?.name : selectedPackSize?.toString()}
                       className="grid grid-cols-3 gap-2 md:gap-3"
                   >
                      {packOptions.map((pack) => {
                          const radioValue = pack.isCustomPack ? pack.name : pack.size.toString();
                          const isSelected = currentPackIsCustom ? pack.isCustomPack : (selectedPackSize === pack.size && !pack.isCustomPack);
                          const isMostPopular = pack.name.includes('Pack 12 uds.');
                          
                          // Determine description text based on product ID for flavorPack (palmeritas)
                          let primaryDescription = pack.description;
                          if (product.id === 9) { // Palmeritas
                              primaryDescription = (pack.size === 25 ? '2 sabores max.' : '4 sabores max.');
                          }

                          // Texto específico para el límite de sabores del pack de 6 galletas
                          let uniqueFlavorLimitText = "";
                          if (pack.name.includes('Pack 6 uds.') && pack.maxUniqueFlavors) {
                              uniqueFlavorLimitText = `2 sabores max.`;
                          }
                          // Texto para indicar que el Pack 12 no tiene límite de sabores
                          else if (pack.name.includes('Pack 12 uds.')) {
                              uniqueFlavorLimitText = `Sin límite de sabores`;
                          }

                          return (
                               <Label
                                   key={radioValue}
                                   htmlFor={`pack-${radioValue}`}
                                   className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-2 md:p-3 transition-all duration-200 hover:bg-pati-pink/20 hover:scale-[1.02] ${isSelected ? 'border-pati-burgundy bg-pati-pink/20' : 'border-transparent hover:border-pati-pink/30'} cursor-pointer ${ (selectedPackSize || currentPackIsCustom) && !isSelected ? 'opacity-70' : ''}`}
                               >
                                   <RadioGroupItem value={radioValue} id={`pack-${radioValue}`} className="sr-only" />
                                   {isMostPopular && (
                                        <div className="absolute -top-2 -right-2 bg-pati-burgundy text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md transform rotate-6">
                                            Popular
                                        </div>
                                    )}
                                   {isSelected && (
                                       <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-pati-burgundy" />
                                   )}
                                   <span className="mb-1 font-semibold text-base md:text-lg text-pati-burgundy">{pack.name}</span>
                                   {/* Mostrar primero el límite de sabores para Pack 6 */} 
                                   {uniqueFlavorLimitText && (
                                        <span className={`text-xs md:text-sm text-pati-brown mb-1 text-center`}>
                                            {uniqueFlavorLimitText}
                                        </span>
                                    )}
                                   <span className={`text-xs md:text-sm text-pati-brown mb-1 text-center`}>
                                       {pack.isCustomPack ? pack.description : primaryDescription} 
                                   </span>
                                   <span className="font-bold text-lg md:text-xl text-pati-burgundy">
                                       {pack.isCustomPack ? `${pack.customPackUnitPrice?.toFixed(2).replace('.', ',')}€ / ud.` : `${pack.price.toFixed(2).replace('.', ',')}€`}
                                   </span>
                               </Label>
                          );
                      })}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Step 2: Select Items/Flavors */}
            <Card className={`border-pati-pink/30 shadow-md transition-opacity duration-300 ${(selectedPackSize || currentPackIsCustom) ? 'opacity-100' : 'opacity-60 pointer-events-none'}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-pati-burgundy">2. Elige tus {product.configType === 'flavorPack' ? 'Sabores' : 'Galletas'}</CardTitle>
                    {(selectedPackSize || currentPackIsCustom) ? (
                        <CardDescription>
                            {product.configType === 'flavorPack' ? (
                                `Selecciona hasta ${maxFlavors} sabor${maxFlavors !== 1 ? 'es' : ''}. (${selectedFlavors.length} / ${maxFlavors})`
                            ) : currentPackIsCustom ? (
                                <>
                                    {`Añade las galletas que quieras. Llevas ${currentCount} galleta${currentCount !== 1 ? 's' : ''}.`}
                                    <span className="block text-xs mt-1">
                                        (Precio por galleta: {currentCustomPackUnitPrice?.toFixed(2).replace('.', ',')}€)
                                    </span>
                                </>
                            ) : (
                                <> 
                                    {`Selecciona ${selectedPackSize} unidad${selectedPackSize !== 1 ? 'es' : ''}. (${currentCount} / ${selectedPackSize})`}
                                    {maxUniqueSelectedFlavorsAllowed !== null && (
                                        <span className="block text-xs mt-1">
                                            (Máx. {maxUniqueSelectedFlavorsAllowed} tipo{maxUniqueSelectedFlavorsAllowed !== 1 ? 's' : ''} distinto{maxUniqueSelectedFlavorsAllowed !== 1 ? 's' : ''}. Llevas {currentUniqueFlavorsSelected})                                            
                                        </span>
                                    )}
                                </>                                
                            )}
                        </CardDescription>
                    ) : (
                        <CardDescription>Selecciona primero un tamaño de pack para poder añadir.</CardDescription>
                    )}
                </CardHeader>
                <CardContent className="pt-1">
                    {/* --- UI for CookiePack --- */}
                    {product.configType === 'cookiePack' && (
                        <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2`}>
                            {availableItems.map((item, index) => {
                                const count = selectedItems[item.name] || 0;
                                const isSelected = count > 0;
                                
                                // Lógica para deshabilitar el botón + específico de este item
                                const totalItemsInPack = Object.values(selectedItems).reduce((sum, val) => sum + val, 0);
                                
                                let disableIncrement = false;
                                if (currentPackIsCustom) {
                                    // En pack personalizado, no hay límite para incrementar (salvo un límite práctico de UI si se quisiera)
                                    disableIncrement = false;
                                } else {
                                    const isPackFull = totalItemsInPack >= (selectedPackSize || 0);
                                    disableIncrement = isPackFull;
                                    if (!disableIncrement && maxUniqueSelectedFlavorsAllowed !== null) {
                                        const uniqueFlavorsCount = Object.keys(selectedItems).length;
                                        if (uniqueFlavorsCount >= maxUniqueSelectedFlavorsAllowed && !isSelected) {
                                            disableIncrement = true; 
                                        }
                                    }
                                }

                                return (
                                    <div key={index} className="p-1 h-full">
                                        <Card className={`h-full flex flex-col text-center p-1 transition-all duration-200 ease-in-out border-2 ${isSelected ? 'border-pati-burgundy bg-pati-pink/10' : 'border-transparent bg-white/50'} ${disableIncrement && !isSelected ? 'opacity-50' : ''}`}>
                                            <div className={`flex flex-col items-center flex-grow mb-1 ${disableIncrement ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                onClick={() => !disableIncrement && incrementItem(item.name)} >
                                                <div className="aspect-square rounded-lg overflow-hidden mb-1 w-full bg-gray-50">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain pointer-events-none" loading="lazy"/>
                                                </div>
                                                <h4 className={`text-xs font-medium text-pati-burgundy px-1 line-clamp-1`}>{item.name}</h4>
                                            </div>
                                            <div className="flex items-center justify-center gap-1 mt-auto w-full flex-shrink-0">
                                                <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full text-gray-600 hover:bg-gray-100 ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => {e.stopPropagation(); decrementItem(item.name);}} disabled={count === 0}>
                                                    <MinusCircle className="h-4 w-4" />
                                                </Button>
                                                <Badge variant={isSelected ? "default" : "outline"} className={`text-base font-bold px-2 py-0.5 tabular-nums min-w-[40px] flex justify-center border-2 rounded-md ${isSelected ? 'bg-pati-burgundy text-white border-pati-burgundy scale-110' : 'text-gray-400 border-gray-300 scale-100'}`}>{count}</Badge>
                                                <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full text-gray-600 hover:bg-gray-100 ${disableIncrement ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => {e.stopPropagation(); incrementItem(item.name);}} disabled={disableIncrement}>
                                                    <PlusCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* --- UI for FlavorPack (Palmeritas) --- */}
                    {product.configType === 'flavorPack' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {availableItems.map((item) => {
                                const isChecked = selectedFlavors.includes(item.name);
                                const isDisabled = !isChecked && selectedFlavors.length >= maxFlavors;
                                return (
                                    <div key={item.name} className={`flex items-center space-x-3 p-2 rounded-md border transition-colors ${isChecked ? 'border-pati-burgundy bg-pati-pink/10' : 'border-gray-200'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <Checkbox
                                            id={`flavor-${item.name}`}
                                            checked={isChecked}
                                            disabled={isDisabled}
                                            onCheckedChange={(checkedState) => handleFlavorCheck(item.name, checkedState === true)}
                                            aria-label={item.name}
                                        />
                                        <Label htmlFor={`flavor-${item.name}`} className={`text-sm font-medium leading-none ${isDisabled ? 'text-gray-400' : 'text-pati-burgundy'} ${isChecked ? 'font-semibold' : ''} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                            {item.name}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary Card - Only shown when a pack size is selected OR custom pack has items */}
            {(selectedPackSize || (currentPackIsCustom && currentCount > 0)) && (
              <div ref={summaryRef} id="summary-card" className={`space-y-4 transition-opacity duration-300 ${(selectedPackSize || currentPackIsCustom) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Card className="border-pati-pink/30 shadow-lg md:mb-4">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-xl text-pati-burgundy">
                        {currentPackIsCustom ? `Resumen Pack Personalizado` : `Resumen del Pack ${selectedPackSize}`}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-1">
                     <div className="flex justify-between items-center font-medium border-b pb-2 border-pati-pink/20">
                       <span>{currentPackIsCustom ? 'Total Galletas:': (product.configType === 'flavorPack' ? 'Sabores Seleccionados:' : 'Unidades Seleccionadas:')}</span>
                       <Badge variant={isOrderComplete ? "default" : "secondary"} className={`${isOrderComplete ? 'bg-green-600' : ''}`}>
                           {currentPackIsCustom ? `${currentCount}` : (product.configType === 'flavorPack' ? `${selectedFlavors.length} / ${maxFlavors}` : `${currentCount} / ${selectedPackSize}`)}
                       </Badge>
                     </div>
                     <div className="flex justify-between items-center text-2xl font-bold text-pati-burgundy">
                        <span>Precio Total Pack:</span>
                        <span>{finalPackPrice.toFixed(2).replace('.', ',')}€</span>
                     </div>
                     {product.configType === 'flavorPack' && selectedFlavors.length > 0 && !currentPackIsCustom && (
                         <div className="pt-1">
                              <p className="text-sm font-medium text-pati-brown mb-1">Sabores:</p>
                             <ul className="list-disc list-inside text-sm text-pati-dark-brown space-y-1">
                                  {selectedFlavors.map(f => <li key={f}>{f}</li>)}
                              </ul>
                      </div>
                     )}
                     <div className="flex flex-col sm:flex-row gap-2 mt-2">
                       <Button
                           id="add-pack-button"
                           onClick={() => handleAddToCart('summary')}
                           size="lg"
                           className={`relative flex-1 bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2 ${!isOrderComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                           disabled={!isOrderComplete || isAnimatingSummary}
                           aria-disabled={!isOrderComplete}
                       >
                           <span id={rewardIdSummary} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                           <ShoppingCart className="mr-2 h-5 w-5" />
                           {isOrderComplete ? 
                                (currentPackIsCustom ? `Añadir ${currentCount} Galleta${currentCount !== 1 ? 's' : ''} al Carrito` : `Añadir Pack ${selectedPackSize} al Carrito`) :
                                (currentPackIsCustom ? 'Añade al menos 1 galleta' : (product.configType === 'flavorPack' ? `Elige ${maxFlavors === selectedFlavors.length ? 'tus sabores' : `${maxFlavors - selectedFlavors.length} sabor(es) más`}` : `Completa tu Pack ${selectedPackSize}`))
                           }
                       </Button>
                  </div>
                  </CardContent>
                </Card>
                </div>
            )}
        </div> {/* End of main space-y-4 wrapper */}

        {/* Sticky Footer Bar - Only shown when a pack size is selected OR custom pack is active */}
        {(selectedPackSize || currentPackIsCustom) && (
             <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md p-3 border-t border-pati-pink/30 shadow-top-lg flex items-center justify-between gap-4">
                 <div className='flex-grow'>
                    <p className="text-sm font-medium text-pati-burgundy">
                        {currentPackIsCustom ? `Pack Personalizado (${currentCount} galleta${currentCount !== 1 ? 's' : ''})` : `Pack ${selectedPackSize} - ${product.name}`}
                    </p>
                    <p className="text-xs text-pati-brown">
                        {isOrderComplete ?
                            (currentPackIsCustom ? `Total: ${finalPackPrice.toFixed(2).replace('.',',')}€ ¡Listo para añadir!` : (product.configType === 'flavorPack' ? `(${selectedFlavors.length}/${maxFlavors}) ¡Listo para añadir!` : `¡Listo para añadir! (${finalPackPrice.toFixed(2).replace('.',',')}€)`)) :
                            (currentPackIsCustom ? (currentCount > 0 ? `Total: ${finalPackPrice.toFixed(2).replace('.',',')}€ (Pulsa para añadir)` : 'Elige tus galletas') : (product.configType === 'flavorPack' ? `Elige ${maxFlavors - selectedFlavors.length} sabor(es) más.` : `${currentCount}/${selectedPackSize} seleccionados. Completa tu pack.`))
                        }
                    </p>
                </div>
                 <div className="flex items-center gap-2 flex-shrink-0">
                    <Button asChild variant="outline" size="sm" className="border-pati-accent text-pati-accent hover:bg-pati-accent/10">
                       <Link to="/pedido">
                            <ShoppingCart className="mr-1.5 h-4 w-4"/>
                            Ver Pedido ({getTotalItems()})
                       </Link>
                    </Button>
                    <Button
                        onClick={() => handleAddToCart('sticky')}
                        className={`relative whitespace-nowrap focus-visible:ring-offset-1 flex-shrink-0 ${isOrderComplete ? 'bg-pati-burgundy hover:bg-pati-burgundy/90 text-white focus-visible:ring-pati-burgundy' : 'bg-gray-400 text-gray-700 cursor-not-allowed focus-visible:ring-gray-500'}`}
                        size="sm"
                        disabled={!isOrderComplete || isAnimatingSticky}
                    >
                         <span id={rewardIdSticky} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                        {isOrderComplete ? <CheckCircle2 className="mr-1.5 h-4 w-4"/> : <Info className="mr-1.5 h-4 w-4" />}
                         {isOrderComplete ? (currentPackIsCustom ? "Añadir Galletas" : "Añadir Pack") :
                         (currentPackIsCustom ? (currentCount > 0 ? 'Añadir Galletas' : 'Elige Galletas') : (product.configType === 'flavorPack' ? `Elige sabores` : `Completa`))}
                    </Button>
                </div>
              </div>
            )}
      </>
    );
};

// --- FlavorCheckboxSelector --- (No changes below this line)
// ... existing code ...

// --- FlavorQuantitySelector with Animation --- 
interface FlavorQuantitySelectorProps {
    product: ProductType;
}
const FlavorQuantitySelector: React.FC<FlavorQuantitySelectorProps> = ({ product }) => {
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const { dispatch } = useCart();
    const availableFlavors = product.availableFlavors || [];
    const unitPrice = product.unitPrice || 0;

    const rewardId = `reward-flavorquantity-${product.id}`;
    const { reward, isAnimating } = useReward(rewardId, 'emoji', {
        emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
        elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });

    const handleQuantityChange = (flavor: string, change: number) => {
        setQuantities(prev => {
            const currentQuantity = prev[flavor] || 0;
            const newQuantity = Math.max(0, currentQuantity + change); 
            return { ...prev, [flavor]: newQuantity };
        });
    };
    
    const totalSelectedCount = Object.values(quantities).reduce((s, q) => s + q, 0);

    const handleAddToCart = () => {
        let itemsAddedCount = 0;
        Object.entries(quantities).forEach(([flavor, quantity]) => {
            if (quantity > 0 && unitPrice > 0) {
                const cartItemId = `${product.id}-${flavor.replace(/\s+/g, '-')}`;
                const cartItem: CartItem = {
                    id: cartItemId, productId: product.id, productName: product.name, quantity: quantity,
                    unitPrice: unitPrice, imageUrl: product.image, type: 'flavorQuantity', selectedOptions: { flavor: flavor },
                };
                dispatch({ type: 'ADD_ITEM', payload: cartItem });
                itemsAddedCount++;
            }
        });
        if (itemsAddedCount > 0) { reward(); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
            <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
            <MobileVideoPlayer product={product} />
            <p className="text-lg text-pati-brown mb-4">Precio: <span className="text-2xl font-bold text-pati-accent">{unitPrice.toFixed(2).replace('.', ',')}€</span> / unidad</p>

            {/* Selección de Sabores y Cantidades */}
            <Card className="border-pati-pink/30 shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl text-pati-burgundy">Elige Sabores y Cantidades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {availableFlavors.map((flavor) => {
                        const count = quantities[flavor] || 0;
                        const isSelected = count > 0;
                        return (
                            <div key={flavor} className={`flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 transition-colors ${isSelected ? 'bg-pati-pink/10' : ''}`}> 
                                <p className={`font-medium ${isSelected ? 'text-pati-burgundy font-semibold' : 'text-pati-dark-brown'}`}>{flavor}</p>
                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="outline" size="icon" className={`h-8 w-8 rounded-full ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleQuantityChange(flavor, -1)} disabled={count === 0}> 
                                        <MinusCircle className="h-4 w-4" /> 
                                    </Button>
                                    <Badge variant={isSelected ? "default" : "outline"} className={`text-lg font-bold px-3 py-1 tabular-nums min-w-[40px] flex justify-center border-2 rounded-md transition-all duration-150 ease-in-out ${isSelected ? 'bg-pati-burgundy text-white border-pati-burgundy scale-110' : 'text-gray-400 border-gray-300 scale-100'}`}>
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

            {/* Botón Añadir Selección al Carrito */} 
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button 
                    onClick={handleAddToCart}
                    size="lg" 
                    className={`relative flex-1 bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3 ${totalSelectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={totalSelectedCount === 0 || isAnimating}
                > 
                    <span id={rewardId} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                    <ShoppingCart className="mr-2 h-5 w-5" /> 
                    {totalSelectedCount > 0 ? `Añadir ${totalSelectedCount} al Carrito` : 'Elige Sabores/Cantidad'}
                </Button>
            </div>
        </div>
    );
};

// --- SimpleProductDisplay with Animation --- 
interface SimpleProductDisplayProps {
    product: ProductType;
}
const SimpleProductDisplay: React.FC<SimpleProductDisplayProps> = ({ product }) => {
    const { dispatch } = useCart();
    const rewardId = `reward-${product.id}`;
    const { reward, isAnimating } = useReward(rewardId, 'emoji', {
        emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
        elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });
    const handleAddToCart = () => {
        const unitPrice = parseFloat(product.price.replace('€', '').replace(',', '.'));
        if (isNaN(unitPrice)) {
            console.error("Precio inválido para el producto:", product.name);
            // Consider showing a toast or user feedback here instead of alert
            return;
        }

        const cartItemId = `${product.id}`; 
        const cartItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            productName: product.name,
            quantity: 1, 
            unitPrice: unitPrice,
            imageUrl: product.image,
            type: 'flavorOnly', 
            selectedOptions: { flavor: product.name } 
        };

        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        reward(); // Trigger the animation
    };
    return (
        // Just the info/button column
        <div className="space-y-6">
             <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-2">{product.name}</h1>
             <p className="text-pati-dark-brown text-lg leading-relaxed mb-4">{product.description}</p>
             <MobileVideoPlayer product={product} />
             {product.size && <p className="text-md text-pati-brown"><span className="font-semibold">Tamaño:</span> {product.size}</p>}
             <p className="text-3xl font-bold text-pati-accent mb-6">{product.price}</p>
             <Button onClick={handleAddToCart} size="lg" className={`relative w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3`} disabled={isAnimating}> 
                <span id={rewardId} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
             </Button>
        </div>
    );
};

// Main Component
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

  const renderConfigurator = () => {
      if (!product) return null;
      switch (product.configType) {
          case 'cookiePack':
          case 'flavorPack':
            return <ItemPackConfigurator product={product} category={product.category} id={product.id.toString()} />;
          case 'fixedPack':
            return <FixedPackSelector product={product} />;
          case 'flavorQuantity':
            return <FlavorQuantitySelector product={product} />;
          case 'flavorOnly':
            return <SimpleProductDisplay product={product} />;
          case 'flavorMultiSelect': 
              return <FlavorMultiSelector product={product} />; 
          default:
              return <SimpleProductDisplay product={product} />;
      }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pati-cream">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 relative pb-28 lg:pb-16">
        <Link to={'/#productos'} className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy mb-6 group">
           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           Volver al catálogo
         </Link>

        {/* Main Grid: Adjusted for Palmeritas (ID 9) & Galletas (ID 2) one-column layout */}
        <div className={`grid ${product.configType === 'fixedPack' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-8 lg:gap-12 items-start`}>
           {/* Column 1: Configurator (always present) */}
           <div>
              {renderConfigurator()} 
           </div>

           {/* Column 2: Media (Image or Video) - Conditional Rendering Adjusted */}
           {/* Show this column if NOT fixedPack AND NOT Palmeritas (id 9) AND NOT Galletas (id 2) */}
           {(product.configType !== 'fixedPack') && (
             <div className="hidden md:block md:sticky md:top-24">
                {/* Video o imagen */}
                {product.video ? (
                    <Card className="overflow-hidden border-pati-pink/30 shadow-md aspect-[9/16] max-w-sm mx-auto bg-black">
                       <CardContent className="p-0 h-full">
                           <video 
                               src={product.video} 
                               autoPlay loop muted playsInline
                               className="w-full h-full object-cover"
                               aria-label={`Vídeo de ${product.name}`}
                           >
                               Tu navegador no soporta la etiqueta de vídeo.
                           </video>
                       </CardContent>
                    </Card>
                ) : product.image ? (
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
                ) : null}
             </div>
           )}
        </div>
         
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
