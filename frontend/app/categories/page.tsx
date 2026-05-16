'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Zap, Laptop, Shirt, Home, Heart, Camera, Coffee, Headphones, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useGetStoreCategoriesQuery } from '@/lib/api/vendorApi';

const categoryIcons: Record<string, any> = {
  'Electronics': Laptop,
  'Fashion': Shirt,
  'Home & Garden': Home,
  'Sports & Outdoors': Headphones, // Using Headphones for lack of sports icon in check
};

const categoryColors: Record<string, string> = {
  'Electronics': 'bg-blue-500/10 text-blue-600 shadow-blue-500/20',
  'Fashion': 'bg-rose-500/10 text-rose-600 shadow-rose-500/20',
  'Home & Garden': 'bg-emerald-500/10 text-emerald-600 shadow-emerald-500/20',
  'Sports & Outdoors': 'bg-green-500/10 text-green-600 shadow-green-500/20',
};

export default function CategoriesPage() {
  const { data: result, isLoading } = useGetStoreCategoriesQuery('');
  const categories = result?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 py-16 md:py-32">
      <div className="flex flex-col gap-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center md:text-left max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em] mb-8 border border-primary/20"
            >
              Our Departments
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
              Explore the <br /><span className="text-gradient italic">Marketplace.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
              Curated by interest and refined for the modern explorer. Find exactly what you need from our global network.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 bg-muted/30 p-2 rounded-[2rem] border border-muted/20"
          >
            <button className="px-8 py-4 rounded-[1.5rem] bg-white shadow-premium text-sm font-black uppercase tracking-widest text-primary">All Departments</button>
            <button className="px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Flash Sales</button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {categories.map((category: any, idx: number) => {
            const Icon = categoryIcons[category.name] || ShoppingBag;
            const colorClass = categoryColors[category.name] || 'bg-muted/10 text-muted-foreground shadow-muted/20';

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12 }}
                className="group relative bg-white rounded-[3.5rem] border border-muted/20 p-10 shadow-soft hover:shadow-premium transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent via-transparent to-muted-foreground/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />

                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className={cn("w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-lg transition-all duration-500", colorClass)}
                >
                  <Icon className="h-12 w-12" />
                </motion.div>

                <h3 className="text-3xl font-black mb-3 group-hover:text-primary transition-colors tracking-tighter">{category.name}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 opacity-60 leading-relaxed">{category.description}</p>

                <div className="mt-auto pt-8">
                  <Link 
                    href={`/products?category=${category.slug}`}
                    className="inline-flex items-center justify-between w-full h-16 px-8 rounded-2xl bg-muted/30 group-hover:bg-primary group-hover:text-white transition-all font-black text-[11px] uppercase tracking-[0.2em]"
                  >
                    Explore <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[5rem] bg-gradient-to-br from-violet-600 via-primary to-rose-500 p-16 md:p-32 text-center overflow-hidden shadow-2xl shadow-primary/40"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center text-white mb-10"
            >
              <Zap className="h-10 w-10" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-tight">Didn&apos;t find your match?</h2>
            <p className="text-xl md:text-2xl text-white/80 font-medium mb-16 leading-relaxed">
              Our marketplace is growing every minute. Try our intelligent search or discover our latest curated arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link href="/products" className="px-14 py-7 rounded-2xl bg-white text-primary font-black text-xl hover:scale-105 transition-all shadow-2xl">
                All Collections
              </Link>
              <Link href="/search" className="px-14 py-7 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-white font-black text-xl hover:bg-white/10 transition-all">
                Search Anything
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}