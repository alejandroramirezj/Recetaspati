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

  // Detectar si estamos en la home
  const isHomePage = location.pathname === '/';

  // Estado para saber si se acaba de añadir un pack
  const [justAddedPack, setJustAddedPack] = useState(false);

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
      document.dispatchEvent(new CustomEvent('add-to-cart', { 
        detail: { 
          source: 'summary',
          packSelection: {
            ...packSelection,
            quantity: packSelection.currentCount
          }
        } 
      }));
      showConfetti();
      setShowAddButton(false);
      setIsSheetOpen(false);
      setPackSelection(null);
      setJustAddedPack(true); // Marcar que se acaba de añadir un pack
    } else {
      console.warn('No hay packSelection disponible para añadir al carrito');
    }
  };

  // Resetear justAddedPack cuando se cambia de producto o de página
  useEffect(() => {
    setJustAddedPack(false);
  }, [location.pathname]);

  // Resetear packSelection al salir de la página de producto
  useEffect(() => {
    if (!location.pathname.includes('/product/')) {
      setPackSelection(null);
    }
  }, [location.pathname]);

  // Ocultar MobileCartBar en la página de resumen del pedido
  if (location.pathname === '/pedido') {
    return null;
  }

  if (totalItems === 0 && !packSelection?.isActive) {
    return null; // No mostrar si no hay carrito ni selección activa
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {/* Barra inferior creativa y animada sin gradiente */}
        <div 
          className={`fixed left-0 right-0 mx-auto bottom-4 z-50 bg-white border border-pati-burgundy shadow-lg rounded-full w-[92vw] max-w-lg px-2 py-2 flex items-center justify-between min-h-[56px] h-auto cursor-pointer lg:hidden transition-all fixed-cart-bar`}
          style={{
            boxShadow: '0 8px 32px 0 rgba(123, 63, 63, 0.18), 0 1.5px 0 0 #fff inset',
            transition: 'box-shadow 0.3s',
          }}
        >
          {/* Carrito SVG grande y miniaturas dentro (20%) */}
          <div className="flex items-center justify-start flex-shrink-0 w-[20%] min-w-[70px] max-w-[100px] pl-1 relative">
            <div className="relative w-14 h-14">
              <svg width="56" height="56" viewBox="0 0 32 32" fill="none" stroke="#7B3F3F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
                <circle cx="12" cy="28" r="2.5"/>
                <circle cx="26" cy="28" r="2.5"/>
                <path d="M3.5 5h3l3 17h14l3-10H8.5"/>
              </svg>
              {/* Badge animado con número de productos y destello */}
              {state.items.length > 0 && (
                <span
                  key={state.items.length}
                  className="cart-badge absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-[#E9B7B7] text-pati-burgundy text-xs font-bold border-2 border-white shadow z-20 animate-bump"
                  style={{animation: 'bump 0.3s', boxShadow: '0 0 8px 2px #fff7, 0 0 0 2px #E9B7B7'}}
                >
                  {state.items.length}
                  {/* Destello tipo estrella */}
                  <svg className="absolute -top-1 -right-1" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0v2M6 10v2M0 6h2M10 6h2M2.22 2.22l1.42 1.42M8.36 8.36l1.42 1.42M2.22 9.78l1.42-1.42M8.36 3.64l1.42-1.42" stroke="#FFD700" strokeWidth="1" strokeLinecap="round"/></svg>
                </span>
              )}
              {/* Miniaturas absolutas dentro del carrito, borde dorado y brillo */}
              {state.items[0] && (
                <span className="absolute left-[13px] top-[13px] w-5 h-5 flex items-center justify-center rounded-full bg-white/70 border-2 border-yellow-400 shadow-gold z-10">
                  <img
                    src={state.items[0].imageUrl || '/Recetaspati/placeholder.svg'}
                    alt={state.items[0].productName}
                    className="w-4 h-4 object-cover rounded-full"
                    style={{zIndex: 10}}
                  />
                </span>
              )}
              {state.items[1] && (
                <span className="absolute left-[25px] top-[22px] w-4 h-4 flex items-center justify-center rounded-full bg-white/70 border-2 border-yellow-400 shadow-gold z-9">
                  <img
                    src={state.items[1].imageUrl || '/Recetaspati/placeholder.svg'}
                    alt={state.items[1].productName}
                    className="w-3 h-3 object-cover rounded-full"
                    style={{zIndex: 9}}
                  />
                </span>
              )}
              {state.items[2] && state.items.length <= 3 && (
                <span className="absolute left-[5px] top-[25px] w-4 h-4 flex items-center justify-center rounded-full bg-white/70 border-2 border-yellow-400 shadow-gold z-8">
                  <img
                    src={state.items[2].imageUrl || '/Recetaspati/placeholder.svg'}
                    alt={state.items[2].productName}
                    className="w-3 h-3 object-cover rounded-full"
                    style={{zIndex: 8}}
                  />
                </span>
              )}
              {state.items.length > 3 && (
                null
              )}
            </div>
          </div>
          {/* Botón dinámico o 'Ver mi pedido' (80%) */}
          <div className="flex-1 flex justify-end w-[80%]">
            {packSelection?.isActive ? (
              <Button
                className={`w-full font-bold shadow-none rounded-full px-3 py-3 text-base truncate h-12 border-none flex items-center justify-center gap-2 transition-all cart-bar-btn-solid ${packSelection.isOrderComplete ? 'bg-pati-burgundy text-white hover:scale-[1.04] hover:shadow-xl active:scale-95 cursor-pointer' : 'bg-pati-brown/30 text-pati-brown cursor-not-allowed'}`}
                onClick={packSelection.isOrderComplete ? handleAddToCart : undefined}
                disabled={!packSelection.isOrderComplete}
                aria-label={packSelection.isOrderComplete ? 'Añadir al carrito' : 'Completa tu pack'}
                style={{maxWidth: '100%', boxShadow: '0 4px 18px 0 rgba(123, 63, 63, 0.18)', transition: 'box-shadow 0.3s, transform 0.2s'}}
              >
                {/* Progreso y acción en una sola línea */}
                <span className="font-semibold">
                  {packSelection.currentPackIsCustom
                    ? `${packSelection.currentCount} uds.`
                    : `${packSelection.currentCount}/${packSelection.selectedPackSize || 0} uds.`}
                </span>
                <span className="mx-2">·</span>
                <span className="truncate block w-full text-center">
                  {packSelection.isOrderComplete
                    ? (packSelection.currentPackIsCustom
                        ? `Añadir ${packSelection.currentCount} Galleta${packSelection.currentCount !== 1 ? 's' : ''}`
                        : `Añadir Pack ${packSelection.selectedPackSize || ''}`)
                    : (packSelection.currentPackIsCustom
                        ? 'Elige tus galletas'
                        : `Completa tu pack de ${packSelection.selectedPackSize || ''}`)}
                </span>
              </Button>
            ) : (
              <Button 
                className="w-full font-bold shadow-none rounded-full px-3 py-3 text-base truncate h-12 border-none bg-pati-burgundy text-white hover:scale-[1.04] hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 cart-bar-btn-solid"
                onClick={() => setIsSheetOpen(true)}
                aria-label="Ver mi pedido"
                style={{maxWidth: '100%', boxShadow: '0 4px 18px 0 rgba(123, 63, 63, 0.18)', transition: 'box-shadow 0.3s, transform 0.2s'}}
              >
                <span className="font-semibold">Ver mi pedido</span>
              </Button>
            )}
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
 