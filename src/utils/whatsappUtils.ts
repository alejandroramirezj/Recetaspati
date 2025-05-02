import { CartItem } from '@/types/cart';

const phoneNumber = "+34671266981"; // Asegúrate que este es el número correcto

// Helper para formatear el precio
const formatPrice = (price: number | undefined): string => {
  return price ? `${price.toFixed(2).replace('.', ',')}€` : 'Precio no disponible';
};

// Función para generar el mensaje de WhatsApp unificado
export const generateUnifiedWhatsAppMessage = (items: CartItem[]): string => {
  if (!items || items.length === 0) {
    return "¡Hola Pati! 👋 Quería hacer un pedido pero mi carrito está vacío.";
  }

  let message = "¡Hola Pati! 👋 Me gustaría hacer el siguiente pedido:\n\n";
  let totalOrderPrice = 0;

  items.forEach((item, index) => {
    const itemPrice = (item.packPrice ?? item.unitPrice ?? 0) * item.quantity;
    totalOrderPrice += itemPrice;

    message += `*${index + 1}. ${item.productName}*
`;
    message += `   Cantidad: ${item.quantity}
`;

    // Añadir detalles específicos según el tipo
    if (item.type === 'fixedPack' && item.selectedOptions?.pack) {
      message += `   Pack: ${item.selectedOptions.pack}
`;
    } else if (item.type === 'flavorQuantity' && item.selectedOptions?.flavor) {
      message += `   Sabor: ${item.selectedOptions.flavor}
`;
    } else if (item.type === 'flavorOnly' && item.selectedOptions?.flavor) {
      message += `   Opción: ${item.selectedOptions.flavor}
`; // O 'Sabor' si aplica
    } else if (item.type === 'flavorPack' && item.selectedOptions?.pack) {
      // Mensaje específico para Palmeritas con selección de sabores
      message += `   Caja: ${item.selectedOptions.pack}
`;
      if (item.selectedFlavors && item.selectedFlavors.length > 0) {
        message += `   Sabores elegidos:
`;
        item.selectedFlavors.forEach(flavor => {
            message += `     - ${flavor}\n`;
        });
      } else {
        message += `   (Error: No se seleccionaron sabores)\n`;
      }
    } else if (item.type === 'cookiePack' && item.cookieDetails) {
      message += `   Pack: ${item.cookieDetails.packSize} unidades
`;
      message += `   Galletas elegidas:
`;
      for (const [cookieName, count] of Object.entries(item.cookieDetails.cookies)) {
        if (count > 0) {
          message += `     - ${cookieName} (x${count})
`;
        }
      }
    } else if (item.selectedOptions) {
        // Opciones genéricas si las hubiera
        for (const [key, value] of Object.entries(item.selectedOptions)) {
            message += `   ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
        }
    }

    message += `   Precio item: ${formatPrice(itemPrice)}
\n`;
  });

  message += `*Total Pedido: ${formatPrice(totalOrderPrice)}*

`;
  message += "¿Podrías confirmarme disponibilidad y detalles para la entrega? ¡Gracias! 😊";

  return message;
};

// Función para generar la URL completa de WhatsApp
export const getWhatsAppUrl = (items: CartItem[]): string => {
  const message = generateUnifiedWhatsAppMessage(items);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}; 