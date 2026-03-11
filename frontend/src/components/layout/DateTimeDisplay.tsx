'use client';
import { useState, useEffect } from 'react';

export default function DateTimeDisplay() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setToday(now.toLocaleDateString('bn-BD', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }));
      setTime(now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    setMounted(true);
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#0A0A0F] border-b border-[#1E1E2E] py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#64748B]">
        <span>{today}</span>
        <span className="font-mono">{time}</span>
      </div>
    </div>
  );
}