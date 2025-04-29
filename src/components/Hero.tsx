
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Shield, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="eco-hero-gradient eco-leaf-pattern min-h-[85vh] flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-sage-50 text-sage-700 px-4 py-2 rounded-full mb-5 font-medium text-sm">
              <Leaf size={16} className="text-sage-600" />
              <span>100% Natural Ingredients</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-sage-900 mb-4 leading-tight">
              Nature's Gift For Your
              <span className="text-sage-600 block mt-1">Perfect Beauty</span>
            </h1>
            
            <p className="text-lg text-sage-700 mb-8 max-w-lg">
              Discover our sustainable collection of plant-based skincare and organic makeup products crafted to enhance your natural beauty and protect our planet.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-sage-600 hover:bg-sage-700 rounded-full px-8">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-sage-600 text-sage-600 hover:bg-sage-50 rounded-full px-8">
                <Link to="/bestsellers">Bestsellers</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Leaf className="h-6 w-6 text-sage-500" />
                </div>
                <div className="text-lg font-serif font-bold text-sage-800">100%</div>
                <div className="text-sm text-sage-600">Organic</div>
              </div>
              <div className="h-12 w-px bg-sage-200"></div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Shield className="h-6 w-6 text-sage-500" />
                </div>
                <div className="text-lg font-serif font-bold text-sage-800">Cruelty</div>
                <div className="text-sm text-sage-600">Free</div>
              </div>
              <div className="h-12 w-px bg-sage-200"></div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-sage-500" />
                </div>
                <div className="text-lg font-serif font-bold text-sage-800">Eco</div>
                <div className="text-sm text-sage-600">Packaging</div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-sage-200 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-rose-100 rounded-full blur-3xl opacity-40"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800" 
              alt="Eco-friendly cosmetics collection" 
              className="w-full h-auto max-h-[600px] object-cover rounded-3xl shadow-xl relative z-10 animate-nature-grow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
