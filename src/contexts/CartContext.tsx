
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

type CartContextType = {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
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

  useEffect(() => {
    const loadCart = () => {
      const currentCart = getCartService();
      setCart(currentCart);
    };
    
    loadCart();
    
    window.addEventListener('storage', (event) => {
      if (event.key === 'cart') {
        loadCart();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addToCartService(product, quantity);
    setCart(getCartService());
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantityService(productId, quantity);
    setCart(getCartService());
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCartService(productId);
    setCart(getCartService());
  };

  const handleClearCart = () => {
    clearCartService();
    setCart(getCartService());
  };

  const value = {
    cart,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
