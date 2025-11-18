'use client';

import { useEffect, useRef, useState } from 'react';
import { Testimonial } from '@/lib/landing-page-db';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
}

export default function TestimonialMarquee({ testimonials }: TestimonialMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current || testimonials.length === 0) return;

    const container = containerRef.current;
    let animationFrameId: number;

    const animate = () => {
      // Move the content to the left (right-to-left scrolling)
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        // Reset to beginning to create continuous effect
        container.scrollLeft = 0;
      } else {
        // Move a small amount to the right
        container.scrollLeft += 1;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMounted, testimonials]);

  // Duplicate testimonials to create infinite scrolling effect only on the client
  const duplicatedTestimonials = isMounted ? [...testimonials, ...testimonials] : testimonials;

  if (testimonials.length === 0) return null;

  return (
    <div id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Testimoni Klien</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Apa yang dikatakan klien kami tentang layanan kami
        </p>
        
        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${index}`} 
                className="mx-2 flex-shrink-0 w-64 sm:w-72"
              >
                <Card className="h-full flex flex-col p-4 sm:p-5 border rounded-lg">
                  <div className="flex items-start mb-4">
                    <div className="mr-4 flex-shrink-0">
                      {testimonial.avatar_url ? (
                        <img 
                          src={testimonial.avatar_url} 
                          alt={testimonial.client_name} 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white text-sm sm:text-base">
                          {testimonial.client_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base sm:text-lg truncate">{testimonial.client_name}</h4>
                      {testimonial.client_position && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                          {testimonial.client_position}
                        </p>
                      )}
                      {testimonial.company && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground italic flex-grow mb-4 text-sm">
                    "{testimonial.content}"
                  </p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < (testimonial.rating || 0) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}