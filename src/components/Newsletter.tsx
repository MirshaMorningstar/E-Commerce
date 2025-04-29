
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeToNewsletter } from '@/services/emailService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await subscribeToNewsletter(email, name || undefined, user?.id);
      
      if (success) {
        toast({
          title: 'Subscription Successful!',
          description: 'Thank you for subscribing to our newsletter.',
        });
        
        // Clear the form on success
        setEmail('');
        setName('');
      } else {
        toast({
          title: 'Subscription Failed',
          description: 'There was a problem with your subscription. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Stay Connected</h2>
          <p className="mb-8">
            Subscribe to our newsletter for exclusive offers, eco-living tips, and new product alerts.
            Join our community committed to sustainable living.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Your Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
              />
            </div>
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Your Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
              />
            </div>
            <Button 
              type="submit" 
              variant="secondary" 
              size="lg" 
              disabled={isSubmitting}
              className="whitespace-nowrap h-12"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe Now"}
            </Button>
          </form>
          
          <p className="text-xs mt-4 text-white/80">
            By subscribing, you agree to receive marketing emails from us. 
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
