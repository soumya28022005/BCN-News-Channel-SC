'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🔹 FIX 1: Router import করা হলো
import { api } from '../../../lib/api';
import { Radio, Save, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TickerSettingsPage() {
  const router = useRouter(); // 🔹 FIX 2: Router initialize করা হলো
  const [tickerText, setTickerText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCurrentTicker = async () => {
      try {
        const res = await api.get<any>('/settings/HEADER_TICKER_TEXT');
        if (res?.data?.value || res?.value) {
           setTickerText(res.data?.value || res.value);
        }
      } catch (err) {
        console.log("No ticker found or error loading");
      }
    };
    fetchCurrentTicker();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await api.post('/settings', {
        key: 'HEADER_TICKER_TEXT',
        value: tickerText,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000); // ৪ সেকেন্ড পর সাকসেস মেসেজ হাইড হবে
    } catch (err) {
      alert('আপডেট করতে সমস্যা হয়েছে!');
    }
    setLoading(false);
  };

  return (
    <>
      {/* 🔹 লাইভ প্রিভিউ স্ক্রলিং এর জন্য অ্যানিমেশন */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-preview {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll-preview {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-preview 15s linear infinite;
        }
      `}} />

      {/* 🔹 FIXED INSET-0 Z-50 দেওয়া হলো যাতে পেছনের গ্লোবাল Header-কে এই পেজটা কভার করে নেয় */}
      <div className="fixed inset-0 z-50 flex flex-col font-bangla overflow-hidden" 
           style={{ background: 'radial-gradient(circle at top, #1A2E5A, #0A1A3A)' }}>
        
        {/* Ambient Gold Glow Background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 60%)',
        }} />

        {/* 🔹 Ticker Header Section */}
        <header className="px-8 py-4 sticky top-0 z-20 flex items-center justify-between"
          style={{
            background: 'rgba(10,26,58,0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(212,175,55,0.15)'
          }}>
          
          {/* 🔹 FIX 3: Back Button Added Here */}
          <div className="flex items-center gap-4">
            <span 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors text-sm font-bold cursor-pointer select-none bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20"
            >
              ← ফিরে যান
            </span>
            <h2 className="text-white font-bold hidden md:block tracking-widest text-sm border-l border-[#D4AF37]/30 pl-4" style={{ fontFamily: 'monospace' }}>
              BCN SECURE
            </h2>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#D4AF37' }} />
            <p className="text-sm font-bold tracking-widest" style={{ color: '#D4AF37', fontFamily: 'monospace' }}>
              SECURE PANEL
            </p>
          </div>
        </header>

        {/* 🔹 Content Area with Scroll */}
        <div className="flex-1 overflow-y-auto z-10 p-8 max-w-6xl mx-auto w-full">
          {/* 🔹 Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              <Radio className="text-[#D4AF37] animate-pulse" size={32} />
              ফ্ল্যাশ নিউজ ম্যানেজমেন্ট
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(122,134,182,0.8)' }}>
              ওয়েবসাইটের মেনুবারের লাইভ ব্রেকিং নিউজ এবং স্পেশাল অ্যানাউন্সমেন্ট আপডেট করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* 🔹 Left Column: Editor Form (60%) */}
            <div className="md:col-span-3">
              <div className="rounded-2xl p-8 relative overflow-hidden transition-all shadow-2xl"
                   style={{ 
                     background: 'rgba(15, 33, 71, 0.6)', 
                     backdropFilter: 'blur(16px)', 
                     border: '1px solid rgba(212,175,55,0.2)' 
                   }}>
                
                {/* Background Ambient Glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none"></div>

                <form onSubmit={handleUpdate} className="relative z-10 space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3 tracking-wide uppercase" style={{ fontFamily: 'monospace' }}>
                      <AlertCircle size={16} className="text-[#D4AF37]" />
                      নতুন ব্রেকিং নিউজ টেক্সট
                    </label>
                    <textarea
                      value={tickerText}
                      onChange={(e) => setTickerText(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-5 py-4 bg-[#0A1A3A]/80 border border-[rgba(212,175,55,0.2)] rounded-xl text-white text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder-gray-500 shadow-inner"
                      placeholder="যেমন: আজ রাত ৮টায় বিশেষ লাইভ সম্প্রচার..."
                    />
                    <div className="flex justify-between items-center mt-2 flex-wrap gap-1">
                      <span className="text-xs text-gray-400">সর্বোচ্চ ভিজিবিলিটির জন্য ছোট ও আকর্ষণীয় বাক্য ব্যবহার করুন।</span>
                      <span className={`text-xs font-mono ${tickerText.length > 100 ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                        {tickerText.length} অক্ষর
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 flex items-center justify-center gap-2 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    style={{ 
                      background: 'linear-gradient(135deg, #D4AF37, #B8960C)', 
                      color: '#0A1A3A' 
                  }}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#0A1A3A] border-t-transparent rounded-full animate-spin" />
                        আপডেট হচ্ছে...
                      </span>
                    ) : success ? (
                      <span className="flex items-center gap-2 text-green-900">
                        <CheckCircle2 size={22} /> আপডেট সফল!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save size={22} /> লাইভ করুন
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* 🔹 Right Column: Live Preview (40%) */}
            <div className="md:col-span-2">
              <div className="rounded-2xl p-6 h-full flex flex-col shadow-2xl"
                   style={{ 
                     background: 'rgba(10, 26, 58, 0.8)', 
                     border: '1px dashed rgba(212,175,55,0.3)' 
                   }}>
                
                <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
                  <Eye size={20} />
                  <h3 className="text-lg font-bold">লাইভ প্রিভিউ</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4">
                  <p className="text-sm text-gray-400 text-center mb-2">
                    ওয়েবসাইটে ঠিক এইরকম ভাবে স্ক্রল হবে:
                  </p>

                  {/* 🔹 Mock Header Bar for Preview */}
                  <div className="w-full bg-[#0f172a] border border-gray-700 rounded-full h-12 flex items-center overflow-hidden relative shadow-inner">
                    {/* Mock LIVE Label */}
                    <div className="absolute left-0 z-10 h-full flex items-center px-4 rounded-r-full shadow-[2px_0_10px_rgba(0,0,0,0.5)]" style={{ background: '#DC2626' }}>
                       <span className="text-white text-[10px] font-bold tracking-widest flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                         ফ্ল্যাশ
                       </span>
                    </div>
                    
                    {/* Scrolling Text Preview */}
                    <div className="flex-1 overflow-hidden ml-20 relative h-full flex items-center">
                      <span className="animate-scroll-preview text-sm font-medium text-white">
                        {tickerText || 'আপনার টেক্সট এখানে দেখাবে...'} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {tickerText || 'আপনার টেক্সট এখানে দেখাবে...'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}