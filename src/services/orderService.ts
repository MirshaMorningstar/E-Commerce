
import { supabase } from "@/integrations/supabase/client";

// Get order by id
export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        price_at_purchase,
        products:product_id (*)
      )
    `)
    .eq('id', orderId)
    .single();
  
  if (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
  
  return data;
};

// Get orders for current user
export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        price_at_purchase,
        products:product_id (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
  
  return data;
};

/**
 * Create a new order from cart items
 * 
 * @param userId The authenticated user ID
 * @param totalAmount The total order amount
 * @param shippingInfo Shipping information object
 * @param cartItems Array of cart items
 * @returns The ID of the newly created order, or null if creation failed
 */
export const createOrder = async (
  userId: string, 
  totalAmount: number,
  shippingInfo: any, 
  cartItems: any[]
) => {
  console.log("Creating order with userId:", userId);
  console.log("Total amount:", totalAmount);
  
  if (!userId) {
    console.error("UserId is required");
    return null;
  }
  
  if (cartItems.length === 0) {
    console.error("Cart is empty");
    return null;
  }
  
  try {
    // Format the total amount properly for the numeric(10,2) field
    const formattedAmount = parseFloat(totalAmount.toFixed(2));
    
    // Step 1: Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: formattedAmount,
        status: 'pending',
        shipping_address: shippingInfo,
        payment_intent_id: `sim_${Math.random().toString(36).substring(2, 15)}`
      })
      .select('id')
      .single();
    
    if (orderError) {
      console.error("Error creating order:", orderError);
      return null;
    }
    
    if (!orderData || !orderData.id) {
      console.error("No order ID returned");
      return null;
    }
    
    console.log("Order created with ID:", orderData.id);
    
    // Step 2: Create order items
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: parseFloat(item.product.price.toFixed(2))
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error("Error adding order items:", itemsError);
      
      // Clean up the order if items couldn't be added
      await supabase
        .from('orders')
        .delete()
        .eq('id', orderData.id);
      
      return null;
    }
    
    return orderData.id;
  } catch (err) {
    console.error("Unexpected error in createOrder:", err);
    return null;
  }
};
