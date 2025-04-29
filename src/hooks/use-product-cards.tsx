
import React, { useRef, useEffect } from 'react';
import { Product } from '@/services/productService';
import ProductGrid from '@/components/ProductGrid';
import ProductCard from '@/components/ProductCard';
import { useAutoScroll } from './use-auto-scroll';

type ProductCardsProps = {
  products: Product[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  autoScroll?: boolean;
  scrollId?: string;
};

export const useProductCards = () => {
  const ProductCards = ({
    products,
    title,
    subtitle,
    loading = false,
    autoScroll = false,
    scrollId = 'scrollable-products'
  }: ProductCardsProps) => {
    // Enable auto-scrolling if requested
    if (autoScroll) {
      useAutoScroll(scrollId, {
        speed: 1,
        interval: 50,
        pauseOnHover: true,
        reverseOnEdges: true
      });
    }
    
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-72 rounded-md"></div>
            ))}
          </div>
        </div>
      );
    }
    
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {title && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-sage-900">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        )}
        
        {autoScroll ? (
          <div className="overflow-hidden">
            <div
              id={scrollId}
              className="flex overflow-x-auto hide-scrollbar pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-6 min-w-max">
                {products.map(product => (
                  <div key={product.id} className="w-[250px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ProductGrid products={products} columns={4} />
        )}
      </div>
    );
  };
  
  return ProductCards;
};
