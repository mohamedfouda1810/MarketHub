'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Globe, Star, TrendingUp, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

const featuredCategories = [
  { name: 'Electronics', icon: '📱', color: 'bg-blue-500/10 text-blue-600', count: '1.2k+ Products' },
  { name: 'Fashion', icon: '👕', color: 'bg-rose-500/10 text-rose-600', count: '850+ Products' },
  { name: 'Home & Living', icon: '🏠', color: 'bg-emerald-500/10 text-emerald-600', count: '2k+ Products' },
  { name: 'Beauty', icon: '💄', color: 'bg-purple-500/10 text-purple-600', count: '400+ Products' },
];

const features = [
  {
    title: 'Secure Payments',
    description: 'Every transaction is protected with bank-grade encryption.',
    icon: ShieldCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    title: 'Instant Delivery',
    description: 'Get your digital products instantly or tracked shipping.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    title: 'Global Marketplace',
    description: 'Shop from unique independent sellers across the globe.',
    icon: Globe,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-48">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="container px-4 md:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mb-8 border border-primary/20"
            >
              <TrendingUp className="h-4 w-4" /> Next-Gen Marketplace
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8"
            >
              Your Hub for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Global Goods.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-2xl leading-relaxed"
            >
              Discover unique products from thousands of independent vendors. Secure, fast, and built for the modern shopper.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/products" className="btn-gradient px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30">
                Explore Shop <ShoppingBag className="h-6 w-6" />
              </Link>
              <Link href="/register" className="px-10 py-5 rounded-2xl bg-white border border-muted-foreground/10 font-black text-xl hover:bg-muted/30 transition-all flex items-center justify-center gap-2 shadow-soft">
                Become a Vendor <ChevronRight className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.4 }}
            className="flex-1 relative"
          >
            <div className="relative w-full aspect-square max-w-[550px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[4rem] rotate-6 scale-95 blur-2xl" />
              <div className="relative h-full w-full rounded-[4rem] overflow-hidden border-8 border-white shadow-premium">
                <Image 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" 
                  alt="Marketplace Hero" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-8 glass p-6 rounded-3xl shadow-premium border-white/40 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-sm">Safe Checkout</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified by Stripe</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -right-8 glass p-6 rounded-3xl shadow-premium border-white/40 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-sm">4.9/5 Rating</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Customer Satisfaction</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Users', value: '50k+' },
            { label: 'Happy Vendors', value: '12k+' },
            { label: 'Products Sold', value: '1M+' },
            { label: 'Countries', value: '45+' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</p>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Shop by <span className="text-primary">Category</span></h2>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">Browse our curated selection of premium goods across all departments.</p>
          </div>
          <Link href="/categories" className="px-6 py-3 rounded-xl bg-muted/50 font-bold text-sm hover:bg-primary hover:text-white transition-all">View All Categories</Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 1 : -1 }}
              className={cn(
                "group relative p-8 rounded-[2.5rem] cursor-pointer overflow-hidden border border-transparent hover:border-primary/10 transition-all shadow-soft hover:shadow-premium",
                category.color
              )}
            >
              <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-500">{category.icon}</div>
              <h3 className="text-2xl font-black mb-1">{category.name}</h3>
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest">{category.count}</p>
              
              <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Features */}
      <section className="bg-primary/5 py-32 rounded-[4rem]">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={feature.title}
                className="flex flex-col items-center text-center p-8 rounded-[3rem] bg-white shadow-soft hover:shadow-premium transition-all hover:-translate-y-2"
              >
                <div className={cn("w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-8 shadow-lg", feature.bg, feature.color)}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="relative rounded-[4rem] bg-primary overflow-hidden p-12 md:p-24 text-center text-primary-foreground shadow-2xl shadow-primary/40"
        >
          <div className="absolute top-0 right-0 w-[50%] h-full bg-white/5 rounded-full blur-[120px] translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[40%] h-full bg-black/10 rounded-full blur-[100px] -translate-x-1/2" />
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 relative z-10 leading-tight">Ready to Start Your <br /> Shopping Adventure?</h2>
          <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            Join 50,000+ happy customers today and experience the best multi-vendor marketplace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link href="/register" className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-white text-primary font-black text-xl shadow-xl hover:scale-105 transition-all">
              Join MarketHub Free
            </Link>
            <Link href="/stores" className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-black text-xl hover:bg-white/20 transition-all">
              Browse All Stores
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
