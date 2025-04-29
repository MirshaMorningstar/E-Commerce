
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
import { useAuth } from './AuthContext';

type WishlistContextType = {
  wishlist: Wishlist;
  isLoading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        const currentWishlist = await getWishlistService();
        setWishlist(currentWishlist);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWishlist();
  }, [isAuthenticated, user]);

  const handleAddToWishlist = async (product: Product) => {
    await addToWishlistService(product);
    setWishlist(await getWishlistService());
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlistService(productId);
    setWishlist(await getWishlistService());
  };

  const handleIsInWishlist = async (productId: string) => {
    return checkIsInWishlist(productId);
  };

  const handleClearWishlist = async () => {
    await clearWishlistService();
    setWishlist(await getWishlistService());
  };

  const value = {
    wishlist,
    isLoading,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isInWishlist: handleIsInWishlist,
    clearWishlist: handleClearWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
