import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Cake, Cookie, Plus, Minus, Gift } from 'lucide-react';
import { Product, FlavorOption, Topping } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';
import { useReward } from 'react-rewards';
import MobileVideoPlayer from './MobileVideoPlayer';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface SizePackSelectorProps {
  product: Product;
}

// Define a type for topping positions
interface ToppingPosition {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

const SizePackSelector: React.FC<SizePackSelectorProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const { dispatch } = useCart();
  const rewardId = `size-pack-${product.id}`;
  const { reward, isAnimating } = useReward(rewardId, 'emoji', {
    emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'],
    elementCount: 15,
    spread: 90,
    startVelocity: 30,
    decay: 0.95,
    lifetime: 200,
    zIndex: 1000,
    position: 'absolute',
  });

  // Mapping for flavor and topping images
  const itemImageMap: { [key: string]: string } = {
    // Flavors (as per src/data/products.ts flavorOptions for Tarta Galleta)
    // 'Nutella': '/images/nutella.png', // Assuming a nutella.png exists for 'Nutella' - REMOVED AS REQUESTED
    // 'Lotus': '/images/lotus.png',     // Assuming a lotus.png exists for 'Lotus'
    // 'Kinder': '/images/kinder-bueno.png', // Using kinder-bueno for the 'Kinder' flavor

    // Toppings (as per existing toppings or new ones)
    'Happy Hippo': '/images/happy-hippo.png',
    'Kinder Bueno': '/images/kinder-bueno.png',
    'Kinder Maxi': '/images/kinder-maxi.png',
    'Galleta Lotus': '/images/galleta-lotus.png',
    // Add other toppings if they have specific overlay images
  };

  // Predefined positions for toppings (relative to the cake image)
  const toppingPositions: ToppingPosition[] = [
    { top: '30%', left: '30%' },
    { top: '30%', left: '70%' },
    { top: '70%', left: '30%' },
    { top: '70%', left: '70%' },
    { top: '40%', left: '25%' },
    { top: '40%', left: '75%' },
    { top: '25%', left: '50%' },
    { top: '75%', left: '50%' },
    { top: '50%', left: '40%' },
    { top: '50%', left: '60%' },
    { top: '35%', left: '45%' },
    { top: '35%', left: '55%' },
    { top: '65%', left: '45%' },
    { top: '65%', left: '55%' },
  ];

  const numInstancesPerTopping = 3; // Number of instances to display for each selected topping

  const getOverlayImageUrl = (itemName: string): string | undefined => {
    return itemImageMap[itemName];
  };

  const handleSizeSelect = (value: string) => {
    setSelectedSize(value);
    setSelectedFlavor(null);
    setSelectedToppings([]);
  };

  const handleFlavorSelect = (value: string) => {
    setSelectedFlavor(value);
  };

  const handleToppingCheck = (toppingName: string, checked: boolean) => {
    setSelectedToppings(prev =>
      checked ? [...prev, toppingName] : prev.filter(name => name !== toppingName)
    );
  };

  const calculateTotalPrice = useMemo(() => {
    let basePrice = 0;
    const selectedSizeOption = product.options?.find(opt => opt.name === selectedSize);
    if (selectedSizeOption) {
      basePrice = parseFloat(selectedSizeOption.price.replace('€', '').replace(',', '.'));
    }

    const selectedFlavorOption = product.flavorOptions?.find(opt => opt.name === selectedFlavor);
    const flavorPriceAdjustment = selectedFlavorOption?.priceAdjustment || 0;

    const toppingsPrice = selectedToppings.reduce((sum, toppingName) => {
      const topping = product.toppingOptions?.find(t => t.name === toppingName);
      return sum + (topping?.price || 0);
    }, 0);

    return basePrice + flavorPriceAdjustment + toppingsPrice;
  }, [selectedSize, selectedFlavor, selectedToppings, product.options, product.flavorOptions, product.toppingOptions]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFlavor) return;

    const selectedSizeOption = product.options?.find(opt => opt.name === selectedSize);
    const selectedFlavorOption = product.flavorOptions?.find(opt => opt.name === selectedFlavor);
    if (!selectedSizeOption || !selectedFlavorOption) return;

