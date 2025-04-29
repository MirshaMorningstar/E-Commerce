
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export interface NewsletterSubscription {
  email: string;
  name?: string;
  userId?: string;
}

// Subscribe to newsletter
export const subscribeToNewsletter = async (subscription: NewsletterSubscription): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: subscription.email,
        name: subscription.name || null,
        user_id: subscription.userId || null
      });
      
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter.",
        });
        return true; // Still consider it a success since they're subscribed
      }
      throw error;
    }
    
    // Send a "Thank You" toast
    toast({
      title: "Successfully Subscribed!",
      description: "Thank you for subscribing to our newsletter. You'll receive our latest updates directly to your inbox.",
    });

    // In a real application, we would call an edge function here to send a welcome email
    // For now, we'll simulate it with a console log
    console.log("Send welcome email to:", subscription.email);
    
    return true;
  } catch (error: any) {
    toast({
      title: "Subscription Failed",
      description: error.message || "An error occurred while subscribing. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email);
      
    if (error) throw error;
    
    toast({
      title: "Unsubscribed",
      description: "You have been unsubscribed from our newsletter.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "An error occurred while unsubscribing. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Check if email is subscribed
export const isSubscribed = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
};
