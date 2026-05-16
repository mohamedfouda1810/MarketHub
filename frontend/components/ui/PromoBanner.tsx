'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  variant?: 'primary' | 'green' | 'violet' | 'rose';
  className?: string;
}

export default function PromoBanner({ 
  title, 
  subtitle, 
  ctaText, 
  ctaHref, 
  variant = 'primary',
  className 
}: PromoBannerProps) {
  const variants = {
    primary: 'bg-primary shadow-glow-primary text-white',
    green: 'bg-green-600 shadow-glow-green text-white',
    violet: 'bg-violet-600 shadow-violet-glow text-white',
    rose: 'bg-rose-600 shadow-rose-glow text-white',
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative rounded-squircle-md md:rounded-squircle-lg overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10",
        variants[variant],
        className
      )}
    >
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-white rounded-full blur-2xl animate-bounce-subtle" />
      </div>

      <div className="flex flex-col gap-4 relative z-10 text-center md:text-left max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md w-fit mx-auto md:mx-0">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
          {title}
        </h2>
        <p className="text-lg opacity-80 font-bold max-w-lg">
          {subtitle}
        </p>
      </div>

      <motion.div whileHover={{ x: 5 }} className="relative z-10">
        <Link 
          href={ctaHref} 
          className="btn-squircle bg-white text-foreground hover:bg-white/90 shadow-2xl flex items-center gap-3 px-10 h-16 text-lg"
        >
          {ctaText} <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
