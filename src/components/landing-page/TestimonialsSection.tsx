'use client';

import { Testimonial } from '@/lib/landing-page-db';
import TestimonialMarquee from './TestimonialMarquee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  // Calculate client count - using actual testimonials count with realistic minimum
  const clientCount = testimonials.length > 0 ? Math.max(326, testimonials.length) : 326;

  return (
    <>
      {/* Trusted Clients Section */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground mb-4">
              Telah dipercaya oleh
            </h3>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {clientCount.toLocaleString()}+ Klien
            </div>
            
            {/* Client Avatars */}
            <div className="flex justify-center items-center flex-wrap gap-1 md:gap-2">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={`avatar-${testimonial.id}-${index}`} className="flex -space-x-4 z-10">
                  <Avatar className="border-2 border-white dark:border-gray-800 w-12 h-12">
                    {testimonial.avatar_url ? (
                      <AvatarImage 
                        src={testimonial.avatar_url} 
                        alt={testimonial.client_name} 
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-sm">
                        {testimonial.client_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              ))}
              {/* Show + icon to represent additional clients */}
              <div className="flex -space-x-4 z-0">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-white dark:border-gray-800 z-20">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialMarquee testimonials={testimonials} />
    </>
  );
}