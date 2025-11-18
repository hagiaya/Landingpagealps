'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ClientLocation } from '@/lib/landing-page-db';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  locations: ClientLocation[];
}

export default function OpenStreetMap({ locations }: OpenStreetMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<ClientLocation | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.200000, 106.816666]);
  const [zoom, setZoom] = useState(6);

  // Calculate map center and zoom based on locations
  useEffect(() => {
    if (locations.length === 0) {
      // Default to Jakarta if no locations
      setMapCenter([-6.200000, 106.816666]);
      setZoom(6);
      return;
    }

    if (locations.length === 1 && locations[0].latitude && locations[0].longitude) {
      // If only one location, center on it
      setMapCenter([locations[0].latitude!, locations[0].longitude!]);
      setZoom(10); // Zoom in for single location
      return;
    }

    // Multiple locations - calculate bounds
    const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
    if (validLocations.length === 0) {
      // If no valid locations, default to Jakarta
      setMapCenter([-6.200000, 106.816666]);
      setZoom(6);
      return;
    }

    if (validLocations.length === 1) {
      // If only one valid location after filtering
      setMapCenter([validLocations[0].latitude!, validLocations[0].longitude!]);
      setZoom(10);
      return;
    }

    // Multiple valid locations - fit bounds
    const lats = validLocations.map(loc => loc.latitude).filter(Boolean) as number[];
    const lngs = validLocations.map(loc => loc.longitude).filter(Boolean) as number[];
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    setMapCenter([centerLat, centerLng]);
    
    // Calculate appropriate zoom level based on the extent
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    // Rough calculation for zoom level
    let newZoom = 13 - Math.log2(maxDiff * 100);
    newZoom = Math.max(6, Math.min(12, Math.round(newZoom)));
    setZoom(newZoom);
  }, [locations]);

  // Create custom icon for selected markers
  const selectedIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `
      <div class="relative flex flex-col items-center">
        <div class="absolute -top-4 -left-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center transform rotate-45"></div>
        <div class="relative z-10 bg-red-500 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

  const defaultIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `
      <div class="relative flex flex-col items-center">
        <div class="absolute -top-4 -left-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transform rotate-45"></div>
        <div class="relative z-10 bg-blue-500 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
  });

  return (
    <div className="w-full h-[500px] relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {locations.map((location) => {
          if (!location.latitude || !location.longitude) return null;
          
          const position: [number, number] = [location.latitude!, location.longitude!];
          
          return (
            <Marker
              key={location.id}
              position={position}
              icon={selectedLocation?.id === location.id ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => setSelectedLocation(location),
              }}
            >
              <Popup>
                <div className="font-bold">{location.client_name}</div>
                <div className="text-sm">{location.address}</div>
                {location.location_description && (
                  <div className="text-xs mt-1 text-gray-600">{location.location_description}</div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

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
  );
}