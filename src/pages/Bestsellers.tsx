
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import SectionTitle from '@/components/SectionTitle';
import { Product, getBestsellers } from '@/services/productService';

const Bestsellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestsellers = async () => {
      try {
        const bestsellers = await getBestsellers();
        setProducts(bestsellers);
      } catch (error) {
        console.error("Error loading bestsellers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBestsellers();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title="Bestsellers"
          subtitle="Our most popular products loved by customers"
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
                <p className="text-gray-500">No bestsellers found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bestsellers;
