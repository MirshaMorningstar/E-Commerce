
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import { getNewProducts } from '@/services/productService';
import SectionTitle from '@/components/SectionTitle';
import ProductGrid from '@/components/ProductGrid';

const Index = () => {
  const newProducts = getNewProducts();

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
          <ProductGrid products={newProducts} columns={4} />
        </div>
      </section>
      
      <Testimonials />
      
      <Newsletter />
    </Layout>
  );
};

export default Index;
