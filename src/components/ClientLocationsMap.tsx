'use client';

import { ClientLocation } from '@/lib/landing-page-db';
import dynamic from 'next/dynamic';

interface ClientLocationsMapProps {
  locations: ClientLocation[];
}

const ClientOpenStreetMap = dynamic(() => import('@/components/ClientOpenStreetMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function ClientLocationsMap({ locations }: ClientLocationsMapProps) {
  return <ClientOpenStreetMap locations={locations} />;
}