'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (!email || !token) {
      toast.error('Invalid reset link. Please request a new one.');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api/v1';
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: data.password,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        const result = await response.json();
        toast.error(result.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error('A connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-white rounded-[3rem] border border-muted-foreground/10 p-12 text-center shadow-soft">
          <h1 className="text-2xl font-black mb-4">Invalid Link</h1>
          <p className="text-muted-foreground mb-8">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn-gradient w-full h-14 rounded-2xl flex items-center justify-center font-black">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-muted-foreground/10 p-12 shadow-soft"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tight mb-3">Reset <span className="text-primary">Password</span></h1>
            <p className="text-muted-foreground font-medium">Please enter your new password below.</p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 uppercase tracking-widest text-muted-foreground">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    {...register('password')}
                    className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 uppercase tracking-widest text-muted-foreground">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black mb-2">Password Updated!</h2>
              <p className="text-muted-foreground font-medium mb-8">
                Your password has been changed successfully. You can now sign in with your new credentials.
              </p>
              <Link href="/login" className="btn-gradient w-full h-14 rounded-2xl flex items-center justify-center font-black text-lg gap-2">
                Sign In <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
