
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from './SearchBar';

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const NavLink = ({ to, children, className, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'nav-link font-medium text-sage-700 hover:text-sage-900 transition-colors',
        isActive && 'text-sage-900 font-semibold',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    setShowMobileSearch(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-sage-600 rounded-full flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-sage-800 font-serif">
              Eco<span className="text-rose-400">Glow</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/bestsellers">Bestsellers</NavLink>
            <NavLink to="/new">New</NavLink>
            <NavLink to="/sale">Sale</NavLink>
          </nav>

          {/* Desktop Search, User, Wishlist, Cart Icons */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
            <Link to={isAuthenticated ? "/account" : "/login"} className="text-sage-700 hover:text-sage-900">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/wishlist" className="text-sage-700 hover:text-sage-900">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart" className="text-sage-700 hover:text-sage-900 relative">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ShoppingBag className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sage-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="text-sage-700 hover:text-sage-900 relative">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ShoppingBag className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sage-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full"
              onClick={() => {
                if (showMobileSearch) {
                  setShowMobileSearch(false);
                } else {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }
              }}
            >
              {showMobileSearch ? (
                <X className="h-6 w-6 text-sage-700" />
              ) : isMobileMenuOpen ? (
                <X className="h-6 w-6 text-sage-700" />
              ) : (
                <Menu className="h-6 w-6 text-sage-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden mt-4">
            <SearchBar isMobile onClose={() => setShowMobileSearch(false)} />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && !showMobileSearch && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-2xl shadow-lg animate-slide-in">
            <div className="px-4 mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 text-sage-700"
                onClick={() => {
                  setShowMobileSearch(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span>Search products</span>
              </Button>
            </div>
            <div className="flex flex-col space-y-1 px-4">
              <NavLink to="/" className="py-2">Home</NavLink>
              <NavLink to="/shop" className="py-2">Shop</NavLink>
              <NavLink to="/categories" className="py-2">Categories</NavLink>
              <NavLink to="/bestsellers" className="py-2">Bestsellers</NavLink>
              <NavLink to="/new" className="py-2">New</NavLink>
              <NavLink to="/sale" className="py-2">Sale</NavLink>
              <div className="border-t border-sage-100 my-2"></div>
              <NavLink to={isAuthenticated ? "/account" : "/login"} className="py-2 flex items-center gap-2">
                <User className="h-4 w-4 text-sage-600" />
                <span>{isAuthenticated ? 'My Account' : 'Login / Register'}</span>
              </NavLink>
              <NavLink to="/wishlist" className="py-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-sage-600" />
                <span>Wishlist</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
