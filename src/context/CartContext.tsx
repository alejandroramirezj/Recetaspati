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

// Añadir nueva propiedad al tipo CartState
export interface CartState {
    items: CartItem[];
    itemAddedTimestamp: number | null; // Timestamp de la última adición
}

// Añadir nueva acción al tipo CartAction
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESET_TIMESTAMP' }; // Nueva acción

// Reducer para manejar las acciones del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const itemId = newItem.id || generateCartItemId(newItem);
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      let updatedItems;

      if (existingItemIndex > -1) {
        updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = { 
            ...existingItem, 
            quantity: existingItem.quantity + newItem.quantity 
        };
      } else {
        updatedItems = [...state.items, { ...newItem, id: itemId }];
      }
      // Devolver estado actualizado CON el nuevo timestamp
      return { ...state, items: updatedItems, itemAddedTimestamp: Date.now() }; 
    }
    case 'REMOVE_ITEM': {
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload.id),
        itemAddedTimestamp: null // Resetear timestamp
      };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      return {
          ...state,
          items: updatedItems,
          itemAddedTimestamp: null // Resetear timestamp
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], itemAddedTimestamp: null }; // Resetear timestamp
    case 'RESET_TIMESTAMP':
      return { ...state, itemAddedTimestamp: null };
    default:
      // Simplemente devolver el estado si la acción no es reconocida
      return state; 
  }
};

// Estado inicial del carrito (usando el tipo importado CartState)
const initialState: CartState = {
  items: [],
  itemAddedTimestamp: null, 
};

// Interfaz de Props del Contexto (usando tipos importados)
interface CartContextProps {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  getCartTotal: () => number;
  getTotalItems: () => number;
  resetItemAddedTimestamp: () => void; // Añadir función para resetear
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Provider (sin cambios en la lógica principal, solo asegurar tipos)
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const getCartTotal = (): number => {
    return state.items.reduce((total, item) => {
        const price = item.packPrice ?? item.unitPrice ?? 0;
        return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = (): number => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const resetItemAddedTimestamp = () => {
    dispatch({ type: 'RESET_TIMESTAMP' });
  };

  return (
    <CartContext.Provider value={{ 
        state, 
        dispatch, 
        getCartTotal, 
        getTotalItems, 
        resetItemAddedTimestamp 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook useCart (sin cambios)
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 