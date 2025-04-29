
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';

interface ProductGridProps {
  products: Product[];
  columns?: number;
}

const ProductGrid = ({ products, columns = 4 }: ProductGridProps) => {
  const getColumnClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      case 6:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      case 4:
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getColumnClass()} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
