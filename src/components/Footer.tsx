
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Leaf, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/components/NewsletterService';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeToNewsletter({ email });
      toast({
        title: "Subscribed!",
        description: "You've been successfully subscribed to our newsletter.",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-sage-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Eco-friendly features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-b border-sage-200 pb-12">
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-sage-100 flex items-center justify-center mb-4">
              <Leaf className="h-7 w-7 text-sage-600" />
            </div>
            <h3 className="font-serif font-bold text-sage-800 text-lg mb-2">100% Natural Ingredients</h3>
            <p className="text-sage-600">Ethically sourced botanical ingredients that are good for you and the planet.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-sage-100 flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-sage-600" />
            </div>
            <h3 className="font-serif font-bold text-sage-800 text-lg mb-2">Cruelty-Free Promise</h3>
            <p className="text-sage-600">We never test on animals and only work with ethical suppliers who share our values.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-sage-100 flex items-center justify-center mb-4">
              <Award className="h-7 w-7 text-sage-600" />
            </div>
            <h3 className="font-serif font-bold text-sage-800 text-lg mb-2">Sustainable Packaging</h3>
            <p className="text-sage-600">Recyclable and biodegradable packaging made from recycled materials.</p>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-sage-600 rounded-full flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-sage-800 font-serif">
                Eco<span className="text-rose-400">Glow</span>
              </span>
            </div>
            <p className="text-sage-600 mb-6">
              Your premier destination for eco-friendly and sustainable cosmetics.
              We believe in beauty that empowers and enhances without compromising our planet.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-sage-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sage-600 hover:text-sage-800 transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/bestsellers" className="text-sage-600 hover:text-sage-800 transition-colors">Best Sellers</Link>
              </li>
              <li>
                <Link to="/new" className="text-sage-600 hover:text-sage-800 transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/sale" className="text-sage-600 hover:text-sage-800 transition-colors">Sale</Link>
              </li>
              <li>
                <Link to="/about" className="text-sage-600 hover:text-sage-800 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sage-600 hover:text-sage-800 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-sage-800 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sage-600 hover:text-sage-800 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-sage-600 hover:text-sage-800 transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns-exchanges" className="text-sage-600 hover:text-sage-800 transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sage-600 hover:text-sage-800 transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sage-600 hover:text-sage-800 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-sage-600 hover:text-sage-800 transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-sage-800 mb-4">Stay Connected</h4>
            <p className="text-sage-600 mb-4">
              Join our community for sustainable beauty tips and exclusive offers.
            </p>
            <form className="flex mb-4" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-l-full rounded-r-none border-sage-200 focus-visible:ring-sage-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit"
                className="rounded-l-none rounded-r-full bg-sage-600 hover:bg-sage-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sage-600">
                <Mail size={16} className="text-sage-500" />
                <a href="mailto:support@ecoglow.com" className="hover:text-sage-800 transition-colors">support@ecoglow.com</a>
              </div>
              <div className="flex items-center gap-2 text-sage-600">
                <Phone size={16} className="text-sage-500" />
                <a href="tel:+15551234567" className="hover:text-sage-800 transition-colors">+1 (555) 123-4567</a>
              </div>
              <div className="flex items-center gap-2 text-sage-600">
                <MapPin size={16} className="text-sage-500" />
                <address className="not-italic">123 Green Ave, Eco City</address>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-200 mt-12 pt-8 text-center text-sage-500">
          <p>&copy; {currentYear} EcoGlow Cosmetics. All rights reserved.</p>
          <p className="mt-1 text-sm">Committed to sustainability, transparency, and natural beauty.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
