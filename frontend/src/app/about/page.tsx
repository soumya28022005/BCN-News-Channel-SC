import Link from 'next/link';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0F]">
        {/* Hero */}
        <div className="bg-[#111118] border-b border-[#1E1E2E] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-xl rounded-sm mx-auto mb-6">
              BCN
            </div>
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              আমাদের সম্পর্কে
            </h1>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              বাংলার মানুষের কাছে সত্যিকারের সংবাদ পৌঁছে দেওয়ার লক্ষ্যে আমাদের যাত্রা শুরু হয়েছে।
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Mission */}
          <section className="mb-12">
            <div className="red-line mb-4">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>আমাদের লক্ষ্য</h2>
            </div>
            <p className="text-[#94A3B8] leading-relaxed mb-4">
              The Bengal Chronicle Network (BCN) হলো বাংলার একটি আধুনিক ডিজিটাল সংবাদ মাধ্যম। আমরা বিশ্বাস করি যে সত্যিকারের সাংবাদিকতা সমাজের ভিত্তি। আমাদের লক্ষ্য হলো নিরপেক্ষ, তথ্যভিত্তিক এবং দায়িত্বশীল সংবাদ পরিবেশন করা।
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
              আমরা বাংলার রাজনীতি, সংস্কৃতি, খেলাধুলা, ব্যবসা, প্রযুক্তি সহ সব বিষয়ে গভীর ও বিশ্লেষণমূলক প্রতিবেদন প্রকাশ করি।
            </p>
          </section>

          {/* Values */}
          <section className="mb-12">
            <div className="red-line mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>আমাদের মূল্যবোধ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '⚖️', title: 'নিরপেক্ষতা', desc: 'রাজনৈতিক বা আর্থিক প্রভাব থেকে মুক্ত, সত্যনিষ্ঠ সংবাদ পরিবেশন।' },
                { icon: '🔍', title: 'তথ্যভিত্তিক', desc: 'প্রতিটি সংবাদ যাচাই করে, তথ্য-প্রমাণের ভিত্তিতে প্রকাশ করা হয়।' },
                { icon: '🤝', title: 'দায়িত্বশীলতা', desc: 'পাঠকদের কাছে সৎ ও দায়িত্বশীল থাকা আমাদের প্রতিশ্রুতি।' },
              ].map((v) => (
                <div key={v.title} className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-6">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="text-white font-bold mb-2">{v.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mb-12">
            <div className="red-line mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>আমাদের দল</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Rahul Banerjee', role: 'Senior Political Correspondent', initial: 'R' },
                { name: 'Priya Sen', role: 'Chief Reporter', initial: 'P' },
              ].map((member) => (
                <div key={member.name} className="flex items-center gap-4 bg-[#111118] border border-[#1E1E2E] rounded-lg p-4">
                  <div className="w-12 h-12 rounded-full bg-[#E53E3E] flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {member.initial}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{member.name}</h4>
                    <p className="text-[#E53E3E] text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Link href="/contact" className="inline-block bg-[#E53E3E] text-white px-8 py-3 rounded text-sm hover:bg-red-700 transition-colors">
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}