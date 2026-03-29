'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import logo from '../../../components/layout/logo/log.png'; 

export default function SecretLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('ইমেইল ও পাসওয়ার্ড দিন');
      return;
    }
    setError('');
    const result = await login(email, password);
    if (result.success) {
      router.push('/newsroom-bcn-2024');
    } else {
      setError('ইমেইল বা পাসওয়ার্ড ভুল');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'radial-gradient(circle at top, #1A2E5A, #0A1A3A)' }}>

      {/* Gold ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 60%)',
      }} />

      {/* Top status bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,26,58,0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
        padding: '6px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div className="flex items-center gap-2">
          <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#D4AF37' }} />
          <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            BCN SECURE PANEL
          </span>
        </div>
        <Link href="/"
          style={{ color: 'rgba(212,175,55,0.5)', fontSize: '10px', fontFamily: 'monospace' }}
          className="hover:text-[var(--gold)] transition-colors">
          ← হোমপেজ
        </Link>
      </div>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10 mt-8"
        style={{
          background: 'rgba(15, 33, 71, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <Image
              src={logo}
              alt="BCN"
              height={90}
              priority
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Playfair Display, Georgia, serif',
            fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: 4,
          }}>লগইন করুন</h1>
          <p style={{
            fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.7)', fontFamily: 'monospace',
          }}>Admin Panel</p>
        </div>

        {/* Gold divider */}
        <div className="gold-line mb-6" />

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.3)',
            color: '#FCA5A5',
            fontSize: '13px', padding: '10px 14px',
            borderRadius: '8px', marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label style={{
            display: 'block', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.8)', marginBottom: 6, fontFamily: 'monospace',
          }}>ইমেইল</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="admin@bengalchronicle.com"
            style={{
              width: '100%', background: 'rgba(10,26,58,0.6)',
              color: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
              outline: 'none', transition: 'border-color 0.2s',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label style={{
            display: 'block', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.8)', marginBottom: 6, fontFamily: 'monospace',
          }}>পাসওয়ার্ড</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            style={{
              width: '100%', background: 'rgba(10,26,58,0.6)',
              color: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
              outline: 'none', transition: 'border-color 0.2s',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: '100%',
            background: isLoading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #D4AF37, #B8960C)',
            color: '#0A1A3A', border: 'none', borderRadius: '8px',
            padding: '12px', fontSize: '15px', fontWeight: 700,
            fontFamily: 'inherit', cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s, transform 0.15s',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => { if (!isLoading) (e.currentTarget.style.opacity = '0.9'); }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: '#0A1A3A', borderTopColor: 'transparent' }} />
              লগইন হচ্ছে...
            </span>
          ) : 'লগইন'}
        </button>

        <div className="text-center mt-5">
          <Link href="/"
            style={{ color: 'rgba(122,134,182,0.7)', fontSize: '11px', fontFamily: 'monospace' }}
            className="hover:text-[var(--gold)] transition-colors">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}