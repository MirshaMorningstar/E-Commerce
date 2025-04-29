
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

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
        'nav-link font-medium text-gray-600 hover:text-cosmetic-600 transition-colors',
        isActive && 'text-cosmetic-600 font-semibold',
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
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();
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
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

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
          <Link to="/" className="text-2xl font-bold text-cosmetic-700">
            Cosmic<span className="text-gold-500">Chic</span>
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

          {/* Search, User, Wishlist, Cart Icons */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] rounded-full pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search 
                className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" 
                onClick={() => handleSearch}
              />
            </form>
            <Link to={isAuthenticated ? "/account" : "/login"} className="text-gray-700 hover:text-cosmetic-600">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-cosmetic-600">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-cosmetic-600 relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cosmetic-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="text-gray-700 hover:text-cosmetic-600 relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cosmetic-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg animate-slide-in">
            <form onSubmit={handleSearch} className="px-4 mb-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-full pr-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost"
                  className="absolute right-0 top-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="flex flex-col space-y-3 px-4">
              <NavLink to="/" className="py-2">Home</NavLink>
              <NavLink to="/shop" className="py-2">Shop</NavLink>
              <NavLink to="/categories" className="py-2">Categories</NavLink>
              <NavLink to="/bestsellers" className="py-2">Bestsellers</NavLink>
              <NavLink to="/new" className="py-2">New</NavLink>
              <NavLink to="/sale" className="py-2">Sale</NavLink>
              <div className="border-t border-gray-200 my-2"></div>
              <NavLink to={isAuthenticated ? "/account" : "/login"} className="py-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{isAuthenticated ? 'My Account' : 'Login / Register'}</span>
              </NavLink>
              <NavLink to="/wishlist" className="py-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
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
