'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Globe, Star, TrendingUp, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import PromoBanner from '@/components/ui/PromoBanner';
import { useGetFeaturedProductsQuery } from '@/lib/api/productApi';
import { useGetStoreCategoriesQuery } from '@/lib/api/vendorApi';

const features = [
  {
    title: 'Secure Payments',
    description: 'Every transaction is protected with bank-grade encryption.',
    icon: ShieldCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    glow: 'hover:shadow-blue-500/20'
  },
  {
    title: 'Instant Delivery',
    description: 'Get your digital products instantly or tracked shipping.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    glow: 'hover:shadow-amber-500/20'
  },
  {
    title: 'Global Marketplace',
    description: 'Shop from unique independent sellers across the globe.',
    icon: Globe,
    color: 'text-green-500',
    bg: 'bg-green-50',
    glow: 'hover:shadow-green-500/20'
  },
];

const categoryIcons: Record<string, string> = {
  'Electronics': '📱',
  'Fashion': '👕',
  'Home & Garden': '🏠',
  'Sports & Outdoors': '⚽',
};

const categoryColors: Record<string, string> = {
  'Electronics': 'bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white',
  'Fashion': 'bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white',
  'Home & Garden': 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white',
  'Sports & Outdoors': 'bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white',
};

export default function HomePage() {
  const { data: featuredResult, isLoading: isProductsLoading } = useGetFeaturedProductsQuery();
  const { data: categoriesResult, isLoading: isCategoriesLoading } = useGetStoreCategoriesQuery('');

  const featuredProducts = featuredResult?.data || [];
  const categories = categoriesResult?.data || [];

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-48">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-green-400/10 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-rose-400/5 rounded-full blur-[80px]" />
        </div>

        <div className="container px-4 md:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-black text-xs uppercase tracking-[0.2em] mb-8 border border-green-500/20 shadow-green-glow"
            >
              <TrendingUp className="h-4 w-4" /> Eco-Friendly Choices Available
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8"
            >
              Your Hub for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-500 to-rose-500">Global Goods.</span>
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
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <Link href="/products" className="btn-squircle bg-primary text-white px-12 h-20 font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30">
                Explore Shop <ShoppingBag className="h-6 w-6" />
              </Link>
              <Link href="/register" className="btn-squircle bg-white border border-muted-foreground/10 font-black text-xl hover:bg-muted/30 px-12 h-20 transition-all flex items-center justify-center gap-2 shadow-soft hover:shadow-premium">
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
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-primary/10 to-transparent rounded-squircle-lg rotate-6 scale-95 blur-2xl" />
              <div className="relative h-full w-full rounded-squircle-lg overflow-hidden border-8 border-white shadow-premium">
                <Image 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" 
                  alt="Marketplace Hero" 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                  priority
                />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-8 glass-green p-6 rounded-squircle-sm shadow-premium border-white/40 flex items-center gap-4 z-20"
              >
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-black text-sm text-green-700">Safe Checkout</p>
                  <p className="text-[10px] font-bold text-green-600/60 uppercase tracking-widest">Verified by Stripe</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -right-8 glass p-6 rounded-squircle-sm shadow-premium border-white/40 flex items-center gap-4 z-20"
              >
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Star className="h-7 w-7" />
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

      {/* Featured Products */}
      <section className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic">Editor&apos;s <span className="text-primary">Choice</span></h2>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">The most popular and highly rated products currently trending in our marketplace.</p>
          </div>
          <Link href="/products" className="btn-squircle bg-muted/50 font-black text-sm hover:bg-primary hover:text-white px-8 h-14 transition-all shadow-soft hover:shadow-premium">See All Products</Link>
        </div>

        {isProductsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-muted/30 rounded-squircle-lg border-2 border-dashed">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold">No products available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Active Users', value: '50k+', color: 'text-primary' },
            { label: 'Happy Vendors', value: '12k+', color: 'text-green-600' },
            { label: 'Products Sold', value: '1M+', color: 'text-rose-500' },
            { label: 'Countries', value: '45+', color: 'text-amber-500' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="text-center"
            >
              <p className={cn("text-5xl md:text-6xl font-black mb-3 tracking-tighter", stat.color)}>{stat.value}</p>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="container px-4">
        <PromoBanner 
          title="Eco-Friendly Collection is Here!"
          subtitle="Discover our curated list of sustainable and ethically sourced products from independent makers."
          ctaText="Shop Sustainable"
          ctaHref="/products?tag=eco"
          variant="green"
        />
      </section>

      {/* Categories */}
      <section className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-primary italic">Category</span></h2>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">Browse our curated selection of premium goods across all departments.</p>
          </div>
          <Link href="/categories" className="btn-squircle bg-muted/50 font-black text-sm hover:bg-green-600 hover:text-white px-8 h-14 transition-all shadow-soft hover:shadow-premium">View All Categories</Link>
        </div>
        
        {isCategoriesLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.length > 0 ? (
              categories.slice(0, 4).map((category: any, idx: number) => (
                <Link href={`/categories/${category.slug}`} key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 1 : -1 }}
                    className={cn(
                      "group relative p-10 rounded-squircle-md cursor-pointer overflow-hidden border border-transparent transition-all shadow-soft hover:shadow-premium h-full",
                      categoryColors[category.name] || 'bg-muted/10 text-muted-foreground'
                    )}
                  >
                    <div className="text-6xl mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{categoryIcons[category.name] || '📦'}</div>
                    <h3 className="text-3xl font-black mb-2 tracking-tight">{category.name}</h3>
                    <p className="text-xs font-black opacity-60 uppercase tracking-[0.1em]">{category.description?.slice(0, 30)}...</p>
                    
                    <div className="absolute top-6 right-6 p-3 rounded-squircle-sm bg-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="h-5 w-5 text-current" />
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground font-bold">No categories found.</div>
            )}
          </div>
        )}
      </section>

      {/* Featured Features */}
      <section className="bg-gradient-to-b from-green-500/5 via-primary/5 to-transparent py-40 rounded-squircle-lg">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {features.map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={feature.title}
                className={cn(
                  "flex flex-col items-center text-center p-12 rounded-squircle-md bg-white shadow-soft transition-all hover:-translate-y-3",
                  feature.glow
                )}
              >
                <div className={cn("w-24 h-24 rounded-squircle-sm flex items-center justify-center mb-10 shadow-xl transform group-hover:rotate-12 transition-transform", feature.bg, feature.color)}>
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="relative rounded-squircle-lg bg-green-600 overflow-hidden p-16 md:p-32 text-center text-white shadow-2xl shadow-green-600/40"
        >
          <div className="absolute top-0 right-0 w-[60%] h-full bg-white/10 rounded-full blur-[150px] translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[50%] h-full bg-primary/20 rounded-full blur-[120px] -translate-x-1/2" />
          
          <h2 className="text-6xl md:text-8xl font-black mb-10 relative z-10 leading-[1.05] tracking-tighter">Ready to Start Your <br /> Shopping Adventure?</h2>
          <p className="text-xl md:text-3xl opacity-80 mb-16 max-w-3xl mx-auto relative z-10 font-medium leading-relaxed">
            Join 50,000+ happy customers today and experience the most vibrant multi-vendor marketplace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
            <Link href="/register" className="w-full sm:w-auto px-14 py-7 rounded-squircle-sm bg-white text-green-700 font-black text-2xl shadow-2xl hover:scale-105 transition-all hover:shadow-green-glow">
              Join MarketHub Free
            </Link>
            <Link href="/stores" className="w-full sm:w-auto px-14 py-7 rounded-squircle-sm bg-white/10 backdrop-blur-md border border-white/20 font-black text-2xl hover:bg-white/20 transition-all">
              Browse All Stores
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
