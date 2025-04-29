
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/services/productService';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link 
      to={`/category/${category.id}`} 
      className="category-card block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md group"
    >
      <div className="relative">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white text-xl font-semibold mb-1">
            {category.name}
          </h3>
          <p className="text-white/80 text-sm mb-2">
            {category.subcategories.length} collections
          </p>
          <div className="flex items-center text-white/90 text-sm group-hover:text-cosmetic-200 transition-colors">
            <span>Shop now</span>
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
