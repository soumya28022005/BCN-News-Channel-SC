import Link from 'next/link';

interface SidebarAdProps {
  imageUrl: string;
  linkUrl: string;
}

export default function SidebarAd({ imageUrl, linkUrl }: SidebarAdProps) {
  // If admin disables the ad or leaves it blank, render nothing
  if (!imageUrl || !linkUrl) return null; 

  return (
    <div className="hidden lg:block sticky top-24 w-full max-w-[300px] h-[600px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <span className="absolute top-0 left-0 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-br-md z-10 uppercase font-semibold tracking-wider">
        Advertisement
      </span>
      {/* 🔹 Opens in New Tab securely */}
      <Link href={linkUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
        <img 
          src={imageUrl} 
          alt="Sidebar Ad" 
          className="w-full h-full object-cover"
          loading="lazy" // 🔹 Lazy load to protect SEO/Performance
        />
      </Link>
    </div>
  );
}