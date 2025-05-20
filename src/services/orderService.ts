
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
