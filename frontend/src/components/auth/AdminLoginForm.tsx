'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '../../lib/schemas/auth';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';

export function AdminLoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const storeError = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginInput) => {
    await login(values);
    router.push('/newsroom-bcn-2024');
    router.refresh();
  };

  return (
    <div className="grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15),_transparent_35%),linear-gradient(135deg,#020617,#0f172a,#111827)] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden min-h-[640px] flex-col justify-between border-r border-white/10 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent p-10 md:flex">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-200"><ShieldCheck className="h-4 w-4" />BCN secure admin portal</div>
            <div className="relative h-16 w-52"><Image src="https://dummyimage.com/320x96/111827/f59e0b&text=BCN+NETWORK" alt="BCN logo" fill className="object-contain" /></div>
            <h1 className="max-w-md text-4xl font-bold leading-tight text-white">Fast, secure newsroom access for editors and admins.</h1>
            <p className="max-w-md text-base text-slate-300">This redesigned glassmorphism login removes the hidden route pattern, improves trust, and gives clear validation and loading states.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold text-white">HTTP-only</p><p className="mt-1">Cookie-based session flow</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold text-white">Zod</p><p className="mt-1">Typed input validation</p></div>
          </div>
        </div>
        <div className="relative p-6 sm:p-10 md:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 md:hidden"><div className="relative h-12 w-40"><Image src="https://dummyimage.com/240x72/111827/f59e0b&text=BCN+NETWORK" alt="BCN logo" fill className="object-contain" /></div></div>
            <div className="mb-8 space-y-2">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-200/80">Admin login</p>
              <h2 className="text-3xl font-semibold">Welcome back</h2>
              <p className="text-sm text-slate-300">Use your editor or admin credentials to enter the newsroom panel.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Email address</label>
                <Input placeholder="admin@bcnnetwork.in" autoComplete="email" {...register('email')} />
                {errors.email ? <p className="text-sm text-rose-300">{errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Password</label>
                <PasswordInput placeholder="Enter your password" autoComplete="current-password" {...register('password')} />
                {errors.password ? <p className="text-sm text-rose-300">{errors.password.message}</p> : null}
              </div>
              {storeError ? <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{storeError}</div> : null}
              <Button type="submit" disabled={isLoading} className="w-full rounded-2xl text-base">{isLoading ? 'Signing in...' : 'Sign in to newsroom'}</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}