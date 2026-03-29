'use client';
import Link from 'next/link';
import Image from 'next/image';
// Use the @/ alias to cleanly import the logo from anywhere!
import logo from '@/components/layout/logo/log.png';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'radial-gradient(circle at top, #1A2E5A, #0A1A3A)' }}>

      {/* Gold ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 60%)',
      }} />

      {/* 404 Glassmorphism Card */}
      <div className="w-full max-w-md relative z-10 text-center"
        style={{
          background: 'rgba(15, 33, 71, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>

        {/* Logo */}
        <Link href="/" className="inline-block mb-6">
          <Image
            src={logo}
            alt="BCN"
            height={90}
            priority
            className="h-16 w-auto object-contain mx-auto"
          />
        </Link>
        
        {/* Gold divider */}
        <div style={{ 
            borderBottom: '1px solid rgba(212,175,55,0.3)', 
            width: '50%', 
            margin: '0 auto 24px' 
        }} />

        {/* 404 Error Text */}
        <h1 style={{
            fontFamily: 'var(--font-playfair), Playfair Display, Georgia, serif',
            fontSize: '80px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1, marginBottom: '1rem',
            textShadow: '0 4px 20px rgba(212,175,55,0.2)'
        }}>
          ৪০৪
        </h1>
        
        <p style={{
            fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.8)', fontFamily: 'monospace', marginBottom: '2.5rem'
        }}>
          এই পাতাটি পাওয়া যাচ্ছে না
        </p>

        {/* Return Home Button */}
        <Link href="/"
          className="inline-block"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
            color: '#0A1A3A', border: 'none', borderRadius: '8px',
            padding: '12px 28px', fontSize: '14px', fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.opacity = '0.9'; 
            e.currentTarget.style.transform = 'translateY(-2px)'; 
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.opacity = '1'; 
            e.currentTarget.style.transform = 'translateY(0)'; 
          }}
        >
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
}