
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-cosmetic-100 to-cosmetic-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-cosmetic-500 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                Limited Time Offer
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                25% Off All Skincare Products
              </h3>
              <p className="text-gray-600 mb-6">
                Stock up on your favorite moisturizers, serums, and cleansers.
                Use code <span className="font-bold">GLOWUP25</span> at checkout.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-cosmetic-600 hover:bg-cosmetic-700">
                  <Link to="/sale">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" className="border-cosmetic-600 text-cosmetic-600 hover:bg-cosmetic-50">
                  <Link to="/skincare">Explore Skincare</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800"
                alt="Skincare products promotion"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
