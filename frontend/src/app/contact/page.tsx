'use client';
import { useState } from 'react';
import Link from 'next/link';


export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <>
      
      <main className="min-h-screen bg-[#0A0A0F]">
        {/* Hero */}
        <div className="bg-[#111118] border-b border-[#1E1E2E] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              যোগাযোগ করুন
            </h1>
            <p className="text-[#94A3B8] text-lg">আমাদের সাথে যোগাযোগ করতে নিচের ফর্মটি পূরণ করুন।</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="red-line mb-4">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>যোগাযোগের তথ্য</h2>
              </div>
              {[
                { icon: '📧', label: 'ইমেইল', value: 'contact@bengalchronicle.com' },
                { icon: '📍', label: 'ঠিকানা', value: 'কলকাতা, পশ্চিমবঙ্গ, ভারত' },
                { icon: '🕐', label: 'সময়', value: 'সোম–শনি, সকাল ৯টা – রাত ৬টা' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-[#64748B] text-xs uppercase tracking-wider">{item.label}</p>
                    <p className="text-[#E2E8F0] text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="bg-[#111118] border border-[#16A34A]/40 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-white font-bold text-lg mb-2">বার্তা পাঠানো হয়েছে!</h3>
                  <p className="text-[#64748B] text-sm mb-6">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="text-[#E53E3E] text-sm hover:underline"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-1.5">নাম *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="আপনার নাম"
                        className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-1.5">ইমেইল *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="আপনার ইমেইল"
                        className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-1.5">বিষয়</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="বার্তার বিষয়"
                      className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-1.5">বার্তা *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="আপনার বার্তা লিখুন..."
                      rows={5}
                      className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#E53E3E] text-white py-3 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    বার্তা পাঠান
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
     
    </>
  );
}