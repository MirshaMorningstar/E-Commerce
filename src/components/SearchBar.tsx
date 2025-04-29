
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';
import { Product, searchProducts } from '@/services/productService';

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const SearchBar = ({ isMobile = false, onClose }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      
      setIsLoading(true);
      setIsOpen(true);
      
      try {
        const searchResults = await searchProducts(debouncedSearch);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);
  
  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
    setIsOpen(false);
    setSearchQuery('');
    if (onClose) onClose();
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    inputRef.current?.focus();
  };
  
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className="w-full pr-8 border-sage-200 focus-visible:ring-sage-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 rounded-full"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-sage-500" />
            </Button>
          ) : (
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-sage-500" />
          )}
        </div>
        
        {isOpen && searchQuery && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-lg rounded-md max-h-80 overflow-y-auto z-50 border border-sage-100">
            {isLoading ? (
              <div className="p-4 text-center text-sage-500">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-sage-500">No products found</div>
            ) : (
              <div className="py-2">
                {results.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sage-50 cursor-pointer"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="h-10 w-10 bg-sage-100 rounded-md overflow-hidden">
                      {product.images && product.images.length > 0 && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="h-full w-full object-cover" 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-sage-500">{product.category}</div>
                    </div>
                    <div className="text-sm font-medium">${product.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className="w-[250px] rounded-full pr-8 border-sage-200 focus-visible:ring-sage-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 rounded-full h-10 w-10"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-sage-500" />
            </Button>
          ) : (
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-sage-500" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[350px]" align="start">
        <Command>
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sage-500">Searching...</div>
            ) : results.length === 0 ? (
              <CommandEmpty>No products found</CommandEmpty>
            ) : (
              <CommandGroup heading="Products">
                {results.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => handleSelectProduct(product)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="h-10 w-10 bg-sage-100 rounded-md overflow-hidden">
                      {product.images && product.images.length > 0 && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="h-full w-full object-cover" 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-sage-500">{product.category}</div>
                    </div>
                    <div className="text-sm font-medium">${product.price.toFixed(2)}</div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
