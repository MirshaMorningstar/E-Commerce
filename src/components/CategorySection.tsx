
import React from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '@/services/productService';
import SectionTitle from './SectionTitle';
import CategoryCard from './CategoryCard';
import { Button } from '@/components/ui/button';

const CategorySection = () => {
  const categories = getAllCategories();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between mb-8">
          <SectionTitle
            title="Shop by Category"
            subtitle="Find products by your favorite categories"
          />
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/categories">All Categories</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
