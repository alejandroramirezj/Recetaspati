// src/types/cart.ts

// Define la estructura para un artículo individual dentro del carrito
export interface CartItem {
  id: string; // ID único para este item en el carrito (ej: productoId-opcion1-opcion2)
  productId: number; // ID original del producto desde productsData
  productName: string;
  quantity: number;
  unitPrice?: number; // Precio por unidad (ej: mini-tartas)
  packPrice?: number; // Precio del pack completo (ej: pack galletas, caja palmeritas)
  imageUrl?: string; // Para mostrar en el resumen
  
  // Tipo de producto para lógica condicional
  type: 'cookiePack' | 'fixedPack' | 'flavorQuantity' | 'flavorOnly' | 'flavorPack' | 'simple' | 'flavorMultiSelect' | 'sizePack'; // ADDED sizePack
  
  // Opciones específicas seleccionadas
  selectedOptions?: {
    [key: string]: string | number; // Ej: { sabor: 'Chocolate', tamaño: 'Grande' }
  };

  // Detalles específicos para packs de galletas
  cookieDetails?: {
    packSize: number;
    cookies: Record<string, number>; // { "Red Velvet": 2, "Oreo": 4 }
  };

  // Para packs con selección de sabores (ej: palmeritas)
  selectedFlavors?: string[]; // ["Filipinos chocolate blanco", "Oreo y chocolate blanco"]
}

// Define la estructura del estado del contexto del carrito
export interface CartState {
  items: CartItem[];
  itemAddedTimestamp: number | null; // Timestamp de la última adición
}

// Define las acciones que se pueden realizar en el carrito
export type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } } // Usar el id único del carrito
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESET_TIMESTAMP' }; 