'use client';

import StoreCard from '@/components/store/StoreCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetVendorsQuery } from '@/lib/api/vendorApi';
import { useState, useEffect } from 'react';

export default function StoresPage() {
  const [page, setPage] = useState(1);
  const [allVendors, setAllVendors] = useState<any[]>([]);
  
  const { data: result, isLoading, isFetching } = useGetVendorsQuery({ 
    pageNumber: page, 
    pageSize: 12 
  });

  useEffect(() => {
    if (result?.data?.items) {
      if (page === 1) {
        setAllVendors(result.data.items);
      } else {
        setAllVendors(prev => [...prev, ...result.data.items]);
      }
    }
  }, [result, page]);

  const hasMore = result?.data ? page < result.data.totalPages : false;

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 italic">Our <span className="text-primary">Vendors.</span></h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Meet the independent creators, curators, and shops that make MarketHub unique. Every vendor is verified for quality.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 bg-white rounded-[2.5rem] border border-muted-foreground/10 shadow-soft">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search stores by name..."
              className="flex h-12 w-full rounded-2xl border-none bg-muted/50 px-12 py-2 text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>
          <button className="h-12 px-6 rounded-2xl bg-muted/50 flex items-center gap-2 font-bold text-sm text-muted-foreground hover:text-primary transition-all">
            <SlidersHorizontal className="h-4 w-4" /> All Categories
          </button>
        </div>

        {isLoading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[300px] rounded-[2.5rem] bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allVendors.map((vendor, index) => (
              <motion.div
                key={`${vendor.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 12) * 0.1 }}
              >
                <StoreCard vendor={vendor} />
              </motion.div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={isFetching}
              className="px-12 py-5 rounded-2xl bg-white border border-muted-foreground/10 font-black text-lg shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {isFetching ? 'Loading...' : 'Load More Stores'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
