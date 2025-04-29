
import React from 'react';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import SectionTitle from './SectionTitle';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Skincare Enthusiast',
    image: 'https://i.pravatar.cc/150?img=32',
    content: 'The serums are amazing! I\'ve been using the Radiance Serum for just two weeks, and my skin already looks noticeably brighter and more even-toned. Definitely worth every penny.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chang',
    role: 'Makeup Artist',
    image: 'https://i.pravatar.cc/150?img=69',
    content: 'As a professional makeup artist, I\'m very picky about the products I use. The foundation is simply outstanding - buildable coverage with a natural finish that lasts all day. My clients love it!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Parker',
    role: 'Beauty Blogger',
    image: 'https://i.pravatar.cc/150?img=47',
    content: 'I\'ve tried dozens of lipstick brands, but these are my new favorite. The color payoff is incredible, they\'re super comfortable, and they stay put through meals. Will be ordering more shades!',
    rating: 4,
  },
  {
    id: 4,
    name: 'Thomas Wilson',
    role: 'Regular Customer',
    image: 'https://i.pravatar.cc/150?img=12',
    content: 'Bought the skincare set for my wife\'s birthday, and she absolutely loves it. The packaging is elegant, and the products are high quality. Great customer service too!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Lisa Rodriguez',
    role: 'Skincare Specialist',
    image: 'https://i.pravatar.cc/150?img=25',
    content: 'The ingredients in these products are top-notch. I especially appreciate the focus on clean formulations without compromising effectiveness. I recommend these to my clients regularly.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="What Our Customers Say"
          subtitle="Real reviews from beauty enthusiasts like you"
          center
        />
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-1">
                <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic flex-grow">{testimonial.content}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
