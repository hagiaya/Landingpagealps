'use client';

import { ClientLocation } from '@/lib/landing-page-db';
import ClientLocationsMap from '@/components/ClientLocationsMap';

interface ClientLocationsSectionProps {
  locations: ClientLocation[];
}

export default function ClientLocationsSection({ locations }: ClientLocationsSectionProps) {
  if (locations.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Lokasi Klien Kami</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Kami telah melayani klien dari berbagai wilayah
        </p>
        
        <div className="max-w-6xl mx-auto">
          <ClientLocationsMap locations={locations} />
        </div>
      </div>
    </section>
  );
}