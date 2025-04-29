
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">CosmicChic</h3>
            <p className="text-gray-600 mb-6">
              Your premier destination for quality cosmetics and skincare products.
              We believe in beauty that empowers and enhances.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-cosmetic-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-cosmetic-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-cosmetic-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-cosmetic-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/bestsellers" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Best Sellers</Link>
              </li>
              <li>
                <Link to="/new" className="text-gray-600 hover:text-cosmetic-600 transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/sale" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Sale</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-cosmetic-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-cosmetic-600 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-cosmetic-600 transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Subscribe to Our Newsletter</h4>
            <p className="text-gray-600 mb-4">
              Stay updated on new products, sales, and beauty tips.
            </p>
            <form className="flex mb-4">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-r-none focus-visible:ring-cosmetic-500"
              />
              <Button className="rounded-l-none bg-cosmetic-600 hover:bg-cosmetic-700">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>support@cosmicchic.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>123 Beauty Ave, Fashion City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} CosmicChic Cosmetics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
