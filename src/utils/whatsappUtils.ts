import { CartItem } from '@/types/cart';
import { productsData } from '@/data/products'; // Importar datos de productos

const phoneNumber = "+34671266981"; // Número actualizado

// Helper para formatear el precio
const formatPrice = (price: number | undefined): string => {
  return price ? `${price.toFixed(2).replace('.', ',')}€` : '--'; // Más corto
};

// Emojis para categorías
const categoryEmojis: Record<string, string> = {
  tartas: '🎂',
  galletas: '🍪',
  palmeritas: '🥨',
  'mini-tartas': '🍰',
  bundtcake: '🍩', // Añadir si existe como categoría
  default: '✨'
};

// Función MEJORADA para generar el mensaje de WhatsApp
export const generateUnifiedWhatsAppMessage = (items: CartItem[]): string => {
  if (!items || items.length === 0) {
    return "¡Hola Pati! 👋 Quería hacer un pedido pero mi carrito está vacío.";
  }

  let message = "¡Hola Pati! 👋 Me gustaría hacer el siguiente pedido:\n\n";
  let totalOrderPrice = 0;

  // 1. Agrupar items por categoría (o nombre de producto si es más útil)
  const groupedItems: { [key: string]: CartItem[] } = {};
  items.forEach(item => {
      // Usaremos productName como clave principal de agrupación
      const key = item.productName;
      if (!groupedItems[key]) {
          groupedItems[key] = [];
      }
      groupedItems[key].push(item);
  });

  // 2. Construir el mensaje por grupos
  for (const productName in groupedItems) {
    const itemsInGroup = groupedItems[productName];
    const firstItem = itemsInGroup[0]; // Tomar el primero como referencia para emoji
    
    // Buscar producto original para obtener categoría
    const originalProduct = productsData.find(p => p.id === firstItem.productId);
    const category = originalProduct?.category || 'default';
    const emoji = categoryEmojis[category] || categoryEmojis.default;
    
    message += `*${emoji} ${productName}*
`;

    itemsInGroup.forEach(item => {
        const itemSubtotal = (item.packPrice ?? item.unitPrice ?? 0) * item.quantity;
        totalOrderPrice += itemSubtotal;

        // Detalles concisos
        let details = `  - x${item.quantity}`;
        if (item.type === 'fixedPack' && item.selectedOptions?.pack) {
          details += ` (${item.selectedOptions.pack})`;
        } else if (item.type === 'flavorQuantity' && item.selectedOptions?.flavor) {
          details += ` (Sabor: ${item.selectedOptions.flavor})`;
        } else if (item.type === 'flavorOnly' && item.selectedOptions?.flavor && item.productName !== item.selectedOptions.flavor) {
           // Para Tartas, el "sabor" ya suele ser el productName, no repetir si es igual
           details += ` (Opción: ${item.selectedOptions.flavor})`;
        } else if (item.type === 'flavorPack' && item.selectedOptions?.pack) {
           details += ` (${item.selectedOptions.pack}`;
           if (item.selectedFlavors && item.selectedFlavors.length > 0) {
             details += `: ${item.selectedFlavors.join(', ')}`;
           }
           details += `)`;
        } else if (item.type === 'cookiePack' && item.cookieDetails) {
           details += ` (Pack ${item.cookieDetails.packSize}: `;
           const cookiesList = Object.entries(item.cookieDetails.cookies)
                                  .filter(([, count]) => count > 0)
                                  .map(([name, count]) => `${name} x${count}`)
                                  .join(', ');
           details += `${cookiesList})`;
        }
        // Añadir subtotal de la línea
        details += `: *${formatPrice(itemSubtotal)}*
`;
        message += details;
    });
    message += `\n`; // Espacio entre grupos
  }

  // 3. Añadir Total
  message += `--------------------
`;
  message += `💰 *Total Pedido: ${formatPrice(totalOrderPrice)}*

`;
  message += "¿Me confirmas disponibilidad? ¡Gracias! 😊";

  return message;
};

// Función para generar la URL completa de WhatsApp
export const getWhatsAppUrl = (items: CartItem[]): string => {
  const message = generateUnifiedWhatsAppMessage(items);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}; 