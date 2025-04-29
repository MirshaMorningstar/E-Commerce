
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight } from 'lucide-react';

const PromoBanner = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-sage-100 to-beige-100 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/70 text-sage-700 px-4 py-2 rounded-full mb-4 font-medium text-sm backdrop-blur-sm">
                <Leaf size={16} className="text-sage-600" />
                <span>Limited Time Offer</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-serif">
                25% Off All Natural Skincare
              </h3>
              <p className="text-sage-700 mb-6">
                Experience our organic moisturizers, serums, and cleansers.
                Use code <span className="font-bold">ECOGLOW25</span> at checkout.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-sage-600 hover:bg-sage-700 rounded-full">
                  <Link to="/sale" className="flex items-center gap-1">Shop Now <ArrowRight size={16} /></Link>
                </Button>
                <Button asChild variant="outline" className="border-sage-600 text-sage-600 hover:bg-sage-50 rounded-full">
                  <Link to="/skincare">Explore Skincare</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1615396900547-51398d4aa05a?q=80&w=800"
                alt="Natural skincare products promotion"
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
