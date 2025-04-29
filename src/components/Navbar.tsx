
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Leaf, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/services/productService';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const { cart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchProducts(debouncedSearchQuery);
        setSearchResults(results.slice(0, 5)); // Limit to 5 results in dropdown
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSelectProduct = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
  };
  
  // Get first name to display in navbar
  const firstName = user?.user_metadata?.name || '';
  
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <form onSubmit={handleSearch} className="flex items-center border-b p-2">
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="flex-1 border-none outline-none bg-transparent py-2 px-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : (
                  searchResults.length > 0 && (
                    <ScrollArea className="h-[300px]">
                      <div className="py-2">
                        {searchResults.map(product => (
                          <button
                            key={product.id}
                            className="flex w-full items-center space-x-4 p-3 hover:bg-accent transition-colors"
                            onClick={() => handleSelectProduct(product.id)}
                          >
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="h-10 w-10 object-cover rounded-md" 
                            />
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground">${product.price.toFixed(2)}</span>
                            </div>
                          </button>
                        ))}
                        <div className="p-2 text-center">
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => {
                              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                              setSearchQuery('');
                            }}
                          >
                            See all results
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  )
                )}
              </PopoverContent>
            </Popover>
            
            {isAuthenticated ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          <span className="animate-pulse text-sage-600">Hello, {firstName.split(' ')[0]}</span>
                        </span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-2 p-4 w-[250px]">
                        <NavigationMenuLink asChild>
                          <Link to="/profile" className="block p-2 hover:bg-accent rounded-md">
                            Profile
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/track-order" className="block p-2 hover:bg-accent rounded-md">
                            Track Orders
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/returns-exchanges" className="block p-2 hover:bg-accent rounded-md">
                            Returns & Exchanges
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link to="/auth" className="text-sage-700 hover:text-sage-900">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
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
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="search"
                placeholder="Search products..."
                className="flex-1 border border-gray-200 rounded-l-md py-2 px-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {isSearching ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : (
              searchResults.length > 0 && (
                <div className="bg-white shadow-lg rounded-md mt-2">
                  {searchResults.map(product => (
                    <button
                      key={product.id}
                      className="flex w-full items-center space-x-4 p-3 hover:bg-accent transition-colors"
                      onClick={() => handleSelectProduct(product.id)}
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="h-10 w-10 object-cover rounded-md" 
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">${product.price.toFixed(2)}</span>
                      </div>
                    </button>
                  ))}
                  <div className="p-2 text-center">
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setSearchQuery('');
                        setShowMobileSearch(false);
                      }}
                    >
                      See all results
                    </Button>
                  </div>
                </div>
              )
            )}
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
              {isAuthenticated ? (
                <>
                  <div className="py-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-sage-600" />
                    <span className="animate-pulse text-sage-600">Hello, {firstName.split(' ')[0]}</span>
                  </div>
                  <NavLink to="/profile" className="py-2 pl-6">My Profile</NavLink>
                  <NavLink to="/track-order" className="py-2 pl-6">Track Orders</NavLink>
                  <NavLink to="/returns-exchanges" className="py-2 pl-6">Returns & Exchanges</NavLink>
                </>
              ) : (
                <NavLink to="/auth" className="py-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-sage-600" />
                  <span>Login / Register</span>
                </NavLink>
              )}
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
