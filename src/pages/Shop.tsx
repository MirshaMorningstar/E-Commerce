
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { Product, getAllProducts } from '@/services/productService';
import ProductGrid from '@/components/ProductGrid';
import SectionTitle from '@/components/SectionTitle';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [categories, setCategories] = useState<{[key: string]: boolean}>({});
  const [brands, setBrands] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        
        // Extract unique categories and brands
        const categorySet = new Set(allProducts.map(p => p.category));
        const brandSet = new Set(allProducts.map(p => p.brand).filter(Boolean));
        
        // Initialize filter states
        const categoryObj: {[key: string]: boolean} = {};
        const brandObj: {[key: string]: boolean} = {};
        categorySet.forEach(cat => categoryObj[cat] = false);
        brandSet.forEach(brand => brandObj[brand as string] = false);
        
        setCategories(categoryObj);
        setBrands(brandObj);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setCategories(prev => ({...prev, [category]: checked}));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setBrands(prev => ({...prev, [brand]: checked}));
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    
    const resetCategories = {...categories};
    Object.keys(resetCategories).forEach(key => resetCategories[key] = false);
    setCategories(resetCategories);
    
    const resetBrands = {...brands};
    Object.keys(resetBrands).forEach(key => resetBrands[key] = false);
    setBrands(resetBrands);
  };

  // Apply filters
  const filteredProducts = products.filter(product => {
    // Price filter
    const productPrice = product.price;
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    
    if (productPrice < minPrice || productPrice > maxPrice * 2) {
      return false;
    }
    
    // Category filter - if no categories selected, show all
    const categoriesSelected = Object.values(categories).some(v => v);
    if (categoriesSelected && !categories[product.category]) {
      return false;
    }
    
    // Brand filter - if no brands selected, show all
    const brandsSelected = Object.values(brands).some(v => v);
    if (brandsSelected && product.brand && !brands[product.brand]) {
      return false;
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SectionTitle
          title="All Products"
          subtitle="Discover our complete collection"
          center
        />
        
        <div className="flex flex-col md:flex-row mt-8 gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Price Range</h3>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0] * 2}</span>
                <span>${priceRange[1] * 2}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {Object.keys(categories).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={categories[category]}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Brands</h3>
              <div className="space-y-2">
                {Object.keys(brands).map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`} 
                      checked={brands[brand]}
                      onCheckedChange={(checked) => 
                        handleBrandChange(brand, checked as boolean)
                      }
                    />
                    <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
          
          {/* Products grid */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-72 rounded-md"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-500">
                  {filteredProducts.length} products found
                </div>
                <ProductGrid products={filteredProducts} columns={3} />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
