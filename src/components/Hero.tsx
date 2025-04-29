
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="hero-gradient min-h-[85vh] flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Discover Your Perfect
              <span className="text-cosmetic-600 block mt-1">Beauty Routine</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Explore our premium collection of skincare and makeup products crafted to highlight your natural beauty.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-cosmetic-600 hover:bg-cosmetic-700">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-cosmetic-600 text-cosmetic-600 hover:bg-cosmetic-50">
                <Link to="/bestsellers">Bestsellers</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-gray-800">500+</div>
                <div className="text-sm text-gray-500">Beauty Products</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-800">50k+</div>
                <div className="text-sm text-gray-500">Happy Customers</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-800">100%</div>
                <div className="text-sm text-gray-500">Quality Guarantee</div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cosmetic-200 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gold-200 rounded-full blur-3xl opacity-40"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800" 
              alt="Cosmetics collection" 
              className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
