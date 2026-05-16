'use client';

import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List, Loader2, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useGetProductsQuery } from '@/lib/api/productApi';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ProductsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const observerTarget = useRef(null);

  // Debounce search — fire API only 300ms after user stops typing
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTerm(inputValue);
      setPage(1); // Reset to first page on new search
      setAllProducts([]);
    }, 300);
    return () => clearTimeout(id);
  }, [inputValue]);

  const { data: result, isLoading, isFetching } = useGetProductsQuery({
    pageNumber: page,
    pageSize: 12,
    search: searchTerm || undefined,
  });

  useEffect(() => {
    if (result?.data?.items) {
      if (page === 1) {
        setAllProducts(result.data.items);
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = result.data.items.filter((p: any) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [result, page]);

  const hasMore = useMemo(() => result?.data ? page < result.data.totalPages : false, [result, page]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const renderedProducts = useMemo(() => (
    <div className={`grid gap-8 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
      {allProducts.map((product, index) => (
        <motion.div
          key={`${product.id}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index % 12) * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  ), [allProducts, view]);

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Discover <span className="text-primary italic">Everything.</span></h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Browse our entire collection of unique products from verified independent vendors around the world.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 bg-white rounded-[2.5rem] border border-muted-foreground/10 shadow-soft">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products…"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex h-12 w-full rounded-2xl border-none bg-muted/50 px-12 py-2 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
              {inputValue && (
                <button
                  onClick={() => { setInputValue(''); setSearchTerm(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button className="h-12 px-6 rounded-2xl bg-muted/50 flex items-center gap-2 font-bold text-sm text-muted-foreground hover:text-primary transition-all">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-white shadow-soft text-primary' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white shadow-soft text-primary' : 'text-muted-foreground'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">Sort by:</span>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 font-bold text-sm">
                Featured <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {isLoading && page === 1 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          renderedProducts
        )}

        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {isFetching && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading more magic...</p>
            </div>
          )}
          {!hasMore && allProducts.length > 0 && (
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">You&apos;ve reached the end of the world.</p>
          )}
        </div>
      </div>
    </div>
  );
}
