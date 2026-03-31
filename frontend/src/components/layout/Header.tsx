import Link from 'next/link';
const links = [
  { href: '/', label: 'Home' },
  { href: '/trending', label: 'Trending' },
  { href: '/news', label: 'Latest' },
  { href: '/search', label: 'Search' },
];
export function Header() {
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8"><Link href="/" className="text-lg font-bold tracking-[0.2em] text-amber-300">BCN NETWORK</Link><nav className="flex items-center gap-5 text-sm text-slate-300">{links.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-white">{link.label}</Link>)}<Link href="/auth/login" className="rounded-full border border-white/15 px-4 py-2 text-white hover:border-amber-300 hover:text-amber-200">Admin</Link></nav></div></header>;
}