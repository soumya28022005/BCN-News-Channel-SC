import { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 bg-amber-400 text-slate-950 hover:bg-amber-300', className)} {...props} />;
}