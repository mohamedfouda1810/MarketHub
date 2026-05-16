'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api/v1';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSent(true);
        toast.success('Reset link sent!');
      } else {
        toast.error('Failed to send reset link.');
      }
    } catch (error) {
      toast.error('A connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-muted-foreground/10 p-12 shadow-soft"
        >
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm mb-10"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-3 italic">Forgot <span className="text-primary">Password?</span></h1>
            <p className="text-muted-foreground font-medium">Don&apos;t worry! It happens. Please enter your email to receive a reset link.</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 uppercase tracking-widest text-muted-foreground" htmlFor="email">Email Address</label>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    <span>Send Reset Link</span>
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black mb-2">Check your inbox!</h2>
              <p className="text-muted-foreground font-medium mb-8">
                If an account exists for that email, we&apos;ve sent password reset instructions.
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-primary font-black text-sm hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
