
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import SectionTitle from '@/components/SectionTitle';
import { Product, getProductsByCategory, getCategoryById } from '@/services/productService';

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const category = await getCategoryById(id);
        if (category) {
          setCategoryName(category.name);
          const categoryProducts = await getProductsByCategory(category.id);
          setProducts(categoryProducts);
        }
      } catch (error) {
        console.error("Error loading category products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [id]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title={categoryName || 'Category'}
          subtitle={`Browse all ${categoryName.toLowerCase()} products`}
          center
        />
        
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-72 rounded-md"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            {products.length > 0 ? (
              <ProductGrid products={products} columns={4} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryDetail;
