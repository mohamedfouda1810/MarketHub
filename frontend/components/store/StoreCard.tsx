'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Vendor } from '@/lib/types';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface StoreCardProps {
  vendor: Vendor;
}

const StoreCard = memo(function StoreCard({ vendor }: StoreCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border bg-card text-card-foreground shadow-soft rounded-squircle-md md:rounded-squircle-lg overflow-hidden hover:shadow-premium transition-all duration-700 flex flex-col"
    >
      <div className="h-52 bg-muted relative overflow-hidden">
        {vendor.bannerUrl ? (
          <Image 
            src={vendor.bannerUrl} 
            alt={vendor.storeName} 
            fill 
            className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-primary/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="p-10 pt-0 flex-1 flex flex-col relative">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.15 }}
          className="h-28 w-28 rounded-squircle-sm border-8 border-card bg-background overflow-hidden relative -mt-14 mb-6 shadow-2xl transition-all duration-500 group-hover:shadow-green-glow"
        >
           {vendor.logoUrl ? (
             <Image src={vendor.logoUrl} alt={vendor.storeName} fill className="object-cover" />
           ) : (
             <div className="h-full w-full bg-green-500/5 flex items-center justify-center font-black text-4xl text-green-600">
               {vendor.storeName.charAt(0)}
             </div>
           )}
        </motion.div>
        
        <Link 
          href={`/stores/${vendor.storeSlug}`} 
          className="font-black text-3xl hover:text-green-600 transition-colors mb-4 tracking-tighter leading-none"
        >
          {vendor.storeName}
        </Link>
        
        <p className="text-base text-muted-foreground line-clamp-2 mb-10 flex-1 font-bold leading-relaxed opacity-70">
          {vendor.description || "Discover our curated collection of high-quality products designed for your lifestyle."}
        </p>

        <div className="flex items-center justify-between pt-8 border-t border-muted/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-green-500/10 px-3 py-2 rounded-squircle-sm">
              <Star className="h-5 w-5 fill-green-500 text-green-500" />
              <span className="text-sm font-black text-green-700 ml-2">{vendor.rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-50">({vendor.reviewCount} Reviews)</span>
          </div>
          <Link 
            href={`/stores/${vendor.storeSlug}`} 
            className="btn-squircle bg-green-500/5 hover:bg-green-600 text-green-600 hover:text-white px-8 h-14 transition-all flex items-center gap-3 shadow-sm hover:shadow-green-glow"
          >
            Visit <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

export default StoreCard;