
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Cart, 
  CartItem, 
  addToCart as addToCartService,
  getCart as getCartService,
  updateQuantity as updateQuantityService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService
} from '../services/cartService';
import { Product } from '../services/productService';
import { useAuth } from './AuthContext';

type CartContextType = {
  cart: Cart;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, subtotal: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        const currentCart = await getCartService();
        setCart(currentCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [isAuthenticated, user]);

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    await addToCartService(product, quantity);
    setCart(await getCartService());
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateQuantityService(productId, quantity);
    setCart(await getCartService());
  };

  const handleRemoveFromCart = async (productId: string) => {
    await removeFromCartService(productId);
    setCart(await getCartService());
  };

  const handleClearCart = async () => {
    await clearCartService();
    setCart(await getCartService());
  };

  const value = {
    cart,
    isLoading,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
