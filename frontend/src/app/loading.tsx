import Image from 'next/image';
// Using the @/ alias so the path never breaks!
import logo from '@/components/layout/logo/log.png';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'radial-gradient(circle at top, #1A2E5A, #0A1A3A)' }}>

      {/* Gold ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 60%)',
      }} />

      {/* Glassmorphism Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-10 min-w-[250px]"
        style={{
          background: 'rgba(15, 33, 71, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>

        {/* Pulsing Logo */}
        <div className="animate-pulse mb-6">
          <Image
            src={logo}
            alt="BCN Loading..."
            height={80}
            priority
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Custom Gold Spinner & Text */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }} />
          <p style={{
            color: 'rgba(212,175,55,0.9)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            fontFamily: 'monospace',
            textTransform: 'uppercase'
          }}>
            লোড হচ্ছে...
          </p>
        </div>
        
      </div>
    </div>
  );
}