
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name?: string;
  rating: number;
  comment: string;
  productName?: string;
}

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch testimonials from the database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            products (
              name
            ),
            user_id
          `)
          .order('created_at', { ascending: false })
          .limit(15);

        if (error) throw error;

        // Format testimonials
        const formattedTestimonials = await Promise.all((data || []).map(async (review) => {
          // Try to get the user's name if available
          let name = 'Satisfied Customer';
          if (review.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', review.user_id)
              .single();

            if (profileData) {
              name = profileData.first_name || '';
              if (profileData.last_name) {
                name += ' ' + profileData.last_name;
              }
            }
          }

          return {
            id: review.id,
            name: name,
            rating: review.rating,
            comment: review.comment,
            productName: review.products?.name
          };
        }));

        setTestimonials(formattedTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isLoading || isPaused || !carouselRef.current || testimonials.length === 0) return;

    const carousel = carouselRef.current;
    const scrollAmount = 1; // Adjust for smoother or faster scrolling
    let animationFrameId: number;
    
    const scroll = () => {
      if (carousel) {
        carousel.scrollLeft += scrollAmount;
        
        // Loop back to the beginning when reaching the end
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10) {
          carousel.scrollLeft = 0;
        }
        
        animationFrameId = requestAnimationFrame(scroll);
      }
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading, isPaused, testimonials]);

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={i < rating ? 'currentColor' : 'none'}
            stroke={i < rating ? 'none' : 'currentColor'}
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div 
      className="overflow-hidden my-8 py-4" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-transform hover:scale-105 border border-gray-100 dark:border-gray-700"
          >
            <div className="mb-4">
              <StarRating rating={testimonial.rating} />
            </div>
            <p className="italic mb-4 text-gray-600 dark:text-gray-300">"{testimonial.comment}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                {testimonial.productName && (
                  <p className="text-sm text-muted-foreground">on {testimonial.productName}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
