import Link from 'next/link';
export default function NotFound() {
  return <main className="grid min-h-[70vh] place-items-center bg-slate-950 px-4 text-white"><div className="text-center"><p className="text-sm uppercase tracking-[0.3em] text-amber-300">404</p><h1 className="mt-4 text-4xl font-bold">Page not found</h1><p className="mt-3 text-slate-400">The page you requested does not exist or has been moved.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">Return home</Link></div></main>;
}