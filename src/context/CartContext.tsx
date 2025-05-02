import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { CartItem, CartState, CartAction } from '../types/cart';

// Helper para generar IDs únicos para items del carrito (más robusto sería uuid)
const generateCartItemId = (item: Omit<CartItem, 'id'>): string => {
  let id = `${item.productId}`;
  if (item.type === 'cookiePack' && item.cookieDetails) {
    id += `-pack${item.cookieDetails.packSize}`;
    // Podríamos incluso añadir hash de cookies si fuera necesario distinguir packs iguales con distinta selección
  } else if (item.selectedOptions) {
    // Ordenar keys para consistencia
    const sortedOptions = Object.keys(item.selectedOptions).sort().map(key => `${key}-${item.selectedOptions?.[key]}`).join('_');
    id += `-${sortedOptions}`;
  }
  // Para items simples o fixed packs, el productId suele ser suficiente
  // Para quantity > 1 de items simples, el reducer se encargará de agrupar
  return id;
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      // Generar ID basado en producto y opciones, si no viene ya con uno específico (ej cookie pack)
      const itemId = newItem.id || generateCartItemId(newItem);
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);

      if (existingItemIndex > -1) {
        // Actualizar cantidad si el item ya existe
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = { 
            ...existingItem, 
            quantity: existingItem.quantity + newItem.quantity 
        };
        return { ...state, items: updatedItems };
      } else {
        // Añadir nuevo item con su ID único
        return { ...state, items: [...state.items, { ...newItem, id: itemId }] };
      }
    }
    case 'REMOVE_ITEM': {
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) } // Ensure quantity doesn't go below 0
            : item
        ).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

// Estado inicial del carrito
const initialState: CartState = {
  items: [],
};

// Crear el contexto
interface CartContextProps {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  // Podríamos añadir helpers aquí, ej: getCartTotal, getItemCount
  getCartTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Crear el Provider del contexto
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper functions
  const getCartTotal = (): number => {
    return state.items.reduce((total, item) => {
        const price = item.packPrice ?? item.unitPrice ?? 0;
        return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = (): number => {
      // Suma las cantidades de todos los items
      return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ state, dispatch, getCartTotal, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 