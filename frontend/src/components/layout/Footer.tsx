import Link from 'next/link';
import Image from 'next/image';
import logo from '@/components/layout/logo/log.png';
import { categories } from '@/lib/categories';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background:'#070908', borderTop:'1px solid rgba(212,175,55,0.2)' }}>
      <div style={{ height:'1px', background:'linear-gradient(90deg,transparent,#D4AF37 30%,#D4AF37 70%,transparent)' }} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image src={logo} alt="BCN" height={56} className="h-14 w-auto mb-4" style={{ filter:'drop-shadow(0 2px 8px rgba(212,175,55,0.3))' }} />
            <p className="text-sm leading-relaxed mb-4" style={{ color:'#6B7280' }}>
              বাংলার মানুষের কাছে সত্যিকারের সংবাদ পৌঁছে দেওয়ার লক্ষ্যে আমাদের যাত্রা। সাহসী, নিরপেক্ষ ও বিশ্বস্ত সাংবাদিকতা।
            </p>
            <div className="flex gap-3">
              {['facebook','twitter','youtube','instagram'].map(s => (
                <a key={s} href="#" className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors" style={{ background:'rgba(212,175,55,0.1)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.2)' }}>
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color:'#D4AF37' }}>বিভাগ</h4>
            <ul className="space-y-2">
              {[['বাংলা','bengal'],['রাজনীতি','politics'],['ক্রীড়া','sports'],['বিনোদন','entertainment'],['প্রযুক্তি','technology']].map(([n,s]) => (
                <li key={s}>
                  <Link href={`/category/${s}`} className="text-sm transition-colors hover:text-yellow-300" style={{ color:'#6B7280' }}>{n}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color:'#D4AF37' }}>যোগাযোগ</h4>
            <ul className="space-y-2 text-sm" style={{ color:'#6B7280' }}>
              <li>📧 tech@bengalchronicle.com</li>
              <li>📍 কলকাতা, পশ্চিমবঙ্গ</li>
              <li className="pt-2">
                <Link href="/about" className="hover:text-yellow-300 transition-colors">আমাদের সম্পর্কে</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-300 transition-colors">যোগাযোগ করুন</Link>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ height:'1px', background:'rgba(212,175,55,0.15)', margin:'2rem 0 1.5rem' }} />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ color:'rgba(212,175,55,0.4)' }}>
          <p>© {year} BCN - The Bengal Chronicle Network. সর্বস্বত্ব সংরক্ষিত।</p>
          <p>Made with ❤️ for Bengal</p>
        </div>
      </div>
    </footer>
  );
}
