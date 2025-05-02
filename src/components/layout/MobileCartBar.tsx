import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext'; 
import { Button } from '@/components/ui/button';
import { ShoppingCart, MinusCircle, PlusCircle, Trash2, Send } from 'lucide-react'; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  SheetDescription, // Added for empty state
} from "@/components/ui/sheet" // Import Sheet components
import { getWhatsAppUrl } from '@/utils/whatsappUtils'; // Import the helper
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable item list

// Helper to format price (redundant if also in whatsappUtils, maybe move to a shared util?)
const formatPrice = (price: number | undefined): string => {
  return price ? `${price.toFixed(2).replace('.', ',')}€` : '--';
};

const MobileCartBar: React.FC = () => {
  const { state, getCartTotal, getTotalItems, dispatch } = useCart();
  const totalItems = getTotalItems();
  const cartTotal = getCartTotal();
  const whatsappUrl = getWhatsAppUrl(state.items);

  // Handler to remove an item
  const handleRemoveItem = (itemId: string) => {
      dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
  };
  
  // Handler to update quantity (simplified: +1 / -1)
  const handleUpdateQuantity = (itemId: string, currentQuantity: number, change: number) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity <= 0) {
          handleRemoveItem(itemId);
      } else {
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
      }
  };

  if (totalItems === 0) {
    return null; // Don't render if cart is empty
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* This is the visible bar at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 py-3 border-t border-gray-200 shadow-lg lg:hidden flex items-center justify-between gap-3 min-h-[70px] cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 flex-shrink min-w-0">
             <ShoppingCart className="h-6 w-6 text-pati-accent flex-shrink-0" />
             <div className="flex flex-col text-sm flex-shrink min-w-0">
                 <span className="font-semibold text-pati-dark-brown whitespace-nowrap truncate">
                     {totalItems} artículo{totalItems !== 1 ? 's' : ''}
                 </span>
                 <span className="font-bold text-lg text-pati-burgundy">
                     {formatPrice(cartTotal)}
                 </span>
             </div>
          </div>
          <Button size="sm" variant="outline" className="border-pati-accent text-pati-accent whitespace-nowrap flex-shrink-0">
            Ver/Enviar Pedido
          </Button>
        </div>
      </SheetTrigger>
      
      {/* This is the content that slides up */}
      <SheetContent side="bottom" className="lg:hidden flex flex-col max-h-[85vh] p-0 pt-4"> 
        <SheetHeader className="px-4 pb-2 border-b">
          <SheetTitle className="text-xl font-bold font-playfair text-pati-burgundy">Tu Pedido</SheetTitle>
          {/* Optional: Add description if needed */}
          {/* <SheetDescription>Revisa los artículos antes de enviar.</SheetDescription> */}
        </SheetHeader>

        {/* Scrollable list of items */}
        <ScrollArea className="flex-grow overflow-y-auto px-4 py-4">
            {state.items.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Tu carrito está vacío.</p>
            ) : (
                <div className="space-y-4">
                    {state.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 border-b pb-3 last:border-b-0">
                            {/* Image */}
                            <img 
                                src={item.imageUrl || '/Recetaspati/placeholder.svg'}
                                alt={item.productName} 
                                className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                            />
                            {/* Details */}
                            <div className="flex-grow space-y-1">
                                <p className="font-semibold text-pati-burgundy leading-tight">{item.productName}</p>
                                {/* Display options */} 
                                {item.selectedOptions?.pack && <p className="text-xs text-gray-500">Pack: {item.selectedOptions.pack}</p>}
                                {item.type === 'flavorQuantity' && item.selectedOptions?.flavor && <p className="text-xs text-gray-500">Sabor: {item.selectedOptions.flavor}</p>} {/* Flavor for Mini-Tarta */}
                                {item.type === 'flavorOnly' && item.selectedOptions?.flavor && <p className="text-xs text-gray-500">Opción: {item.selectedOptions.flavor}</p>} {/* Flavor for Tarta */}
                                {/* Display selected flavors for Palmeritas */}
                                {item.type === 'flavorPack' && item.selectedFlavors && (
                                     <div className="text-xs text-gray-500">
                                         Sabores: {item.selectedFlavors.join(', ')}
                                     </div>
                                )}
                                {/* Display cookie details */}
                                {item.type === 'cookiePack' && item.cookieDetails && (
                                     <p className="text-xs text-gray-500">Pack {item.cookieDetails.packSize} Galletas</p>
                                     /* Optionally list cookies here too if needed */
                                )}
                                {/* TODO: Show individual cookies if needed? */} 
                                
                                <p className="text-sm font-bold text-pati-accent">
                                    {formatPrice(item.packPrice ?? item.unitPrice)}
                                </p>
                            </div>
                            {/* Quantity Controls & Remove */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-auto">
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}>
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                    <span className="font-bold text-md w-6 text-center tabular-nums">{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}>
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-1 h-auto py-0" onClick={() => handleRemoveItem(item.id)}>
                                     <Trash2 className="h-4 w-4 mr-1"/> Quitar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>

        {/* Footer with Total and WhatsApp Button */}
        {state.items.length > 0 && (
            <SheetFooter className="bg-gray-50 px-4 py-4 border-t mt-auto sm:flex-col sm:items-stretch sm:gap-3">
                <div className="flex justify-between items-center font-bold text-lg mb-3 sm:mb-0">
                    <span className="text-pati-dark-brown">Total Pedido:</span>
                    <span className="text-pati-burgundy">{formatPrice(cartTotal)}</span>
                </div>
                <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <Send className="mr-2 h-5 w-5" />
                        Enviar Pedido por WhatsApp
                    </a>
                </Button>
            </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileCartBar;
