import Link from 'next/link';
import Image from 'next/image';
import logo from '@/components/layout/logo/log.png';

export default function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'আমাদের সম্পর্কে', href: '/about' },
      { name: 'যোগাযোগ', href: '/contact' },
      { name: 'বিজ্ঞাপন', href: '/advertising-policy' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Disclaimer', href: '/disclaimer' },
      { name: 'Editorial Policy', href: '/editorial-policy' },
    ],
    social: [
      { name: 'Facebook', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'YouTube', href: '#' },
      { name: 'Instagram', href: '#' },
    ]
  };

  return (
    <footer className="bg-[var(--bg2)] border-t border-[var(--border)] pt-12 pb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          {/* Column 1: Logo & Info */}
          <div className="col-span-1 md:col-span-1">
            <Image
              src={logo}
              alt="BCN Logo"
              width={160}
              height={60}
              className="mb-4 drop-shadow-md"
            />
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              বাংলার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম। আমরা নিরপেক্ষ ও সত্যনিষ্ঠ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ।
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[var(--gold)] font-bold text-sm uppercase tracking-wider mb-5">কোম্পানি</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[var(--muted)] text-sm hover:text-[var(--gold)] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div>
            <h4 className="text-[var(--gold)] font-bold text-sm uppercase tracking-wider mb-5">আইনগত তথ্য</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[var(--muted)] text-sm hover:text-[var(--gold)] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h4 className="text-[var(--gold)] font-bold text-sm uppercase tracking-wider mb-5">যোগাযোগ ও সোশ্যাল</h4>
            <p className="text-[var(--muted)] text-sm mb-4">ইমেইল: tech@bengalchronicle.com</p>
            <div className="flex gap-4">
              {footerLinks.social.map((s) => (
                <a key={s.name} href={s.href} className="w-8 h-8 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--bg)] transition-all">
                  <span className="text-xs font-bold">{s.name[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-[var(--muted)]">
          <p>© {year} BCN - The Bengal Chronicle Network. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span>Made with ❤️ for Bengal</span>
            <span className="bg-[var(--bg3)] px-2 py-1 rounded text-[var(--gold)] font-mono">v2.0.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}