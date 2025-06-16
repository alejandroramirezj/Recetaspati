import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import confetti from 'canvas-confetti';

// Helper to format price (redundant if also in whatsappUtils, maybe move to a shared util?)
const formatPrice = (price: number | undefined): string => {
  return price ? `${price.toFixed(2).replace('.', ',')}€` : '--';
};

const MobileCartBar: React.FC = () => {
  const { state, getCartTotal, getTotalItems, dispatch } = useCart();
  const totalItems = getTotalItems();
  const cartTotal = getCartTotal();
  const whatsappUrl = getWhatsAppUrl(state.items);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const [showAddButton, setShowAddButton] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- NUEVO: Estado para selección de pack/galletas en ProductDetail ---
  const [packSelection, setPackSelection] = useState<null | {
    isActive: boolean;
    isOrderComplete: boolean;
    currentCount: number;
    selectedPackSize: number | null;
    currentPackIsCustom: boolean;
    maxToSelect: number | null;
    productName: string;
  }>(null);

  // Escuchar evento global de selección de pack/galletas
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setPackSelection(e.detail);
    };
    window.addEventListener('pack-selection-update', handler as EventListener);
    return () => window.removeEventListener('pack-selection-update', handler as EventListener);
  }, []);

  // Manejar el auto-hide en scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  // Solo mostrar botón de añadir/progreso en páginas de producto
  const isProductPage = location.pathname.includes('/product/');

  // Mostrar botón de añadir solo si está configurando pack y no se ha añadido
  const showAdd = isProductPage && packSelection?.isActive && showAddButton;
  // Mostrar botón de progreso si está configurando pack pero no está completo
  const showProgress = isProductPage && packSelection?.isActive && !packSelection.isOrderComplete;
  // Mostrar botón de pedido si no hay selección activa o tras añadir
  const showPedido = !showAdd && !showProgress && (!isProductPage || !packSelection?.isActive || !showAddButton);

  // Reset showAddButton cuando cambia de producto o pack
  useEffect(() => {
    setShowAddButton(true);
  }, [location.pathname, packSelection?.selectedPackSize, packSelection?.currentPackIsCustom]);

  // Ocultar MobileCartBar en la página de resumen del pedido
  if (location.pathname === '/pedido') {
    return null;
  }

  if (totalItems === 0 && !packSelection?.isActive) {
    return null; // No mostrar si no hay carrito ni selección activa
  }

  // Función para mostrar confeti
  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handler para añadir al carrito
  const handleAddToCart = () => {
    if (packSelection) {
      console.log('Intentando añadir al carrito:', packSelection);
      // Disparamos el evento con toda la información necesaria
      document.dispatchEvent(new CustomEvent('add-to-cart', { 
        detail: { 
          source: 'summary',
          packSelection: {
            ...packSelection,
            quantity: packSelection.currentCount
          }
        } 
      }));
      console.log('Evento add-to-cart disparado');
      showConfetti();
      setShowAddButton(false);
      // Cerramos el sheet si está abierto
      setIsSheetOpen(false);
    } else {
      console.warn('No hay packSelection disponible para añadir al carrito');
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {/* Barra inferior visible */}
        <div 
          className={`fixed left-0 right-0 mx-auto bottom-4 z-50 bg-white border border-pati-burgundy shadow-lg rounded-full w-[92vw] max-w-lg pl-3 pr-12 py-2 flex items-center justify-start min-h-[60px] h-16 cursor-pointer lg:hidden`}
        >
          {/* Icono de carrito pequeño y badge alineado a la esquina izquierda */}
          <div className="flex items-center justify-start h-10 mr-2 ml-0" style={{minWidth: '40px'}}>
            <div className="relative flex items-center justify-center h-10 w-10">
              <span className="absolute -top-1 -right-1 bg-pati-burgundy text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow z-10 min-w-[20px] text-center border border-pati-burgundy">
                {totalItems}
                 </span>
              <span className="text-2xl" role="img" aria-label="Carrito lleno de dulces">🛒</span>
             </div>
          </div>
          {/* Botón de añadir, progreso o ver/enviar pedido */}
          <div className="flex gap-2 items-center w-full justify-center">
            {/* Confeti desde el centro de la píldora */}
            <span className="flex gap-2 items-center w-full justify-center">
              {showAdd && packSelection?.isOrderComplete && (
                <Button
                  className="w-full font-bold shadow-none rounded-full px-3 py-2 text-sm truncate h-9 border-none bg-pati-burgundy text-white hover:bg-pati-burgundy/90 cursor-pointer"
                  onClick={handleAddToCart}
                  aria-label="Añadir al carrito"
                >
                  <span className="truncate block w-full text-center">
                    {packSelection.currentPackIsCustom
                      ? `Añadir ${packSelection.currentCount} uds.`
                      : `Añadir Pack${packSelection.selectedPackSize ? ' ' + packSelection.selectedPackSize : ''}`}
                  </span>
                </Button>
              )}
              {showProgress && (
                <Button
                  className="w-full font-bold shadow-none rounded-full px-3 py-2 text-sm truncate h-9 border-none bg-gray-200 text-gray-500 cursor-not-allowed"
                  disabled
                  aria-label="Progreso de selección"
                >
                  <span className="truncate block w-full text-center">
                    {packSelection.currentPackIsCustom
                      ? `Elige galletas (${packSelection.currentCount} seleccionadas)`
                      : packSelection.selectedPackSize
                        ? `${packSelection.currentCount}/${packSelection.selectedPackSize} seleccionadas`
                        : 'Completa tu pack'}
                  </span>
                </Button>
              )}
              {showPedido && (
                <Button 
                  className="w-full font-bold shadow-none rounded-full px-3 py-2 text-sm truncate h-9 border-none bg-pati-burgundy text-white hover:bg-pati-burgundy/90 cursor-pointer"
                  onClick={() => setIsSheetOpen(true)}
                  aria-label="Ver o enviar pedido"
                >
                  <span className="truncate block w-full text-center">Ver/Enviar Pedido</span>
                </Button>
              )}
            </span>
          </div>
        </div>
      </SheetTrigger>
      
      {/* This is the content that slides up */}
      <SheetContent 
        side="bottom" 
        className="max-h-[80vh] flex flex-col" 
        onOpenAutoFocus={(e) => e.preventDefault()} // Evitar focus trap inicial
        id="cart-sheet-content"
        aria-labelledby="cart-sheet-title"
      >
        <SheetHeader>
          <SheetTitle id="cart-sheet-title">Resumen del Pedido</SheetTitle>
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
                                {item.type === 'flavorQuantity' && item.selectedOptions?.flavor && <p className="text-xs text-gray-500">Sabor: {item.selectedOptions.flavor}</p>}
                                {item.type === 'flavorOnly' && item.selectedOptions?.flavor && <p className="text-xs text-gray-500">Opción: {item.selectedOptions.flavor}</p>}
                                {item.type === 'sizePack' && item.selectedOptions?.size && <p className="text-xs text-gray-500">Tamaño: {item.selectedOptions.size}</p>}
                                
                                {/* Section for cookiePack to display individual cookies from cookieDetails.cookies */}
                                {item.type === 'cookiePack' && item.cookieDetails && item.cookieDetails.cookies && (
                                    <div className="text-xs text-gray-500 space-y-0.5">
                                        <p className="font-medium">Contenido ({item.cookieDetails.packSize} uds):</p>
                                        <ul className="list-disc list-inside pl-2">
                                            {Object.entries(item.cookieDetails.cookies).map(([name, quantity]) => (
                                                <li key={name}>{quantity}x {name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {/* Section for flavorPack (like Palmeritas) and flavorMultiSelect (like Minicookies) to display selectedFlavors */}
                                {(item.type === 'flavorPack' || item.type === 'flavorMultiSelect') && item.selectedFlavors && item.selectedFlavors.length > 0 && (
                                   <div className="text-xs text-gray-500">
                                       Sabores: {item.selectedFlavors.join(', ')}
                                   </div>
                                )}
                                
                                <p className="text-sm font-bold text-pati-accent pt-1">
                                    {formatPrice(item.packPrice ?? item.unitPrice)}
                                </p>
                            </div>
                            {/* Quantity Controls & Remove */}
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} aria-label="Reducir cantidad">
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                    <span className="font-semibold text-lg w-6 text-center">{item.quantity}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} aria-label="Aumentar cantidad">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs text-red-600 px-1 h-auto" onClick={() => handleRemoveItem(item.id)} aria-label={`Quitar ${item.productName}`}>
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Quitar
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
 