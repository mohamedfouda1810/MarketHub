'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Package, Users, Search, SlidersHorizontal, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const MOCK_STORE = {
  name: 'TechGadgets Pro',
  slug: 'techgadgets-pro',
  description: 'Your premier destination for high-end electronics and cutting-edge technology. We specialize in bringing the future to your doorstep with our curated collection of premium gadgets.',
  rating: 4.8,
  reviews: 1245,
  followers: '12.5k',
  joinedDate: 'Jan 2024',
  location: 'San Francisco, CA',
  logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  bannerUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80',
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
      id: '4',
      name: 'Smart Fitness Tracker',
      price: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
      vendorName: 'TechGadgets Pro',
      vendorSlug: 'techgadgets-pro',
      slug: 'smart-fitness-tracker',
      rating: 4.5,
      reviewCount: 89,
    },
    {
      id: '7',
      name: 'Ultra-Slim Laptop',
      price: 1299.00,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      vendorName: 'TechGadgets Pro',
      vendorSlug: 'techgadgets-pro',
      slug: 'ultra-slim-laptop',
      rating: 4.9,
      reviewCount: 45,
    },
    {
      id: '8',
      name: '4K Mirrorless Camera',
      price: 850.00,
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
      vendorName: 'TechGadgets Pro',
      vendorSlug: 'techgadgets-pro',
      slug: '4k-mirrorless-camera',
      rating: 4.7,
      reviewCount: 67,
    },
  ]
};

export default function StoreDetailPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');

  return (
    <div className="flex flex-col gap-12 pb-32">
      {/* Store Hero/Banner */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <img src={MOCK_STORE.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container px-4 md:px-8 flex flex-col md:flex-row items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-white p-2 shadow-2xl overflow-hidden relative"
            >
              <img src={MOCK_STORE.logoUrl} alt="Store Logo" className="w-full h-full object-cover rounded-[2.5rem]" />
              <div className="absolute bottom-4 right-4 bg-green-500 w-4 h-4 rounded-full border-4 border-white shadow-sm" />
            </motion.div>

            <div className="flex-1 text-white pb-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight">{MOCK_STORE.name}</h1>
                  <span className="px-4 py-1 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Verified Store
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {MOCK_STORE.rating} ({MOCK_STORE.reviews} Reviews)</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {MOCK_STORE.followers} Followers</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {MOCK_STORE.location}</div>
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
                { id: 'products', label: 'Products', count: MOCK_STORE.products.length },
                { id: 'about', label: 'About Store', count: null },
                { id: 'reviews', label: 'Reviews', count: MOCK_STORE.reviews },
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {MOCK_STORE.products.map((product, idx) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <ProductCard product={product as any} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white rounded-[3rem] border border-muted-foreground/10 p-12 shadow-soft">
                    <h3 className="text-3xl font-black mb-6">Our <span className="text-primary">Story</span></h3>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
                      {MOCK_STORE.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Member Since</p>
                        <p className="text-lg font-black">{MOCK_STORE.joinedDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Location</p>
                        <p className="text-lg font-black">{MOCK_STORE.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Total Sales</p>
                        <p className="text-lg font-black">50k+</p>
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