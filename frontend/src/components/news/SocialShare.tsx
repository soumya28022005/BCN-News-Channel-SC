'use client';
interface SocialShareProps {
  title: string;
  url?: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: 'Facebook', color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { label: 'Twitter', color: '#1DA1F2', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodedTitle}%20${encoded}` },
  ];

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-xs text-[#64748B] uppercase tracking-wider">শেয়ার করুন:</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: l.color }}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}