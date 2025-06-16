import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useReward } from 'react-rewards';
import MobileVideoPlayer from '@/components/product/MobileVideoPlayer';

interface SizePackSelectorProps {
  product: Product;
}

const SizePackSelector: React.FC<SizePackSelectorProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
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
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const selectedOption = product.options?.find(opt => opt.name === selectedSize);
    if (!selectedOption) return;

    const price = parseFloat(selectedOption.price.replace('€', '').replace(',', '.'));
    const cartItem = {
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      productName: `${product.name} - ${selectedSize}`,
      quantity: 1,
      packPrice: price,
      imageUrl: product.image,
      type: 'sizePack',
      selectedOptions: {
        size: selectedSize
      }
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    reward();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
      <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
      <MobileVideoPlayer product={product} />

      <Card className="border-pati-pink/30 shadow-md">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-xl text-pati-burgundy">Elige el Tamaño</CardTitle>
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

      <Button 
        size="lg" 
        className="relative w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-2"
        onClick={handleAddToCart}
        disabled={!selectedSize || isAnimating}
      >
        <span id={rewardId} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
        <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
      </Button>
    </div>
  );
};

export default SizePackSelector; 