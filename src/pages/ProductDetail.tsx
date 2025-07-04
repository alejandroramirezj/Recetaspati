import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cookie, ArrowLeft, PlusCircle, MinusCircle, Info, CheckCircle2, Box, ShoppingCart, Trash2, Share2 } from 'lucide-react';
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
import SizePackSelector from '@/components/product/SizePackSelector';
import MobileVideoPlayer from '@/components/product/MobileVideoPlayer';

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
interface ItemPackConfiguratorProps { 
    product: ProductType;
    category: string; 
    id: string;
    onConfigUpdate?: (
      packSize: number | null,
      isCustom: boolean,
      count: number,
      complete: boolean,
      price: number,
      animatingSummary: boolean,
      animatingSticky: boolean
    ) => void;
}

// Sub-component for Fixed Pack Selection (e.g., Palmeritas)
interface FixedPackSelectorProps {
    product: ProductType;
}
const FixedPackSelector: React.FC<FixedPackSelectorProps> = ({ product }) => {
    const { dispatch } = useCart();
    const rewardId = `reward-fixedpack-${product.id}`;
    const { reward, isAnimating: isAnimatingReward } = useReward(rewardId, 'emoji', {
        emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
        elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });

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
        reward(); // Trigger the animation here
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
                    <div className="flex flex-col sm:flex-row gap-3">
                        {product.options?.map((option) => (
                            <div key={option.name} className="flex-1 min-w-[140px] border rounded-lg p-4 flex flex-col items-center justify-between text-center transition-colors hover:border-pati-burgundy/60 focus-within:border-pati-burgundy/80">
                                <div>
                                    <p className="font-semibold text-pati-burgundy mb-1">{option.name}</p>
                                    {option.description && <p className="text-xs text-pati-brown mb-2">{option.description}</p>}
                                </div>
                                <p className="text-lg font-bold text-pati-burgundy mb-2">{option.price}</p>
                                <Button 
                                    size="sm" 
                                    className="relative w-full" 
                                    onClick={() => handleAddPack(option)}
                                    disabled={isAnimatingReward} // Disable during animation
                                >
                                    <span id={rewardId} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                                    Añadir al Pedido
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Inner Component handling configuration logic and UI - NOW GENERIC
const ItemPackConfigurator: React.FC<ItemPackConfiguratorProps> = ({ product, category, id, onConfigUpdate }) => {
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
    const { state, dispatch, getTotalItems } = useCart();
    const phoneNumber = "+34671266981";
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const { ref: summaryRef, inView } = useInView({ threshold: 0.5 });
    useEffect(() => { setIsSummaryVisible(inView); }, [inView]);

    // --- REWARD HOOKS ---
    const rewardIdSticky = `reward-itempack-sticky-${product.id}`;
    const { reward: rewardSticky, isAnimating: isAnimatingSticky } = useReward(rewardIdSticky, 'emoji', {
        emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
        elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });

    const rewardIdSummary = `reward-itempack-summary-${product.id}`;
    const { reward: rewardSummary, isAnimating: isAnimatingSummary } = useReward(rewardIdSummary, 'emoji', {
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

    // Efecto para sincronizar los estados con el componente padre Y MobileCartBar
    useEffect(() => {
        // Si existe la función onConfigUpdate, pasar los estados actuales
        if (onConfigUpdate) {
            onConfigUpdate(
                selectedPackSize,
                currentPackIsCustom,
                currentCount,
                isOrderComplete,
                finalPackPrice,
                isAnimatingSummary,
                isAnimatingSticky
            );
        }
        // --- NUEVO: Emitir evento global para MobileCartBar ---
        const isActive = !!(selectedPackSize || (currentPackIsCustom && currentCount > 0));
        window.dispatchEvent(new CustomEvent('pack-selection-update', {
          detail: {
            isActive,
            isOrderComplete,
            currentCount,
            selectedPackSize,
            currentPackIsCustom,
            maxToSelect: currentPackIsCustom ? null : selectedPackSize,
            productName: product.name
          }
        }));
    }, [
        selectedPackSize,
        currentPackIsCustom,
        currentCount,
        isOrderComplete,
        finalPackPrice,
        isAnimatingSticky,
        onConfigUpdate,
        selectedItems,  // Añadido para actualizar cuando cambian las galletas seleccionadas
        selectedFlavors, // Añadido para actualizar cuando cambian los sabores seleccionados
        isAnimatingSummary
    ]);

    // Efecto para escuchar el evento add-to-cart
    useEffect(() => {
        const handleCustomEvent = (e: CustomEvent) => {
            if (e.detail && e.detail.source) {
                if (e.detail.source === 'sticky') {
                    handleAddToCart('sticky');
                } else if (e.detail.source === 'desktop') {
                    handleAddToCart('summary'); // Usamos summary para el efecto en desktop
                    rewardSummary(); // Disparar la animación del botón de resumen
                } else if (e.detail.source === 'summary' && e.detail.packSelection) {
                    // Si viene de la píldora, reconstruimos el estado y añadimos el producto
                    // Usamos los datos de packSelection para crear el item
                    const sel = e.detail.packSelection;
                    let cartItemId: string;
                    let cartItemPayload: Omit<CartItem, 'id'>;
                    if (sel.currentPackIsCustom) {
                        cartItemId = `customPack-${product.id}-${Date.now()}`;
                        cartItemPayload = {
                            productId: product.id,
                            productName: `${product.name} - Personalizado`,
                            quantity: 1,
                            packPrice: sel.currentCount * (currentCustomPackUnitPrice || 0),
                            imageUrl: product.image,
                            type: 'cookiePack',
                            cookieDetails: {
                                packSize: sel.currentCount,
                                cookies: selectedItems
                            },
                            selectedOptions: { pack: 'Personalizado' }
                        };
                    } else {
                        cartItemId = `${product.id}-pack${sel.selectedPackSize}`;
                        cartItemPayload = {
                            productId: product.id,
                            productName: product.name,
                            quantity: 1,
                            packPrice: finalPackPrice,
                            imageUrl: product.image,
                            type: 'cookiePack',
                            cookieDetails: {
                                packSize: sel.selectedPackSize,
                                cookies: selectedItems
                            }
                        };
                    }
                    dispatch({ type: 'ADD_ITEM', payload: { ...cartItemPayload, id: cartItemId } });
                    rewardSticky();
                }
            }
        };

        document.addEventListener('add-to-cart', handleCustomEvent as EventListener);
        return () => {
            document.removeEventListener('add-to-cart', handleCustomEvent as EventListener);
        };
    }, [isOrderComplete, selectedItems, selectedFlavors, finalPackPrice, currentCustomPackUnitPrice, currentPackIsCustom, selectedPackSize, currentCount, product, dispatch, rewardSticky, rewardSummary]);

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
        const currentTotalCount = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
        const currentUniqueFlavorCount = Object.keys(selectedItems).length;
        const isFlavorAlreadySelected = (selectedItems[itemName] || 0) > 0;

        // Condición 1: No exceder el tamaño total del pack
        if (currentTotalCount >= (selectedPackSize || 0)) {
                    return;
                }

        // Condición 2: Respetar el límite de sabores únicos, si está definido
        if (maxUniqueSelectedFlavorsAllowed !== null) {
            if (currentUniqueFlavorCount >= maxUniqueSelectedFlavorsAllowed && !isFlavorAlreadySelected) {
                // Ya se alcanzó el límite de sabores únicos Y este es un sabor nuevo
                console.warn(`Máximo de ${maxUniqueSelectedFlavorsAllowed} sabores únicos alcanzado.`);
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
        const selectedOpt = packOptions.find(opt => opt.name === value);

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
        if (!isOrderComplete) return; 
        
        let cartItemId: string;
        let cartItemPayload: Omit<CartItem, 'id'>;

        if (currentPackIsCustom) {
            if (!currentCustomPackUnitPrice || currentCount === 0) return; 
            // Generar ID ÚNICA para cada pack personalizado
            cartItemId = `customPack-${product.id}-${Date.now()}`;
            cartItemPayload = {
                productId: product.id,
                productName: `${product.name} - Personalizado`, 
                quantity: 1, 
                packPrice: finalPackPrice, 
                imageUrl: product.image, 
                type: 'cookiePack', 
                cookieDetails: { 
                    packSize: currentCount, 
                    cookies: selectedItems 
                },
                selectedOptions: { pack: 'Personalizado' } 
            };

        } else {
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
        }

        dispatch({ type: 'ADD_ITEM', payload: { ...cartItemPayload, id: cartItemId } }); // Siempre ADD_ITEM
        if (triggerSource === 'sticky') rewardSticky();
        else if (triggerSource === 'summary') rewardSummary();
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
        return `¡Hola Pati! 👋 Quiero mi Pack de ${selectedPackSize} ${productLabel} (${finalPackPrice?.toFixed(2).replace('.', ',')}€):\\n\\n${itemsList}\\n\\n¿Confirmamos el pedido? 😊`;
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
  const filteredPackOptions = useMemo(() => {
    if (product.configType === 'flavorPack') {
      // Solo permitir 25 y 50
      return packOptions.filter(opt => opt.size === 25 || opt.size === 50);
    }
    return packOptions;
  }, [packOptions, product.configType]);

  return (
      <>
        {/* Main content area for the configurator */}
          <div className="space-y-4">
            {/* Product Title and Description */}
            <div className="relative inline-block">
              <h1 className="text-2xl md:text-3xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
              {product.name.toLowerCase().includes('happy hippo') && (
                <span className="absolute -top-4 -right-16 z-10">
                  <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                    <path
                      d="M40 5 Q45 15 55 10 Q60 20 70 15 Q68 28 78 30 Q70 38 75 45 Q65 48 70 60 Q60 58 58 70 Q50 65 45 75 Q40 65 35 75 Q30 65 22 70 Q20 58 10 60 Q15 48 5 45 Q10 38 2 30 Q12 28 10 15 Q20 20 25 10 Q35 15 40 5 Z"
                      fill="#a78bfa"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text x="40" y="48" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="'Comic Sans MS', 'Comic Sans', cursive">NEW</text>
                  </svg>
                </span>
              )}
            </div>
            <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
            <MobileVideoPlayer product={product} />

            {/* Step 1: Select Pack */}
                <Card className="border-pati-pink/30 shadow-md">
                 <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-xl text-pati-burgundy">Elige tu Pack</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {product.configType === 'cookiePack' && (
                        <RadioGroup
                            value={currentPackIsCustom ? product.options?.find(opt => opt.isCustomPack)?.name || '' : selectedPackSize ? product.options?.find(opt => !opt.isCustomPack && parseInt(opt.name.match(/\d+/)?.[0] || '0') === selectedPackSize)?.name : ''}
                            onValueChange={handlePackSelect}
                            className="flex flex-row w-full gap-2"
                        >
                            {product.options?.map((option) => {
                                // Mostrar 'Pack 6', 'Pack 12' o 'Individual', pero el value y la lógica usan option.name
                                let displayName = '';
                                if (option.isCustomPack) displayName = 'Individual';
                                else if (option.name.includes('6')) displayName = 'Pack 6';
                                else if (option.name.includes('12')) displayName = 'Pack 12';
                                else displayName = option.name;
                                // Lógica de selección restaurada
                                const isSelected = (option.isCustomPack && currentPackIsCustom) || (!option.isCustomPack && !currentPackIsCustom && selectedPackSize && parseInt(option.name.match(/\d+/)?.[0] || '0') === selectedPackSize);
                                // Determinar texto de restricción de sabores
                                let flavorInfo = '';
                                if (option.maxUniqueFlavors === 2) flavorInfo = '2 sabores';
                                else if (option.isCustomPack || option.name.includes('12')) flavorInfo = 'Sin límite';
                                // Colores pati
                                const patiSelected = isSelected ? 'bg-pati-burgundy border-pati-burgundy text-white' : 'bg-white border-pati-pink/60 text-pati-burgundy hover:border-pati-burgundy/60';
                                const displayPrice = String(option.price).replace('/ud', '').replace('/ ud', '').replace(' /ud', '').replace(' / ud', '').trim();
                                return (
                                    <div key={option.name} className="relative flex-1 min-w-0 max-w-[33%] sm:max-w-[200px]" style={{flexBasis: '0', flexGrow: 1}}>
                                        <label
                                            htmlFor={option.name}
                                            className={`w-full h-full border-2 rounded-xl px-2 py-2 sm:px-4 sm:py-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden whitespace-normal ${patiSelected}`}
                                        >
                                            <RadioGroupItem
                                                value={option.name}
                                                id={option.name}
                                                className="hidden"
                                            />
                                            <span className="font-bold mb-1 text-base sm:text-lg leading-tight w-full break-words text-center">{displayName}</span>
                                            {flavorInfo && <span className="text-sm mb-1 text-pati-brown/90 w-full break-words text-center">{flavorInfo}</span>}
                                            <span className="text-xl font-bold mt-1 text-center">{displayPrice.replace('.', '')}</span>
                                        </label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    )}
                    {product.configType === 'flavorPack' && (
                        <RadioGroup
                            value={selectedPackSize ? filteredPackOptions.find(opt => opt.size === selectedPackSize)?.name || '' : ''}
                            onValueChange={handlePackSelect}
                            className="flex flex-row w-full gap-2"
                        >
                            {filteredPackOptions.map((option) => {
                                // Mostrar 'Pack 6', 'Pack 12' o 'Individual', pero el value y la lógica usan option.name
                                let displayName = '';
                                if (option.isCustomPack) displayName = 'Individual';
                                else if (option.name.includes('6')) displayName = 'Pack 6';
                                else if (option.name.includes('12')) displayName = 'Pack 12';
                                else displayName = option.name;
                                // Lógica de selección restaurada
                                const isSelected = (option.isCustomPack && currentPackIsCustom) || (!option.isCustomPack && !currentPackIsCustom && selectedPackSize && parseInt(option.name.match(/\d+/)?.[0] || '0') === selectedPackSize);
                                // Determinar texto de restricción de sabores
                                let flavorInfo = '';
                                if (option.maxUniqueFlavors === 2) flavorInfo = '2 sabores';
                                else if (option.isCustomPack || option.name.includes('12')) flavorInfo = 'Sin límite';
                                // Colores pati
                                const patiSelected = isSelected ? 'bg-pati-burgundy border-pati-burgundy text-white' : 'bg-white border-pati-pink/60 text-pati-burgundy hover:border-pati-burgundy/60';
                                const displayPrice = String(option.price).replace('/ud', '').replace('/ ud', '').replace(' /ud', '').replace(' / ud', '').trim();
                                return (
                                    <div key={option.name} className="relative flex-1 min-w-0 max-w-[33%] sm:max-w-[200px]" style={{flexBasis: '0', flexGrow: 1}}>
                                        <label
                                            htmlFor={option.name}
                                            className={`w-full h-full border-2 rounded-xl px-2 py-2 sm:px-4 sm:py-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden whitespace-normal ${patiSelected}`}
                                        >
                                            <RadioGroupItem
                                                value={option.name}
                                                id={option.name}
                                                className="hidden"
                                            />
                                            <span className="font-bold mb-1 text-base sm:text-lg leading-tight w-full break-words text-center">{displayName}</span>
                                            {flavorInfo && <span className="text-sm mb-1 text-pati-brown/90 w-full break-words text-center">{flavorInfo}</span>}
                                            <span className="text-xl font-bold mt-1 text-center">{displayPrice.replace('.', '')}</span>
                                        </label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    )}
                    </CardContent>
                </Card>

            {/* Step 2: Select Items/Flavors */}
            <Card className={`border-pati-pink/30 shadow-md transition-opacity duration-300 ${(selectedPackSize || currentPackIsCustom) ? 'opacity-100' : 'opacity-60 pointer-events-none'}`}>
                <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-xl text-pati-burgundy">
                        {product.configType === 'flavorPack' ? 'Elige tus Sabores' : 'Elige tus Galletas'}
                    </CardTitle>
                            <CardDescription>
                        {product.configType === 'flavorPack' ? (
                            `Selecciona hasta ${maxFlavors} sabor${maxFlavors !== 1 ? 'es' : ''}. (${currentCount} / ${maxFlavors || 0})`
                        ) : currentPackIsCustom ? (
                            <>
                                {`Añade las galletas que quieras. Llevas ${currentCount} galleta${currentCount !== 1 ? 's' : ''}.`}
                                <span className="block text-xs mt-1">
                                    (Precio por galleta: {currentCustomPackUnitPrice?.toFixed(2).replace('.', ',')}€)
                                </span>
                            </>
                        ) : (
                            <> 
                                {`Selecciona ${selectedPackSize || 0} unidad${(selectedPackSize || 0) !== 1 ? 'es' : ''}. (${currentCount} / ${selectedPackSize || 0})`}
                                {maxUniqueSelectedFlavorsAllowed !== null && (
                                    <span className="block text-xs mt-1">
                                        (Máx. {maxUniqueSelectedFlavorsAllowed} tipo{maxUniqueSelectedFlavorsAllowed !== 1 ? 's' : ''} distinto{maxUniqueSelectedFlavorsAllowed !== 1 ? 's' : ''}. Llevas {currentUniqueFlavorsSelected})                                            
                                    </span>
                                )}
                            </>
                                )}
                            </CardDescription>
                    </CardHeader>
                <CardContent className="pt-1 pb-3">
                    {/* --- UI for CookiePack --- */}
                    {product.configType === 'cookiePack' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                                {availableItems.map((item) => {
                                    const count = selectedItems[item.name] || 0;
                                    const isSelected = count > 0;
                                    // Determine if disabled (can't add more items or reached max unique flavors)
                                    const canAddThis = (currentCount < (selectedPackSize || Infinity)) || isSelected;
                                    const maxUniqueReached = maxUniqueSelectedFlavorsAllowed !== null && 
                                                           currentUniqueFlavorsSelected >= maxUniqueSelectedFlavorsAllowed &&
                                                           !isSelected;
                                    const isDisabled = !canAddThis || (!currentPackIsCustom && maxUniqueReached);
                                    const isHappyHippo = item.name.toLowerCase().includes('happy hippo');
                                    return (
                                        <div key={item.name} 
                                            className={`flex flex-col border rounded-md overflow-hidden transition-colors h-full
                                                      ${isSelected ? 'border-pati-burgundy shadow-md' : 'border-gray-200'}
                                                      ${isDisabled ? 'opacity-50' : 'hover:border-pati-burgundy/50'}`}
                                        >
                                            <div 
                                                className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-1 cursor-pointer"
                                                onClick={() => !isDisabled && incrementItem(item.name)}
                                            >
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className={`object-contain h-full w-full transition-transform ${isSelected ? 'scale-110' : 'scale-100'}`}
                                                    loading="lazy"
                                                />
                                                {isHappyHippo && (
                                                  <span className="absolute top-2 right-2 z-10">
                                                    <svg width="54" height="54" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                                                      <path
                                                        d="M40 5 Q45 15 55 10 Q60 20 70 15 Q68 28 78 30 Q70 38 75 45 Q65 48 70 60 Q60 58 58 70 Q50 65 45 75 Q40 65 35 75 Q30 65 22 70 Q20 58 10 60 Q15 48 5 45 Q10 38 2 30 Q12 28 10 15 Q20 20 25 10 Q35 15 40 5 Z"
                                                        fill="#a78bfa"
                                                        stroke="#fff"
                                                        strokeWidth="2"
                                                      />
                                                      <text x="40" y="48" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="'Comic Sans MS', 'Comic Sans', cursive">NEW</text>
                                                    </svg>
                                                  </span>
                                                )}
                                            </div>
                                            <div className="p-1.5 flex flex-col justify-between flex-grow bg-white">
                                                <div>
                                                    <p className={`text-xs font-medium leading-tight truncate ${isSelected ? 'text-pati-burgundy' : 'text-pati-dark-brown'}`} title={item.name}>
                                                        {item.name}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center mt-1.5">
                                                    <Button 
                                                        variant="outline"
                                                        size="icon"
                                                        className={`h-5 w-5 rounded-full ${count === 0 ? 'invisible' : ''}`}
                                                        onClick={() => decrementItem(item.name)}
                                                    >
                                                        <MinusCircle className="h-3 w-3" />
                                                    </Button>
                                                    <div className={`min-w-[24px] text-center font-semibold text-xs rounded-md px-1.5 py-0.5 ${count > 0 ? 'bg-pati-burgundy text-white' : 'text-gray-400'}`}>
                                                        {count}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className={`h-5 w-5 rounded-full ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        onClick={() => incrementItem(item.name)}
                                                        disabled={isDisabled}
                                                    >
                                                        <PlusCircle className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
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
              <div ref={summaryRef} id="summary-card" className={`space-y-3 transition-opacity duration-300 md:hidden ${(selectedPackSize || currentPackIsCustom) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Card className="border-pati-pink/30 shadow-lg md:mb-3">
                  <CardHeader className="pb-2 pt-3">
                     <CardTitle className="text-xl text-pati-burgundy">
                        {currentPackIsCustom ? `Resumen Pack Personalizado` : `Resumen del Pack ${selectedPackSize || 0}`}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-1 pb-3">
                     <div className="flex justify-between items-center font-medium border-b pb-2 border-pati-pink/20">
                       <span>{currentPackIsCustom ? 'Total Galletas:': (product.configType === 'flavorPack' ? 'Sabores Seleccionados:' : 'Unidades Seleccionadas:')}</span>
                       <Badge variant={isOrderComplete ? "default" : "secondary"} className={`${isOrderComplete ? 'bg-green-600 text-white' : ''}`}>
                           {currentPackIsCustom ? `${currentCount} uds.` : (product.configType === 'flavorPack' ? `${selectedFlavors.length} / ${maxFlavors || 0}` : `${currentCount} / ${selectedPackSize || 0} uds.`)}
                       </Badge>
                     </div>
                     <div className="flex justify-between items-center text-xl font-bold text-pati-burgundy">
                        <span>Precio Total:</span>
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
                     {/* Botón de Añadir al Carrito para el Resumen (visible en móvil) */}
                     <div className="flex flex-col gap-2 mt-2 md:hidden"> {/* HIDDEN ON DESKTOP */}
                         <Button 
                             id="add-pack-button-summary"
                             onClick={() => {
                                 handleAddToCart('summary');
                                 rewardSummary(); // Asegurar que la animación se activa aquí
                             }}
                             size="lg" 
                             className={`relative w-full max-w-[280px] mx-auto bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2 ${!isOrderComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                             disabled={!isOrderComplete || isAnimatingSummary} 
                         >
                             <span id={rewardIdSummary} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                             <ShoppingCart className="mr-2 h-5 w-5" /> 
                             {isOrderComplete 
                                 ? (currentPackIsCustom 
                                     ? `Añadir ${currentCount} Galleta${currentCount !== 1 ? 's' : ''}`
                                     : product.configType === 'flavorPack'
                                         ? `Añadir Caja ${selectedPackSize || 0}`
                                         : `Añadir Pack ${selectedPackSize || 0}`) 
                                 : currentPackIsCustom 
                                     ? 'Elige tus galletas'
                                     : product.configType === 'flavorPack'
                                         ? `Elige ${maxFlavors || 0 - selectedFlavors.length} sabor(es) más`
                                         : `Completa tu pack de ${selectedPackSize || 0}`}
                         </Button>
                     </div>
                  </CardContent>
                </Card>
                </div>
            )}
        </div> {/* End of main space-y-4 wrapper */}

        {/* Sticky Footer Bar - Only shown when a pack size is selected OR custom pack is active */}
        {(selectedPackSize || currentPackIsCustom) && (
             <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md p-2 border-t border-pati-pink/30 shadow-top-lg flex items-center justify-between gap-3 hidden md:flex">
                 <div className='flex-grow'>
                    <p className="text-sm font-medium text-pati-burgundy">
                        {currentPackIsCustom ? `Pack Personalizado (${currentCount} galleta${currentCount !== 1 ? 's' : ''})` : `Pack ${selectedPackSize || 0} - ${product.name}`}
                    </p>
                    <p className="text-xs text-pati-brown">
                        {isOrderComplete ?
                            (currentPackIsCustom ? `Total: ${finalPackPrice.toFixed(2).replace('.',',')}€ ¡Listo para añadir!` : (product.configType === 'flavorPack' ? `(${selectedFlavors.length}/${maxFlavors || 0}) ¡Listo para añadir!` : `¡Listo para añadir! (${finalPackPrice.toFixed(2).replace('.',',')}€)`)) :
                            (currentPackIsCustom ? (currentCount > 0 ? `Total: ${finalPackPrice.toFixed(2).replace('.',',')}€ (Pulsa para añadir)` : 'Elige tus galletas') : (product.configType === 'flavorPack' ? `Elige ${maxFlavors || 0 - selectedFlavors.length} sabor(es) más.` : `${currentCount}/${selectedPackSize || 0} seleccionados. Completa tu pack.`))
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
                        disabled={!isOrderComplete || isAnimatingSticky} // Disable during animation
                    >
                        <span id={rewardIdSticky} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                        {isOrderComplete ? <CheckCircle2 className="mr-1.5 h-4 w-4"/> : <Info className="mr-1.5 h-4 w-4" />}
                         {isOrderComplete ? (currentPackIsCustom ? "Añadir Galletas" : "Añadir Pack") :
                         (currentPackIsCustom ? (currentCount > 0 ? 'Añadir Galletas' : 'Elige Galletas') : (product.configType === 'flavorPack' ? `Elige ${maxFlavors || 0 - selectedFlavors.length} sabor(es) más.` : `${currentCount}/${selectedPackSize || 0} seleccionados. Completa tu pack.`))
                         }
                    </Button>
                </div>
              </div>
            )}
      </>
    );
};

// Creamos un nuevo componente DesktopPackSummary que actualiza dinámicamente
const DesktopPackSummary = ({ 
  product,
  selectedPackSize,
  currentPackIsCustom,
  currentCount,
  isOrderComplete,
  finalPackPrice,
  handleAddToCart,
  isAnimating
}: { 
    product: ProductType;
  selectedPackSize: number | null;
  currentPackIsCustom: boolean;
  currentCount: number;
  isOrderComplete: boolean;
  finalPackPrice: number;
  handleAddToCart: (source: 'desktop' | 'summary' | 'sticky') => void;
  isAnimating: boolean;
}) => {
  const rewardIdDesktop = `reward-itempack-desktop-${product.id}`;
  const { reward: rewardDesktop, isAnimating: isAnimatingDesktop } = useReward(rewardIdDesktop, 'emoji', {
        emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
        elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
    });

    // Determinar el máximo de sabores para palmeritas basado en selectedPackSize
    const maxFlavorsForPalmeritas = useMemo(() => {
        if (product.configType === 'flavorPack') {
            if (selectedPackSize === 50) return 4;
            if (selectedPackSize === 25) return 2;
        }
        return null; // No aplica o no se pudo determinar
    }, [product.configType, selectedPackSize]);

    return (
    <div className="mb-6" id="desktop-summary-container">
      <Card className="border-pati-pink/30 shadow-lg">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-xl text-pati-burgundy">
            {currentPackIsCustom 
              ? "Resumen Pack Personalizado" 
              : product.configType === 'flavorPack' 
                ? `Resumen Caja ${selectedPackSize || 0} Palmeritas`
                : `Resumen del Pack ${selectedPackSize || 0}`}
          </CardTitle>
                </CardHeader>
        <CardContent className="space-y-3 pt-1 pb-3">
          <div className="flex justify-between items-center font-medium border-b pb-2 border-pati-pink/20">
            <span>
              {currentPackIsCustom 
                ? 'Total Galletas:' 
                : product.configType === 'flavorPack'
                  ? 'Sabores Seleccionados:'
                  : 'Selección Actual:'}
            </span>
            <Badge variant={isOrderComplete ? "default" : "secondary"} className={`${isOrderComplete ? 'bg-green-600 text-white' : ''}`}>
              {currentPackIsCustom 
                ? `${currentCount} uds.` 
                : product.configType === 'flavorPack' && maxFlavorsForPalmeritas
                  ? `${currentCount}/${maxFlavorsForPalmeritas}`
                  : `${currentCount}/${selectedPackSize || 0} uds.`}
                                    </Badge>
                                </div>
          <div className="flex justify-between items-center text-xl font-bold text-pati-burgundy">
            <span>Precio Total:</span>
            <span>{finalPackPrice.toFixed(2).replace('.', ',')}€</span>
                            </div>
          <div className="flex flex-col gap-2 mt-2">
                <Button 
              id="add-pack-button-desktop"
              onClick={() => {
                handleAddToCart('desktop');
                rewardDesktop(); // Call the reward function here
              }}
                    size="lg" 
              className={`relative flex-1 bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2 ${!isOrderComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isOrderComplete || isAnimatingDesktop || isAnimating}
                > 
              <span id={rewardIdDesktop} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                    <ShoppingCart className="mr-2 h-5 w-5" /> 
              {isOrderComplete 
                ? (currentPackIsCustom 
                    ? `Añadir ${currentCount} Galleta${currentCount !== 1 ? 's' : ''}`
                    : product.configType === 'flavorPack'
                      ? `Añadir Caja ${selectedPackSize || 0}`
                      : `Añadir Pack ${selectedPackSize || 0}`) 
                : product.configType === 'flavorPack' && maxFlavorsForPalmeritas
                  ? `Elige ${maxFlavorsForPalmeritas - currentCount} sabor(es) más`
                  : currentPackIsCustom 
                    ? 'Elige tus galletas'
                    : `Completa tu pack de ${selectedPackSize || 0}`}
                </Button>
            </div>
        </CardContent>
      </Card>
        </div>
    );
};

// Main Component
const ProductDetail = () => {
  const { category, slug } = useParams();
  const { dispatch } = useCart();
  
  const product = useMemo(() => {
    const foundProduct = productsData.find(p => p.slug === slug && p.category === category);
    if (foundProduct && category === 'galletas' && !foundProduct.individualCookies) {
        console.error("Product data for galletas is missing individualCookies array.");
        return null; 
    }
    return foundProduct || null;
  }, [category, slug]);

  // Reward hook para el botón de flavorOnly
  const flavorOnlyRewardId = product ? `reward-flavorOnly-${product.id}` : 'reward-flavorOnly-default';
  const { reward: rewardFlavorOnly, isAnimating: isAnimatingFlavorOnly } = useReward(flavorOnlyRewardId, 'emoji', {
    emoji: ['🎂', '🍰', '💖', '✨'],
    elementCount: 15, spread: 90, startVelocity: 30, decay: 0.95, lifetime: 200, zIndex: 1000, position: 'absolute',
  });

  // Estos estados son necesarios para el componente DesktopPackSummary
  // Estados para los configuradores (para el DesktopPackSummary)
  const [selectedPackSize, setSelectedPackSize] = useState<number | null>(null);
  const [currentPackIsCustom, setCurrentPackIsCustom] = useState<boolean>(false);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [finalPackPrice, setFinalPackPrice] = useState<number>(0);
  const [isAnimatingSummary, setIsAnimatingSummary] = useState<boolean>(false);
  const [isAnimatingSticky, setIsAnimatingSticky] = useState<boolean>(false);

  // Función para manejar la adición al carrito (para el DesktopPackSummary)
  const handleAddToCart = (source: 'desktop' | 'summary' | 'sticky') => {
    // Encontrar el componente ItemPackConfigurator y llamar a su método handleAddToCart
    // En lugar de implementación ficticia, ahora emitimos un evento personalizado que será
    // capturado por el componente ItemPackConfigurator
    const event = new CustomEvent('add-to-cart', { detail: { source } });
    document.dispatchEvent(event);
  };

  // Estos estados serán actualizados por el componente real ItemPackConfigurator

  const renderConfigurator = () => {
      if (!product) return null;

      // Para productos cookiePack (como las galletas) y flavorPack (como las palmeritas)
      // modificamos el renderizado para conectar los estados con el componente DesktopPackSummary
      if ((product.configType === 'cookiePack' && product.id === 2) || 
          (product.configType === 'flavorPack' && product.id === 9)) {
        const updatePackConfigurator = (
          packSize: number | null,
          isCustom: boolean,
          count: number,
          complete: boolean, 
          price: number,
          animatingSummary: boolean,
          animatingSticky: boolean
        ) => {
          setSelectedPackSize(packSize);
          setCurrentPackIsCustom(isCustom);
          setCurrentCount(count);
          setIsOrderComplete(complete); 
          setFinalPackPrice(price);
          setIsAnimatingSummary(animatingSummary);
          setIsAnimatingSticky(animatingSticky);
        };

        return <ItemPackConfigurator 
                product={product} 
                category={product.category} 
                id={product.id.toString()}
                onConfigUpdate={updatePackConfigurator}
              />;
      }

      switch (product.configType) {
          case 'cookiePack':
          case 'flavorPack':
            return <ItemPackConfigurator product={product} category={product.category} id={product.id.toString()} />;
          case 'fixedPack':
            return <FixedPackSelector product={product} />;
          case 'flavorQuantity':
            return <FlavorMultiSelector product={product} />;
          case 'sizePack':
            return <SizePackSelector product={product} />;
          case 'flavorOnly':
            return (
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
                <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
                <MobileVideoPlayer product={product} />
                {product.size && <p className="text-md text-pati-brown"><span className="font-semibold">Tamaño:</span> {product.size}</p>}
                <p className="text-xl font-bold text-pati-accent mb-4">{product.price}</p>
                <Button 
                  size="lg" 
                  className="relative w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2"
                  onClick={() => {
                    dispatch({ 
                      type: 'ADD_ITEM', 
                      payload: { 
                        id: product.id.toString(), 
                        productId: product.id, 
                        productName: product.name, 
                        quantity: 1, 
                        packPrice: parseFloat(product.price.replace('€', '').replace(',', '.')), 
                        imageUrl: product.image, 
                        type: 'flavorOnly',
                        selectedOptions: { flavor: product.availableFlavors ? product.availableFlavors[0] : '' } // Por defecto el primer sabor o vacío
                      }
                    });
                    rewardFlavorOnly(); // Trigger the animation here
                  }}
                  disabled={isAnimatingFlavorOnly}
                >
                  <span id={flavorOnlyRewardId} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                  Añadir al Pedido
                </Button>
              </div>
            );
          case 'flavorMultiSelect': 
              return <FlavorMultiSelector product={product} />;
          default:
              return (
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
                  <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
                  <MobileVideoPlayer product={product} />
                  <p className="text-xl font-bold text-pati-accent mb-4">{product.price}</p>
                  <Button size="lg" className="relative w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2"> 
                      <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
                  </Button>
                </div>
              );
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
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative pb-24 lg:pb-12"> {/* Reducido padding */}
        <div className="flex items-center justify-between mb-4">
          <Link to={'/#productos'} className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al catálogo
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  text: product.description,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('¡Enlace copiado!');
              }
            }}
            className="inline-flex items-center gap-1 text-pati-burgundy hover:text-pati-brown bg-pati-cream border border-pati-pink/40 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pati-burgundy focus:ring-offset-2 transition-colors"
            aria-label="Compartir producto"
          >
            <Share2 className="h-4 w-4 mr-1" /> Compartir
          </button>
        </div>
        {/* Main Grid: Adjusted for Palmeritas (ID 9) & Galletas (ID 2) one-column layout */}
        <div className={`grid ${product.configType === 'fixedPack' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6 lg:gap-8 items-start`}> {/* Reducido gap */}
           {/* Column 1: Configurator (always present) */}
           <div>
              {renderConfigurator()} 
              {/* Resumen del Pack en Desktop - Para cookiePack (id 2 - galletas) y flavorPack (id 9 - palmeritas) */}
              {((product.configType === 'cookiePack' && product.id === 2) || 
                (product.configType === 'flavorPack' && product.id === 9)) && (
                <div className="hidden md:block mt-6"> {/* Added wrapper div with desktop-only class and margin-top */}
                  <DesktopPackSummary 
                    product={product}
                    selectedPackSize={selectedPackSize}
                    currentPackIsCustom={currentPackIsCustom}
                    currentCount={currentCount}
                    isOrderComplete={isOrderComplete}
                    finalPackPrice={finalPackPrice}
                    handleAddToCart={handleAddToCart}
                    isAnimating={isAnimatingSummary || isAnimatingSticky}
                  />
                </div>
              )}
           </div>

           {/* Column 2: Media (Image or Video) - Conditional Rendering Adjusted */}
           {(product.configType !== 'fixedPack') && (
             <div className="hidden md:block md:sticky md:top-24">
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