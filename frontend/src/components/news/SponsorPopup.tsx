'use client';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function SponsorPopup() {
  const [sponsor, setSponsor] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    // Prevent showing the ad multiple times in the same session
    if (sessionStorage.getItem('bcn_sponsor_shown')) return;

    // Fetch the active sponsor data from your backend
    const fetchSponsor = async () => {
      try {
        const res = await api.get<any>('/sponsor');
        // If there is an active ad, display it
        if (res.data && res.data.isActive && res.data.imageUrl) {
          setSponsor(res.data);
          setShow(true);
          sessionStorage.setItem('bcn_sponsor_shown', 'true');
        }
      } catch (err) {
        console.log("No active sponsor found.");
      }
    };
    fetchSponsor();
  }, []);

  // 5-Second Countdown Timer Logic
  useEffect(() => {
    if (!show) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, timeLeft]);

  if (!show || !sponsor) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity"
      style={{ background: 'rgba(10,26,58,0.85)', backdropFilter: 'blur(8px)' }}>
      
      <div className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-500"
        style={{ border: '1px solid rgba(212,175,55,0.4)', background: '#0A0A0F' }}>
        
        {/* The Sponsor Image */}
        <a href={sponsor.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block">
          <img 
            src={sponsor.imageUrl} 
            alt={sponsor.title || "Sponsor"} 
            className="w-full h-auto max-h-[75vh] object-contain bg-black" 
          />
        </a>

        {/* The Skip/Close Button */}
        <div className="absolute top-4 right-4">
          <button
            disabled={timeLeft > 0}
            onClick={() => setShow(false)}
            className="text-white px-5 py-2.5 rounded-full text-sm font-bold backdrop-blur-md transition-all shadow-lg"
            style={{ 
              background: timeLeft > 0 ? 'rgba(0,0,0,0.6)' : 'linear-gradient(135deg, #D4AF37, #B8960C)',
              color: timeLeft > 0 ? '#94A3B8' : '#0A1A3A',
              border: timeLeft > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              cursor: timeLeft > 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {timeLeft > 0 ? `Wait ${timeLeft}s...` : '✕ Close Ad'}
          </button>
        </div>

        {/* Sponsor Label */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10">
          <p className="text-[10px] text-white/70 uppercase tracking-widest font-mono">Sponsored Content</p>
        </div>

      </div>
    </div>
  );
}