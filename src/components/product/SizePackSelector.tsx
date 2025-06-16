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

  const isAddToCartEnabled = selectedSize !== null && selectedFlavor !== null;

  return (
    <div className="space-y-4">
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
                        className={`w-full h-full border-2 rounded-xl px-2 py-2 sm:px-4 sm:py-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden whitespace-normal ${patiSelected}`}
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
                        <span className="text-xl font-bold mt-1 text-center">{option.price}</span>
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
                  <CardTitle className="text-xl text-pati-burgundy">Elige el Sabor</CardTitle>
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
                            +{flavor.priceAdjustment.toFixed(2).replace('.', ',')}€
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.toppingOptions.map((topping) => {
                    const isChecked = selectedToppings.includes(topping.name);
                    return (
                      <div key={topping.name} className={`flex items-center space-x-3 p-3 border rounded-md ${isChecked ? 'border-pati-burgundy bg-pati-pink/10' : 'border-gray-200'}`}>
                        <Checkbox
                          id={`topping-${topping.name}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleToppingCheck(topping.name, checked === true)}
                        />
                        <Label htmlFor={`topping-${topping.name}`} className="flex-grow flex justify-between items-center cursor-pointer">
                          <span className="font-medium text-pati-burgundy">{topping.name}</span>
                          <Badge variant="secondary" className="bg-pati-burgundy text-white hover:bg-pati-burgundy/90">
                            +{topping.price.toFixed(2).replace('.', ',')}€
                          </Badge>
                        </Label>
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
                  <h3 className="text-lg font-bold text-pati-burgundy">Tu Tarta Personalizada</h3>
                </div>
                <div className="space-y-1 text-sm text-pati-dark-brown">
                  <p><span className="font-medium">Tamaño:</span> {selectedSize}</p>
                  <p><span className="font-medium">Sabor:</span> {selectedFlavor}</p>
                  {selectedToppings.length > 0 && (
                    <p><span className="font-medium">Toppings:</span> {selectedToppings.join(', ')}</p>
                  )}
                </div>
                <div className="text-xl font-bold text-pati-burgundy mt-2">
                  Total: {calculateTotalPrice.toFixed(2).replace('.', ',')}€
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