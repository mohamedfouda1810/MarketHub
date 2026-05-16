'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User, Briefcase, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useRegisterCustomerMutation, useRegisterVendorMutation } from '@/lib/api/authApi';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  role: z.enum(['Customer', 'Vendor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Customer' | 'Vendor'>('Customer');
  const router = useRouter();

  const [registerCustomer] = useRegisterCustomerMutation();
  const [registerVendor] = useRegisterVendorMutation();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Customer',
    }
  });

  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      if (data.role === 'Customer') {
        await registerCustomer({
          email: data.email,
          password: data.password,
          fullName: data.fullName
        }).unwrap();
      } else {
        await registerVendor({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          storeName: `${data.fullName}'s Store` // Default store name
        }).unwrap();
      }
      setRegisteredEmail(data.email);
      setIsVerificationSent(true);
      toast.success('Account created! Please check your email.');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] border border-muted-foreground/10 p-12 text-center shadow-soft"
        >
          <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8">
            <Mail className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black mb-4 tracking-tight">Verify your <span className="text-primary">Email</span></h1>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed text-lg">
            We&apos;ve sent a verification link to <span className="font-bold text-foreground">{registeredEmail}</span>. Please check your inbox and click the link to activate your account.
          </p>
          <div className="space-y-4">
            <Link href="/login" className="btn-gradient w-full h-14 rounded-2xl flex items-center justify-center font-black text-lg">
              Go to Sign In
            </Link>
            <button 
              onClick={() => setIsVerificationSent(false)}
              className="text-primary font-black text-sm hover:underline"
            >
              Back to Registration
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Register Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <Link 
          href="/login" 
          className="absolute top-12 left-8 md:left-16 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-3">Create <span className="text-primary">Account</span></h1>
            <p className="text-muted-foreground font-medium">Join MarketHub and start exploring.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => { setSelectedRole('Customer'); setValue('role', 'Customer'); }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 gap-2 group",
                  selectedRole === 'Customer' 
                    ? "border-primary bg-primary/5 text-primary shadow-soft" 
                    : "border-muted bg-white text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.02]"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-all",
                  selectedRole === 'Customer' ? "bg-primary text-white scale-110 shadow-glow" : "bg-muted text-muted-foreground group-hover:scale-110"
                )}>
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm">Customer</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setSelectedRole('Vendor'); setValue('role', 'Vendor'); }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 gap-2 group",
                  selectedRole === 'Vendor' 
                    ? "border-primary bg-primary/5 text-primary shadow-soft" 
                    : "border-muted bg-white text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.02]"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-all",
                  selectedRole === 'Vendor' ? "bg-primary text-white scale-110 shadow-glow" : "bg-muted text-muted-foreground group-hover:scale-110"
                )}>
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm">Vendor</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="fullName"
                  {...register('fullName')}
                  className="input-premium flex h-14 w-full px-12 py-2 text-base outline-none"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="input-premium flex h-14 w-full px-12 py-2 text-base outline-none"
                  placeholder="m@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="input-premium flex h-14 w-full px-12 py-2 text-base outline-none"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1" htmlFor="confirmPassword">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    className="input-premium flex h-14 w-full px-12 py-2 text-base outline-none"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg mt-8"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : 'Get Started'}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-bold text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign In
            </Link>
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
            <User className="h-10 w-10" />
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-6">Build Your Future.</h2>
          <p className="text-xl opacity-80 font-medium leading-relaxed">
            Whether you&apos;re a buyer or a seller, MarketHub provides the tools you need to succeed in the digital economy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}