import { createContext, useContext, useEffect, useState } from 'react';
import type { AddToCartRequest, CartItemWithProduct, UpdateCartRequest } from '~/service/cart.service';
import { cartService } from '~/service/cart.service';
import { useAuth } from './AuthContext';

// Define the shape of our cart context
interface CartContextState {
  cartItems: CartItemWithProduct[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
  addToCart: (data: AddToCartRequest) => Promise<void>;
  updateCartItem: (variantId: number, amount: number) => Promise<void>;
  removeFromCart: (variantId: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

// Create a default context state
const defaultCartContextState: CartContextState = {
  cartItems: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: () => {},
  refreshCart: async () => {},
};

// Create the context
export const CartContext = createContext<CartContextState>(defaultCartContextState);

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);

// Cart provider props interface
interface CartProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {isAuthenticated} = useAuth();
  
  // Calculate derived state
  const totalItems = cartItems.reduce((total, item) => total + item.amount, 0);
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.product_variant?.price || 0;
    return total + price * item.amount;
  }, 0);

  // Fetch cart items when the component mounts
  useEffect(() => {
    
    refreshCart();
  }, [isAuthenticated]);

  // Refresh cart data
  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
        
      const [response, err] = await cartService.getCart();
      
      if (err) {
        setError(typeof err === 'string' ? err : 'Failed to load cart items');
        return;
      }
      
      setCartItems(response?.carts || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  // Add an item to the cart
  const addToCart = async (data: AddToCartRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [response, err] = await cartService.addToCart(data);
      
      if (err) {
        setError(typeof err === 'string' ? err : 'Failed to add item to cart');
        return;
      }
      
      // Refresh the cart to get the updated list with product details
      await refreshCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Update an item in the cart
  const updateCartItem = async (variantId: number, amount: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updateData: UpdateCartRequest = { amount };
      const [response, err] = await cartService.updateCartItem(variantId, updateData);
      
      if (err) {
        setError(typeof err === 'string' ? err : 'Failed to update cart item');
        return;
      }
      
      // Update the local state
      setCartItems(prevItems => {
        if (amount <= 0) {
          return prevItems.filter(item => item.product_variant_id !== variantId);
        }
        return prevItems.map(item => 
          item.product_variant_id === variantId ? { ...item, amount } : item
        );
      });
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (variantId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [response, err] = await cartService.removeFromCart(variantId);
      
      if (err) {
        setError(typeof err === 'string' ? err : 'Failed to remove item from cart');
        return;
      }
      
      // Update the local state
      setCartItems(prevItems => prevItems.filter(item => item.product_variant_id !== variantId));
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Provide the context value
  const contextValue: CartContextState = {
    cartItems,
    isLoading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};


