import type { Metadata } from 'next';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { AppProviders } from '../components/providers/AppProviders';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'), title: { default: 'BCN Network', template: '%s | BCN Network' }, description: 'Production-grade Bengal news platform with fast SSR and secure newsroom tools.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><AppProviders><Header />{children}<Footer /></AppProviders></body></html>;
}