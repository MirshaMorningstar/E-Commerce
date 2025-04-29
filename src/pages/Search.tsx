
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import SectionTitle from '@/components/SectionTitle';
import { searchProducts, Product } from '@/services/productService';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title={`Search Results: "${query}"`}
          subtitle={`${products.length} products found`}
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
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
