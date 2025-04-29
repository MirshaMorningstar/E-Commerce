
import { toast } from "@/components/ui/use-toast";
import { Product } from "./productService";

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

// Initialize cart from localStorage
const initCart = (): Cart => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    return JSON.parse(storedCart);
  }
  return { items: [], totalItems: 0, subtotal: 0 };
};

// Save cart to localStorage
const saveCart = (cart: Cart): void => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Get cart
export const getCart = (): Cart => {
  return initCart();
};

// Add item to cart
export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = initCart();
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
  
  saveCart(cart);
  toast({
    title: "Added to Cart",
    description: `${quantity} × ${product.name} added to your cart.`,
  });
};

// Update item quantity
export const updateQuantity = (productId: string, quantity: number): void => {
  if (quantity < 1) return;
  
  const cart = initCart();
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity = quantity;
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    saveCart(cart);
  }
};

// Remove item from cart
export const removeFromCart = (productId: string): void => {
  const cart = initCart();
  cart.items = cart.items.filter(item => item.productId !== productId);
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  saveCart(cart);
};

// Clear cart
export const clearCart = (): void => {
  saveCart({ items: [], totalItems: 0, subtotal: 0 });
};
