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
  title: 'BCN – The Bengal Chronicle Network',
  description: 'বাংলার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম',
  keywords: ['বাংলা সংবাদ', 'Bengal news', 'BCN', 'The Bengal Chronicle Network'],
  openGraph: {
    title: 'BCN – The Bengal Chronicle Network',
    description: 'বাংলার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              var theme = localStorage.getItem('bcn-theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e){}
          `
        }} />
      </head>
      <body className={`${tiroBangla.variable} ${playfair.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
