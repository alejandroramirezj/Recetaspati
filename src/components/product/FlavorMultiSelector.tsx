import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Product as ProductType } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

interface FlavorMultiSelectorProps {
  product: ProductType;
}

const FlavorMultiSelector: React.FC<FlavorMultiSelectorProps> = ({ product }) => {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const { dispatch } = useCart();

  const availableFlavors = product.availableFlavors || [];
  const unitPrice = useMemo(() => {
      // Extract price, assuming it's a single price like "5€"
      return parseFloat(product.price.replace('€', '').replace(',', '.')) || 0;
  }, [product.price]);

  const handleFlavorCheck = (flavor: string, checked: boolean) => {
    setSelectedFlavors(prev => {
      if (checked) {
        return [...prev, flavor]; // Add flavor
      } else {
        return prev.filter(f => f !== flavor); // Remove flavor
      }
    });
  };

  const isSelectionMade = selectedFlavors.length > 0;

  const handleAddToCart = () => {
    if (!isSelectionMade || unitPrice <= 0) return;

    // Create a unique ID including selected flavors to treat different selections as distinct items
    const flavorsString = selectedFlavors.sort().join('-'); // Sort for consistency
    const cartItemId = `${product.id}-flavors-${flavorsString}`;

    const cartItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      productName: product.name,
      quantity: 1, // Add one bag at a time
      unitPrice: unitPrice,
      imageUrl: product.image,
      type: 'flavorMultiSelect', // Indicate the type
      selectedOptions: {}, // Clear previous options format if any
      selectedFlavors: selectedFlavors, // Store the array of selected flavors
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    // Optionally reset selection after adding
    // setSelectedFlavors([]); 
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy">{product.name}</h1>
      <p className="text-pati-dark-brown text-lg leading-relaxed">{product.description}</p>
      <p className="text-3xl font-bold text-pati-accent">{product.price}</p>

      {/* Flavor Selection */}
      <Card className="border-pati-pink/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-pati-burgundy">Elige tus Sabores</CardTitle>
          <CardDescription>Puedes seleccionar uno o ambos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableFlavors.map((flavor) => {
            const isChecked = selectedFlavors.includes(flavor);
            return (
              <div key={flavor} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${isChecked ? 'border-pati-burgundy bg-pati-pink/10' : 'border-gray-200'}`}>
                <Checkbox
                  id={`flavor-${flavor}`}
                  checked={isChecked}
                  onCheckedChange={(checkedState) => handleFlavorCheck(flavor, checkedState === true)}
                  aria-label={flavor}
                />
                <Label htmlFor={`flavor-${flavor}`} className={`text-base font-medium cursor-pointer ${isChecked ? 'text-pati-burgundy font-semibold' : 'text-pati-dark-brown'}`}>
                  {flavor}
                </Label>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        size="lg"
        className={`w-full bg-pati-burgundy hover:bg-pati-burgundy/90 text-white py-3 ${!isSelectionMade ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isSelectionMade}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isSelectionMade ? 'Añadir al Carrito' : 'Selecciona al menos un sabor'}
      </Button>
    </div>
  );
};

export default FlavorMultiSelector; 