
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CategoryCard from '@/components/CategoryCard';
import SectionTitle from '@/components/SectionTitle';
import { getAllCategories, Category, getProductCountByCategory } from '@/services/productService';
import { supabase } from '@/integrations/supabase/client'; 

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        // Get all unique categories from the products table
        const { data: uniqueCategories, error } = await supabase
          .from('products')
          .select('category')
          .distinct();
          
        if (error) throw error;
        
        if (!uniqueCategories) {
          setCategories([]);
          return;
        }
        
        // Transform into Category objects
        const categoryObjects: Category[] = uniqueCategories.map((item, index) => ({
          id: `category-${index}`,
          name: item.category,
          image: `/categories/${item.category.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          description: `Explore our ${item.category} collection`
        }));
        
        setCategories(categoryObjects);
        
        // Get product counts for each category
        const counts: Record<string, number> = {};
        for (const category of categoryObjects) {
          const { count, error } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category', category.name);
            
          counts[category.id] = count || 0;
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
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title="Browse Categories"
          subtitle="Explore our wide range of sustainable product categories"
          center
        />
        
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-beige-200 h-72 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {categories.map((category, index) => (
              <div className="animate-nature-grow" key={category.id} style={{animationDelay: `${index * 0.1}s`}}>
                <CategoryCard 
                  category={category} 
                  productCount={productCounts[category.id] || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
