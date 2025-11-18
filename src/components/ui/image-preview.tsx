'use client';

import React, { useState, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import Lottie from 'lottie-react';
import { imagePlaceholderAnimation } from '@/lib/lottie/image-placeholder-data';
import { loadingSpinnerAnimation } from '@/lib/lottie/loading-spinner-data';

interface ImagePreviewProps {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  onImageChange?: (url: string) => void;
}

export function ImagePreview({ 
  id, 
  name, 
  label, 
  defaultValue = '', 
  placeholder = 'https://example.com/image.jpg',
  onImageChange
}: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If it's a valid URL, show loading state
    if (value && isValidUrl(value)) {
      setIsLoading(true);
      setHasError(false);
    } else if (!value) {
      setIsLoading(false);
      setHasError(false);
    }
    
    setImageUrl(value);
    if (onImageChange) {
      onImageChange(value);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const triggerInputChange = () => {
    if (inputRef.current) {
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            id={id}
            name={name}
            type="url"
            value={imageUrl}
            onChange={handleInputChange}
            placeholder={placeholder}
            onBlur={triggerInputChange} // Trigger change when user moves away from input
            ref={inputRef}
          />
        </div>
      </div>
      
      {/* Animated Preview Area */}
      <div className="mt-3">
        <Label>Preview</Label>
        <div className="relative mt-2 overflow-hidden w-full max-w-md aspect-video flex items-center justify-center">
          {(!imageUrl || hasError) && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lottie 
                animationData={imagePlaceholderAnimation} 
                loop={true}
                autoplay={true}
                className="w-full h-full"
              />
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lottie 
                animationData={loadingSpinnerAnimation} 
                loop={true}
                autoplay={true}
                className="w-full h-full"
              />
            </div>
          )}
          
          {imageUrl && !hasError && !isLoading && (
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-contain" // Changed to object-contain to show the full image without cropping
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          
          {hasError && !isLoading && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <p className="text-sm text-muted-foreground">Image could not be loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}