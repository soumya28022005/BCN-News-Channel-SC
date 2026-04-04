'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/components/layout/logo/log.png';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!form.name || !form.email || !form.message) {
      setError('অনুগ্রহ করে * চিহ্নিত ঘরগুলো পূরণ করুন।');
      return;
    }
    
    // API Call hobe ekhane bhabishote
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      {/* Hero Section */}
      <div className="bg-[#111118] border-b border-[#1E1E2E] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Integration */}
          <div className="mx-auto mb-8 flex justify-center">
            <Image
              src={logo}
              alt="BCN Logo"
              width={160}
              height={60}
              priority
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            যোগাযোগ করুন
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            আপনার মতামত, সংবাদ বা কোনো জিজ্ঞাসা থাকলে আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="space-y-8 bg-[#111118] border border-[#1E1E2E] p-8 rounded-xl h-fit">
            <div className="red-line mb-6">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>যোগাযোগের মাধ্যম</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { icon: '📧', label: 'ইমেইল', value: 'contact@bengalchronicle.com' },
                { icon: '📞', label: 'ফোন', value: '+91 98765 43210' },
                { icon: '📍', label: 'ঠিকানা', value: 'সেক্টর ৫, সল্টলেক, কলকাতা - ৭০০০৯১, পশ্চিমবঙ্গ, ভারত' },
                { icon: '🕐', label: 'অফিসের সময়', value: 'সোম–শনি, সকাল ৯টা – রাত ৮টা' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1E1E2E] flex items-center justify-center text-xl shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[#64748B] text-xs uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-[#E2E8F0] text-sm mt-1 leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="bg-[#111118] border border-[#16A34A]/30 rounded-xl p-12 text-center h-full flex flex-col justify-center">
                <div className="w-20 h-20 bg-[#16A34A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-white font-bold text-2xl mb-3">বার্তা সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-[#94A3B8] text-base mb-8 max-w-sm mx-auto">
                  আপনার বার্তার জন্য ধন্যবাদ। আমাদের প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="bg-[#1E1E2E] text-white px-6 py-2.5 rounded hover:bg-[#2E2E3E] transition-colors inline-block mx-auto font-medium"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-8 space-y-5">
                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-4 flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[#94A3B8] text-xs uppercase tracking-wider font-medium block mb-2">নাম *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="আপনার সম্পূর্ণ নাম"
                      className="w-full bg-[#0A0A0F] text-[#E2E8F0] placeholder-[#475569] border border-[#2E2E3E] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] focus:ring-1 focus:ring-[#E53E3E] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs uppercase tracking-wider font-medium block mb-2">ইমেইল *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="আপনার ইমেইল অ্যাড্রেস"
                      className="w-full bg-[#0A0A0F] text-[#E2E8F0] placeholder-[#475569] border border-[#2E2E3E] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] focus:ring-1 focus:ring-[#E53E3E] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs uppercase tracking-wider font-medium block mb-2">বিষয়</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="আপনি কি বিষয়ে কথা বলতে চান?"
                    className="w-full bg-[#0A0A0F] text-[#E2E8F0] placeholder-[#475569] border border-[#2E2E3E] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] focus:ring-1 focus:ring-[#E53E3E] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs uppercase tracking-wider font-medium block mb-2">বার্তা *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="আপনার বিস্তারিত বার্তা এখানে লিখুন..."
                    rows={6}
                    className="w-full bg-[#0A0A0F] text-[#E2E8F0] placeholder-[#475569] border border-[#2E2E3E] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] focus:ring-1 focus:ring-[#E53E3E] transition-all resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#E53E3E] text-white py-3.5 rounded-lg text-sm font-bold tracking-wide hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/30 transition-all mt-2"
                >
                  বার্তা পাঠান
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}