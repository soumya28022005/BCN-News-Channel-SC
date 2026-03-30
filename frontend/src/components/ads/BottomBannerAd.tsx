'use client';
import { useState } from 'react';
import Link from 'next/link';

interface BottomBannerProps {
  imageUrl: string;
  linkUrl: string;
}

export default function BottomBannerAd({ imageUrl, linkUrl }: BottomBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // If no image is provided by admin, or user closed it, do not render anything
  if (!isVisible || !imageUrl || !linkUrl) return null;

  return (
    <>
      {/* 🔹 FIX: Invisible spacer so the fixed banner doesn't cover your footer/content */}
      <div className="h-[90px] w-full shrink-0" aria-hidden="true" />
      
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex justify-center py-2 px-4 transition-transform">
        <div className="relative w-full max-w-[728px] h-[90px] bg-gray-100 rounded-md overflow-hidden">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs z-10 border border-gray-300 shadow-sm"
            aria-label="Close Ad"
          >
            ✕
          </button>
          <Link href={linkUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
            <img 
              src={imageUrl} 
              alt="Advertisement" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </>
  );
}