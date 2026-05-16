'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/store/authSlice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useLoginMutation, authApi } from '@/lib/api/authApi';
import { Suspense } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await login(data).unwrap();
      
      if (result.success && result.data) {
        // Dispatch token first so baseQuery can use it for subsequent calls
        dispatch(setCredentials({
          accessToken: result.data.accessToken,
        }));

        // Fetch user info after successful login
        const userResult = await dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
        
        if (userResult.success && userResult.data) {
          dispatch(setCredentials({
            user: userResult.data,
            accessToken: result.data.accessToken,
          }));
          
          // ✅ FIX: Removed manual document.cookie setting.
          // The backend sets HttpOnly cookies (accessToken, refreshToken, userRole) already.
          // Duplicating them as JS-accessible cookies was redundant and a security concern.

          toast.success(`Welcome back, ${userResult.data.fullName}!`);
          
          // 1. Prioritize returnUrl from params
          if (returnUrl) {
            router.push(returnUrl);
            return;
          }

          // 2. Fallback to role-based redirection
          const role = userResult.data.role;
          if (role === 'Vendor') {
            router.push('/vendor/dashboard');
          } else if (role === 'Admin' || role === 'SuperAdmin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Invalid credentials';
      if (errorMessage.toLowerCase().includes('email not confirmed')) {
        toast.error(
          (t) => (
            <span className="flex flex-col gap-2">
              {errorMessage}
              <button 
                onClick={() => { toast.dismiss(t.id); router.push('/resend-verification'); }}
                className="text-primary font-bold underline text-xs text-left"
              >
                Resend verification email?
              </button>
            </span>
          ),
          { duration: 6000 }
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <Link 
          href="/" 
          className="absolute top-12 left-8 md:left-16 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-3">Sign <span className="text-primary">In to MarketHub</span></h1>
            <p className="text-muted-foreground font-medium">Continue your journey with our multi-vendor platform.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  placeholder="m@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-bold" htmlFor="password">Password</label>
                {/* ✅ FIX: <Link disabled> is not valid. Forgot password not yet implemented — render as styled span */}
                <span className="text-xs font-bold text-muted-foreground/40 cursor-not-allowed select-none">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-12 text-center text-sm font-bold text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Create one now
            </Link>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-xs font-bold text-primary/70 mb-1 uppercase tracking-widest">Demo Credentials</p>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-primary/80">admin1@markethub.com <span className="mx-1">•</span> Admin123!</p>
              <p className="text-sm font-medium text-primary/80">vendor1@markethub.com <span className="mx-1">•</span> Vendor123!</p>
            </div>
            <p className="text-[10px] font-bold text-primary/40 mt-4 uppercase tracking-[0.2em]">System Version 1.1.0</p>
          </div>
        </motion.div>
      </div>

      {/* Right: Visual Content */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden items-center justify-center p-24">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-white/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-black/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-primary-foreground max-w-lg"
        >
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl border border-white/20">
            <Lock className="h-10 w-10" />
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-6">Safe. Secure. Seamless.</h2>
          <p className="text-xl opacity-80 font-medium leading-relaxed">
            Join the most trusted multi-vendor marketplace platform and start your global commerce journey today.
          </p>
        </motion.div>
      </div>
    </div>
  );
}