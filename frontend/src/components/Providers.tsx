'use client';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, []);

  return <>{children}</>;
}