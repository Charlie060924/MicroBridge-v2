"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fallbackIcon?: React.ReactNode;
  fallbackBg?: string;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackIcon = <User className="h-1/2 w-1/2 text-white" />,
  fallbackBg = 'bg-gradient-to-br from-blue-500 to-purple-600',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div
        className={`${fallbackBg} rounded-full flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
      )}
    </div>
  );
}

// Predefined sizes for common use cases
export const ImageSizes = {
  avatar: {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 },
    xlarge: { width: 96, height: 96 },
  },
  thumbnail: {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 200, height: 200 },
  },
} as const;

// Convenience components for common use cases
export function Avatar({
  src,
  alt,
  size = 'medium',
  className = '',
  priority = false,
}: {
  src?: string;
  alt: string;
  size?: keyof typeof ImageSizes.avatar;
  className?: string;
  priority?: boolean;
}) {
  const dimensions = ImageSizes.avatar[size];
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority={priority}
      sizes="48px"
    />
  );
}

export function Thumbnail({
  src,
  alt,
  size = 'medium',
  className = '',
  priority = false,
}: {
  src?: string;
  alt: string;
  size?: keyof typeof ImageSizes.thumbnail;
  className?: string;
  priority?: boolean;
}) {
  const dimensions = ImageSizes.thumbnail[size];
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority={priority}
      sizes="120px"
    />
  );
}

