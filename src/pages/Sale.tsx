
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import SectionTitle from '@/components/SectionTitle';
import { Product, getSaleProducts } from '@/services/productService';

const Sale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSaleProducts = async () => {
      try {
        const saleProducts = await getSaleProducts();
        setProducts(saleProducts);
      } catch (error) {
        console.error("Error loading sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSaleProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title="Sale Items"
          subtitle="Limited time offers at special prices"
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
                <p className="text-gray-500">No sale products found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sale;
