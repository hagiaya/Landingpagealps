'use client';

import { useState, useEffect } from 'react';
import { ClientLocation } from '@/lib/landing-page-db';
import { MapPin } from 'lucide-react';

interface InteractiveMapProps {
  locations: ClientLocation[];
}

export default function InteractiveMap({ locations }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<ClientLocation | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -6.200000, lng: 106.816666 }); // Jakarta as default

  // Set map center to the first location if available
  useEffect(() => {
    if (locations.length > 0 && locations[0].latitude && locations[0].longitude) {
      setMapCenter({
        lat: locations[0].latitude,
        lng: locations[0].longitude
      });
    }
  }, [locations]);

  // Calculate map bounds to fit all locations
  useEffect(() => {
    if (locations.length > 0) {
      const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
      if (validLocations.length > 0) {
        const lats = validLocations.map(loc => loc.latitude).filter(Boolean) as number[];
        const lngs = validLocations.map(loc => loc.longitude).filter(Boolean) as number[];
        
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        
        setMapCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }, [locations]);

  // Function to calculate distance between two points (for clustering effect)
  const calculateDistance = (loc1: ClientLocation, loc2: ClientLocation) => {
    if (!loc1.latitude || !loc1.longitude || !loc2.latitude || !loc2.longitude) {
      return Infinity;
    }
    
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  return (
    <div className="w-full h-[500px] relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      {/* Map container with a background that simulates a map */}
      <div 
        className="w-full h-full relative bg-blue-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(120, 180, 240, 0.1) 0%, transparent 20%),
            radial-gradient(circle at 85% 30%, rgba(120, 220, 180, 0.1) 0%, transparent 20%),
            linear-gradient(to bottom, #e0f0ff 0%, #d0e8ff 100%)
          `,
        }}
      >
        {/* Simulated roads */}
        <div className="absolute inset-0">
          {/* Horizontal roads */}
          <div className="absolute top-1/4 w-full h-0.5 bg-gray-400 opacity-30"></div>
          <div className="absolute top-1/2 w-full h-0.5 bg-gray-400 opacity-30"></div>
          <div className="absolute top-3/4 w-full h-0.5 bg-gray-400 opacity-30"></div>
          
          {/* Vertical roads */}
          <div className="absolute left-1/4 h-full w-0.5 bg-gray-400 opacity-30"></div>
          <div className="absolute left-1/2 h-full w-0.5 bg-gray-400 opacity-30"></div>
          <div className="absolute left-3/4 h-full w-0.5 bg-gray-400 opacity-30"></div>
        </div>

        {/* Location markers */}
        {locations.map((location) => {
          if (!location.latitude || !location.longitude) return null;

          // Calculate relative position (simplified for demo purposes)
          // In a real implementation, we'd use a proper projection
          const relativeX = ((location.longitude - mapCenter.lng) * 100) + 50; // Center is 50%
          const relativeY = ((mapCenter.lat - location.latitude) * 100) + 50; // Inverted because latitude decreases as we go down

          return (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all duration-200 ${
                selectedLocation?.id === location.id ? 'z-20 scale-125' : ''
              }`}
              style={{
                left: `${Math.max(5, Math.min(95, relativeX))}%`,
                top: `${Math.max(5, Math.min(95, relativeY))}%`,
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div className={`
                flex flex-col items-center transition-all duration-200
                ${selectedLocation?.id === location.id ? 'animate-bounce' : ''}
              `}>
                <MapPin 
                  className={`
                    h-8 w-8 text-red-500 drop-shadow-lg
                    ${selectedLocation?.id === location.id 
                      ? 'text-red-700 h-10 w-10' 
                      : 'hover:text-red-600'}
                  `}
                />
                <div 
                  className={`
                    mt-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap
                    ${selectedLocation?.id === location.id
                      ? 'bg-primary text-primary-foreground shadow-md scale-100'
                      : 'bg-white text-gray-800 shadow opacity-0 scale-0'}
                    transition-all duration-300
                  `}
                >
                  {location.client_name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Map controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Selected location info panel */}
        {selectedLocation && (
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-30">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-bold">{selectedLocation.client_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                {selectedLocation.location_description && (
                  <p className="text-sm mt-1">{selectedLocation.location_description}</p>
                )}
                <button 
                  className="mt-2 text-sm text-primary hover:underline"
                  onClick={() => setSelectedLocation(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}