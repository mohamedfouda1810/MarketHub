'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/store/authSlice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.email === 'vendor@example.com') {
        dispatch(setCredentials({
          user: { id: '1', email: data.email, role: 'Vendor', vendorId: 'v1' },
          accessToken: 'dummy-token',
        }));
        document.cookie = "accessToken=dummy-token; path=/";
        document.cookie = "userRole=Vendor; path=/";
        toast.success('Welcome back, Vendor!');
        router.push('/vendor/dashboard');
      } else {
        dispatch(setCredentials({
          user: { id: '2', email: data.email, role: 'Customer' },
          accessToken: 'dummy-token',
        }));
        document.cookie = "accessToken=dummy-token; path=/";
        document.cookie = "userRole=Customer; path=/";
        toast.success('Logged in successfully');
        router.push('/');
      }
    } catch (error) {
      toast.error('Invalid credentials');
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
            <h1 className="text-4xl font-black tracking-tight mb-3">Sign <span className="text-primary">In</span></h1>
            <p className="text-muted-foreground font-medium">Continue your journey with MarketHub.</p>
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
                <Link href="/forgot-password" disabled className="text-xs font-bold text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
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
                  <span>Signing in...</span>
                </div>
              ) : 'Sign In'}
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
            <p className="text-sm font-medium text-primary/80">vendor@example.com <span className="mx-1">•</span> any password</p>
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