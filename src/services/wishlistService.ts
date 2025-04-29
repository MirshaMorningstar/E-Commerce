
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./productService";
import { getCurrentUser } from "./authService";

export type WishlistItem = {
  productId: string;
  dateAdded: string;
  product: Product;
};

export type Wishlist = {
  items: WishlistItem[];
};

// Get local wishlist for non-authenticated users
const getLocalWishlist = (): Wishlist => {
  const storedWishlist = localStorage.getItem('wishlist');
  if (storedWishlist) {
    return JSON.parse(storedWishlist);
  }
  return { items: [] };
};

// Save local wishlist for non-authenticated users
const saveLocalWishlist = (wishlist: Wishlist): void => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
};

// Get wishlist
export const getWishlist = async (): Promise<Wishlist> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return getLocalWishlist();
  }
  
  try {
    // Fetch wishlist items from Supabase
    const { data: wishlistItems, error } = await supabase
      .from('wishlist_items')
      .select(`
        product_id,
        created_at,
        products:product_id (*)
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching wishlist:", error);
      return getLocalWishlist();
    }
    
    const items = wishlistItems.map(item => ({
      productId: item.product_id,
      dateAdded: item.created_at,
      product: mapDatabaseProductToProduct(item.products)
    }));
    
    return { items };
  } catch (err) {
    console.error("Error in getWishlist:", err);
    return getLocalWishlist();
  }
};

// Add item to wishlist
export const addToWishlist = async (product: Product): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    addToLocalWishlist(product);
    return;
  }
  
  try {
    // Check if product already exists in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();
    
    if (existingItem) {
      // Item already in wishlist, do nothing
      return;
    }
    
    // Insert new wishlist item if product doesn't exist
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: product.id
      });
      
    if (error) throw error;
    
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist.`,
    });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    toast({
      title: "Error",
      description: "Failed to add item to wishlist. Please try again.",
      variant: "destructive",
    });
  }
};

// Add to local wishlist for non-authenticated users
const addToLocalWishlist = (product: Product): void => {
  const wishlist = getLocalWishlist();
  const existingItem = wishlist.items.find(item => item.productId === product.id);
  
  if (!existingItem) {
    wishlist.items.push({
      productId: product.id,
      dateAdded: new Date().toISOString(),
      product
    });
    
    saveLocalWishlist(wishlist);
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist.`,
    });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (productId: string): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    removeFromLocalWishlist(productId);
    return;
  }
  
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
      
    if (error) throw error;
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    toast({
      title: "Error",
      description: "Failed to remove item from wishlist. Please try again.",
      variant: "destructive",
    });
  }
};

// Remove from local wishlist for non-authenticated users
const removeFromLocalWishlist = (productId: string): void => {
  const wishlist = getLocalWishlist();
  wishlist.items = wishlist.items.filter(item => item.productId !== productId);
  saveLocalWishlist(wishlist);
};

// Check if item is in wishlist
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return isInLocalWishlist(productId);
  }
  
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
      
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error("Error checking wishlist:", err);
    return false;
  }
};

// Check if item is in local wishlist for non-authenticated users
const isInLocalWishlist = (productId: string): boolean => {
  const wishlist = getLocalWishlist();
  return wishlist.items.some(item => item.productId === productId);
};

// Clear wishlist
export const clearWishlist = async (): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    clearLocalWishlist();
    return;
  }
  
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id);
      
    if (error) throw error;
  } catch (err) {
    console.error("Error clearing wishlist:", err);
    toast({
      title: "Error",
      description: "Failed to clear wishlist. Please try again.",
      variant: "destructive",
    });
  }
};

// Clear local wishlist for non-authenticated users
const clearLocalWishlist = (): void => {
  saveLocalWishlist({ items: [] });
};

// Utility function to map database product to Product type
const mapDatabaseProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand || "",
    category: dbProduct.category,
    subcategory: dbProduct.category, // Using category as subcategory since we don't have subcategory in DB
    price: dbProduct.price,
    oldPrice: dbProduct.is_sale ? dbProduct.price * (1 + dbProduct.discount_percentage / 100) : undefined,
    description: dbProduct.description || "",
    rating: 5, // Default rating
    reviews: 0, // Default reviews count
    images: [dbProduct.image_url],
    tags: [dbProduct.category, dbProduct.brand].filter(Boolean),
    isNew: dbProduct.is_new,
    isFeatured: dbProduct.is_featured,
    isOnSale: dbProduct.is_sale,
    stock: dbProduct.stock_quantity
  };
};
