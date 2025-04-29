
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Check if a user has admin role
 */
export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Fetch all customers (users with profiles)
 */
export const getAllCustomers = async () => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .order('first_name', { ascending: true });
      
    if (error) throw error;
    
    return profiles;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/**
 * Fetch all orders with customer details
 */
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey(first_name, last_name, email),
        order_items(id, quantity, price_at_purchase, product_id, products(name, image_url))
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

/**
 * Update product data
 */
export const updateProduct = async (productId: string, productData: Partial<any>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Product Updated",
      description: "Product has been successfully updated."
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error Updating Product",
      description: error.message || "An error occurred while updating the product.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Add new product
 */
export const addProduct = async (productData: Omit<any, "id">) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Product Added",
      description: "New product has been successfully added."
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error Adding Product",
      description: error.message || "An error occurred while adding the product.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) throw error;
    
    toast({
      title: "Product Deleted",
      description: "Product has been successfully deleted."
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error Deleting Product",
      description: error.message || "An error occurred while deleting the product.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Order Updated",
      description: `Order status has been updated to ${status}.`
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error Updating Order",
      description: error.message || "An error occurred while updating the order.",
      variant: "destructive"
    });
    throw error;
  }
};
