'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Package, Users, Search, SlidersHorizontal, ChevronRight, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useGetStoreBySlugQuery, useGetStoreProductsQuery } from '@/lib/api/vendorApi';

import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function StoreDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  
  const { data: storeResult, isLoading: isStoreLoading } = useGetStoreBySlugQuery(slug);
  const { data: productsResult, isLoading: isProductsLoading } = useGetStoreProductsQuery({ slug });

  const store = storeResult?.data;
  const products = productsResult?.data?.items || [];

  if (isStoreLoading) {
    return (
      <div className="flex flex-col gap-12 pb-32">
        <section className="relative h-[400px] w-full overflow-hidden bg-muted animate-pulse">
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container px-4 md:px-8 flex flex-col md:flex-row items-end gap-8">
              <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-squircle-md border-8 border-card" />
              <div className="flex-1 space-y-4 pb-4">
                <Skeleton className="h-12 w-1/3" />
                <div className="flex gap-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl font-black">Store Not Found</h2>
        <p className="text-muted-foreground">The store you are looking for does not exist or has been moved.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-32">
      {/* Store Hero/Banner */}
      <section className="relative h-[400px] w-full overflow-hidden">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container px-4 md:px-8 flex flex-col md:flex-row items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-squircle-md bg-white p-2 shadow-2xl overflow-hidden relative"
            >
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="Store Logo" className="w-full h-full object-cover rounded-squircle-sm" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-5xl font-black rounded-squircle-sm">
                  {store.storeName.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-green-500 w-4 h-4 rounded-full border-4 border-white shadow-sm" />
            </motion.div>

            <div className="flex-1 text-white pb-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">{store.storeName}</h1>
                  <span className="badge-premium bg-primary text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Verified Store
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {store.rating?.toFixed(1) || '0.0'} ({store.reviewCount || 0} Reviews)</div>
                  <div className="flex items-center gap-2"><Package className="h-4 w-4" /> {store.totalProducts || 0} Products</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Global Seller</div>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-3 pb-4">
              <button className="btn-gradient px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/30">
                Follow Store
              </button>
              <button className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-black text-lg hover:bg-white/20 transition-all text-white">
                Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Content */}
      <section className="container px-4 md:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between border-b border-muted pb-4">
            <div className="flex gap-4">
              {[
                { id: 'products', label: 'Products', count: store.totalProducts },
                { id: 'about', label: 'About Store', count: null },
                { id: 'reviews', label: 'Reviews', count: store.reviewCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2",
                    activeTab === tab.id ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {tab.label}
                  {tab.count !== null && <span className={cn("px-2 py-0.5 rounded-lg text-[10px]", activeTab === tab.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>{tab.count}</span>}
                </button>
              ))}
            </div>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search in this store..." 
                className="h-12 w-64 rounded-xl bg-muted/30 pl-10 pr-4 text-sm font-medium border-none focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'products' && (
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black">All <span className="text-primary">Products</span></h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 font-bold text-sm">
                    Featured <SlidersHorizontal className="h-4 w-4" />
                  </button>
                </div>
                
                {isProductsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-[400px] rounded-squircle-md bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product, idx) => (
                      <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-xl text-muted-foreground font-bold">This store hasn&apos;t added any products yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white rounded-[3rem] border border-muted-foreground/10 p-12 shadow-soft">
                    <h3 className="text-3xl font-black mb-6">Our <span className="text-primary">Story</span></h3>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
                      {store.description || "Welcome to our store! We are dedicated to providing the best quality products and customer service. Explore our collections and find something special today."}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Contact Email</p>
                        <p className="text-lg font-black">{store.storeEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Store Phone</p>
                        <p className="text-lg font-black">{store.storePhone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Total Sales</p>
                        <p className="text-lg font-black">Verified Vendor</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <h4 className="text-2xl font-black mb-4">Shop Policies</h4>
                    <ul className="space-y-4">
                      {[
                        { icon: ShieldCheck, text: '30-Day Money Back' },
                        { icon: Globe, text: 'Worldwide Shipping' },
                        { icon: Package, text: 'Safe Packaging' },
                      ].map((p, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold">
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <p.icon className="h-5 w-5" />
                          </div>
                          {p.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}