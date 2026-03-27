import type { Metadata } from 'next';
import { Tiro_Bangla, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  title: {
    default: 'BCN - The Bengal Chronicle Network',
    template: '%s | BCN',
  },
  description: 'বাংলার সেরা সংবাদ মাধ্যম — The Bengal Chronicle Network',
  keywords: ['bengal', 'news', 'bangla', 'chronicle', 'BCN'],
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://bengalchronicle.com',
    siteName: 'BCN – The Bengal Chronicle Network',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-scroll-behavior="smooth" className={`${tiroBangla.variable} ${playfair.variable} ${jetbrains.variable}`} >
      <body className="bg-bcn-dark text-bcn-light antialiased">
        {children}
      </body>
    </html>
  );
}