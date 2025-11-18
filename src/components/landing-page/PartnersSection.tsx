'use client';

import { Partner } from '@/lib/landing-page-db';
import { Card, CardContent } from '@/components/ui/card';

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  if (partners.length === 0) return null;

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Klien Kami</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center justify-center p-4">
              {partner.logo_url ? (
                <a 
                  href={partner.website_url || '#'} 
                  target={partner.website_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="block flex items-center justify-center w-full"
                >
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="h-12 sm:h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300 max-h-14 max-w-full"
                  />
                </a>
              ) : (
                <Card className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                  <span className="text-xs text-center">{partner.name.charAt(0)}</span>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}