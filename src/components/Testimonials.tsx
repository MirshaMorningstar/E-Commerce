
import React from 'react';
import TestimonialCarousel from './TestimonialCarousel';

const Testimonials = () => {
  return (
    <section className="py-16 bg-beige-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why our customers love our sustainable products and commitment to eco-friendly practices.
          </p>
        </div>
        
        <TestimonialCarousel />
        
        <div className="mt-10 text-center">
          <p className="text-muted-foreground">
            Join thousands of happy customers who have made the switch to sustainable living.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
