'use client';

import { Service } from '@/lib/landing-page-db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Layanan Kami</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Kami menyediakan berbagai layanan digital untuk membantu mengembangkan bisnis Anda
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden flex flex-col h-full border rounded-lg">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2 flex justify-center">{service.icon_url}</div>
                <CardTitle className="text-xl text-center">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pb-6">
                <p className="text-muted-foreground text-center">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}