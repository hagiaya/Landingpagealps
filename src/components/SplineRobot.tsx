'use client';

import { useState, useEffect } from 'react';

interface SplineRobotProps {
  className?: string;
}

export default function SplineRobot({ className }: SplineRobotProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-xl`}>
        <div className="text-center text-gray-500">
          <div className="animate-pulse mb-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
          </div>
          <p className="text-sm">Memuat 3D Robot...</p>
        </div>
      </div>
    );
  }

  // Fallback to iframe with the original working URL
  return (
    <div className={`${className} overflow-hidden rounded-xl relative`}>
      <iframe 
        src="https://my.spline.design/genkubgreetingrobot-cnDtE9NOWkeYNF0qyZBt3AYJ/" 
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking;"
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          border: 'none'
        }}
        title="3D Robot Animation"
      />
    </div>
  );
}