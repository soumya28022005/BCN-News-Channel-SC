import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#06060A] border-t border-[#1E1E2E] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm">BCN</div>
              <span className="font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>The Bengal Chronicle Network</span>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed">
              বাংলার মানুষের কাছে সত্যিকারের সংবাদ পৌঁছে দেওয়ার লক্ষ্যে আমাদের যাত্রা।
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">বিভাগ</h4>
            <ul className="space-y-2">
              {['বাংলা', 'রাজনীতি', 'ক্রীড়া', 'বিনোদন', 'ব্যবসা', 'প্রযুক্তি'].map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${cat}`} className="text-[#64748B] hover:text-[#E53E3E] text-sm transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">আমাদের সম্পর্কে</h4>
            <ul className="space-y-2">
              {[['আমাদের সম্পর্কে', '/about'], ['যোগাযোগ', '/contact'], ['বিজ্ঞাপন', '/contact']].map(([name, href]) => (
                <li key={name}>
                  <Link href={href} className="text-[#64748B] hover:text-[#E53E3E] text-sm transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E1E2E] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#64748B] text-xs">© {year} The Bengal Chronicle Network. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-[#64748B] text-xs">Made with ❤️ for Bengal</p>
        </div>
      </div>
    </footer>
  );
}