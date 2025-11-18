'use client';

import { useState, useEffect, useRef } from 'react';
import { Testimonial } from '@/lib/landing-page-db';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Adjust number of visible testimonials based on screen size
  useEffect(() => {
    if (!isMounted) return;

    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2); // Tablet: 2 cards
      } else if (window.innerWidth < 1400) {
        setVisibleCount(3); // Desktop: 3 cards
      } else {
        setVisibleCount(4); // Large screens: 4 cards
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [isMounted]);

  // Auto-advance testimonials
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!paused && testimonials.length > visibleCount) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % Math.max(1, testimonials.length)
        );
      }, 5000); // Change every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused, testimonials.length, visibleCount]);

  // Handle pause on hover
  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) return null;

  // Calculate which testimonials to show based on current index
  const displayTestimonials = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex + i) % testimonials.length;
    displayTestimonials.push(testimonials[index]);
  }

  return (
    <section 
      className="py-16 bg-gray-50 dark:bg-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Testimoni Klien</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Apa yang dikatakan klien kami tentang layanan kami
        </p>
        
        <div className="relative">
          {/* Testimonial Cards with smooth transition */}
          <div 
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 transition-opacity duration-500"
          >
            {displayTestimonials.map((testimonial, index) => (
              <Card 
                key={`${testimonial.id}-${index}`} 
                className="p-6 flex flex-col transition-all duration-300 ease-in-out"
              >
                <div className="flex items-start mb-4">
                  <div className="mr-4 flex-shrink-0">
                    {testimonial.avatar_url ? (
                      <img 
                        src={testimonial.avatar_url} 
                        alt={testimonial.client_name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                        {testimonial.client_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg">{testimonial.client_name}</h4>
                    {testimonial.client_position && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {testimonial.client_position}
                      </p>
                    )}
                    {testimonial.company && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-auto italic flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (testimonial.rating || 0) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button 
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-6' // Active dot is wider 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={goToNext}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Auto-play indicator */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {paused ? 'Autoplay paused' : 'Autoplay enabled'}
        </div>
      </div>
    </section>
  );
}