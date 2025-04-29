
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Leaf, Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In a real app, we would send this to an API
    toast({
      title: "Thanks for subscribing!",
      description: "We'll keep you updated with eco-friendly beauty news and offers.",
    });
    
    setEmail('');
  };

  return (
    <section className="py-16 bg-sage-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-sage-100 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-sage-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-sage-800 mb-4 font-serif">
            Join Our Eco-Beauty Community
          </h2>
          <p className="text-sage-600 mb-8">
            Subscribe to our newsletter for sustainable beauty tips, early access to sales, and exclusive eco-friendly offers.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow rounded-full border-sage-200 focus-visible:ring-sage-500"
            />
            <Button type="submit" className="bg-sage-600 hover:bg-sage-700 rounded-full flex items-center gap-2">
              Subscribe <Send size={16} />
            </Button>
          </form>
          
          <p className="text-sm text-sage-500 mt-4">
            We're committed to sustainability and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
