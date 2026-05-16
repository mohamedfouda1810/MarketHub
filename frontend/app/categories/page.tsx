'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Zap, Laptop, Shirt, Home, Heart, Camera, Coffee, Headphones } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'bg-blue-500/10 text-blue-600', count: '1,240 Products', subcategories: ['Smartphones', 'Laptops', 'Audio', 'Gaming'] },
  { name: 'Fashion', icon: Shirt, color: 'bg-rose-500/10 text-rose-600', count: '3,850 Products', subcategories: ['Men', 'Women', 'Kids', 'Accessories'] },
  { name: 'Home & Living', icon: Home, color: 'bg-emerald-500/10 text-emerald-600', count: '2,100 Products', subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden'] },
  { name: 'Beauty', icon: Heart, color: 'bg-purple-500/10 text-purple-600', count: '940 Products', subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'] },
  { name: 'Photography', icon: Camera, color: 'bg-amber-500/10 text-amber-600', count: '450 Products', subcategories: ['Cameras', 'Lenses', 'Lighting', 'Tripods'] },
  { name: 'Food & Drink', icon: Coffee, color: 'bg-orange-500/10 text-orange-600', count: '620 Products', subcategories: ['Coffee', 'Tea', 'Snacks', 'Organic'] },
  { name: 'Audio', icon: Headphones, color: 'bg-indigo-500/10 text-indigo-600', count: '830 Products', subcategories: ['Headphones', 'Speakers', 'Microphones', 'Vinyl'] },
  { name: 'Flash Deals', icon: Zap, color: 'bg-yellow-500/10 text-yellow-600', count: '120 Deals', subcategories: ['Electronics', 'Home', 'Fashion'] },
];

export default function CategoriesPage() {
  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Browse by <span className="text-primary italic">Category.</span></h1>
          <p className="text-xl text-muted-foreground font-medium">
            Explore our vast marketplace organized by interest and department to find exactly what you&apos;re looking for.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white rounded-[2.5rem] border border-muted-foreground/10 p-8 shadow-soft hover:shadow-premium transition-all hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              <div className={cn("w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", category.color)}>
                <category.icon className="h-10 w-10" />
              </div>
              
              <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">{category.count}</p>
              
              <ul className="space-y-2 mb-8">
                {category.subcategories.map(sub => (
                  <li key={sub} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary/50" />
                    {sub}
                  </li>
                ))}
              </ul>

              <Link 
                href={`/products?category=${category.name.toLowerCase()}`}
                className="inline-flex items-center gap-2 text-sm font-black text-primary group-hover:gap-4 transition-all"
              >
                View Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-[3rem] bg-muted/30 p-12 md:p-20 text-center overflow-hidden border border-muted-foreground/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-black mb-6 tracking-tight">Can&apos;t find what you need?</h2>
            <p className="text-lg text-muted-foreground font-medium mb-10">
              Try our advanced search or contact our support team for help finding the perfect item from our thousands of independent vendors.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="btn-gradient px-10 py-4 rounded-2xl font-black text-lg">
                View All Products
              </Link>
              <Link href="/search" className="px-10 py-4 rounded-2xl bg-white border border-muted-foreground/10 font-black text-lg hover:bg-muted/50 transition-all">
                Try Search
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}