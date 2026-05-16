'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { baseApi } from '@/lib/api/baseApi';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verify = async () => {
      if (!userId || !token) {
        setStatus('error');
        setMessage('Invalid verification link. Missing user ID or token.');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api/v1';
        const response = await fetch(`${apiUrl}/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`);
        const result = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now sign in to your account.');
        } else {
          setStatus('error');
          setMessage(result.message || 'Verification failed. The link may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('A connection error occurred. Please try again later.');
      }
    };

    verify();
  }, [userId, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-muted-foreground/10 p-12 text-center shadow-soft"
        >
          <div className="flex justify-center mb-8">
            {status === 'loading' && (
              <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
                <XCircle className="h-10 w-10" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black mb-4 tracking-tight">
            {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed text-lg">
            {message}
          </p>

          {status === 'success' && (
            <Link href="/login" className="btn-gradient w-full h-14 rounded-2xl flex items-center justify-center font-black text-lg gap-2">
              Sign In <ArrowRight className="h-5 w-5" />
            </Link>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Link href="/login" className="w-full h-14 bg-muted rounded-2xl flex items-center justify-center font-black text-lg hover:bg-muted/80 transition-all">
                Back to Login
              </Link>
              <button 
                onClick={() => router.push('/resend-verification')}
                className="text-primary font-black text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <Mail className="h-4 w-4" /> Resend verification email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
