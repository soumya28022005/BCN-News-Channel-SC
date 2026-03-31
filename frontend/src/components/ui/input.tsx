import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none backdrop-blur placeholder:text-slate-400 focus:border-amber-300 focus:bg-white/12', className)} {...props} />
));
Input.displayName = 'Input';