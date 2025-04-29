
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Wishlist, 
  WishlistItem, 
  addToWishlist as addToWishlistService,
  getWishlist as getWishlistService,
  removeFromWishlist as removeFromWishlistService,
  isInWishlist as checkIsInWishlist,
  clearWishlist as clearWishlistService
} from '../services/wishlistService';
import { Product } from '../services/productService';

type WishlistContextType = {
  wishlist: Wishlist;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Wishlist>({ items: [] });

  useEffect(() => {
    const loadWishlist = () => {
      const currentWishlist = getWishlistService();
      setWishlist(currentWishlist);
    };
    
    loadWishlist();
    
    window.addEventListener('storage', (event) => {
      if (event.key === 'wishlist') {
        loadWishlist();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  const handleAddToWishlist = (product: Product) => {
    addToWishlistService(product);
    setWishlist(getWishlistService());
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlistService(productId);
    setWishlist(getWishlistService());
  };

  const handleIsInWishlist = (productId: string) => {
    return checkIsInWishlist(productId);
  };

  const handleClearWishlist = () => {
    clearWishlistService();
    setWishlist(getWishlistService());
  };

  const value = {
    wishlist,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isInWishlist: handleIsInWishlist,
    clearWishlist: handleClearWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
