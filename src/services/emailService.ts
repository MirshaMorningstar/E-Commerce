
import { supabase } from '@/integrations/supabase/client';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    // In a production environment, we would call an edge function to send emails
    // For now, we'll simulate sending emails with a log
    console.log('Sending email:', {
      to: params.to,
      subject: params.subject,
      html: params.html,
      from: params.from || 'no-reply@example.com'
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, name?: string): Promise<boolean> => {
  const greeting = name ? `Hello ${name},` : 'Hello,';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50; margin-bottom: 20px;">Welcome to Our Newsletter!</h2>
      <p style="margin-bottom: 15px;">${greeting}</p>
      <p style="margin-bottom: 15px;">Thank you for subscribing to our newsletter! We're excited to share our latest products, eco-friendly tips, and exclusive offers with you.</p>
      <p style="margin-bottom: 15px;">Stay tuned for our next update!</p>
      <p style="margin-top: 30px;">Best regards,<br>The Eco-Shop Team</p>
    </div>
  `;
  
  return await sendEmail({
    to: email,
    subject: 'Welcome to Our Newsletter!',
    html
  });
};

// Update the newsletter service to use the email service
export const subscribeToNewsletter = async (email: string, name?: string, userId?: string): Promise<boolean> => {
  try {
    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existing) {
      return true; // Already subscribed
    }
    
    // Add to subscribers
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        user_id: userId || null
      });
    
    if (error) throw error;
    
    // Send welcome email
    await sendWelcomeEmail(email, name);
    
    return true;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return false;
  }
};
