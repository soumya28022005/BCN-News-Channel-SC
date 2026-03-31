import { Skeleton } from '../components/ui/skeleton';
export default function Loading() {
  return <div className="min-h-screen bg-slate-950 px-4 py-10"><div className="mx-auto max-w-7xl space-y-6"><Skeleton className="h-16 w-60" /><Skeleton className="h-[320px] w-full rounded-[32px]" /><div className="grid gap-6 md:grid-cols-3"><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></div></div></div>;
}