    const finalPrice = calculateTotalPrice;

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedFlavor}-${selectedToppings.join('-')}`,
      productId: product.id,
      productName: `${product.name} - ${selectedSize} ${selectedFlavor}` + (selectedToppings.length > 0 ? ` + ${selectedToppings.join(', ')}` : ''),
      quantity: 1,
      packPrice: finalPrice,
      imageUrl: product.image,
      type: 'sizePack',
      selectedOptions: {
        size: selectedSize,
        flavor: selectedFlavor,
        toppings: selectedToppings
      }
    } as CartItem;

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    reward();
  };

  // Helper function to format prices without trailing .00
  const formatPrice = (price: number): string => {
    if (price % 1 === 0) {
      return price.toFixed(0).replace('.', ',');
    } else {
      return price.toFixed(2).replace('.', ',');
    }
  };

  const isAddToCartEnabled = selectedSize !== null && selectedFlavor !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Cake className="h-8 w-8 text-pati-burgundy" />
        <h1 className="text-2xl md:text-3xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
      </div>
      <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>

      <MobileVideoPlayer product={product} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tamaño y Sabor */}
        <div className="space-y-4">
          <Card className="border-pati-pink/30 shadow-md">
            <CardHeader className="pb-3 pt-4">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-pati-burgundy" />
                <CardTitle className="text-xl text-pati-burgundy">Elige el Tamaño</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedSize || ''}
                onValueChange={handleSizeSelect}
                className="flex flex-row w-full gap-2"
              >
                {product.options?.map((option) => {
                  const isSelected = selectedSize === option.name;
                  const patiSelected = isSelected ? 'bg-pati-burgundy border-pati-burgundy text-white' : 'bg-white border-pati-pink/60 text-pati-burgundy hover:border-pati-burgundy/60';
                  
                  return (
                    <div key={option.name} className="relative flex-1 min-w-0 max-w-[33%] sm:max-w-[200px]" style={{flexBasis: '0', flexGrow: 1}}>
                      <label
                        htmlFor={option.name}
                        className={`w-full h-full border-2 rounded-xl px-2 py-1 sm:px-4 sm:py-1 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden whitespace-normal ${patiSelected}`}
                      >
                        <RadioGroupItem
                          value={option.name}
                          id={option.name}
                          className="hidden"
                        />
                        <span className="font-bold mb-1 text-base sm:text-lg leading-tight w-full break-words text-center">{option.name}</span>
                        {option.description && (
                          <span className="text-sm mb-1 text-pati-brown/90 w-full break-words text-center">{option.description}</span>
                        )}
                        <span className="text-xl font-bold mt-1 text-center">{option.price.includes('€') ? formatPrice(parseFloat(option.price.replace('€', '').replace(',', '.'))) + '€' : formatPrice(parseFloat(option.price.replace(',', '.')))}</span>
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {product.flavorOptions && product.flavorOptions.length > 0 && (
            <Card className={`border-pati-pink/30 shadow-md transition-opacity duration-300 ${selectedSize ? 'opacity-100' : 'opacity-60 pointer-events-none'}`}>
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-2">
                  <Cake className="h-5 w-5 text-pati-burgundy" />
                  {/* <CardTitle className="text-xl text-pati-burgundy">Elige el Sabor</CardTitle> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedFlavor || ''}
                  onValueChange={handleFlavorSelect}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {product.flavorOptions.map((flavor) => {
                    const isSelected = selectedFlavor === flavor.name;
                    const patiSelected = isSelected ? 'bg-pati-burgundy border-pati-burgundy text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400';
                    
                    return (
                      <label
                        key={flavor.name}
                        htmlFor={`flavor-${flavor.name}`}
                        className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer ${patiSelected}`}
                      >
                        <RadioGroupItem
                          value={flavor.name}
                          id={`flavor-${flavor.name}`}
                          className="hidden"
                        />
                        <div className="flex-grow">
                          <span className="font-medium text-base leading-none">{flavor.name}</span>
                          {flavor.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{flavor.description}</p>
                          )}
                        </div>
                        {flavor.priceAdjustment > 0 && (
                          <Badge variant="secondary" className="bg-pati-burgundy text-white hover:bg-pati-burgundy/90">
                            +{formatPrice(flavor.priceAdjustment)}€
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Toppings y Resumen */}
        <div className="space-y-4">
          {product.toppingOptions && product.toppingOptions.length > 0 && (
            <Card className={`border-pati-pink/30 shadow-md transition-opacity duration-300 ${selectedSize && selectedFlavor ? 'opacity-100' : 'opacity-60 pointer-events-none'}`}>
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-pati-burgundy" />
                  <CardTitle className="text-xl text-pati-burgundy">Toppings Extra</CardTitle>
                </div>
                <p className="text-sm text-gray-500">¡Añade un toque especial a tu tarta!</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-row flex-nowrap overflow-x-auto space-x-3 pb-2">
                  {product.toppingOptions.map((topping) => {
                    const isChecked = selectedToppings.includes(topping.name);
                    const toppingSelectedClass = isChecked ? 'bg-pati-burgundy border-pati-burgundy text-white' : 'bg-white border-pati-pink/60 text-pati-burgundy hover:border-pati-burgundy/60';

                    return (
                      <div
                        key={topping.name}
                        className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${toppingSelectedClass}`}
                        onClick={() => handleToppingCheck(topping.name, !isChecked)}
                      >
                        <span className="font-medium text-center w-full whitespace-normal break-words">{topping.name}</span>
                        <span className="text-lg font-bold mt-1 text-center w-full">
                          +{formatPrice(topping.price)}€
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {(selectedSize && selectedFlavor) && (
            <Card className="border-pati-pink/30 shadow-md p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center gap-2">
                  <Cake className="h-6 w-6 text-pati-burgundy" />
                  <h3 className="text-lg font-bold font-playfair text-pati-burgundy">Tu Tarta Personalizada</h3>
                </div>
                <div className="space-y-1 text-sm text-pati-dark-brown mb-4">
                  <div className="flex items-center justify-center gap-x-2">
                    <p className="flex items-center gap-1"><Cookie className="h-4 w-4 text-pati-burgundy" /> <span className="font-medium">Tamaño:</span> {selectedSize}</p>
                    <p className="flex items-center gap-1"><Cake className="h-4 w-4 text-pati-burgundy" /> <span className="font-medium">Sabor:</span> {selectedFlavor}</p>
                  </div>
                  {selectedToppings.length > 0 && (
                    <p className="flex items-center gap-1"><Gift className="h-4 w-4 text-pati-burgundy" /> <span className="font-medium">Toppings:</span> <span className="text-xs">{selectedToppings.join(', ')}</span></p>
                  )}
                  <p className="text-2xl font-bold font-playfair text-pati-burgundy mt-2">Total: {formatPrice(calculateTotalPrice)}€</p>
                </div>

                <div className="relative w-full h-64 max-w-lg mx-auto rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Base Cake Image - assuming 'tarta-galleta.png' is the base image */}
                  <img
                    src="/images/tarta-galleta.png"
                    alt="Tarta Galleta Base"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Selected Flavor Overlay */}
                  {selectedFlavor && getOverlayImageUrl(selectedFlavor) && (
                    <img
                      src={getOverlayImageUrl(selectedFlavor)}
                      alt={`${selectedFlavor} overlay`}
                      className="absolute max-w-[60%] max-h-[60%] w-auto h-auto object-contain z-10"
                      style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(5px 5px 6px rgba(0, 0, 0, 0.7))' }}
                    />
                  )}

                  {/* Selected Toppings Overlay */}
                  {selectedToppings.flatMap((toppingName, toppingIndex) => {
                    const toppingImageUrl = getOverlayImageUrl(toppingName);
                    if (!toppingImageUrl) return [];

                    const instances = [];
                    for (let i = 0; i < numInstancesPerTopping; i++) {
                      const overallIndex = (toppingIndex * numInstancesPerTopping) + i;
                      const position = toppingPositions[overallIndex % toppingPositions.length];
                      
                      // Add small random offset to position to avoid perfect overlap
                      const randomXOffset = (Math.random() - 0.5) * 2; // -1 to +1 percentage points
                      const randomYOffset = (Math.random() - 0.5) * 2; // -1 to +1 percentage points

                      const dynamicTop = position.top ? `calc(${position.top} + ${randomYOffset}%)` : undefined;
                      const dynamicLeft = position.left ? `calc(${position.left} + ${randomXOffset}%)` : undefined;
                      const dynamicRight = position.right ? `calc(${position.right} + ${randomXOffset}%)` : undefined;
                      const dynamicBottom = position.bottom ? `calc(${position.bottom} + ${randomYOffset}%)` : undefined;

                      instances.push(
                        <img
                          key={`${toppingName}-${i}`}
                          src={toppingImageUrl}
                          alt={`${toppingName} overlay instance ${i + 1}`}
                          className="absolute max-w-[25%] max-h-[25%] w-auto h-auto object-contain z-20 transition-all duration-300 ease-out"
                          style={{
                            ...(dynamicTop !== undefined && { top: dynamicTop }),
                            ...(dynamicLeft !== undefined && { left: dynamicLeft }),
                            ...(dynamicRight !== undefined && { right: dynamicRight }),
                            ...(dynamicBottom !== undefined && { bottom: dynamicBottom }),
                            transform: `translate(-50%, -50%) scale(0.8)`,
                            opacity: 0,
                            filter: 'drop-shadow(6px 6px 8px rgba(0, 0, 0, 0.9)) contrast(1.2)', // Stronger shadow and contrast
                          }}
                          onLoad={(e) => {
                            // This is a workaround to trigger animation after load
                            (e.target as HTMLImageElement).style.opacity = '1';
                            (e.target as HTMLImageElement).style.transform = `translate(-50%, -50%) scale(1)`;
                          }}
                        />
                      );
                    }
                    return instances;
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Button 
        size="lg" 
        className="relative w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2"
        onClick={handleAddToCart}
        disabled={!isAddToCartEnabled || isAnimating}
      >
        <span id={rewardId} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
        <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
      </Button>
    </div>
  );
};

export default SizePackSelector; 