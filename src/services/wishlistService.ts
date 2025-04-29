
import { toast } from "@/components/ui/use-toast";
import { Product } from "./productService";

export type WishlistItem = {
  productId: string;
  dateAdded: string;
  product: Product;
};

export type Wishlist = {
  items: WishlistItem[];
};

// Initialize wishlist from localStorage
const initWishlist = (): Wishlist => {
  const storedWishlist = localStorage.getItem('wishlist');
  if (storedWishlist) {
    return JSON.parse(storedWishlist);
  }
  return { items: [] };
};

// Save wishlist to localStorage
const saveWishlist = (wishlist: Wishlist): void => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
};

// Get wishlist
export const getWishlist = (): Wishlist => {
  return initWishlist();
};

// Add item to wishlist
export const addToWishlist = (product: Product): void => {
  const wishlist = initWishlist();
  const existingItem = wishlist.items.find(item => item.productId === product.id);
  
  if (!existingItem) {
    wishlist.items.push({
      productId: product.id,
      dateAdded: new Date().toISOString(),
      product
    });
    
    saveWishlist(wishlist);
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist.`,
    });
  }
};

// Remove item from wishlist
export const removeFromWishlist = (productId: string): void => {
  const wishlist = initWishlist();
  wishlist.items = wishlist.items.filter(item => item.productId !== productId);
  saveWishlist(wishlist);
};

// Check if item is in wishlist
export const isInWishlist = (productId: string): boolean => {
  const wishlist = initWishlist();
  return wishlist.items.some(item => item.productId === productId);
};

// Clear wishlist
export const clearWishlist = (): void => {
  saveWishlist({ items: [] });
};
