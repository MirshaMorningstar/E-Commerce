
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import { Product, getNewProducts } from '@/services/productService';
import SectionTitle from '@/components/SectionTitle';
import ProductGrid from '@/components/ProductGrid';

const Index = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getNewProducts();
        setNewProducts(products);
      } catch (error) {
        console.error("Error loading new products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      <Hero />
      
      <CategorySection />
      
      <FeaturedProducts />
      
      <PromoBanner />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="New Arrivals" 
            subtitle="The latest additions to our collection"
            center
          />
          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-72 rounded-md"></div>
                ))}
              </div>
            </div>
          ) : (
            <ProductGrid products={newProducts} columns={4} />
          )}
        </div>
      </section>
      
      <Testimonials />
      
      <Newsletter />
    </Layout>
  );
};

export default Index;
