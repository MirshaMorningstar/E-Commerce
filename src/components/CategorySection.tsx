
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, Category, getProductCountByCategory } from '@/services/productService';
import SectionTitle from './SectionTitle';
import CategoryCard from './CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
        
        // Get product counts for each category
        const counts: Record<string, number> = {};
        for (const category of fetchedCategories) {
          counts[category.id] = category.subcategories.length;
        }
        setProductCounts(counts);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="py-16 bg-beige-50 eco-leaf-pattern">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between mb-8">
          <SectionTitle
            title="Shop by Category"
            subtitle="Find organic products by your favorite categories"
          />
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-sage-500 text-sage-700 hover:bg-sage-50 rounded-full group">
            <Link to="/categories" className="flex items-center gap-1">
              All Categories <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-beige-200 h-48 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map(category => (
              <div className="animate-nature-grow" key={category.id} style={{animationDelay: `${categories.indexOf(category) * 0.1}s`}}>
                <CategoryCard 
                  category={category}
                  productCount={productCounts[category.id] || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
