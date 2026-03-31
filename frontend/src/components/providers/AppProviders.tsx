'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}