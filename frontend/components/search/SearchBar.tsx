'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { useGetProductsQuery } from '../../lib/api/productApi';
import { getErrorMessage } from '../../lib/utils/error-handler';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, error } = useGetProductsQuery(
    { searchTerm: debouncedSearch, PageSize: 5 },
    { skip: debouncedSearch.length < 2 }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <form 
        onSubmit={handleSearch} 
        className={motion.div}
      >
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {isFetching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
          <input
            className="h-14 w-full rounded-[1.25rem] bg-muted/40 px-14 py-2 text-sm font-bold transition-all focus:bg-white focus:ring-[12px] focus:ring-primary/5 shadow-inner-soft placeholder:text-muted-foreground/40 outline-none"
            type="text"
            id="search"
            placeholder="Search for anything extraordinary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                type="button" 
                onClick={() => setSearchTerm('')} 
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-16 left-0 w-full bg-white border border-muted/20 shadow-premium rounded-3xl z-50 overflow-hidden"
          >
            {searchTerm.length < 2 ? (
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6 text-xs font-black text-muted-foreground uppercase tracking-widest">
                  <TrendingUp className="h-3 w-3" /> Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Minimalist Laptops', 'Organic Coffee', 'Sustainable Fashion', 'Smart Home Essentials'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => {
                        setSearchTerm(tag);
                        router.push(`/search?q=${encodeURIComponent(tag)}`);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-muted/50 text-sm font-bold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                    >
                      {tag} <ArrowUpRight className="h-3 w-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            ) : isFetching ? (
              <div className="p-12 text-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4 opacity-20" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Searching the hub...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-rose-500 font-bold text-sm">{getErrorMessage(error)}</div>
            ) : data?.data?.items?.length ? (
              <div className="p-4">
                 <div className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-muted/10 mb-2">
                   Products Found ({data.data.items.length})
                 </div>
                 <ul className="space-y-1">
                  {data.data.items.map((item: any) => (
                    <li key={item.id}>
                      <button
                        className="w-full text-left px-4 py-4 hover:bg-primary/5 rounded-2xl transition-all flex justify-between items-center group"
                        onClick={() => {
                          setSearchTerm('');
                          setIsFocused(false);
                          router.push(`/products/${item.vendorSlug || 'v'}/${item.slug}`);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-black group-hover:text-primary transition-colors">{item.name}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.vendorName || 'Independent Vendor'}</span>
                        </div>
                        <span className="text-sm font-black text-foreground tracking-tight">${item.price}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleSearch}
                  className="w-full mt-4 py-4 rounded-2xl bg-muted/30 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  View All Results <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm font-bold text-muted-foreground">We couldn't find matches for "{searchTerm}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try different keywords or browse categories.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
