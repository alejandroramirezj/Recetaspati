import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, MinusCircle, PlusCircle, Trash2, Send, ArrowLeft } from 'lucide-react';
import { getWhatsAppUrl } from '@/utils/whatsappUtils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Para maquetar

// Helper para formatear precio (podría ir a un utils)
const formatPrice = (price: number | undefined): string => {
  return price ? `${price.toFixed(2).replace('.', ',')}€` : '--';
};

const OrderSummary: React.FC = () => {
  const { state, dispatch, getCartTotal, getTotalItems } = useCart();
  const cartTotal = getCartTotal();
  const totalItems = getTotalItems();
  const whatsappUrl = getWhatsAppUrl(state.items);

  // Handlers (similares a MobileCartBar)
  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
  };

  const handleUpdateQuantity = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pati-cream">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Link 
           to={'/#productos'} 
           className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy mb-8 group"
         >
           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           Seguir comprando
         </Link>

        <h1 className="text-3xl md:text-4xl font-bold font-playfair text-pati-burgundy mb-8 text-center">Resumen de tu Pedido</h1>

        {state.items.length === 0 ? (
            <div className="text-center py-16">
                 <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl text-pati-dark-brown mb-6">Tu carrito está vacío.</p>
                 <Button asChild variant="outline" className="border-pati-accent text-pati-accent">
                    <Link to="/#productos">Ver Productos</Link>
                 </Button>
             </div>
        ) : (
            <div className="max-w-3xl mx-auto">
                 <Card className="border-pati-pink/30 shadow-md mb-8">
                     <CardHeader>
                         <CardTitle className="text-xl text-pati-burgundy">Artículos ({totalItems})</CardTitle>
                     </CardHeader>
                    <CardContent className="divide-y divide-pati-pink/20">
                        {state.items.map((item) => (
                             <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 py-4 px-2 sm:px-0">
                                <img 
                                     src={item.imageUrl || '/Recetaspati/placeholder.svg'}
                                     alt={`Imagen de ${item.productName}${item.selectedOptions?.flavor ? ' sabor ' + item.selectedOptions.flavor : ''}`}
                                     className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border flex-shrink-0 mx-auto sm:mx-0"
                                     loading="lazy"
                                 />
                                 <div className="flex-grow space-y-1 text-center sm:text-left">
                                     <p className="font-semibold text-pati-burgundy leading-tight text-lg">{item.productName}</p>
                                     {/* Display options */}
                                     {item.selectedOptions?.pack && <p className="text-sm text-gray-600">Pack: {item.selectedOptions.pack}</p>}
                                     {item.type === 'flavorQuantity' && item.selectedOptions?.flavor && <p className="text-sm text-gray-600">Sabor: {item.selectedOptions.flavor}</p>}
                                     {item.type === 'flavorOnly' && item.selectedOptions?.flavor && <p className="text-sm text-gray-600">Opción: {item.selectedOptions.flavor}</p>}
                                     {item.type === 'flavorPack' && item.selectedFlavors && (
                                         <div className="text-sm text-gray-600">
                                             Sabores: {item.selectedFlavors.join(', ')}
                                         </div>
                                     )}
                                     {item.type === 'cookiePack' && item.cookieDetails && item.cookieDetails.cookies && (
                                         <div className="text-sm text-gray-600 space-y-0.5">
                                            <p className="font-medium">Pack {item.cookieDetails.packSize} Galletas</p>
                                            <ul className="list-disc list-inside pl-2 text-xs">
                                                {Object.entries(item.cookieDetails.cookies).map(([name, quantity]) => (
                                                    <li key={name}>{quantity}x {name}</li>
                                                ))}
                                            </ul>
                                         </div>
                                     )}
                                     <p className="text-md font-bold text-pati-accent pt-1">
                                         {formatPrice(item.packPrice ?? item.unitPrice)} {item.unitPrice ? '/ ud.' : ''}
                                     </p>
                                 </div>
                                 {/* Quantity Controls & Remove (alineado a la derecha en sm+) */}
                                 <div className="flex flex-row sm:flex-col items-center justify-center sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto">
                                     <div className="flex items-center gap-2">
                                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} aria-label="Reducir cantidad">
                                              <MinusCircle className="h-4 w-4" />
                                          </Button>
                                          <span className="font-bold text-lg w-8 text-center tabular-nums">{item.quantity}</span>
                                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} aria-label="Aumentar cantidad">
                                              <PlusCircle className="h-4 w-4" />
                                          </Button>
                                      </div>
                                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 h-auto py-1 text-xs" onClick={() => handleRemoveItem(item.id)}>
                                           <Trash2 className="h-3 w-3 mr-1"/> Quitar
                                      </Button>
                                  </div>
                             </div>
                         ))}
                     </CardContent>
                    <CardFooter className="bg-gray-50 py-4 px-6 mt-4">
                        <div className="w-full flex justify-end items-center gap-4">
                             <span className="text-lg font-semibold text-pati-dark-brown">Total Pedido:</span>
                             <span className="text-2xl font-bold text-pati-burgundy">{formatPrice(cartTotal)}</span>
                         </div>
                     </CardFooter>
                 </Card>

                 {/* Botón Final WhatsApp */}
                <div className="text-center mt-8">
                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                         <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                             <Send className="mr-2 h-5 w-5" />
                            Enviar Pedido Completo por WhatsApp
                         </a>
                     </Button>
                 </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderSummary; 