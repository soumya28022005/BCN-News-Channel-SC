'use client';
import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';
import { Input } from './input';
export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return <div className="relative"><Input {...props} type={visible ? 'text' : 'password'} className="pr-12" /><button type="button" onClick={() => setVisible((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white" aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>;
}