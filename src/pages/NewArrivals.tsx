
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import SectionTitle from '@/components/SectionTitle';
import { Product, getNewProducts } from '@/services/productService';

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewProducts = async () => {
      try {
        const newProducts = await getNewProducts();
        setProducts(newProducts);
      } catch (error) {
        console.error("Error loading new products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNewProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title="New Arrivals"
          subtitle="Check out our latest additions to the collection"
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
                <p className="text-gray-500">No new products found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewArrivals;
