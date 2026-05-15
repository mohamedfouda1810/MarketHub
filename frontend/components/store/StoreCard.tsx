import Image from 'next/image';
import Link from 'next/link';
import { Vendor } from '@/lib/types';
import { Star, MapPin, ArrowRight } from 'lucide-react';

interface StoreCardProps {
  vendor: Vendor;
}

export default function StoreCard({ vendor }: StoreCardProps) {
  return (
    <div className="group relative border bg-card text-card-foreground shadow-sm rounded-[2rem] overflow-hidden hover:shadow-premium transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="h-40 bg-muted relative overflow-hidden">
        {vendor.bannerUrl ? (
          <Image 
            src={vendor.bannerUrl} 
            alt={vendor.storeName} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-6 pt-0 flex-1 flex flex-col relative">
        <div className="h-20 w-20 rounded-2xl border-4 border-card bg-background overflow-hidden relative -mt-10 mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
           {vendor.logoUrl ? (
             <Image src={vendor.logoUrl} alt={vendor.storeName} fill className="object-cover" />
           ) : (
             <div className="h-full w-full bg-primary/5 flex items-center justify-center font-black text-2xl text-primary">
               {vendor.storeName.charAt(0)}
             </div>
           )}
        </div>
        
        <Link 
          href={`/stores/${vendor.storeSlug}`} 
          className="font-black text-xl hover:text-primary transition-colors mb-2 tracking-tight"
        >
          {vendor.storeName}
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 font-medium leading-relaxed">
          {vendor.description || "Discover our curated collection of high-quality products designed for your lifestyle."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-muted/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-primary/5 px-2 py-1 rounded-lg">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-xs font-bold text-primary ml-1">{vendor.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-bold">({vendor.reviewCount} reviews)</span>
          </div>
          <Link 
            href={`/stores/${vendor.storeSlug}`} 
            className="h-10 px-5 bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 group/btn"
          >
            Visit Store <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}