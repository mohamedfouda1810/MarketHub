'use client';

import StoreCard from '@/components/store/StoreCard';
import { Vendor } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data
const MOCK_VENDORS: Vendor[] = [
  {
    id: '1',
    storeName: 'TechGadgets Pro',
    storeSlug: 'techgadgets-pro',
    storeEmail: 'contact@techgadgets.com',
    description: 'Your one-stop shop for the latest electronics, smartphones, and accessories.',
    rating: 4.8,
    reviewCount: 1245,
    isActive: true,
  },
  {
    id: '2',
    storeName: 'Organic Beauty',
    storeSlug: 'organic-beauty',
    storeEmail: 'hello@organicbeauty.com',
    description: '100% natural, cruelty-free beauty and skincare products for all skin types.',
    rating: 4.9,
    reviewCount: 856,
    isActive: true,
  },
  {
    id: '3',
    storeName: 'Urban Outfitters',
    storeSlug: 'urban-outfitters',
    storeEmail: 'support@urbanoutfitters.com',
    description: 'Trendy clothing and accessories for the modern urban lifestyle.',
    rating: 4.5,
    reviewCount: 320,
    isActive: true,
  },
  {
    id: '4',
    storeName: 'Home Essentials',
    storeSlug: 'home-essentials',
    storeEmail: 'info@homeessentials.com',
    description: 'Everything you need to make your house a home. Furniture, decor, and more.',
    rating: 4.7,
    reviewCount: 512,
    isActive: true,
  }
];

export default function StoresPage() {
  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">Verified <span className="text-primary">Stores</span></h1>
          <p className="text-xl text-muted-foreground font-medium">Explore unique independent sellers handpicked for quality and reliability.</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by store name..."
              className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            />
          </div>
          <button className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_VENDORS.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StoreCard vendor={vendor} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}