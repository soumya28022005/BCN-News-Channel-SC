import Link from 'next/link';
import Image from 'next/image';
import logo from '@/components/layout/logo/log.png'; // Make sure this path is correct

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      {/* Hero Section */}
      <div className="bg-[#111118] border-b border-[#1E1E2E] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Updated: Using the log.png instead of the red box */}
          <div className="mx-auto mb-8 flex justify-center">
            <Image
              src={logo}
              alt="BCN Logo"
              width={160} // Set appropriate width for prominent display
              height={60} // Standard placeholder height, Tailwind handles aspect ratio
              priority // Loads this image faster as it's above the fold
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            আমাদের সম্পর্কে
          </h1>
          <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            বাংলার মানুষের কাছে সত্যিকারের, নির্ভুল এবং বিশ্লেষণমূলক সংবাদ পৌঁছে দেওয়ার লক্ষ্যে আমাদের এই অবিরাম যাত্রা।
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <section className="mb-16 bg-[#111118] border border-[#1E1E2E] rounded-xl p-8">
          <div className="red-line mb-6">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          </div>
          <div className="space-y-4 text-[#94A3B8] leading-relaxed text-lg">
            <p>
              The Bengal Chronicle Network (BCN) হলো বাংলার একটি আধুনিক ও নির্ভরযোগ্য ডিজিটাল সংবাদ মাধ্যম। আমরা গভীরভাবে বিশ্বাস করি যে, একটি সুস্থ সমাজের ভিত্তি হলো সত্যিকারের ও সৎ সাংবাদিকতা। আমাদের প্রধান লক্ষ্য হলো নিরপেক্ষ, তথ্যভিত্তিক এবং দায়িত্বশীল সংবাদ পরিবেশন করা যা মানুষের দৈনন্দিন জীবনে ইতিবাচক প্রভাব ফেলে।
            </p>
            <p>
              আমরা শুধুমাত্র খবর পড়ি না, খবরের পিছনের খবরটি তুলে ধরি। বাংলার রাজনীতি, সংস্কৃতি, খেলাধুলা, ব্যবসা এবং প্রযুক্তি সহ দেশ-বিদেশের সব বিষয়ে গভীর ও বিশ্লেষণমূলক প্রতিবেদন প্রকাশ করাই আমাদের অঙ্গীকার।
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="red-line mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>আমাদের মূল নীতি</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚖️', title: 'নিরপেক্ষতা', desc: 'যেকোনো রাজনৈতিক বা আর্থিক প্রভাব থেকে সম্পূর্ণ মুক্ত থেকে সত্যনিষ্ঠ সংবাদ পরিবেশন।' },
              { icon: '🔍', title: 'তথ্যভিত্তিক যাচাই', desc: 'প্রতিটি সংবাদ একাধিক সোর্স থেকে যাচাই করে, সঠিক তথ্য-প্রমাণের ভিত্তিতে প্রকাশ করা হয়।' },
              { icon: '🤝', title: 'দায়িত্বশীলতা', desc: 'আমাদের পাঠকদের কাছে সর্বদা সৎ, স্বচ্ছ ও দায়িত্বশীল থাকা আমাদের প্রধান প্রতিশ্রুতি।' },
            ].map((v) => (
              <div key={v.title} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-8 hover:border-[#E53E3E]/50 transition-colors duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-white text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-[#64748B] text-base leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Call to action */}
        <div className="text-center bg-[#111118] border border-[#1E1E2E] py-12 px-6 rounded-xl">
          <h3 className="text-2xl font-bold text-white mb-4">আমাদের সাথে যুক্ত হোন</h3>
          <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">আপনার কোনো খবর বা মতামত জানাতে চাইলে আমাদের সাথে সরাসরি যোগাযোগ করতে পারেন।</p>
          <Link href="/contact" className="inline-block bg-[#E53E3E] text-white px-10 py-3.5 rounded font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/30 transition-all">
            যোগাযোগ করুন
          </Link>
        </div>
      </div>
    </main>
  );
}