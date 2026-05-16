'use client';

import { motion } from 'framer-motion';
import { Search as SearchIcon, SlidersHorizontal, ArrowRight, Store, Package } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import StoreCard from '@/components/store/StoreCard';
import { useState } from 'react';

const MOCK_RESULTS = {
  products: [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      vendorName: 'TechGadgets Pro',
      vendorSlug: 'techgadgets-pro',
      slug: 'premium-wireless-headphones',
      rating: 4.8,
      reviewCount: 128,
    },
    {
      id: '2',
      name: 'Organic Silk Scarf',
      price: 89.00,
      imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&q=80',
      vendorName: 'Organic Beauty',
      vendorSlug: 'organic-beauty',
      slug: 'organic-silk-scarf',
      rating: 4.9,
      reviewCount: 56,
    },
  ],
  stores: [
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
  ]
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'stores'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">Search Results for <br /><span className="text-primary italic">&quot;{searchQuery || 'Everything'}&quot;</span></h1>
          
          <div className="relative w-full max-w-2xl">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products, stores, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-16 w-full rounded-[2rem] border-none bg-white px-16 py-2 text-lg font-bold shadow-premium focus:ring-8 focus:ring-primary/5 transition-all outline-none"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 btn-gradient h-10 px-6 rounded-xl font-black text-sm">
              Search
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-muted pb-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Results', count: 4 },
              { id: 'products', label: 'Products', count: 2 },
              { id: 'stores', label: 'Stores', count: 2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-glow' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
          <button className="md:ml-auto h-12 px-6 rounded-2xl bg-muted/50 flex items-center gap-2 font-bold text-sm text-muted-foreground hover:text-primary transition-all">
            <SlidersHorizontal className="h-4 w-4" /> Advanced Filters
          </button>
        </div>

        {(activeTab === 'all' || activeTab === 'products') && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <Package className="h-7 w-7 text-primary" /> Products
              </h2>
              {activeTab === 'all' && <button onClick={() => setActiveTab('products')} className="text-primary font-black text-sm hover:underline flex items-center gap-2">View all products <ArrowRight className="h-4 w-4" /></button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {MOCK_RESULTS.products.map((product, idx) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <ProductCard product={product as any} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'all' && <div className="h-px bg-muted" />}

        {(activeTab === 'all' || activeTab === 'stores') && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <Store className="h-7 w-7 text-primary" /> Stores
              </h2>
              {activeTab === 'all' && <button onClick={() => setActiveTab('stores')} className="text-primary font-black text-sm hover:underline flex items-center gap-2">View all stores <ArrowRight className="h-4 w-4" /></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {MOCK_RESULTS.stores.map((store, idx) => (
                <motion.div key={store.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <StoreCard vendor={store as any} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}