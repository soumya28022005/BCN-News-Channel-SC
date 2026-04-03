import type { Metadata } from 'next';
import { Tiro_Bangla, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

// ✅ FIX: সরাসরি অ্যাড ইমপোর্ট না করে AdsWrapper ইমপোর্ট করা হলো
import AdsWrapper from '../components/ads/AdsWrapper';

const tiroBangla = Tiro_Bangla({
  weight: ['400'],
  subsets: ['bengali', 'latin'],
  variable: '--font-bangla',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bcnnetwork.in'),
  title: {
    default: 'BCN - The Bengal Chronicle Network',
    template: '%s | BCN - The Bengal Chronicle Network',
  },
  description: 'বাংলার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম',
  keywords: ['বাংলা সংবাদ', 'পশ্চিমবঙ্গ সংবাদ', 'BCN', 'The Bengal Chronicle Network'],
  openGraph: {
    title: 'BCN – The Bengal Chronicle Network',
    description: 'বাংলার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম',
    type: 'website',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BCN - The Bengal Chronicle Network',
    description: 'বাংলার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('bcn-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${tiroBangla.variable} ${playfair.variable} ${jetbrains.variable}`}>
        <Header />
        
        {/* ✅ FIX: AdsWrapper এখানে দেওয়া হলো, যা অ্যাডমিনে অ্যাড ব্লক করবে */}
        <AdsWrapper />
        
        {children}
        <Footer />
      </body>
    </html>
  );
}