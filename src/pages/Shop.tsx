import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Slider } from "@/components/ui/slider"
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, X, SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';
import { Product, getAllProducts } from '@/services/productService';

const CATEGORIES = ['Skincare', 'Makeup', 'Hair Care', 'Bath & Body', 'Fragrance'];
const BRANDS = ['Natural Glow', 'Pure Essence', 'Eco Beauty', 'Green Life', 'Botanical'];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        
        // Find actual min and max prices from products
        const prices = allProducts.map(product => product.price);
        if (prices.length > 0) {
          const actualMinPrice = Math.floor(Math.min(...prices));
          const actualMaxPrice = Math.ceil(Math.max(...prices));
          setMinPrice(actualMinPrice);
          setMaxPrice(actualMaxPrice);
          setPriceRange([actualMinPrice, actualMaxPrice]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Filter by price
    result = result.filter(product => 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1]
    );
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }
    
    // Sort products
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result = result.filter(product => product.isNew).concat(
          result.filter(product => !product.isNew)
        );
        break;
      default:
        // Recommended (default sorting)
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, selectedCategories, selectedBrands, sortOption]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };
  
  const handlePriceChange = (newValue: number[]) => {
    setPriceRange([newValue[0], newValue[1]]);
  };
  
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([minPrice, maxPrice]);
    setSortOption('recommended');
  };
  
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Function to start the automatic horizontal scroll
  useEffect(() => {
    const startAutoScroll = (elementId: string) => {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      let scrollAmount = 1;
      let scrollDirection = 1;
      
      const scroll = () => {
        element.scrollLeft += scrollAmount * scrollDirection;
        
        // Change direction if reached end or beginning
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        if (element.scrollLeft >= maxScrollLeft) {
          scrollDirection = -1;
        } else if (element.scrollLeft <= 0) {
          scrollDirection = 1;
        }
      };
      
      const intervalId = setInterval(scroll, 50);
      
      return () => {
        clearInterval(intervalId);
      };
    };
    
    const cleanup = startAutoScroll('featured-products-row');
    
    return cleanup;
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sage-900 mb-2">Shop All Products</h1>
          <p className="text-gray-600">Discover our eco-friendly beauty collection</p>
        </div>
        
        {/* Featured Products Row with Auto Scroll */}
        {!loading && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
            <div id="featured-products-row" className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
              <div className="flex gap-4 min-w-max">
                {filteredProducts
                  .filter(product => product.isFeatured)
                  .map(product => (
                    <div key={product.id} className="min-w-[280px] max-w-[280px]">
                      <Card className="overflow-hidden">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">${product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.oldPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFilters}
                className="flex items-center gap-2"
              >
                {showFilters ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Hide Filters</span>
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4" />
                    <span>Show Filters</span>
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={gridView === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridView('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridView === 'list' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridView('list')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                
                <select
                  className="border border-input bg-background px-3 py-1.5 text-sm rounded-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Sidebar Filters - Desktop & Mobile */}
          <div 
            className={`${
              showFilters ? 'block' : 'hidden lg:block'
            } lg:w-1/4 space-y-6`}
          >
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 h-8"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              </div>
              
              <Accordion type="multiple" defaultValue={['price', 'categories', 'brands']}>
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[minPrice, maxPrice]}
                        value={[priceRange[0], priceRange[1]]}
                        min={minPrice}
                        max={maxPrice}
                        step={1}
                        onValueChange={handlePriceChange}
                        className="mt-6"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-1/2">
                          <Label>Min</Label>
                          <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <Input
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                              min={minPrice}
                              max={priceRange[1]}
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div className="w-1/2">
                          <Label>Max</Label>
                          <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <Input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                              min={priceRange[0]}
                              max={maxPrice}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {CATEGORIES.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="brands">
                  <AccordionTrigger>Brands</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {BRANDS.map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandChange(brand)}
                          />
                          <Label
                            htmlFor={`brand-${brand}`}
                            className="text-sm cursor-pointer"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="availability">
                  <AccordionTrigger>Availability</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" />
                        <Label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="out-of-stock" />
                        <Label htmlFor="out-of-stock" className="text-sm cursor-pointer">Out of Stock</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
          
          {/* Product List */}
          <div className="lg:w-3/4 flex-grow">
            {/* Desktop Sort Controls */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={gridView === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGridView('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={gridView === 'list' ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGridView('list')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                  <select
                    className="border border-input bg-background px-3 py-1 text-sm rounded-md"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Products Grid or List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              gridView === 'grid' ? (
                <ProductGrid products={filteredProducts} columns={4} />
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 lg:w-1/4 aspect-square">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 sm:p-6 flex-grow flex flex-col">
                          <div className="mb-2">
                            <h3 className="text-lg font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category} • {product.brand}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="mt-auto flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-lg">${product.price.toFixed(2)}</span>
                              {product.oldPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.oldPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div>
                              <Link to={`/product/${product.id}`}>
                                <Button>View Details</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
