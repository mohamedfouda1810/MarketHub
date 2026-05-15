'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Globe, Star } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

const featuredCategories = [
  { name: 'Electronics', icon: '📱', color: 'bg-blue-500/10 text-blue-600' },
  { name: 'Fashion', icon: '👕', color: 'bg-pink-500/10 text-pink-600' },
  { name: 'Home & Living', icon: '🏠', color: 'bg-green-500/10 text-green-600' },
  { name: 'Beauty', icon: '💄', color: 'bg-purple-500/10 text-purple-600' },
];

const features = [
  {
    title: 'Secure Payments',
    description: 'Every transaction is protected with industry-standard encryption.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Delivery',
    description: 'Get your products delivered to your doorstep in no time.',
    icon: Zap,
  },
  {
    title: 'Global Vendors',
    description: 'Shop from unique independent sellers across the globe.',
    icon: Globe,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-48">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="container px-4 md:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold mb-8"
          >
            <Star className="h-4 w-4 fill-primary" />
            <span>Trusted by 50,000+ happy customers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]"
          >
            Shop the World&apos;s <br /> 
            <span className="text-primary italic">Best Independent</span> Stores
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[800px] text-lg md:text-2xl text-muted-foreground mb-12 leading-relaxed"
          >
            MarketHub connects you directly with unique vendors worldwide. 
            Discover handpicked products with guaranteed buyer protection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
          >
            <Link 
              href="/products" 
              className="flex-1 btn-gradient h-14 rounded-2xl flex items-center justify-center font-bold text-lg gap-2"
            >
              Start Shopping <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/register/vendor" 
              className="flex-1 bg-background border-2 border-primary/20 hover:border-primary/40 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all"
            >
              Sell on MarketHub
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Shop by Category</h2>
            <p className="text-muted-foreground font-medium">Explore our curated collections</p>
          </div>
          <Link href="/categories" className="hidden sm:flex items-center gap-2 font-bold text-primary hover:underline">
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group aspect-[4/3] relative rounded-3xl p-8 flex flex-col justify-end cursor-pointer overflow-hidden transition-all hover:shadow-premium",
                category.color
              )}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="font-extrabold text-xl group-hover:translate-x-1 transition-transform">{category.name}</h3>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-6 w-6" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="container px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-primary rounded-[3rem] p-12 md:p-24 overflow-hidden text-primary-foreground text-center flex flex-col items-center gap-8 shadow-2xl shadow-primary/20"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-2xl leading-tight">
            Ready to grow your business globally?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-xl">
            Join 10,000+ vendors who are already selling on MarketHub. Get your store online in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link 
              href="/register/vendor" 
              className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-xl hover:bg-opacity-90 transition-all shadow-xl active:scale-95"
            >
              Start Selling Now
            </Link>
            <Link 
              href="/vendor-guidelines" 
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all border border-white/20 backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}