'use client';
import { useState } from 'react';
import Link from 'next/link';

interface FloatingAdProps {
  position?: 'bottom-left' | 'bottom-right';
  imageUrl: string;
  linkUrl: string;
}

export default function FloatingAd({ position = 'bottom-right', imageUrl, linkUrl }: FloatingAdProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !imageUrl || !linkUrl) return null;

  const positionClass = position === 'bottom-left' ? 'bottom-6 left-6' : 'bottom-6 right-6';

  return (
    <div className={`fixed ${positionClass} z-50 w-[250px] shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white transition-opacity duration-300`}>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10 transition-colors"
        aria-label="Close Ad"
      >
        ✕
      </button>
      <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
        <img 
          src={imageUrl} 
          alt="Floating Ad" 
          className="w-full h-auto min-h-[150px] object-cover"
          loading="lazy"
        />
      </Link>
    </div>
  );
}