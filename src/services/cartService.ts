import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./productService";
import { getCurrentUser } from "./authService";

export type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
};

// Get cart
export const getCart = async (): Promise<Cart> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return getLocalCart();
  }
  
  try {
    // Fetch cart items from Supabase
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        product_id,
        quantity,
        products:product_id (*)
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching cart:", error);
      return getLocalCart();
    }
    
    const items = cartItems.map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
      product: mapDatabaseProductToProduct(item.products)
    }));
    
    return {
      items,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    };
  } catch (err) {
    console.error("Error in getCart:", err);
    return getLocalCart();
  }
};

// Get local cart for non-authenticated users
const getLocalCart = (): Cart => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    return JSON.parse(storedCart);
  }
  return { items: [], totalItems: 0, subtotal: 0 };
};

// Save local cart for non-authenticated users
const saveLocalCart = (cart: Cart): void => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Add item to cart
export const addToCart = async (product: Product, quantity: number = 1): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    addToLocalCart(product, quantity);
    return;
  }
  
  try {
    // Check if product already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();
    
    if (existingItem) {
      // Update quantity if product already exists
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('user_id', user.id)
        .eq('product_id', product.id);
        
      if (error) throw error;
    } else {
      // Insert new cart item if product doesn't exist
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity
        });
        
      if (error) throw error;
    }
    
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    toast({
      title: "Error",
      description: "Failed to add item to cart. Please try again.",
      variant: "destructive",
    });
  }
};

// Add to local cart for non-authenticated users
const addToLocalCart = (product: Product, quantity: number = 1): void => {
  const cart = getLocalCart();
  const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
  
  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      quantity,
      product
    });
  }
  
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  saveLocalCart(cart);
  toast({
    title: "Added to Cart",
    description: `${quantity} × ${product.name} added to your cart.`,
  });
};

// Update item quantity
export const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
  if (quantity < 1) return;
  
  const user = await getCurrentUser();
  
  if (!user) {
    updateLocalCartQuantity(productId, quantity);
    return;
  }
  
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);
      
    if (error) throw error;
  } catch (err) {
    console.error("Error updating cart quantity:", err);
    toast({
      title: "Error",
      description: "Failed to update quantity. Please try again.",
      variant: "destructive",
    });
  }
};

// Update local cart quantity for non-authenticated users
const updateLocalCartQuantity = (productId: string, quantity: number): void => {
  const cart = getLocalCart();
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity = quantity;
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    saveLocalCart(cart);
  }
};

// Remove item from cart
export const removeFromCart = async (productId: string): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    removeFromLocalCart(productId);
    return;
  }
  
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
      
    if (error) throw error;
    
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart.",
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    toast({
      title: "Error",
      description: "Failed to remove item from cart. Please try again.",
      variant: "destructive",
    });
  }
};

// Remove from local cart for non-authenticated users
const removeFromLocalCart = (productId: string): void => {
  const cart = getLocalCart();
  cart.items = cart.items.filter(item => item.productId !== productId);
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  saveLocalCart(cart);
  
  toast({
    title: "Removed from Cart",
    description: "Item removed from your cart.",
  });
};

// Clear cart
export const clearCart = async (): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    clearLocalCart();
    return;
  }
  
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
      
    if (error) throw error;
  } catch (err) {
    console.error("Error clearing cart:", err);
    toast({
      title: "Error",
      description: "Failed to clear cart. Please try again.",
      variant: "destructive",
    });
  }
};

// Clear local cart for non-authenticated users
const clearLocalCart = (): void => {
  saveLocalCart({ items: [], totalItems: 0, subtotal: 0 });
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

// New function to create an order in the database
export const createOrder = async (
  userId: string,
  totalAmount: number,
  shippingInfo: any,
  cartItems: CartItem[]
): Promise<string | null> => {
  try {
    // Create a new order in the orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingInfo,
        payment_intent_id: `sim_${Math.random().toString(36).substring(2, 15)}`, // Simulated payment ID
      })
      .select('id')
      .single();
    
    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(orderError.message);
    }
    
    if (!orderData) {
      throw new Error("Failed to create order");
    }
    
    // Create entries in the order_items table for each item
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.product.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error("Error adding order items:", itemsError);
      throw new Error(itemsError.message);
    }
    
    return orderData.id;
  } catch (error) {
    console.error("Error in createOrder:", error);
    return null;
  }
};
